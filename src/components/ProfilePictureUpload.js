'use client';

import { useState } from 'react';

export default function ProfilePictureUpload({ 
  currentImage, 
  onImageChange, 
  size = 'w-24 h-24',
  showLabel = true,
  className = ''
}) {
  const [previewImage, setPreviewImage] = useState(currentImage);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError('');

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // Call parent handler
      onImageChange(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    onImageChange(null);
    setError('');
    // Reset file input
    const fileInput = document.getElementById('profilePicture');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className={`flex items-center space-x-6 ${className}`}>
      <div className="relative">
        <div className={`${size} rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300`}>
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Remove button */}
        {previewImage && (
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex-1">
        {showLabel && (
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-2">
            Upload new photo
          </label>
        )}
        <input
          type="file"
          id="profilePicture"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-1 text-xs text-gray-500">
          JPG, PNG, GIF up to 5MB
        </p>
        {error && (
          <p className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
