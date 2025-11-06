import React from 'react';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { activityColors, activityLabels } from '../../../data/mockActivities';

const ActivityCard = ({ activity, onView }) => {
  const colors = activityColors[activity.type];
  
  const formatTimestamp = (timestamp) => {
    if (isToday(timestamp)) {
      return `Today, ${format(timestamp, 'HH:mm')}`;
    } else if (isYesterday(timestamp)) {
      return `Yesterday, ${format(timestamp, 'HH:mm')}`;
    } else {
      return format(timestamp, 'MMM dd, HH:mm');
    }
  };

  const getRelativeTime = (timestamp) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  const renderMetadata = () => {
    switch (activity.type) {
      case 'COMPLIANCE':
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">From:</span> {activity.metadata.sender}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Student ID:</span> {activity.metadata.studentId}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Module:</span> {activity.metadata.module}
            </p>
          </div>
        );
      
      case 'RESULT_UPLOAD':
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Uploaded by:</span> {activity.metadata.uploader}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Year:</span> {activity.metadata.year} • 
              <span className="font-medium"> Results:</span> {activity.metadata.resultCount}
              {activity.metadata.errors > 0 && (
                <span className="text-red-600 font-medium"> • Errors: {activity.metadata.errors}</span>
              )}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Department:</span> {activity.metadata.department}
            </p>
          </div>
        );
      
      case 'TIMETABLE_UPLOAD':
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Uploaded by:</span> {activity.metadata.uploader}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Faculty:</span> {activity.metadata.faculty} • 
              <span className="font-medium"> Format:</span> {activity.metadata.format} • 
              <span className="font-medium"> Size:</span> {activity.metadata.fileSize}
            </p>
          </div>
        );
      
      case 'NEWS_UPLOAD':
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Posted by:</span> {activity.metadata.poster}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Target Faculties:</span> {activity.metadata.targetFaculties.join(', ')}
            </p>
          </div>
        );
      
      case 'STUDENT_REGISTRATION':
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Student:</span> {activity.metadata.studentName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Enrollment:</span> {activity.metadata.enrollmentNumber}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Program:</span> {activity.metadata.degree} - {activity.metadata.department}
            </p>
          </div>
        );
      
      case 'SYSTEM_MAINTENANCE':
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Admin:</span> {activity.metadata.admin}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {activity.metadata.updateType}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Affected:</span> {activity.metadata.affectedModules.join(', ')}
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-xl shadow-md px-4 py-3 mb-4 border-l-4 ${colors.bg} ${colors.border} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with icon and badge */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">{activity.icon}</span>
            <div className="flex items-center gap-2">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
                {activityLabels[activity.type]}
              </span>
              {activity.status === 'NEW' && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  New
                </span>
              )}
              {activity.priority === 'HIGH' && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-200 text-red-800">
                  High Priority
                </span>
              )}
              {isToday(activity.timestamp) && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Today
                </span>
              )}
            </div>
          </div>

          {/* Title and description */}
          <div className="mb-3">
            <h3 className={`text-lg font-semibold ${colors.text} mb-1`}>
              {activity.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {activity.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="mb-3">
            {renderMetadata()}
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formatTimestamp(activity.timestamp)}</span>
            <span>•</span>
            <span>{getRelativeTime(activity.timestamp)}</span>
          </div>
        </div>

        {/* Action button */}
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onView(activity)}
            className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${colors.text} hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200`}
          >
            View Details
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;