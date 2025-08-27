'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { checkAuthAction, logoutAction } from '@/action/action';

export default function UserLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const result = await checkAuthAction();
        console.log('Auth result:', result);
        
        if (result.success && result.isAuthenticated) {
          console.log('User authenticated:', result.user);
          setUser(result.user);
        } else {
          console.log('Authentication failed:', result.error);
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logoutAction();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/user/dashboard" className="text-xl font-bold text-gray-900">
                Dashboard
              </Link>
                             <div className="hidden md:flex space-x-6">
                 <Link 
                   href="/user/dashboard" 
                   className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                 >
                   Home
                 </Link>
                 <Link 
                   href="/user/edit-profile" 
                   className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                 >
                   Edit Profile
                 </Link>
                 <Link 
                   href="/user/settings" 
                   className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                 >
                   Settings
                 </Link>
                 <div className="relative group">
                   <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                     Account
                     <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                   </button>
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                     <Link 
                       href="/user/deactivate-account" 
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                     >
                       Deactivate Account
                     </Link>
                     <Link 
                       href="/user/delete-account" 
                       className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                     >
                       Delete Account
                     </Link>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <span className="hidden sm:block text-sm text-gray-700">
                  Welcome, {user.firstName} {user.lastName}
                </span>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b">
            <Link 
              href="/user/dashboard" 
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
                         <Link 
               href="/user/edit-profile" 
               className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
               onClick={() => setMobileMenuOpen(false)}
             >
               Edit Profile
             </Link>
             <Link 
               href="/user/settings" 
               className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
               onClick={() => setMobileMenuOpen(false)}
             >
               Settings
             </Link>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="text-xs font-medium text-gray-500 px-3 py-1">Account Management</div>
              <Link 
                href="/user/deactivate-account" 
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Deactivate Account
              </Link>
              <Link 
                href="/user/delete-account" 
                className="text-red-600 hover:text-red-800 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Delete Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
