import React from 'react';
import { format } from 'date-fns';
import {
  UserCircleIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  MapPinIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;

  const isSuspended = student.status === 'suspended';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Student Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Complete information about the student
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Basic Info Section */}
            <div className="mb-6">
              <div className="flex items-start">
                <UserCircleIcon className="h-12 w-12 text-gray-400" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    {student.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {student.faculty} • {student.degree}
                  </p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isSuspended 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Academic Info */}
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Year {student.year}
                    </p>
                    <p className="text-xs text-gray-500">Current Year</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <IdentificationIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.enrollmentNumber}
                    </p>
                    <p className="text-xs text-gray-500">Enrollment Number</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(student.dob), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Contact Info */}
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.email}
                    </p>
                    <p className="text-xs text-gray-500">Email Address</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.phone}
                    </p>
                    <p className="text-xs text-gray-500">Phone Number</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.address}
                    </p>
                    <p className="text-xs text-gray-500">Address</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Registered on {format(new Date(student.registeredAt), 'MMMM d, yyyy')}
                  </p>
                  <p className="text-xs text-gray-500">
                    at {format(new Date(student.registeredAt), 'h:mm a')}
                  </p>
                </div>
              </div>
            </div>

            {/* Suspension Info */}
            {isSuspended && student.suspensionReason && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Suspension Details
                </h4>
                <p className="text-sm text-red-700">
                  {student.suspensionReason}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;