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

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return {
        success: false,
        error: 'First name, last name, email, and password are required'
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long'
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

// Action: User Login
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
