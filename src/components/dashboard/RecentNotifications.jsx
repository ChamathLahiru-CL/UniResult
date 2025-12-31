import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  ChartBarIcon,
  CalendarIcon,
  NewspaperIcon,
  BellIcon
} from '@heroicons/react/24/outline';

/**
 * RecentNotifications Component
 * Displays a list of recent notifications with timestamps
 * Each notification has a type icon, message, and action button
 * Fetches latest 5 notifications from backend
 */
const RecentNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/notifications?limit=5', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setNotifications(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Get appropriate icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'result':
        return DocumentTextIcon;
      case 'gpa':
        return ChartBarIcon;
      case 'timetable':
      case 'exam':
        return CalendarIcon;
      case 'news':
        return NewspaperIcon;
      default:
        return BellIcon;
    }
  };

  // Format date to relative time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Handle view notification
  const handleViewNotification = (notification) => {
    if (notification.link) {
      navigate(notification.link);
    }
  };

  // Navigate to full notifications page
  const handleViewMore = () => {
    navigate('/dash/notifications');
  };

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md border border-gray-200 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-50 rounded-full opacity-50"></div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50 rounded-full opacity-40"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md mr-2 sm:mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Recent Notifications</h2>
          </div>
        </div>
        
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Notifications List */}
            {notifications.length > 0 ? (
              <>
                <div className="space-y-2 sm:space-y-4">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    
                    return (
                      <div 
                        key={notification._id} 
                        className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white border border-gray-100 hover:border-blue-100 transition-all duration-200 hover:shadow-md transform md:hover:-translate-y-1 active:scale-95"
                      >
                        <div className="flex items-start flex-grow min-w-0">
                          <div className={`p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0 ${
                            notification.type === 'result' ? 'bg-blue-100 text-blue-600' :
                            notification.type === 'gpa' ? 'bg-green-100 text-green-600' :
                            notification.type === 'timetable' || notification.type === 'exam' ? 'bg-yellow-100 text-yellow-600' :
                            notification.type === 'news' ? 'bg-purple-100 text-purple-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{notification.message}</p>
                            <div className="flex items-center mt-1">
                              <svg className="h-3 w-3 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleViewNotification(notification)}
                          className="ml-4 px-4 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-sm transition-all duration-200 flex items-center"
                        >
                          View
                          <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                {/* View More Button */}
                <div className="mt-5 text-center">
                  <button
                    onClick={handleViewMore}
                    className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    View More Notifications
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </>
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
          </>
        )}
      </div>
    </div>
  );
};

export default RecentNotifications;