import React from 'react';
import { isAfter, subDays, format } from 'date-fns';
import {
  UserCircleIcon,
  AcademicCapIcon,
  IdentificationIcon,
  EyeIcon,
  NoSymbolIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const StudentCard = ({ student, onView, onSuspend, onRemove, onActivate }) => {
  const isNew = isAfter(
    new Date(student.registeredAt),
    subDays(new Date(), 7)
  );

  const isSuspended = student.status === 'suspended';

  return (
    <div 
      className={`relative rounded-lg border ${
        isNew
          ? 'bg-green-50 border-l-4 border-l-green-600 border-t-green-200 border-r-green-200 border-b-green-200'
          : 'bg-white border-slate-200'
      } p-4 shadow-sm transition-shadow hover:shadow-md`}
    >
      {/* New Badge */}
      {isNew && (
        <span className="absolute -top-2 -right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-sm">
          New
        </span>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
          <div className="ml-2">
            <h3 className="text-sm font-medium text-gray-900">{student.name}</h3>
            <p className="text-xs text-gray-500">{student.email}</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <span className={`text-xs inline-flex items-center px-2 py-1 rounded-full ${
          isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${
            isSuspended ? 'bg-red-600' : 'bg-green-600'
          } mr-1.5`}></span>
          {isSuspended ? 'Suspended' : 'Active'}
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-sm">
          <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-1.5" />
          <span className="text-gray-600">Year {student.year}</span>
        </div>
        <div className="flex items-center text-sm">
          <IdentificationIcon className="h-4 w-4 text-gray-400 mr-1.5" />
          <span className="text-gray-600">{student.enrollmentNumber}</span>
        </div>
      </div>

      {/* Faculty & Degree */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">{student.faculty}</p>
        <p className="text-xs text-gray-500">{student.degree}</p>
      </div>

      {/* Registered Date */}
      <div className="text-xs text-gray-500 mb-4">
        Registered: {format(new Date(student.registeredAt), 'MMM d, yyyy')}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onView(student)}
          className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <EyeIcon className="h-4 w-4 mr-1" />
          View
        </button>

        {isSuspended ? (
          <button
            onClick={() => onActivate(student)}
            className="inline-flex items-center px-2 py-1 text-sm text-green-600 hover:text-green-700 transition-colors"
          >
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Activate
          </button>
        ) : (
          <button
            onClick={() => onSuspend(student)}
            className="inline-flex items-center px-2 py-1 text-sm text-orange-600 hover:text-orange-700 transition-colors"
          >
            <NoSymbolIcon className="h-4 w-4 mr-1" />
            Suspend
          </button>
        )}

        <button
          onClick={() => onRemove(student)}
          className="inline-flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default StudentCard;