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
  if (timeTables.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-md text-center">
        <DocumentIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Time Tables Found</h3>
        <p className="text-gray-500">
          No time tables match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  const getFileIcon = (type) => {
    return type === 'pdf' ? (
      <DocumentIcon className="h-8 w-8 text-red-500" />
    ) : (
      <PhotoIcon className="h-8 w-8 text-blue-500" />
    );
  };

  const getFacultyBadgeColor = (faculty) => {
    const colors = {
      ICT: 'bg-blue-100 text-blue-700 border-blue-200',
      CST: 'bg-green-100 text-green-700 border-green-200', 
      EET: 'bg-purple-100 text-purple-700 border-purple-200',
      BST: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[faculty] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Past Uploads</h3>
        <p className="text-sm text-gray-600 mt-1">
          {timeTables.length} time table{timeTables.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {timeTables.map((timeTable) => (
          <div key={timeTable.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              {/* File Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0">
                  {getFileIcon(timeTable.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900 truncate">
                      {timeTable.fileName}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getFacultyBadgeColor(timeTable.faculty)}`}>
                      {timeTable.faculty}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      <span>Uploaded by {timeTable.uploadedBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{formatDate(timeTable.uploadedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DocumentIcon className="h-4 w-4" />
                      <span>{timeTable.fileSize}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="capitalize">{timeTable.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => onPreview(timeTable)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Preview file"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </button>

                {timeTable.type === 'pdf' && (
                  <a
                    href={timeTable.fileUrl}
                    download={timeTable.fileName}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTableHistoryList;