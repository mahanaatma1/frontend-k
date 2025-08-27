import { useState, useCallback } from 'react';

// Email validation utility using RapidAPI
export const validateEmail = async (email) => {
  try {
    const response = await fetch('/api/validate-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Email validation error:', error);
    return {
      success: false,
      error: 'Failed to validate email',
      isValid: false
    };
  }
};

// Client-side email format validation
export const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Email validation with debouncing
export const useEmailValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const validateEmailWithDebounce = useCallback(
    debounce(async (email) => {
      if (!email || !validateEmailFormat(email)) {
        setValidationResult({ isValid: false, error: 'Invalid email format' });
        return;
      }

      setIsValidating(true);
      try {
        const result = await validateEmail(email);
        setValidationResult(result);
      } catch (error) {
        setValidationResult({ isValid: false, error: 'Validation failed' });
      } finally {
        setIsValidating(false);
      }
    }, 500),
    []
  );

  return {
    isValidating,
    validationResult,
    validateEmail: validateEmailWithDebounce
  };
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
