'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProfileAction } from '../../../action/action';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmText, setConfirmText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setMessage({ type: 'error', text: 'Please type DELETE to confirm account deletion' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await deleteProfileAction();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Account deleted successfully. Redirecting...' });
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete account' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while deleting your account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Delete Account</h1>
                <p className="text-red-100 mt-1">This action cannot be undone</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Warning</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Deleting your account will permanently remove:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>All your personal information</li>
                      <li>Profile data and settings</li>
                      <li>Account history and activity</li>
                      <li>Any associated data and files</li>
                    </ul>
                    <p className="mt-2 font-medium">This action cannot be undone.</p>
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

            {/* Confirmation Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-2">
                      Type "DELETE" to confirm
                    </label>
                    <input
                      type="text"
                      id="confirmText"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="understand"
                      checked={showConfirmation}
                      onChange={(e) => setShowConfirmation(e.target.checked)}
                      className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="understand" className="text-sm text-gray-700">
                      I understand that this action is permanent and cannot be undone. 
                      I have backed up any important data I want to keep.
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading || confirmText !== 'DELETE' || !showConfirmation}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Deleting...' : 'Delete My Account'}
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
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  If you're having issues with your account, consider these alternatives:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <a href="/user/edit-profile" className="text-blue-600 hover:text-blue-800">Update your profile</a> instead of deleting</li>
                  <li>• Contact support for account issues</li>
                  <li>• Temporarily deactivate your account</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
