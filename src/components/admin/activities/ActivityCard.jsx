import React from 'react';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { activityColors, activityLabels } from '../../../data/mockActivities';

const ActivityCard = ({ activity, onView }) => {
  // Handle both old mock data structure and new API structure
  const activityType = activity.activityType || activity.type;
  const activityName = activity.activityName || activityLabels[activityType] || activityType;
  const timestamp = activity.timestamp;
  const status = activity.status;
  const priority = activity.priority;
  const description = activity.description;
  const performedBy = activity.performedBy;
  const performedByUsername = activity.performedByUsername;
  const faculty = activity.faculty;
  const year = activity.year;
  const fileName = activity.fileName;

  const colors = activityColors[activityType] || {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: 'text-blue-600'
  };

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
    switch (activityType) {
      case 'TIMETABLE_UPLOAD':
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Faculty:</span> {faculty}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Year:</span> {year}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">File:</span> {fileName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Uploaded by:</span> {performedBy} ({performedByUsername})
            </p>
          </div>
        );

      case 'RESULT_UPLOAD':
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Uploaded by:</span> {performedBy}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Year:</span> {year}
            </p>
          </div>
        );

      case 'COMPLIANCE':
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">From:</span> {performedBy}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Student ID:</span> {performedByUsername}
            </p>
          </div>
        );

      default:
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Performed by:</span> {performedBy}
            </p>
            {performedByUsername && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Username:</span> {performedByUsername}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`rounded-xl shadow-md px-4 py-3 mb-4 border-l-4 ${colors.bg} ${colors.border} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with icon and badge */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">📋</span>
            <div className="flex items-center gap-2">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
                {activityName}
              </span>
              {status === 'NEW' && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  New
                </span>
              )}
              {priority === 'HIGH' && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-200 text-red-800">
                  High Priority
                </span>
              )}
              {isToday(timestamp) && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Today
                </span>
              )}
            </div>
          </div>

          {/* Title and description */}
          <div className="mb-3">
            <h3 className={`text-lg font-semibold ${colors.text} mb-1`}>
              {activityName}
            </h3>
            <p className="text-gray-600 text-sm">
              {description}
            </p>
          </div>

          {/* Metadata */}
          <div className="mb-3">
            {renderMetadata()}
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formatTimestamp(timestamp)}</span>
            <span>•</span>
            <span>{getRelativeTime(timestamp)}</span>
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