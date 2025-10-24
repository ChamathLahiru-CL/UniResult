import React, { useState } from 'react';
import { CloudArrowUpIcon, DocumentIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { facultyOptions } from '../../data/mockTimeTables';
import { validateFileType, getFileType, formatFileSize } from '../../utils/validateFileType';
import { notificationDispatcher, showNotificationToast } from '../../utils/notificationDispatcher';
import UploadProgressBar from './UploadProgressBar';

const TimeTableUploadForm = ({ onUploadSuccess }) => {
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setError('');

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const validation = validateFileType(file);
    if (!validation.isValid) {
      setError(validation.error);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    
    // Create preview for images
    if (getFileType(file) === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    // Reset file input
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  const simulateUpload = () => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random progress increment
        setUploadProgress(Math.min(progress, 100));
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(resolve, 500); // Small delay after reaching 100%
        }
      }, 200);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFaculty || !selectedFile) {
      setError('Please select both faculty and file before uploading.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Simulate file upload with progress
      await simulateUpload();

      // Create upload data
      const uploadData = {
        id: `tt_${Date.now()}`,
        faculty: selectedFaculty,
        uploadedBy: 'Current User', // In real app, get from auth context
        fileName: selectedFile.name,
        fileUrl: `/uploads/${selectedFile.name}`, // Simulated URL
        type: getFileType(selectedFile) === 'pdf' ? 'pdf' : 'image',
        uploadedAt: new Date().toISOString(),
        fileSize: formatFileSize(selectedFile.size)
      };

      // Dispatch notifications
      await notificationDispatcher(uploadData);

      // Call success callback
      onUploadSuccess(uploadData);

      // Show success message
      showNotificationToast('success', `Time table uploaded successfully for ${selectedFaculty}!`);

      // Reset form
      resetForm();

    } catch (error) {
      console.error('Upload failed:', error);
      setError('Upload failed. Please try again.');
      showNotificationToast('error', 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setSelectedFaculty('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  const isFormValid = selectedFaculty && selectedFile && !isUploading;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <CloudArrowUpIcon className="h-6 w-6 text-[#246BFD]" />
        <h2 className="text-xl font-semibold text-gray-900">Upload New Time Table</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Faculty Selection */}
        <div>
          <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
            Select Faculty <span className="text-red-500">*</span>
          </label>
          <select
            id="faculty"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            disabled={isUploading}
            className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Choose a faculty...</option>
            {facultyOptions.map((faculty) => (
              <option key={faculty.value} value={faculty.value}>
                {faculty.label}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Time Table <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${selectedFile 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                }
                ${isUploading ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudArrowUpIcon className="w-8 h-8 mb-3 text-slate-400" />
                <p className="mb-2 text-sm text-slate-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">PDF, JPG, PNG (MAX. 10MB)</p>
              </div>
            </label>
          </div>
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-16 h-16 object-cover rounded-lg border border-slate-300"
                  />
                ) : (
                  <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                    <DocumentIcon className="w-8 h-8 text-red-600" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getFileType(selectedFile) === 'image' ? (
                      <PhotoIcon className="w-4 h-4 text-blue-500" />
                    ) : (
                      <DocumentIcon className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-600 capitalize">
                      {getFileType(selectedFile)} File
                    </span>
                  </div>
                </div>
              </div>
              {!isUploading && (
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        <UploadProgressBar progress={uploadProgress} isVisible={isUploading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors
            ${isFormValid
              ? 'bg-[#246BFD] text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isUploading ? 'Uploading...' : 'Upload Time Table'}
        </button>
      </form>
    </div>
  );
};

export default TimeTableUploadForm;