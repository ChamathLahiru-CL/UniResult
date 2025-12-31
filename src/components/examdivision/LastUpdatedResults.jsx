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
              .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
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
    navigate('/exam/new-result');
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
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
        <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-b border-gray-200 bg-gray-50">
          <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-32 sm:w-40 md:w-48 mb-1.5 sm:mb-2 animate-pulse"></div>
          <div className="h-3 sm:h-3.5 md:h-4 bg-gray-200 rounded w-20 sm:w-24 md:w-32 animate-pulse"></div>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-3 sm:p-4 md:p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1">
                  <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 bg-gray-200 rounded animate-pulse shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-3.5 sm:h-4 md:h-5 bg-gray-200 rounded w-full max-w-[200px] sm:max-w-xs mb-1.5 sm:mb-2 animate-pulse"></div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-4">
                      <div className="h-2.5 sm:h-3 md:h-4 bg-gray-200 rounded w-16 sm:w-20 md:w-24 animate-pulse"></div>
                      <div className="h-2.5 sm:h-3 md:h-4 bg-gray-200 rounded w-14 sm:w-16 md:w-20 animate-pulse"></div>
                    </div>
                  </div>
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
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-6 sm:p-8 md:p-10 text-center">
        <DocumentIcon className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-gray-300 mx-auto mb-2 sm:mb-3" />
        <p className="text-gray-500 text-xs sm:text-sm md:text-base">No results uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
      <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Past Result Uploads</h3>
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">
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
            className="p-3 sm:p-4 md:p-5 lg:p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-3 md:gap-4">
              {/* File Icon */}
              <div className="shrink-0 mt-0.5">
                <DocumentIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-red-500" />
              </div>

              <div className="flex-1 min-w-0">
                {/* Title */}
                <h4 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-1.5 sm:mb-2 break-words leading-tight">
                  {result.subjectName}
                </h4>
                
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2 mb-2 sm:mb-2.5 md:mb-3">
                  <span className={`inline-flex items-center px-1.5 sm:px-2 md:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${getFacultyBadgeColor(result.faculty)}`}>
                    <span className="truncate max-w-[120px] sm:max-w-[150px] md:max-w-none">{result.faculty}</span>
                  </span>
                  <span className="inline-flex items-center px-1.5 sm:px-2 md:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                    {result.credits} Credit{result.credits !== '1' ? 's' : ''}
                  </span>
                </div>

                {/* Metadata */}
                <div className="space-y-1 sm:space-y-1.5 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-3 lg:gap-4 text-[10px] sm:text-xs md:text-sm text-gray-500 mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 shrink-0" />
                    <span className="truncate">
                      {result.uploadedByName}
                      {result.uploadedByRole && ` - ${result.uploadedByRole}`}
                    </span>
                  </div>
                  <span className="hidden md:inline">•</span>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 shrink-0" />
                    <span className="truncate">{formatDate(result.uploadedAt)}</span>
                  </div>
                  <span className="hidden md:inline">•</span>
                  <div className="flex items-center gap-1">
                    <AcademicCapIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 shrink-0" />
                    <span>{result.resultCount} result{result.resultCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* File details */}
                <div className="flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 md:gap-x-3 gap-y-0.5 sm:gap-y-1 text-[10px] sm:text-xs md:text-sm text-gray-500">
                  <span className="font-medium text-gray-700 truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">{result.department}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{result.fileSize}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="capitalize">Pdf File</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 sm:gap-2 md:gap-3 sm:shrink-0 sm:ml-auto mt-2 sm:mt-0">
                <button
                  onClick={() => handlePreview(result)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md sm:rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                >
                  <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="hidden xs:inline">Preview</span>
                  <span className="xs:hidden">View</span>
                </button>

                <button
                  onClick={() => handleDownload(result)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md sm:rounded-lg transition-colors border border-red-200 hover:border-red-300"
                >
                  <ArrowDownTrayIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <div className="border-t border-gray-200 bg-gray-50 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4">
        <button
          onClick={handleViewAll}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md sm:rounded-lg transition-colors duration-200"
        >
          <span>View All Results</span>
          <ArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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