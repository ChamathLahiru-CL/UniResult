import React from 'react';

const UploadProgressBar = ({ progress = 0, isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
      <div 
        className="h-2 bg-[#246BFD] rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">Uploading...</span>
        <span className="text-xs text-gray-600 font-medium">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default UploadProgressBar;