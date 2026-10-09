import { TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon = TrendingUp, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-400/10',
    green: 'text-emerald-400 bg-emerald-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
    orange: 'text-amber-400 bg-amber-400/10',
    red: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
