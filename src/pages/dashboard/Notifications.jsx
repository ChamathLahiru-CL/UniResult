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
    <div className="animate-fadeIn p-4">
      {/* Page Header */}
      <div className="relative mb-6">
        <div className="absolute top-0 left-0 w-12 h-12 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-2 right-12 w-16 h-12 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <h1 className="relative text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          Notifications
        </h1>
        <p className="text-gray-500 text-sm">
          Stay updated with your latest academic activities
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-between border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['all', 'unread', 'read'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                  ${filter === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab}
                {tab === 'unread' && unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-md hover:bg-blue-50 transition-colors duration-150"
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
                bg-white rounded-lg shadow-sm border p-4 transition-all duration-200
                ${notification.isRead ? 'border-gray-100' : 'border-blue-100 bg-blue-50'}
                hover:shadow-md hover:transform hover:-translate-y-0.5
              `}
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  p-2 rounded-full
                  ${notification.isRead ? 'bg-gray-100' : 'bg-blue-100'}
                `}>
                  <Icon className={`w-6 h-6 ${notification.isRead ? 'text-gray-500' : 'text-blue-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-900' : 'text-blue-800'}`}>
                      {notification.title}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatTime(notification.time)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Details
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
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
          <div className="text-center py-12">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'unread' ? 'No unread notifications to show.' : 
               filter === 'read' ? 'No read notifications to show.' :
               'You don\'t have any notifications yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;