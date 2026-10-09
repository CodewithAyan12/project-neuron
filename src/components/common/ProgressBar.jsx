const ProgressBar = ({ value, max = 100, color = 'blue', size = 'md', showLabel = false }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    purple: 'bg-purple-500',
    orange: 'bg-amber-500',
    red: 'bg-red-500',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className={`flex-1 bg-gray-800 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${colors[color]} ${heights[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && <span className="text-sm text-gray-400 min-w-[3ch] text-right">{percentage}%</span>}
    </div>
  );
};

export default ProgressBar;
