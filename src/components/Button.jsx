import React from 'react';

const Button = ({ 
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  icon: Icon,
  onClick,
  fullWidth,
  disabled
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow hover:shadow-md focus:ring-blue-400 active:shadow-inner',
    secondary: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 focus:ring-gray-400 active:shadow-inner',
    outline: 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-300 focus:ring-gray-400 active:shadow-inner',
    google: 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow focus:ring-gray-400'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {Icon && <Icon className={`h-5 w-5 ${children ? 'mr-3' : ''}`} />}
      <span className="relative inline-block">{children}</span>
    </button>
  );
};

export default Button;