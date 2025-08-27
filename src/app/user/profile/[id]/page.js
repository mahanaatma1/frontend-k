'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUserProfileAction } from '../../../../action/action';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, [params.id]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await getUserProfileAction(params.id);
      
      if (result.success) {
        setUser(result.data.data.user);
      } else {
        setError(result.error || 'Failed to load profile');
      }
    } catch (error) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Profile Not Found</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/user/dashboard')}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 border-4 border-white/30">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                <p className="text-blue-100 mt-1">{user.email}</p>
                {user.bio && (
                  <p className="text-blue-100 mt-2 max-w-2xl">{user.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Basic Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                  
                  {user.dateOfBirth && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(user.dateOfBirth).toLocaleDateString()}
                        {user.age && ` (${user.age} years old)`}
                      </p>
                    </div>
                  )}
                  
                  {user.gender && user.gender !== 'prefer-not-to-say' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Gender</label>
                      <p className="mt-1 text-gray-900 capitalize">{user.gender}</p>
                    </div>
                  )}
                  
                  {user.phoneNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="mt-1 text-gray-900">{user.phoneNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              {user.address && Object.values(user.address).some(value => value) && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Address Information
                  </h2>
                  
                  <div className="space-y-4">
                    {user.address.street && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Street Address</label>
                        <p className="mt-1 text-gray-900">{user.address.street}</p>
                      </div>
                    )}
                    
                    {user.address.city && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">City</label>
                        <p className="mt-1 text-gray-900">{user.address.city}</p>
                      </div>
                    )}
                    
                    {user.address.state && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">State</label>
                        <p className="mt-1 text-gray-900">{user.address.state}</p>
                      </div>
                    )}
                    
                    {user.address.country && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Country</label>
                        <p className="mt-1 text-gray-900">{user.address.country}</p>
                      </div>
                    )}
                    
                    {user.address.zipCode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">ZIP Code</label>
                        <p className="mt-1 text-gray-900">{user.address.zipCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {user.socialLinks && Object.values(user.socialLinks).some(value => value) && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {user.socialLinks.facebook && (
                    <a 
                      href={user.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span className="text-xl">📘</span>
                      <span>Facebook</span>
                    </a>
                  )}
                  
                  {user.socialLinks.twitter && (
                    <a 
                      href={user.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <span className="text-xl">🐦</span>
                      <span>Twitter</span>
                    </a>
                  )}
                  
                  {user.socialLinks.linkedin && (
                    <a 
                      href={user.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      <span className="text-xl">💼</span>
                      <span>LinkedIn</span>
                    </a>
                  )}
                  
                  {user.socialLinks.instagram && (
                    <a 
                      href={user.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-pink-600 hover:text-pink-800 transition-colors"
                    >
                      <span className="text-xl">📷</span>
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Member Since</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                {user.lastLoginAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Login</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(user.lastLoginAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Account Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
