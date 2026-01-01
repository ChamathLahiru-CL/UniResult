import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  EyeIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  ArrowRightIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatDate';
import FilePreviewModal from '../exam/FilePreviewModal';

const LastUpdatedResults = ({ isLoading }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState({ isOpen: false, file: null });

  // Fetch last 5 results from API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/results', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            // Get last 5 results sorted by upload date
            const last5 = data.data
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5);
            setResults(last5);
          }
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleViewAll = () => {
    navigate('/exam/results');
  };

  const handlePreview = async (result) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/results/${result._id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Open the file preview modal with the result PDF
        const fileData = {
          fileName: result.fileName || `${result.subjectName}.pdf`,
          fileUrl: blobUrl,
          type: 'pdf',
          faculty: result.faculty,
          fileSize: result.fileSize,
          uploadedBy: result.uploadedByName
        };
        setPreviewModal({ isOpen: true, file: fileData });
      } else {
        alert('Failed to load file preview');
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('An error occurred while loading the preview.');
    }
  };

  const closePreviewModal = () => {
    // Revoke the blob URL to free memory
    if (previewModal.file?.fileUrl) {
      window.URL.revokeObjectURL(previewModal.file.fileUrl);
    }
    setPreviewModal({ isOpen: false, file: null });
  };

  const handleDownload = async (result) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/results/${result._id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download file');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('An error occurred while downloading the file.');
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

  if (loading || isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="h-5 bg-gray-200 rounded w-40 mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-5 bg-gray-200 rounded w-full max-w-xs mb-2 animate-pulse"></div>
                  <div className="flex gap-2 mb-3">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 sm:p-10 md:p-12 text-center border border-gray-100">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full mb-4">
          <DocumentIcon className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">Result sheets will appear here once they're uploaded by exam division members.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Past Result Uploads</h3>
        <p className="text-sm text-gray-600 mt-1">
          {results.length} latest result sheet{results.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {results.map((result, index) => (
          <motion.div
            key={result._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-4 sm:p-6 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-300 border-b border-gray-50 last:border-b-0 relative overflow-hidden"
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full transform translate-x-16 -translate-y-16"></div>
            </div>

            <div className="flex items-start gap-4 relative z-10">
              {/* File Icon with modern styling */}
              <div className="shrink-0">
                <div className="p-2 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200/50 group-hover:shadow-md transition-shadow duration-300">
                  <DocumentIcon className="h-6 w-6 text-red-500" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {/* Title with better typography */}
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors line-clamp-2">
                  {result.subjectName}
                </h4>
                
                {/* Enhanced badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm ${getFacultyBadgeColor(result.faculty)}`}>
                    <span className="truncate max-w-xs">{result.faculty}</span>
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                    {result.credits} Credit{result.credits !== '1' ? 's' : ''}
                  </span>
                </div>

                {/* Metadata with better spacing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate text-xs font-medium">
                      {result.uploadedByName}
                      {result.uploadedByRole && ` • ${result.uploadedByRole}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-xs font-medium text-blue-700">
                      {result.createdAt ? formatDate(result.createdAt) : 'Date not available'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AcademicCapIcon className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-xs font-medium text-green-700">
                      {result.resultCount || 0} result{(result.resultCount || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* File details */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="font-medium text-gray-700 truncate max-w-xs">{result.department}</span>
                  <span className="text-gray-300">•</span>
                  <span>{result.fileSize}</span>
                  <span className="text-gray-300">•</span>
                  <span className="capitalize font-medium text-gray-600">PDF File</span>
                </div>
              </div>

              {/* Modern action buttons */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handlePreview(result)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-md transform hover:scale-105"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </button>

                <button
                  onClick={() => handleDownload(result)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 hover:shadow-md transform hover:scale-105"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4">
        <button
          onClick={handleViewAll}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-md transform hover:scale-105"
        >
          <span>View All Results</span>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        file={previewModal.file}
      />
    </div>
  );
};

export default LastUpdatedResults;