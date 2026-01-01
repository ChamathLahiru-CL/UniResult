import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

const ComplianceDetailView = ({ complaint }) => {
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [downloadingFiles, setDownloadingFiles] = useState(new Set());

  if (!complaint) return null;

  const handleAttachmentPreview = async (attachment) => {
    try {
      const response = await fetch(`http://localhost:5000/api/compliance/${complaint._id}/attachment/${attachment._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load preview: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setSelectedAttachment({ ...attachment, previewUrl: url });
    } catch (error) {
      console.error('Preview error:', error);
      alert(`Failed to load preview for ${attachment.originalName || attachment.filename}. Please try downloading instead.`);
    }
  };

  const closePreview = () => {
    if (selectedAttachment && selectedAttachment.previewUrl) {
      window.URL.revokeObjectURL(selectedAttachment.previewUrl);
    }
    setSelectedAttachment(null);
  };

  const isImage = (filename) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const isPDF = (filename) => {
    return filename.toLowerCase().endsWith('.pdf');
  };

  const handleDownload = async (attachment) => {
    const fileId = attachment._id || attachment.filename;
    setDownloadingFiles(prev => new Set(prev).add(fileId));

    try {
      const response = await fetch(`http://localhost:5000/api/compliance/${complaint._id}/attachment/${attachment._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.originalName || attachment.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert(`Failed to download ${attachment.originalName || attachment.filename}. Please try again.`);
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const isDownloading = (attachment) => {
    const fileId = attachment._id || attachment.filename;
    return downloadingFiles.has(fileId);
  };

  return (
    <div className="space-y-6">
      {/* Main Complaint Content */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {complaint.topic}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Recipient: {complaint.recipient}</span>
            <span>Importance: {complaint.importance}</span>
            {!complaint.isRead && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Unread
              </span>
            )}
          </div>
        </div>

        <div className="prose max-w-none">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Complaint Message:</h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {complaint.message}
            </p>
          </div>
        </div>

        {/* Selected Groups */}
        {complaint.selectedGroups && complaint.selectedGroups.length > 0 && (
          <div className="mt-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">Selected Groups:</h4>
              <div className="flex flex-wrap gap-2">
                {complaint.selectedGroups.map((group, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {group}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Attachments Preview - Modern Design */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <div className="mt-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Attachments</h4>
                  <p className="text-xs text-gray-500 mt-1">{complaint.attachments.length} file{complaint.attachments.length !== 1 ? 's' : ''} uploaded</p>
                </div>
              </div>

              {/* Attachments Grid */}
              <div className="space-y-3">
                {complaint.attachments.map((attachment, index) => {
                  const fileName = attachment.originalName || attachment.filename;
                  const fileSize = ((attachment.size || 0) / 1024).toFixed(2);
                  const isImg = isImage(fileName);
                  const isPdf = isPDF(fileName);

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group"
                    >
                      {/* File Info Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* File Type Icon */}
                          <div className={`p-2.5 rounded-lg flex-shrink-0 ${
                            isImg ? 'bg-blue-100' : isPdf ? 'bg-red-100' : 'bg-gray-100'
                          }`}>
                            {isImg ? (
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            ) : isPdf ? (
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 6h16V4H4v2zm0 5h16V9H4v2zm0 5h16v-2H4v2z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </div>

                          {/* File Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate" title={fileName}>
                                {fileName}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                                isImg ? 'bg-blue-100 text-blue-700' : isPdf ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {fileName.split('.').pop().toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{fileSize} KB</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          {/* Preview Button */}
                          <button
                            onClick={() => handleAttachmentPreview(attachment)}
                            className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group/btn"
                            title="Preview file"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Download Button */}
                          <button
                            onClick={() => handleDownload(attachment)}
                            disabled={isDownloading(attachment)}
                            className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                              isDownloading(attachment)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'text-green-600 bg-green-50 hover:bg-green-100'
                            }`}
                            title={isDownloading(attachment) ? 'Downloading...' : 'Download file'}
                          >
                            {isDownloading(attachment) ? (
                              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 010 20 10 10 0 010-20z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* File Preview Thumbnail (for images) */}
                      {isImg && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleAttachmentPreview(attachment)}
                          >
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Response Section */}
      {complaint.response && complaint.response.message && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Admin Response
          </h3>

          <div className="border-l-4 border-green-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {complaint.response.respondedByName}
                </span>
                <span className="text-xs text-gray-500">
                  Admin
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(complaint.response.respondedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>

            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {complaint.response.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Response State */}
      {(!complaint.response || !complaint.response.message) && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No admin response yet</h3>
            <p className="text-sm text-gray-500">
              This complaint hasn't received any admin response.
            </p>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {selectedAttachment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedAttachment.originalName || selectedAttachment.filename}
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-auto">
              {isImage(selectedAttachment.originalName || selectedAttachment.filename) ? (
                <img
                  src={selectedAttachment.previewUrl}
                  alt={selectedAttachment.originalName || selectedAttachment.filename}
                  className="max-w-full h-auto rounded-lg"
                />
              ) : isPDF(selectedAttachment.originalName || selectedAttachment.filename) ? (
                <iframe
                  src={selectedAttachment.previewUrl}
                  className="w-full h-96 border rounded-lg"
                  title="PDF Preview"
                />
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 mb-4">This file type cannot be previewed directly.</p>
                  <button
                    onClick={() => handleDownload(selectedAttachment)}
                    disabled={isDownloading(selectedAttachment)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isDownloading(selectedAttachment)
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {isDownloading(selectedAttachment) ? 'Downloading...' : 'Download File'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceDetailView;