import React from 'react';
import { format } from 'date-fns';
import {
  DocumentIcon,
  CalendarIcon,
  MegaphoneIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

const ActivityTimeline = ({ activities }) => {
  if (!activities?.length) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-gray-500">No activity recorded yet</p>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload_result':
        return <DocumentIcon className="h-5 w-5" />;
      case 'update_timetable':
        return <CalendarIcon className="h-5 w-5" />;
      case 'news_upload':
        return <MegaphoneIcon className="h-5 w-5" />;
      case 'compliance_check':
        return <ClipboardDocumentCheckIcon className="h-5 w-5" />;
      default:
        return <DocumentIcon className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'upload_result':
        return 'text-blue-600 bg-blue-100';
      case 'update_timetable':
        return 'text-purple-600 bg-purple-100';
      case 'news_upload':
        return 'text-amber-600 bg-amber-100';
      case 'compliance_check':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = format(new Date(activity.createdAt), 'MMM d, yyyy');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {Object.entries(groupedActivities).map(([date, dayActivities], groupIndex) => (
          <li key={date}>
            <div className="relative pb-8">
              {groupIndex !== Object.keys(groupedActivities).length - 1 && (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex flex-col space-y-4">
                <div className="text-sm text-gray-500 mb-2">{date}</div>
                {dayActivities.map((activity) => (
                  <div key={activity.id} className="relative flex space-x-3">
                    <div>
                      <span className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-900">{activity.description}</p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        {format(new Date(activity.createdAt), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityTimeline;