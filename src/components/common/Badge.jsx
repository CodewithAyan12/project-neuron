const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-gray-800 text-gray-300',
    success: 'bg-emerald-400/10 text-emerald-400',
    warning: 'bg-amber-400/10 text-amber-400',
    danger: 'bg-red-400/10 text-red-400',
    info: 'bg-blue-400/10 text-blue-400',
    purple: 'bg-purple-400/10 text-purple-400',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
