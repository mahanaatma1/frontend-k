'use client';

// API Base URL - Update this to match your backend server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/api/auth${endpoint}`;
  
  const defaultOptions = {
    headers: {
      ...options.headers,
    },
  };

  // Only set Content-Type for JSON requests
  if (!(options.body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json';
  }

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        
        // Handle specific error cases
        if (response.status === 400) {
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ');
          }
        } else if (response.status === 409) {
          errorMessage = 'This email is already registered. Please try logging in instead.';
        } else if (response.status === 422) {
          errorMessage = 'Please check your information and try again.';
        }
      } catch (jsonError) {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Request Error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to connect to server. Please check if the backend is running.' 
    };
  }
};

// Helper function to get auth token from cookies or localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token:', token);
    return token;
  }
  return null;
};

// Helper function to set auth token
const setAuthToken = (token) => {
  console.log('setAuthToken called with:', token);
  console.log('typeof window:', typeof window);
  console.log('window available:', typeof window !== 'undefined');
  
  if (typeof window !== 'undefined' && token) {
    try {
      console.log('Setting auth token in localStorage:', token);
      localStorage.setItem('authToken', token);
      console.log('Token stored successfully');
      
      // Verify storage
      const storedToken = localStorage.getItem('authToken');
      console.log('Verified stored token:', storedToken);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  } else {
    console.log('Cannot set token - window not available or token is empty:', { 
      window: typeof window !== 'undefined', 
      token: token ? 'present' : 'empty' 
    });
  }
};

// Helper function to remove auth token
const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Action: User Signup
export const signupAction = async (formData, profilePicture = null) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      phoneNumber,
      gender,
      address,
      bio
    } = formData;

    // Enhanced validation with better error messages
    if (!firstName || !lastName || !email || !password) {
      return {
        success: false,
        error: 'Please fill in all required fields (First name, Last name, Email, and Password)'
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long'
      };
    }

    // Validate password strength
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return {
        success: false,
        error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      };
    }

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('firstName', firstName);
    submitData.append('lastName', lastName);
    submitData.append('email', email);
    submitData.append('password', password);
    if (dateOfBirth) submitData.append('dateOfBirth', dateOfBirth);
    if (phoneNumber) submitData.append('phoneNumber', phoneNumber);
    if (gender) submitData.append('gender', gender);
    if (address) {
      Object.keys(address).forEach(key => {
        if (address[key]) submitData.append(`address[${key}]`, address[key]);
      });
    }
    if (bio) submitData.append('bio', bio);
    
    // Add profile picture if provided
    if (profilePicture) {
      submitData.append('profilePicture', profilePicture);
    }

    const result = await apiRequest('/signup', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: submitData,
    });

    if (result.success) {
      // Store the token
      setAuthToken(result.data.data.token);
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Signup failed'
    };
  }
};

// Action: User/Admin Login
export const loginAction = async (formData) => {
  try {
    const { email, password } = formData;

    // Basic validation
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    const result = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    console.log('Login result:', result);

    if (result.success) {
      // Store the token
      const token = result.data.data.token;
      console.log('Storing token:', token);
      setAuthToken(token);
      
      // Check user role for redirection
      const user = result.data.data.user;
      if (user.role === 'admin') {
        result.redirectTo = '/admin/dashboard';
      } else {
        result.redirectTo = '/user/dashboard';
      }
    }

    return result;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'Login failed'
    };
  }
};

// Action: Get Current User
export const getCurrentUserAction = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      console.log('No token found in getCurrentUserAction');
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    console.log('Making API request to /me with token:', token);
    const result = await apiRequest('/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('getCurrentUserAction result:', result);
    return result;
  } catch (error) {
    console.error('getCurrentUserAction error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get user data'
    };
  }
};

// Action: User Logout
export const logoutAction = async () => {
  try {
    const token = getAuthToken();
    
    if (token) {
      // Call logout API
      await apiRequest('/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    // Remove token from storage
    removeAuthToken();

    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    // Even if API call fails, remove local token
    removeAuthToken();
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
};

// Action: Check if user is authenticated
export const checkAuthAction = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        isAuthenticated: false,
        error: 'No authentication token found'
      };
    }

    const result = await getCurrentUserAction();
    
    return {
      success: result.success,
      isAuthenticated: result.success,
      user: result.success ? result.data.data.user : null,
      error: result.success ? null : result.error
    };
  } catch (error) {
    console.error('CheckAuth Error:', error);
    return {
      success: false,
      isAuthenticated: false,
      error: error.message || 'Authentication check failed'
    };
  }
};

// Action: Update user profile (if needed)
export const updateProfileAction = async (formData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    const result = await apiRequest('/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Profile update failed'
    };
  }
};

// Action: Edit user profile with file upload support
export const editProfileAction = async (formData, profilePicture = null) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    // Create FormData for file upload
    const submitData = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
        if (key === 'address' && typeof formData[key] === 'object') {
          // Handle address object
          Object.keys(formData[key]).forEach(addressKey => {
            if (formData[key][addressKey]) {
              submitData.append(`address[${addressKey}]`, formData[key][addressKey]);
            }
          });
        } else if (key === 'socialLinks' && typeof formData[key] === 'object') {
          // Handle social links object
          Object.keys(formData[key]).forEach(socialKey => {
            if (formData[key][socialKey]) {
              submitData.append(`socialLinks[${socialKey}]`, formData[key][socialKey]);
            }
          });
        } else {
          submitData.append(key, formData[key]);
        }
      }
    });
    
    // Add profile picture if provided
    if (profilePicture) {
      submitData.append('profilePicture', profilePicture);
    }

    // Use a different API request function for user endpoints
    const url = `${API_BASE_URL}/api/user/profile`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: submitData,
    });

    if (!response.ok) {
      let errorMessage = 'Profile update failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Edit Profile Error:', error);
    return {
      success: false,
      error: error.message || 'Profile update failed'
    };
  }
};

// Action: Update phone number
export const updatePhoneNumberAction = async (phoneNumber) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    if (!phoneNumber) {
      return {
        success: false,
        error: 'Phone number is required'
      };
    }

    const result = await apiRequest('/phone', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ phoneNumber }),
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Phone number update failed'
    };
  }
};

// Action: Update profile picture
export const updateProfilePictureAction = async (profilePicture) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    if (!profilePicture) {
      return {
        success: false,
        error: 'Profile picture is required'
      };
    }

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('profilePicture', profilePicture);

    const result = await apiRequest('/profile-picture', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: submitData,
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Profile picture update failed'
    };
  }
};

// Action: Change password (if needed)
export const changePasswordAction = async (formData) => {
  try {
    const { currentPassword, newPassword } = formData;
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    if (!currentPassword || !newPassword) {
      return {
        success: false,
        error: 'Current password and new password are required'
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        error: 'New password must be at least 6 characters long'
      };
    }

    const result = await apiRequest('/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Password change failed'
    };
  }
};

// Action: Delete user profile
export const deleteProfileAction = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    const url = `${API_BASE_URL}/api/user/profile`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete account';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Delete Profile Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete account'
    };
  }
};

// Action: Deactivate user profile
export const deactivateProfileAction = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    const url = `${API_BASE_URL}/api/user/deactivate`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      let errorMessage = 'Failed to deactivate account';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Deactivate Profile Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to deactivate account'
    };
  }
};

// Action: Get user profile by ID
export const getUserProfileAction = async (userId) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const url = `${API_BASE_URL}/api/user/profile/${userId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = 'Failed to get user profile';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Get User Profile Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get user profile'
    };
  }
};

// ==================== ADMIN ACTIONS ====================

// Action: Admin Login
export const adminLoginAction = async (formData) => {
  try {
    const { email, password } = formData;

    // Basic validation
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    const url = `${API_BASE_URL}/api/admin/login`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      let errorMessage = 'Admin login failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (data.success) {
      // Store the admin token
      setAuthToken(data.data.token);
    }

    return data;
  } catch (error) {
    console.error('Admin login error:', error);
    return {
      success: false,
      error: error.message || 'Admin login failed'
    };
  }
};

// Action: Get all users (Admin only)
export const getAllUsersAction = async (params = {}) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const url = `${API_BASE_URL}/api/admin/users?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = 'Failed to get users';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Get All Users Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get users'
    };
  }
};

// Action: Get user by ID (Admin only)
export const getAdminUserByIdAction = async (userId) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const url = `${API_BASE_URL}/api/admin/users/${userId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = 'Failed to get user';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Get Admin User Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get user'
    };
  }
};

// Action: Update user (Admin only)
export const updateUserAction = async (userId, userData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const url = `${API_BASE_URL}/api/admin/users/${userId}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update user';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Update User Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update user'
    };
  }
};

// Action: Delete user (Admin only)
export const deleteUserAction = async (userId) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const url = `${API_BASE_URL}/api/admin/users/${userId}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete user';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Delete User Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete user'
    };
  }
};

// Action: Toggle user status (Admin only)
export const toggleUserStatusAction = async (userId, isActive) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const url = `${API_BASE_URL}/api/admin/users/${userId}/toggle-status`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isActive })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to toggle user status';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Toggle User Status Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to toggle user status'
    };
  }
};

// Action: Get dashboard stats (Admin only)
export const getDashboardStatsAction = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    const url = `${API_BASE_URL}/api/admin/dashboard`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = 'Failed to get dashboard stats';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get dashboard stats'
    };
  }
};

// Action: Bulk operations (Admin only)
export const bulkOperationsAction = async (operation, userIds) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    if (!operation || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return {
        success: false,
        error: 'Operation and user IDs are required'
      };
    }

    const url = `${API_BASE_URL}/api/admin/users/bulk`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ operation, userIds })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to perform bulk operation';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Bulk Operations Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to perform bulk operation'
    };
  }
};

// Action: Export users (Admin only)
export const exportUsersAction = async (format = 'json', status = 'all') => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found'
      };
    }

    const url = `${API_BASE_URL}/api/admin/users/export?format=${format}&status=${status}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = 'Failed to export users';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    if (format === 'csv') {
      // For CSV, return the blob
      const blob = await response.blob();
      return { success: true, data: blob };
    } else {
      // For JSON, parse the response
      const data = await response.json();
      return { success: true, data };
    }
  } catch (error) {
    console.error('Export Users Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to export users'
    };
  }
};
