import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../context/NotificationContext';

const Notifications = () => {
  const navigate = useNavigate();
  const { decreaseCount, resetCount } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load notifications from backend
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Please log in to view notifications');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const result = await response.json();

      if (result.success) {
        setNotifications(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to load notifications');
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case 'result':
        return AcademicCapIcon;
      case 'gpa':
        return ChartBarIcon;
      case 'exam':
      case 'timetable':
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

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update local state
        setNotifications(prevNotifications =>
          prevNotifications.map(notif =>
            notif._id === id ? { ...notif, isRead: true } : notif
          )
        );
        // Decrease count in context
        decreaseCount(1);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update local state
        setNotifications(prevNotifications =>
          prevNotifications.map(notif => ({ ...notif, isRead: true }))
        );
        // Reset count in context
        resetCount();
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'read') return notif.isRead;
    if (filter === 'unread') return !notif.isRead;
    return true;
  });

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="animate-fadeIn p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute top-4 right-16 w-16 sm:w-20 h-12 sm:h-16 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
          <h1 className="relative text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Notifications
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm font-medium">
            Stay updated with your latest academic activities
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading notifications...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="animate-fadeIn p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
        <div className="relative mb-6 sm:mb-8">
          <h1 className="relative text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Notifications
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadNotifications}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-fadeIn p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute top-4 right-16 w-16 sm:w-20 h-12 sm:h-16 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
          <h1 className="relative text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Notifications
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm font-medium">
            Stay updated with your latest academic activities
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-lg shadow-sm p-3 sm:p-4">
            {/* Tab Navigation */}
            <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
              {['all', 'unread', 'read'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`
                  relative whitespace-nowrap py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-xs sm:text-sm capitalize transition-all duration-200
                  focus:outline-none flex-shrink-0
                  ${filter === tab
                      ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md shadow-blue-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }
                  ${tab === 'unread' && unreadCount > 0 ? 'pr-10 sm:pr-12' : ''}
                `}
                >
                  {tab}
                  {tab === 'unread' && unreadCount > 0 && (
                    <span className="absolute top-1/2 -translate-y-1/2 right-2.5 sm:right-3.5 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-red-500 text-white rounded-full min-w-[20px] sm:min-w-[24px] flex items-center justify-center font-bold shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Mark All as Read Button */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="w-full sm:w-auto text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg 
                shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all duration-200 
                hover:translate-y-[-1px] active:translate-y-[1px] focus:outline-none"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <div
                key={notification._id}
                className={`
                group bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300
                ${notification.isRead
                    ? 'border border-gray-100 hover:border-gray-200'
                    : 'border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                  }
                hover:shadow-xl hover:transform hover:-translate-y-1
              `}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`
                  p-2.5 sm:p-3 rounded-xl transition-all duration-300 flex-shrink-0
                  ${notification.isRead
                      ? 'bg-gray-100 group-hover:bg-gray-200'
                      : 'bg-gradient-to-r from-blue-100 to-indigo-100 group-hover:shadow-md'
                    }
                `}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${notification.isRead
                        ? 'text-gray-600 group-hover:text-gray-800'
                        : 'text-blue-600 group-hover:text-blue-700'
                      }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-2">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm sm:text-base font-semibold pr-2 ${notification.isRead ? 'text-gray-800' : 'text-blue-800'
                          }`}>
                          {notification.title}
                        </p>
                        {/* Priority Badge */}
                        {notification.priority && notification.priority !== 'normal' && (
                          <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${notification.priority === 'urgent'
                              ? 'bg-red-100 text-red-700'
                              : notification.priority === 'high'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                            {notification.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 w-fit">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                      {notification.message}
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r 
                        from-blue-500 to-indigo-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200
                        hover:translate-y-[-1px] active:translate-y-[1px] focus:outline-none"
                      >
                        View Details
                        <svg className="ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 
                          bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 focus:outline-none"
                        >
                          <CheckCircleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12 sm:py-16 px-4 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 mb-3 sm:mb-4">
                <BellIcon className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
                {filter === 'unread' ? 'You\'re all caught up! No unread notifications to show.' :
                  filter === 'read' ? 'No read notifications in your history yet.' :
                    'Your notification feed is empty. New updates will appear here.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;