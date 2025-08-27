export default function GenderDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No gender data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percentage = total > 0 ? (item.count / total) * 100 : 0;
        const gender = item._id || 'Unknown';
        
        return (
          <div key={gender} className="flex items-center">
            <div className="w-20 text-sm font-medium text-gray-700 capitalize">
              {gender}
            </div>
            <div className="flex-1 ml-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{item.count} users</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
