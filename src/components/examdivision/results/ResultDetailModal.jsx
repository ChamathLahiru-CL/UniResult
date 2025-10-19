import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const ResultDetailModal = ({ result, isOpen, onClose }) => {
  if (!result) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <Dialog.Overlay className="fixed inset-0 bg-black/40 transition-opacity" />

        {/* Modal Panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Result Details
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Subject Information */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {result.subject}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Degree Program</p>
                  <p className="text-base font-medium">{result.degree}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Academic Year</p>
                  <p className="text-base font-medium">{result.year}</p>
                </div>
              </div>
            </div>

            {/* Upload Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Upload Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Uploaded By</p>
                  <p className="text-base font-medium">{result.uploadedBy}</p>
                  <p className="text-sm text-gray-500">{result.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upload Date & Time</p>
                  <p className="text-base font-medium">
                    {format(new Date(result.timestamp), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(result.timestamp), 'h:mm a')}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-600 font-medium">Total Results</p>
                <p className="text-2xl font-bold text-blue-700">{result.count}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-green-600 font-medium">Pass Rate</p>
                <p className="text-2xl font-bold text-green-700">78%</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center sm:col-span-1 col-span-2">
                <p className="text-sm text-purple-600 font-medium">Average GPA</p>
                <p className="text-2xl font-bold text-purple-700">3.2</p>
              </div>
            </div>

            {/* Additional Notes or Comments */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Additional Notes</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                Results uploaded successfully. All student records have been processed and verified.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
            <button
              onClick={() => console.log('Download results')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Download Results
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ResultDetailModal;