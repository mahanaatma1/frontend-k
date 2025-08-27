export default function StatsCard({ title, value, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  const bgColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`${bgColor} rounded-lg p-3 mr-4`}>
          <span className="text-2xl text-white">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
