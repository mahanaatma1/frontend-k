'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signupAction } from '@/action/action';
import { z } from 'zod';
import PhoneInput from '@/components/PhoneInput';
import RegistrationStepper from '@/components/RegistrationStepper';
import { useEmailValidation } from '@/utils/emailValidation';

// Enhanced validation schema with better error messages
const signupSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional()
  }).optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Password strength checker
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  
  let score = 0;
  let feedback = [];
  
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score < 2) return { score, label: 'Weak', color: 'text-red-500', bgColor: 'bg-red-100' };
  if (score < 4) return { score, label: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
  if (score < 5) return { score, label: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-100' };
  return { score, label: 'Strong', color: 'text-green-500', bgColor: 'bg-green-100' };
};

// Form steps
const FORM_STEPS = [
  { id: 1, title: 'Card Details', description: 'Name and email' },
  { id: 2, title: 'Authentication', description: 'Personal information' },
  { id: 3, title: 'Address Info', description: 'Location details' },
  { id: 4, title: 'Create Code', description: 'Security credentials' }
];

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phoneNumber: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    },
    bio: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Email validation hook
  const { isValidating, validationResult, validateEmail } = useEmailValidation();

  // Password strength
  const passwordStrength = getPasswordStrength(formData.password);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Trigger email validation when email field changes
    if (name === 'email' && value) {
      validateEmail(value);
    }

    // Clear general error when user makes changes
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, GIF)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const validateCurrentStep = () => {
    const stepErrors = {};
    console.log('Validating step:', currentStep);
    console.log('Form data for validation:', formData);
    
    switch (currentStep) {
      case 1:
        if (!formData.firstName) stepErrors.firstName = 'First name is required';
        if (!formData.lastName) stepErrors.lastName = 'Last name is required';
        if (!formData.email) stepErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          stepErrors.email = 'Please enter a valid email address';
        }
        break;
      case 2:
        // Personal information step - optional fields, no validation needed
        break;
      case 3:
        // Address information step - optional fields, no validation needed
        break;
      case 4:
        console.log('Validating password fields...');
        console.log('Password:', formData.password);
        console.log('Confirm password:', formData.confirmPassword);
        
        if (!formData.password) stepErrors.password = 'Password is required';
        else if (formData.password.length < 8) {
          stepErrors.password = 'Password must be at least 8 characters';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          stepErrors.password = 'Password must contain uppercase, lowercase, and number';
        }
        if (!formData.confirmPassword) stepErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) {
          stepErrors.confirmPassword = "Passwords don't match";
        }
        break;
    }
    
    console.log('Step errors:', stepErrors);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateForm = () => {
    try {
      signupSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            const fieldPath = err.path.join('.');
            newErrors[fieldPath] = err.message;
          } else {
            newErrors[err.path] = err.message;
          }
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    setLoading(true);
    setError('');
    setSuccess('');

    // First validate the current step (step 4 - password validation)
    console.log('Validating current step...');
    if (!validateCurrentStep()) {
      console.log('Current step validation failed');
      setLoading(false);
      return;
    }

    // Then validate the entire form
    console.log('Validating entire form...');
    if (!validateForm()) {
      console.log('Form validation failed');
      setLoading(false);
      return;
    }

    if (validationResult && !validationResult.isValid) {
      console.log('Email validation failed');
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    console.log('All validations passed, calling signupAction...');
    console.log('Form data:', formData);
    console.log('Selected file:', selectedFile);

    try {
      const result = await signupAction(formData, selectedFile);
      console.log('Signup result:', result);

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/auth/login?message=Account created successfully! Please sign in.');
        }, 2000);
      } else {
        // Handle specific error messages
        let errorMessage = result.error || 'Signup failed';
        
        // Map backend errors to user-friendly messages
        if (errorMessage.includes('already exists')) {
          errorMessage = 'An account with this email already exists. Please try logging in instead.';
        } else if (errorMessage.includes('phone number')) {
          errorMessage = 'Please enter a valid phone number with country code (e.g., +91 for India)';
        } else if (errorMessage.includes('validation failed')) {
          errorMessage = 'Please check your information and try again.';
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Card Details</h2>
              <p className="text-gray-600 mt-2">Enter your personal information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 
                    validationResult && !validationResult.isValid ? 'border-red-300 bg-red-50' :
                    validationResult && validationResult.isValid ? 'border-green-300 bg-green-50' :
                    'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {isValidating && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  )}
                  {!isValidating && validationResult && validationResult.isValid && (
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {!isValidating && validationResult && !validationResult.isValid && (
                    <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
              {validationResult && !validationResult.isValid && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{validationResult.message || 'Invalid email domain'}</p>
                  {validationResult.details && validationResult.details.reason && (
                    <p className="text-xs text-red-500 mt-1">Reason: {validationResult.details.reason}</p>
                  )}
                </div>
              )}
              {validationResult && validationResult.isValid && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">✓ Email domain is valid</p>
                  {validationResult.details && validationResult.details.risk !== undefined && (
                    <p className="text-xs text-green-600 mt-1">Risk score: {validationResult.details.risk}/100</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );



      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
              <p className="text-gray-600 mt-2">Set up your personal information</p>
            </div>
            
            {/* Profile Picture */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG, GIF up to 5MB
                  </p>
                  
                  {selectedFile && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-gray-600">
                        Selected: {selectedFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <PhoneInput
                  value={formData.phoneNumber}
                  onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}
                  placeholder="Enter your phone number"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Include country code (e.g., +91 for India)
                </p>
              </div>
            </div>

                         <div>
               <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                 Bio
               </label>
               <textarea
                 id="bio"
                 name="bio"
                 value={formData.bio}
                 onChange={handleChange}
                 rows={4}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 placeholder="Tell us about yourself (optional)"
               />
               <p className="mt-1 text-sm text-gray-500">
                 {formData.bio.length}/500 characters
               </p>
             </div>

             
            </div>
          );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Address Info</h2>
              <p className="text-gray-600 mt-2">Enter your location details</p>
            </div>
            
            {/* Address Information */}
            <div className="space-y-6">
              <div className="md:col-span-2">
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your state"
                  />
                </div>

                <div>
                  <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="address.country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your country"
                  />
                </div>

                <div>
                  <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your ZIP code"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Code</h2>
              <p className="text-gray-600 mt-2">Set up your security credentials</p>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Create a strong password"
              />
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Password strength:</span>
                    <span className={`text-sm font-medium ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 1 ? 'bg-red-500' :
                        passwordStrength.score <= 2 ? 'bg-yellow-500' :
                        passwordStrength.score <= 3 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Password must contain:</p>
                    <ul className="mt-1 space-y-1">
                      <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className={`w-3 h-3 mr-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        At least 8 characters
                      </li>
                      <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className={`w-3 h-3 mr-1 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        One lowercase letter
                      </li>
                      <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className={`w-3 h-3 mr-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        One uppercase letter
                      </li>
                      <li className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className={`w-3 h-3 mr-1 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        One number
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Passwords match
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-white px-8 py-6 border-b border-gray-200">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration</h1>
                <p className="text-gray-600">Complete your account setup</p>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="px-8 py-8 border-b border-gray-200 bg-gray-50">
              <RegistrationStepper 
                currentStep={currentStep} 
                steps={FORM_STEPS} 
              />
            </div>

            {/* Form Content */}
            <div className="px-8 py-8">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                      >
                        ← Previous
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {currentStep < FORM_STEPS.length ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
