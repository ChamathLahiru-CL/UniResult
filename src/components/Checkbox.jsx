import React from 'react';

const Checkbox = ({ 
  label,
  checked,
  onChange,
  name,
  className = ''
}) => {
  return (
    <label className={`inline-flex items-center group ${className}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          name={name}
          className="
            w-4 h-4 text-blue-600 border-gray-300 rounded
            focus:ring-blue-400 focus:ring-offset-1
            cursor-pointer transition-colors
            peer
          "
        />
        <div className="absolute left-0 top-0 w-4 h-4 rounded border border-gray-300 bg-white
                      peer-checked:bg-blue-500 peer-checked:border-blue-500
                      peer-focus:ring-2 peer-focus:ring-blue-400 peer-focus:ring-offset-1
                      transition-all duration-200 pointer-events-none
                      group-hover:border-blue-400">
          <svg className="absolute top-0 left-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
      {label && (
        <span className="ml-2 text-sm text-gray-600 cursor-pointer select-none group-hover:text-gray-800 transition-colors">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;