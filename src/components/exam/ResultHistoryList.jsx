import React from 'react';
import {
  EyeIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  PhotoIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatDate';

const ResultHistoryList = ({ results = [], onPreview }) => {
  const handleDownload = async (result) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/results/${result.id}/download`, {
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
        a.download = result.fileName; // Use the original filename
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

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-md text-center">
        <DocumentIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Result Sheets Found</h3>
        <p className="text-gray-500">
          No result sheets match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <DocumentIcon className="h-8 w-8 text-red-500" />;
      case 'docx':
        return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
      case 'excel':
        return <TableCellsIcon className="h-8 w-8 text-green-500" />;
      case 'image':
        return <PhotoIcon className="h-8 w-8 text-purple-500" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    }
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
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Past Result Uploads</h3>
        <p className="text-sm text-gray-600 mt-1">
          {results.length} result sheet{results.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {results.map((result) => (
          <div key={result.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              {/* File Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0">
                  {getFileIcon(result.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900 truncate">
                      {result.subjectName}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getFacultyBadgeColor(result.faculty)}`}>
                      {result.faculty}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {result.year}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {result.credits} Credit{result.credits !== '1' ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      <span>
                        Uploaded by {result.uploadedByName}
                        {result.uploadedByUsername && ` (${result.uploadedByUsername})`}
                        {result.uploadedByRole && ` - ${result.uploadedByRole}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{formatDate(result.uploadedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AcademicCapIcon className="h-4 w-4" />
                      <span>{result.resultCount} result{result.resultCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{result.department}</span>
                    <span>•</span>
                    <span>{result.fileName}</span>
                    <span>•</span>
                    <span>{result.fileSize}</span>
                    <span>•</span>
                    <span className="capitalize">{result.type} file</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => onPreview(result)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Preview file"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </button>

                {/* Download button for all file types */}
                <button
                  onClick={() => handleDownload(result)}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    result.type === 'pdf' ? 'text-red-600 hover:text-red-800 hover:bg-red-50' :
                    result.type === 'docx' ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50' :
                    result.type === 'excel' ? 'text-green-600 hover:text-green-800 hover:bg-green-50' :
                    'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                  }`}
                  title={`Download ${result.type.toUpperCase()} file`}
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultHistoryList;