const Card = ({ children, className = '', title, subtitle, action }) => {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <div>
            {title && <h3 className="text-base font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};

export default Card;
