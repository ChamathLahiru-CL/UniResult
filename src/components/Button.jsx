import React from 'react';
import { 
  CheckIcon, 
  XMarkIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const Button = ({ 
  children,
  type = 'button',
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onClick,
  fullWidth = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-600/40 focus:ring-blue-500/50',
    secondary: 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white shadow-xl shadow-gray-500/30 hover:shadow-2xl hover:shadow-gray-600/40 focus:ring-gray-500/50',
    success: 'bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 text-white shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-600/40 focus:ring-green-500/50',
    danger: 'bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 hover:from-red-600 hover:via-rose-700 hover:to-pink-700 text-white shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-600/40 focus:ring-red-500/50',
    warning: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white shadow-xl shadow-yellow-500/30 hover:shadow-2xl hover:shadow-orange-600/40 focus:ring-yellow-500/50',
    info: 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-blue-600/40 focus:ring-cyan-500/50',
    outline: 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-blue-700 border-3 border-blue-500 hover:border-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-600/30 focus:ring-blue-500/50',
    ghost: 'bg-transparent hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 text-gray-700 hover:text-gray-900 focus:ring-gray-500/50 hover:shadow-lg',
    link: 'bg-transparent hover:bg-blue-50 text-blue-600 hover:text-blue-800 focus:ring-blue-500/50 p-0 font-bold underline-offset-4 hover:underline',
    gradient: 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-pink-600/40 focus:ring-purple-500/50',
    google: 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl focus:ring-gray-500/50'
  };

  const sizes = {
    small: 'px-4 py-2 text-sm font-bold',
    default: 'px-6 py-3 text-base font-bold',
    large: 'px-8 py-4 text-lg font-bold',
    xl: 'px-10 py-5 text-xl font-bold',
  };

  const iconSizes = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6',
    xl: 'h-7 w-7',
  };

  // Use the appropriate icon
  const DisplayIcon = Icon || LeftIcon;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <ArrowPathIcon className={`${iconSizes[size]} ${children ? 'mr-2' : ''} animate-spin`} />
      )}
      {!loading && DisplayIcon && (
        <DisplayIcon className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} />
      )}
      {children && <span className="relative inline-block">{children}</span>}
      {!loading && RightIcon && (
        <RightIcon className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} />
      )}
    </button>
  );
};

// Specialized button components
export const SuccessButton = (props) => (
  <Button variant="success" leftIcon={CheckCircleIcon} {...props} />
);

export const DangerButton = (props) => (
  <Button variant="danger" leftIcon={XMarkIcon} {...props} />
);

export const WarningButton = (props) => (
  <Button variant="warning" leftIcon={ExclamationTriangleIcon} {...props} />
);

export const InfoButton = (props) => (
  <Button variant="info" leftIcon={InformationCircleIcon} {...props} />
);

export const LoadingButton = ({ loading, children, ...props }) => (
  <Button loading={loading} disabled={loading} {...props}>
    {loading ? 'Loading...' : children}
  </Button>
);

// Toggle Button Component
export const ToggleButton = ({ 
  active, 
  onClick, 
  activeText = 'ON', 
  inactiveText = 'OFF',
  size = 'default',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm font-bold',
    default: 'px-6 py-3 text-base font-bold',
    large: 'px-8 py-4 text-lg font-bold',
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative inline-flex items-center rounded-xl font-bold transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-offset-2 transform hover:scale-105 active:scale-95
        ${active 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-600/40 focus:ring-blue-500/50' 
          : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 shadow-lg hover:shadow-xl focus:ring-gray-500/50'
        }
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">
        {active ? activeText : inactiveText}
      </span>
    </button>
  );
};

// Button Group Component
export const ButtonGroup = ({ children, className = '', orientation = 'horizontal' }) => {
  return (
    <div 
      className={`
        inline-flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}
        ${className}
      `}
      role="group"
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;
        
        return React.cloneElement(child, {
          className: `
            ${child.props.className || ''}
            ${orientation === 'horizontal' 
              ? `${!isFirst ? '-ml-px' : ''} ${isFirst ? 'rounded-r-none' : isLast ? 'rounded-l-none' : 'rounded-none'}`
              : `${!isFirst ? '-mt-px' : ''} ${isFirst ? 'rounded-b-none' : isLast ? 'rounded-t-none' : 'rounded-none'}`
            }
          `,
        });
      })}
    </div>
  );
};

export default Button;