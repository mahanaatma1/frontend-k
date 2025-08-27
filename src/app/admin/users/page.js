'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllUsersAction, deleteUserAction, toggleUserStatusAction, bulkOperationsAction } from '../../../action/action';
import AdminLayout from '../../../components/admin/AdminLayout';
import UserTable from '../../../components/admin/UserTable';
import UserFilters from '../../../components/admin/UserFilters';
import BulkActions from '../../../components/admin/BulkActions';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await getAllUsersAction(filters);
      
      if (result.success) {
        setUsers(result.data.data.users);
        setPagination(result.data.data.pagination);
      } else {
        setError(result.error || 'Failed to load users');
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
    setSelectedUsers([]);
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    setSelectedUsers([]);
  };

  const handleUserSelect = (userId, selected) => {
    if (selected) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (selected) => {
    if (selected) {
      setSelectedUsers(users.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAction = async (operation) => {
    if (selectedUsers.length === 0) {
      alert('Please select users to perform bulk action');
      return;
    }

    if (!confirm(`Are you sure you want to ${operation} ${selectedUsers.length} users?`)) {
      return;
    }

    try {
      setBulkLoading(true);
      const result = await bulkOperationsAction(operation, selectedUsers);
      
      if (result.success) {
        alert(result.data.message);
        setSelectedUsers([]);
        loadUsers(); // Reload users
      } else {
        alert(result.error || 'Bulk operation failed');
      }
    } catch (error) {
      console.error('Bulk operation error:', error);
      alert('Bulk operation failed');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteUserAction(userId);
      
      if (result.success) {
        alert('User deleted successfully');
        loadUsers(); // Reload users
      } else {
        alert(result.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      alert('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      const result = await toggleUserStatusAction(userId, isActive);
      
      if (result.success) {
        alert(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
        loadUsers(); // Reload users
      } else {
        alert(result.error || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      alert('Failed to update user status');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <UserFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <BulkActions 
            selectedCount={selectedUsers.length}
            onBulkAction={handleBulkAction}
            loading={bulkLoading}
          />
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <UserTable
            users={users}
            selectedUsers={selectedUsers}
            onUserSelect={handleUserSelect}
            onSelectAll={handleSelectAll}
            onDeleteUser={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
            onEditUser={(userId) => router.push(`/admin/users/${userId}/edit`)}
          />
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of{' '}
              {pagination.totalUsers} users
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
