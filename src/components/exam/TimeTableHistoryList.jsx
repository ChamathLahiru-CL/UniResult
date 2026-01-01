import React from 'react';
import {
  EyeIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  PhotoIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatDate';

const TimeTableHistoryList = ({ timeTables = [], onPreview }) => {
  const handleDownload = async (timeTable) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/timetable/${timeTable.id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a temporary anchor element and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = timeTable.fileName; // Use the original filename
        document.body.appendChild(a);
        a.click();
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        console.error('Download failed:', errorData);
        alert(`Failed to download file: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('An error occurred while downloading the file.');
    }
  };
  if (timeTables.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md text-center">
        <DocumentIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Time Tables Found</h3>
        <p className="text-sm sm:text-base text-gray-500">
          No time tables match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  const getFileIcon = (type) => {
    return type === 'pdf' ? (
      <DocumentIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-red-500" />
    ) : (
      <PhotoIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-500" />
    );
  };

  const getFacultyBadgeColor = (faculty) => {
    const colors = {
      'Faculty of Technological Studies': 'bg-blue-100 text-blue-700 border-blue-200',
      'Faculty of Applied Science': 'bg-green-100 text-green-700 border-green-200',
      'Faculty of Management': 'bg-purple-100 text-purple-700 border-purple-200',
      'Faculty of Agriculture': 'bg-orange-100 text-orange-700 border-orange-200',
      'Faculty of Medicine': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[faculty] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Past Uploads</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {timeTables.length} time table{timeTables.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {timeTables.map((timeTable) => (
          <div key={timeTable.id} className="p-4 sm:p-5 md:p-6 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              {/* File Info */}
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="shrink-0 mt-0.5">
                  {getFileIcon(timeTable.type)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2 break-words">
                    {timeTable.fileName}
                  </h4>
                  
                  {/* Badges - Stacked on mobile */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
                    <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium border ${getFacultyBadgeColor(timeTable.faculty)}`}>
                      <span className="truncate max-w-[150px] sm:max-w-none">{timeTable.faculty}</span>
                    </span>
                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {timeTable.year}
                    </span>
                  </div>

                  {/* Metadata - Stacked on mobile */}
                  <div className="space-y-1.5 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      <span className="truncate">
                        {timeTable.uploadedByName}
                        {timeTable.uploadedByUsername && ` (${timeTable.uploadedByUsername})`}
                        {timeTable.uploadedByRole && ` - ${timeTable.uploadedByRole}`}
                      </span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      <span className="truncate">{formatDate(timeTable.createdAt)}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <DocumentIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      <span>{timeTable.fileSize}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <span className="capitalize">{timeTable.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions - Full width buttons on mobile */}
              <div className="flex gap-2 sm:gap-3 sm:shrink-0 sm:ml-auto">
                <button
                  onClick={() => onPreview(timeTable)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                  title="Preview file"
                >
                  <EyeIcon className="h-4 w-4 shrink-0" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleDownload(timeTable)}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors border ${timeTable.type === 'pdf'
                    ? 'text-red-600 hover:text-red-800 hover:bg-red-50 border-red-200 hover:border-red-300'
                    : 'text-green-600 hover:text-green-800 hover:bg-green-50 border-green-200 hover:border-green-300'
                    }`}
                  title={`Download ${timeTable.type.toUpperCase()} file`}
                >
                  <ArrowDownTrayIcon className="h-4 w-4 shrink-0" />
                  <span>
                    {timeTable.type === 'pdf' ? 'Download' : 'Download'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTableHistoryList;