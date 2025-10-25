import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  BellIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { mockActivities } from '../../data/mockActivities';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Get only unread activities and limit to 5 most recent
  const unreadActivities = mockActivities
    .filter(activity => activity.status === 'NEW')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  const getActivityIcon = (type, priority) => {
    if (priority === 'HIGH') {
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
    }
    
    switch (type) {
      case 'COMPLIANCE':
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />;
      case 'RESULT_UPLOAD':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'SYSTEM_MAINTENANCE':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleViewAllActivities = () => {
    navigate('/admin/activities');
    onClose();
  };

  const handleNotificationClick = (activity) => {
    if (activity.link) {
      navigate(activity.link);
    } else {
      navigate('/admin/activities');
    }
    onClose();
  };

  const truncateTitle = (title, maxLength = 40) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-30" 
        onClick={onClose}
      ></div>
      
      {/* Notification Dropdown */}
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-40 max-h-96 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BellIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadActivities.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadActivities.length} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-64 overflow-y-auto">
          {unreadActivities.length === 0 ? (
            <div className="p-6 text-center">
              <BellIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No new notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {unreadActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => handleNotificationClick(activity)}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type, activity.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {truncateTitle(activity.title)}
                        </p>
                        {activity.priority === 'HIGH' && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            High
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </span>
                        {activity.link && (
                          <ArrowTopRightOnSquareIcon className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleViewAllActivities}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            View All Activities
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;