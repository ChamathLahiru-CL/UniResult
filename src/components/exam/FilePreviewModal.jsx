import React, { useEffect, useRef } from 'react';
import { XMarkIcon, ArrowTopRightOnSquareIcon, DocumentIcon } from '@heroicons/react/24/outline';

const FilePreviewModal = ({ isOpen, onClose, file }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      // Keep focus within modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const openInNewTab = () => {
    if (file?.fileUrl) {
      window.open(file.fileUrl, '_blank');
    }
  };

  if (!isOpen || !file) return null;

  const isPDF = file.type === 'pdf';
  const isImage = file.type === 'image';

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl max-w-4xl max-h-[90vh] w-full flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <DocumentIcon className="h-6 w-6 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{file.fileName}</h3>
              <p className="text-sm text-gray-500">
                {file.faculty} • {file.fileSize} • Uploaded by {file.uploadedBy}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isPDF && (
              <button
                onClick={openInNewTab}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                Open in New Tab
              </button>
            )}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close preview"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-4">
          {isImage ? (
            <div className="flex justify-center">
              <img
                src={file.fileUrl}
                alt={file.fileName}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Image could not be loaded</p>
                </div>
              </div>
            </div>
          ) : isPDF ? (
            <div className="h-[70vh]">
              <embed
                src={file.fileUrl}
                type="application/pdf"
                className="w-full h-full rounded-lg"
                onError={() => {
                  console.error('PDF could not be loaded');
                }}
              />
              <div className="hidden items-center justify-center h-full bg-gray-100 rounded-lg">
                <div className="text-center">
                  <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">PDF Preview Not Available</p>
                  <button
                    onClick={openInNewTab}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#246BFD] text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    Open PDF in New Tab
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <div className="text-center">
                <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">File preview not available</p>
                <p className="text-sm text-gray-500 mt-1">File type: {file.type}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Press <kbd className="px-2 py-1 bg-white border rounded text-xs">Esc</kbd> to close
          </div>
          <div className="flex gap-3">
            {/* Download button for all file types */}
            <a
              href={file.fileUrl}
              download={file.fileName}
              className={`inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-sm ${
                isPDF 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isPDF ? 'Download PDF' : 'Download Image'}
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;