'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { editProfileAction, getCurrentUserAction } from '../../../action/action';
import PhoneInput from '../../../components/PhoneInput';
import ProfilePictureUpload from '../../../components/ProfilePictureUpload';
import AddressInput from '../../../components/AddressInput';
import SocialLinksInput from '../../../components/SocialLinksInput';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    gender: 'prefer-not-to-say',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    },
    bio: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const result = await getCurrentUserAction();
      if (result.success) {
        const user = result.data.data.user;
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
          phoneNumber: user.phoneNumber || '',
          gender: user.gender || 'prefer-not-to-say',
          address: {
            street: user.address?.street || '',
            city: user.address?.city || '',
            state: user.address?.state || '',
            country: user.address?.country || 'India',
            zipCode: user.address?.zipCode || ''
          },
          bio: user.bio || '',
          socialLinks: {
            facebook: user.socialLinks?.facebook || '',
            twitter: user.socialLinks?.twitter || '',
            linkedin: user.socialLinks?.linkedin || '',
            instagram: user.socialLinks?.instagram || ''
          }
        });
        if (user.profilePicture) {
          setPreviewImage(user.profilePicture);
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to load profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (address) => {
    setFormData(prev => ({
      ...prev,
      address
    }));
  };

  const handleSocialLinksChange = (socialLinks) => {
    setFormData(prev => ({
      ...prev,
      socialLinks
    }));
  };

  const handlePhoneChange = (phoneNumber) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber
    }));
  };

  const handleProfilePictureChange = (file) => {
    setProfilePicture(file);
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await editProfileAction(formData, profilePicture);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/user/dashboard');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
            <p className="text-gray-600">Update your personal information and preferences</p>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
              <ProfilePictureUpload
                currentImage={previewImage}
                onImageChange={handleProfilePictureChange}
              />
            </div>

            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <PhoneInput
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Address Information</h2>
              <AddressInput
                address={formData.address}
                onChange={handleAddressChange}
              />
            </div>

            {/* Bio Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bio</h2>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  About Me
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media Links</h2>
              <SocialLinksInput
                socialLinks={formData.socialLinks}
                onChange={handleSocialLinksChange}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Updating...' : 'Update Profile'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/user/dashboard')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
