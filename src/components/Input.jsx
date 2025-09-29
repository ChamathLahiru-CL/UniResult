import React from 'react';

const Input = ({ 
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  onIconClick,
  className = '',
  autoComplete
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={name} className="block text-[15px] font-medium text-gray-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {name === 'username' ? (
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" />
            ) : (
              <>
                <path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </>
            )}
          </svg>
        </div>
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete || (name === 'username' ? 'username' : type === 'password' ? 'current-password' : 'off')}
          className={`
            w-full pl-10 pr-10 py-2.5 border text-gray-700
            rounded-lg bg-gray-50
            focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:outline-none
            placeholder:text-gray-400
            transition-all duration-200 ease-in-out
            ${error ? 'border-red-500' : 'border-gray-200'}
            ${Icon ? 'pr-10' : ''}
            ${className}
          `}
        />
        {Icon && (
          <button
            type="button"
            onClick={onIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 
                     transition-all duration-150 focus:outline-none"
            aria-label={type === 'password' ? 'Toggle password visibility' : 'Icon button'}
          >
            {typeof Icon === 'function' ? Icon() : <Icon className="h-5 w-5" />}
          </button>
        )}
        {/* Animated focus border indicator */}
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-30"></div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;