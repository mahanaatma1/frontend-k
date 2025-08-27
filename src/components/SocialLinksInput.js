'use client';

import { useState } from 'react';

export default function SocialLinksInput({ 
  socialLinks, 
  onChange, 
  className = '' 
}) {
  const [errors, setErrors] = useState({});

  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/username' },
    { key: 'twitter', label: 'Twitter', icon: '🐦', placeholder: 'https://twitter.com/username' },
    { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/username' },
    { key: 'instagram', label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/username' }
  ];

  const handleChange = (platform, value) => {
    // Clear error for this platform
    setErrors(prev => ({
      ...prev,
      [platform]: ''
    }));

    // Update social links
    const updatedLinks = {
      ...socialLinks,
      [platform]: value
    };

    onChange(updatedLinks);
  };

  const validateUrl = (url, platform) => {
    if (!url) return true; // Empty URLs are allowed
    
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      const validDomains = {
        facebook: ['facebook.com', 'www.facebook.com', 'fb.com', 'www.fb.com'],
        twitter: ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'],
        linkedin: ['linkedin.com', 'www.linkedin.com'],
        instagram: ['instagram.com', 'www.instagram.com']
      };

      return validDomains[platform]?.some(validDomain => domain.includes(validDomain)) || false;
    } catch {
      return false;
    }
  };

  const handleBlur = (platform, value) => {
    if (value && !validateUrl(value, platform)) {
      setErrors(prev => ({
        ...prev,
        [platform]: `Please enter a valid ${platform} URL`
      }));
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {socialPlatforms.map(({ key, label, icon, placeholder }) => (
        <div key={key}>
          <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-2">
            {icon} {label}
          </label>
          <input
            type="url"
            id={key}
            name={key}
            value={socialLinks[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            onBlur={(e) => handleBlur(key, e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[key] ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors[key] && (
            <p className="mt-1 text-xs text-red-600">
              {errors[key]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
