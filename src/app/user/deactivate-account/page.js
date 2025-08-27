'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deactivateProfileAction } from '../../../action/action';

export default function DeactivateAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reason, setReason] = useState('');

  const handleDeactivateAccount = async () => {
    if (!showConfirmation) {
      setMessage({ type: 'error', text: 'Please confirm that you understand the consequences' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await deactivateProfileAction();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Account deactivated successfully. Redirecting...' });
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to deactivate account' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while deactivating your account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-yellow-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Deactivate Account</h1>
                <p className="text-yellow-100 mt-1">Temporarily disable your account</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Information Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">What happens when you deactivate?</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your account will be temporarily disabled</li>
                      <li>You won't be able to log in or access your account</li>
                      <li>Your profile will be hidden from other users</li>
                      <li>Your data will be preserved and can be restored later</li>
                      <li>You can reactivate your account by contacting support</li>
                    </ul>
                  </div>
                </div>
              </div>
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

            {/* Deactivation Form */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Deactivation Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for deactivation (optional)
                    </label>
                    <select
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="">Select a reason (optional)</option>
                      <option value="temporary-break">Taking a temporary break</option>
                      <option value="privacy-concerns">Privacy concerns</option>
                      <option value="too-much-time">Spending too much time on the platform</option>
                      <option value="not-using">Not using the account anymore</option>
                      <option value="technical-issues">Technical issues</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="understand"
                      checked={showConfirmation}
                      onChange={(e) => setShowConfirmation(e.target.checked)}
                      className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor="understand" className="text-sm text-gray-700">
                      I understand that deactivating my account will temporarily disable access to my account. 
                      I can reactivate it later by contacting support.
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleDeactivateAccount}
                  disabled={loading || !showConfirmation}
                  className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-md font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Deactivating...' : 'Deactivate My Account'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/user/dashboard')}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Need to reactivate?</h3>
                <p className="text-sm text-blue-700 mb-3">
                  If you change your mind and want to reactivate your account:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Contact our support team</li>
                  <li>• Provide your email address and account details</li>
                  <li>• We'll help you restore access to your account</li>
                  <li>• All your data will be preserved</li>
                </ul>
              </div>

              {/* Alternative Options */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Consider these alternatives:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <a href="/user/edit-profile" className="text-blue-600 hover:text-blue-800">Update your profile</a> to change your information</li>
                  <li>• Adjust your privacy settings</li>
                  <li>• Take a break without deactivating</li>
                  <li>• Contact support for account issues</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
