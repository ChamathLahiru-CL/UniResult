import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  UserIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ResultRow = ({ result }) => {
  const formatDate = (date) => {
    return format(new Date(date), 'yyyy-MM-dd');
  };

  const formatDateTime = (date) => {
    return format(new Date(date), 'MMM dd, HH:mm');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'processing':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <tr className="bg-white hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100">
      {/* Date */}
      <td className="py-4 px-4 text-sm text-slate-700">
        <div className="flex flex-col">
          <span className="font-medium">{formatDate(result.date)}</span>
          <span className="text-xs text-slate-500">{formatDateTime(result.date)}</span>
        </div>
      </td>

      {/* Degree */}
      <td className="py-4 px-4 text-sm">
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 font-medium">
          {result.degree}
        </span>
      </td>

      {/* Subject */}
      <td className="py-4 px-4 text-sm font-medium text-slate-800 max-w-xs">
        <div className="truncate" title={result.subject}>
          {result.subject}
        </div>
      </td>

      {/* Level */}
      <td className="py-4 px-4 text-sm text-slate-600">
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-800 font-medium">
          {result.level}
        </span>
      </td>

      {/* Semester */}
      <td className="py-4 px-4 text-sm text-slate-600">
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-800 font-medium">
          {result.semester}
        </span>
      </td>

      {/* Uploader */}
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <Link 
              to={`/admin/exam-division/${result.uploadedBy.memberId}`}
              className="text-slate-700 font-medium hover:text-blue-600 hover:underline text-sm transition-colors"
            >
              {result.uploadedBy.name}
            </Link>
            <p className="text-xs text-slate-500">ID: {result.uploadedBy.id}</p>
            <p className="text-xs text-slate-400">{result.uploadedBy.department}</p>
          </div>
        </div>
      </td>

      {/* Statistics */}
      <td className="py-4 px-4 text-sm">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Students:</span>
            <span className="font-medium text-slate-700">{result.statistics.totalStudents}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Avg:</span>
            <span className="font-medium text-slate-700">{result.statistics.averageGrade}%</span>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(result.status)}
          <span className={getStatusBadge(result.status)}>
            {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-4 text-right">
        <Link to={`/admin/results/${result.id}`}>
          <button className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-colors">
            <EyeIcon className="h-4 w-4" />
            <span>View Details</span>
          </button>
        </Link>
      </td>
    </tr>
  );
};

export default ResultRow;