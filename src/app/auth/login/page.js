'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction } from '@/action/action';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccess(message);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting login form with:', formData);
      const result = await loginAction(formData);
      console.log('Login result in component:', result);

      if (result.success) {
        console.log('Login successful, redirecting based on role...');
        // Add a small delay to ensure token is stored
        setTimeout(() => {
          const redirectPath = result.redirectTo || '/user/dashboard';
          router.push(redirectPath);
        }, 100);
      } else {
        console.log('Login failed:', result.error);
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error in component:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl w-full">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          
          {/* Left Section - Onboarding/Marketing */}
          <div className="lg:w-1/2 bg-white p-8 lg:p-12 flex flex-col justify-center">
            <div className="text-center lg:text-left">
              {/* Logo */}
              <div className="flex items-center justify-center lg:justify-start mb-8">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Kuchhbhi</h1>
              </div>

              {/* Tagline */}
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Unlock Your{' '}
                <span className="text-teal-600">Team Performance</span>
              </h2>

              {/* Illustration */}
              <div className="mt-12 flex justify-center lg:justify-start">
                <div className="flex space-x-4">
                  {/* Person 1 */}
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full"></div>
                  </div>
                  {/* Person 2 */}
                  <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
                  </div>
                  {/* Person 3 */}
                  <div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-teal-500 rounded-full"></div>
                  </div>
                  {/* Person 4 */}
                  <div className="w-16 h-16 bg-indigo-400 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="lg:w-1/2 bg-white p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Kuchhbhi</h1>
                <p className="text-gray-600">Unlock Your Team Performance</p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {success}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Enter password"
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link href="/auth/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="font-medium text-teal-600 hover:text-teal-700 transition-colors">
                    Register
                  </Link>
                </p>
              </div>

              {/* Copyright */}
              <div className="mt-12 text-center">
                <p className="text-xs text-gray-500">©2024 all rights reserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
