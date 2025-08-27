'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboardStatsAction } from '../../../action/action';
import AdminLayout from '../../../components/admin/AdminLayout';
import StatsCard from '../../../components/admin/StatsCard';
import RecentUsersTable from '../../../components/admin/RecentUsersTable';
import GenderDistributionChart from '../../../components/admin/GenderDistributionChart';
import RoleDistributionChart from '../../../components/admin/RoleDistributionChart';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await getDashboardStatsAction();
      
      if (result.success) {
        setStats(result.data.data);
      } else {
        setError(result.error || 'Failed to load dashboard stats');
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadDashboardStats}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to the admin panel. Here's an overview of your system.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats?.overview?.totalUsers || 0}
            icon="👥"
            color="blue"
          />
          <StatsCard
            title="Active Users"
            value={stats?.overview?.activeUsers || 0}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="New This Month"
            value={stats?.overview?.newUsersThisMonth || 0}
            icon="📈"
            color="purple"
          />
          <StatsCard
            title="New Today"
            value={stats?.overview?.newUsersToday || 0}
            icon="🎉"
            color="orange"
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gender Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gender Distribution</h2>
            <GenderDistributionChart data={stats?.genderDistribution || []} />
          </div>

          {/* Role Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Role Distribution</h2>
            <RoleDistributionChart data={stats?.roleDistribution || []} />
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
            <button
              onClick={() => router.push('/admin/users')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Users
            </button>
          </div>
          <RecentUsersTable users={stats?.recentUsers || []} />
        </div>
      </div>
    </AdminLayout>
  );
}
