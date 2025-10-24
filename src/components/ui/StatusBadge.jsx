import React from 'react';

const StatusBadge = ({ status, size = 'sm', className = '' }) => {
  const getStatusStyles = (status) => {
    const styles = {
      // Read/Unread status badges
      unread: 'bg-blue-100 text-blue-700 border-blue-200',
      read: 'bg-gray-100 text-gray-700 border-gray-200',
      new: 'bg-blue-500 text-white border-blue-500',
      viewed: 'bg-green-100 text-green-700 border-green-200',
      replied: 'bg-purple-100 text-purple-700 border-purple-200',
      
      // Priority badges
      urgent: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      normal: 'bg-blue-100 text-blue-700 border-blue-200',
      low: 'bg-gray-100 text-gray-700 border-gray-200',
      
      // User type badges
      student: 'bg-green-100 text-green-700 border-green-200',
      exam_officer: 'bg-purple-100 text-purple-700 border-purple-200',
      
      // Default
      default: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    
    return styles[status] || styles.default;
  };

  const getSizeClasses = (size) => {
    const sizes = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1 text-sm'
    };
    
    return sizes[size] || sizes.sm;
  };

  const getStatusText = (status) => {
    const statusTexts = {
      unread: 'New',
      read: 'Read',
      new: 'New',
      viewed: 'Viewed',
      replied: 'Replied',
      urgent: 'Urgent',
      high: 'High Priority',
      normal: 'Normal',
      low: 'Low Priority',
      student: 'Student',
      exam_officer: 'Faculty'
    };
    
    return statusTexts[status] || status;
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full border font-medium ${getStatusStyles(status)} ${getSizeClasses(size)} ${className}`}
    >
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;