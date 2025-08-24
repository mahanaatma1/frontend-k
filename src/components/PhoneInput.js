'use client';

import { useEffect, useRef } from 'react';

export default function PhoneInput({ value, onChange, placeholder = "Enter phone number" }) {
  const inputRef = useRef(null);
  const itiRef = useRef(null);

  useEffect(() => {
    // Load the intl-tel-input CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css';
    document.head.appendChild(link);

    // Load the intl-tel-input script
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js';
    script.onload = () => {
      // Load the utils script
      const utilsScript = document.createElement('script');
      utilsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js';
      utilsScript.onload = initializeIntlTelInput;
      document.head.appendChild(utilsScript);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (itiRef.current) {
        itiRef.current.destroy();
      }
    };
  }, []);

  const initializeIntlTelInput = () => {
    if (!inputRef.current || !window.intlTelInput) return;

    // Initialize intl-tel-input
    itiRef.current = window.intlTelInput(inputRef.current, {
      initialCountry: "auto",
      geoIpLookup: callback => {
        // Use a free IP geolocation service (no token required)
        fetch("https://ipapi.co/json/")
          .then(resp => resp.json())
          .then(resp => {
            callback(resp.country_code);
          })
          .catch(() => {
            // Fallback to India if geolocation fails
            callback("IN");
          });
      },
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      preferredCountries: ["IN", "US", "GB", "CA", "AU"],
      separateDialCode: true,
      formatOnDisplay: true,
      autoHideDialCode: false,
      autoPlaceholder: "polite",
      customPlaceholder: (selectedCountryPlaceholder, selectedCountryData) => {
        return selectedCountryPlaceholder;
      },
      nationalMode: false,
      allowDropdown: true,
      showSelectedDialCode: true,
      enableAreaCodes: true,
      autoInsertDialCode: true,
      excludeCountries: [],
      onlyCountries: [],
      preferredCountries: ["IN", "US", "GB", "CA", "AU"],
      dropdownContainer: document.body,
      customContainer: "iti-custom-container",
      i18n: {
        // Custom internationalization
        "IN": "India",
        "US": "United States",
        "GB": "United Kingdom",
        "CA": "Canada",
        "AU": "Australia"
      }
    });

    // Set initial value if provided
    if (value) {
      itiRef.current.setNumber(value);
    }

    // Listen for country changes
    inputRef.current.addEventListener('countrychange', () => {
      const countryData = itiRef.current.getSelectedCountryData();
      const fullNumber = itiRef.current.getNumber();
      
      // Call the onChange callback with the full number
      if (onChange) {
        onChange(fullNumber);
      }
    });

    // Listen for input changes
    inputRef.current.addEventListener('input', () => {
      const fullNumber = itiRef.current.getNumber();
      
      // Call the onChange callback with the full number
      if (onChange) {
        onChange(fullNumber);
      }
    });

    // Listen for blur events for validation
    inputRef.current.addEventListener('blur', () => {
      if (itiRef.current.isValidNumber()) {
        inputRef.current.classList.remove('iti-error');
        inputRef.current.classList.add('iti-valid');
      } else {
        inputRef.current.classList.remove('iti-valid');
        inputRef.current.classList.add('iti-error');
      }
    });
  };

  // Update value when prop changes
  useEffect(() => {
    if (itiRef.current && value !== undefined) {
      itiRef.current.setNumber(value);
    }
  }, [value]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="tel"
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      {/* Custom styles for better integration */}
      <style jsx>{`
        .iti {
          width: 100%;
        }
        .iti__flag-container {
          border-radius: 6px 0 0 6px;
        }
        .iti__selected-flag {
          background-color: #f9fafb;
          border: 1px solid #d1d5db;
          border-right: none;
          border-radius: 6px 0 0 6px;
        }
        .iti__selected-flag:hover {
          background-color: #f3f4f6;
        }
        .iti__country-list {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .iti__country {
          padding: 8px 12px;
        }
        .iti__country:hover {
          background-color: #f3f4f6;
        }
        .iti__country.iti__active {
          background-color: #dbeafe;
          color: #1d4ed8;
        }
        .iti__dial-code {
          color: #6b7280;
        }
        .iti__flag {
          border-radius: 2px;
        }
        .iti__arrow {
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid #6b7280;
        }
        .iti__arrow--up {
          border-top: none;
          border-bottom: 5px solid #6b7280;
        }
        .iti__error-msg {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .iti__valid-number {
          border-color: #10b981;
        }
        .iti__error-number {
          border-color: #dc2626;
        }
      `}</style>
    </div>
  );
}
