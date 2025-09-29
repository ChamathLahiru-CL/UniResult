import React from 'react';
import { 
  DocumentTextIcon, 
  ChartBarIcon,
  CalendarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

/**
 * RecentNotifications Component
 * Displays a list of recent notifications with timestamps
 * Each notification has a type icon, message, and action button
 */
const RecentNotifications = ({ notifications = [] }) => {
  // Get appropriate icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'result':
        return DocumentTextIcon;
      case 'gpa':
        return ChartBarIcon;
      case 'exam':
        return CalendarIcon;
      default:
        return PlayIcon;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-50 rounded-full opacity-50"></div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50 rounded-full opacity-40"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-5">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Recent Notifications</h2>
        </div>
        
        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white border border-gray-100 hover:border-blue-100 transition-all duration-200 hover:shadow-md mb-3 transform hover:-translate-y-1"
                >
                  <div className="flex items-start flex-grow">
                    <div className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                      notification.type === 'result' ? 'bg-blue-100 text-blue-600' :
                      notification.type === 'gpa' ? 'bg-green-100 text-green-600' :
                      notification.type === 'exam' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                      <div className="flex items-center mt-1">
                        <svg className="h-3 w-3 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-sm transition-all duration-200 flex items-center">
                    View
                    <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">All caught up!</p>
            <p className="text-gray-400 text-sm mt-1">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentNotifications;