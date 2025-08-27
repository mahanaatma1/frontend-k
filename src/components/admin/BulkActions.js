export default function BulkActions({ selectedCount, onBulkAction, loading }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium text-blue-800">
            {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onBulkAction('activate')}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Activate Selected'}
          </button>
          <button
            onClick={() => onBulkAction('deactivate')}
            disabled={loading}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Deactivate Selected'}
          </button>
          <button
            onClick={() => onBulkAction('delete')}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Delete Selected'}
          </button>
        </div>
      </div>
    </div>
  );
}
