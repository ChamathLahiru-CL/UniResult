import React from 'react';

const Toggle = ({ 
  enabled, 
  onChange, 
  size = 'default',
  disabled = false,
  label,
  description,
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    small: 'h-5 w-9',
    default: 'h-6 w-11',
    large: 'h-8 w-14'
  };

  const toggleSizeClasses = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-7 w-7'
  };

  const translateClasses = {
    small: enabled ? 'translate-x-4' : 'translate-x-0.5',
    default: enabled ? 'translate-x-5' : 'translate-x-0.5',
    large: enabled ? 'translate-x-6' : 'translate-x-0.5'
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <p className="text-sm font-medium text-gray-900">{label}</p>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && onChange()}
        disabled={disabled}
        className={`
          ${sizeClasses[size]} 
          ${enabled 
            ? 'bg-blue-500 shadow-lg shadow-blue-500/25' 
            : 'bg-gray-300 shadow-inner'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
          relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent 
          transition-all duration-300 ease-in-out focus:outline-none focus:ring-3 
          focus:ring-blue-500/30 focus:ring-offset-2
          ${!disabled ? 'hover:scale-105 active:scale-95' : ''}
        `}
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        {...props}
      >
        <span
          className={`
            ${toggleSizeClasses[size]} 
            ${translateClasses[size]} 
            inline-block transform rounded-full bg-white
            transition-all duration-300 ease-in-out
            ${enabled 
              ? 'shadow-lg ring-0' 
              : 'shadow-md ring-0'
            }
          `}
        />
      </button>
    </div>
  );
};

export default Toggle;