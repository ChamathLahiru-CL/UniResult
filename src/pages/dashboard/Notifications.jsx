import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  // Load notifications from localStorage on component mount
  const loadNotifications = () => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        return JSON.parse(savedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
    return [];
  };

  // Sample notifications data with persistent storage
  const [notifications, setNotifications] = useState(() => {
    const saved = loadNotifications();
    if (saved.length === 0) {
      // Initial sample data only if no saved notifications exist
      return [{
        id: 1,
        title: 'Semester 5 Results Released',
        message: 'Your semester 5 examination results are now available. Click to view your results.',
        type: 'result',
        time: '2025-09-29T10:20:00',
        isRead: false,
        link: '/dash/results'
      },
      {
        id: 2,
        title: 'GPA Update',
        message: 'Your overall GPA has been updated based on your latest results.',
        type: 'gpa',
        time: '2025-09-29T10:20:00',
        isRead: false,
        link: '/dash/gpa-trend'
      },
      {
        id: 3,
        title: 'New Exam Schedule',
        message: 'The examination timetable for Semester II 2024/2025 has been published.',
        type: 'exam',
        time: '2025-09-29T10:20:00',
        isRead: true,
        link: '/dash/exam-time-table'
      }];
    }
    return saved;
  });

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case 'result':
        return AcademicCapIcon;
      case 'gpa':
        return ChartBarIcon;
      case 'exam':
        return CalendarIcon;
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

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  // Mark notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      isRead: true
    }));
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  // Save notifications to localStorage
  const saveNotifications = (notifs) => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifs));
    } catch (error) {
      console.error('Error saving notifications:', error);
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
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

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
                  ${tab === 'unread' && unreadCount > 0 ? 'pr-8 sm:pr-10' : ''}
                `}
              >
                {tab}
                {tab === 'unread' && unreadCount > 0 && (
                  <span className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs bg-red-500 text-white rounded-full min-w-[18px] sm:min-w-[20px] flex items-center justify-center font-bold">
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
              key={notification.id}
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
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    notification.isRead 
                      ? 'text-gray-600 group-hover:text-gray-800' 
                      : 'text-blue-600 group-hover:text-blue-700'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-2">
                    <p className={`text-sm sm:text-base font-semibold pr-2 ${
                      notification.isRead ? 'text-gray-800' : 'text-blue-800'
                    }`}>
                      {notification.title}
                    </p>
                    <span className="text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 w-fit">
                      {formatTime(notification.time)}
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
                        onClick={() => markAsRead(notification.id)}
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