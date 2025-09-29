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
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="animate-fadeIn p-4 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="relative mb-8">
        <div className="absolute top-0 left-0 w-16 h-16 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-4 right-16 w-20 h-16 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
        <h1 className="relative text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Notifications
        </h1>
        <p className="text-gray-600 text-sm font-medium">
          Stay updated with your latest academic activities
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white rounded-lg shadow-sm p-1">
          <nav className="-mb-px flex space-x-6">
            {['all', 'unread', 'read'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`
                  relative whitespace-nowrap py-3 px-6 rounded-lg font-medium text-sm capitalize transition-all duration-200
                  ${filter === tab
                    ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md shadow-blue-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }
                `}
              >
                {tab}
                {tab === 'unread' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full min-w-[20px]">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 px-6 rounded-lg 
                shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all duration-200 
                hover:translate-y-[-1px] active:translate-y-[1px]"
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
                group bg-white rounded-xl shadow-md p-5 transition-all duration-300
                ${notification.isRead 
                  ? 'border border-gray-100 hover:border-gray-200' 
                  : 'border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                }
                hover:shadow-xl hover:transform hover:-translate-y-1
              `}
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  p-3 rounded-xl transition-all duration-300 
                  ${notification.isRead 
                    ? 'bg-gray-100 group-hover:bg-gray-200' 
                    : 'bg-gradient-to-r from-blue-100 to-indigo-100 group-hover:shadow-md'
                  }
                `}>
                  <Icon className={`w-6 h-6 ${
                    notification.isRead 
                      ? 'text-gray-600 group-hover:text-gray-800' 
                      : 'text-blue-600 group-hover:text-blue-700'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-base font-semibold ${
                      notification.isRead ? 'text-gray-800' : 'text-blue-800'
                    }`}>
                      {notification.title}
                    </p>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {formatTime(notification.time)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="mt-3 flex items-center space-x-4">
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r 
                        from-blue-500 to-indigo-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200
                        hover:translate-y-[-1px] active:translate-y-[1px]"
                    >
                      View Details
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 
                          bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
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
          <div className="text-center py-16 px-4 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 mb-4">
              <BellIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              {filter === 'unread' ? 'You\'re all caught up! No unread notifications to show.' : 
               filter === 'read' ? 'No read notifications in your history yet.' :
               'Your notification feed is empty. New updates will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;