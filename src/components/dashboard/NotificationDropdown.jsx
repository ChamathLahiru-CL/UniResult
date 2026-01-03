/**
 * NotificationDropdown Component
 * 
 * A dropdown menu that displays user notifications with the following features:
 * - Separates notifications into "NEW" (unread) and "EARLIER" (read) sections
 * - Shows notification type icons with different colors (result, GPA, exam, timetable, news)
 * - Displays relative timestamps (e.g., "2m ago", "1h ago")
 * - Allows marking notifications as read
 * - Links to the full notifications page
 * 
 * @param {Object[]} notifications - Array of notification objects
 * @param {boolean} loading - Loading state for notifications
 * @param {Function} onClose - Function to close the dropdown
 * @param {Function} onMarkAsRead - Function to mark a notification as read
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BellIcon, 
  CheckCircleIcon, 
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';

const NotificationDropdown = ({ notifications = [], loading = false, onClose, onMarkAsRead }) => {
  // Separate notifications into unread and read groups
  // Unread notifications are shown at the top under "NEW"
  const unreadNotifications = notifications.filter(n => !n.isRead);
  
  // Get only the 3 most recent read notifications for the "EARLIER" section
  // This keeps the dropdown from getting too long
  const recentReadNotifications = notifications
    .filter(n => n.isRead)
    .slice(0, 3);

  /**
   * Formats a timestamp into a human-readable relative time
   * Examples: "Just now", "5m ago", "2h ago", "3d ago"
   * Falls back to actual date for older notifications
   * 
   * @param {Date} timestamp - The timestamp to format
   * @returns {string} Formatted relative time string
   */
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 1000 / 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  /**
   * Returns the appropriate icon component for each notification type
   * Each type has its own icon and color scheme:
   * - result: Green academic cap icon
   * - gpa: Blue chart icon
   * - timetable/exam: Purple calendar icon
   * - news: Orange newspaper icon
   * - default: Gray bell icon
   * 
   * @param {string} type - The notification type ('result', 'gpa', 'timetable', 'news')
   * @returns {JSX.Element} Icon component with appropriate styling
   */
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'result':
        return (
          <div className="bg-green-100 p-2 rounded-lg">
            <AcademicCapIcon className="h-4 w-4 text-green-600" />
          </div>
        );
      case 'gpa':
        return (
          <div className="bg-blue-100 p-2 rounded-lg">
            <ChartBarIcon className="h-4 w-4 text-blue-600" />
          </div>
        );
      case 'timetable':
      case 'exam':
        return (
          <div className="bg-purple-100 p-2 rounded-lg">
            <CalendarIcon className="h-4 w-4 text-purple-600" />
          </div>
        );
      case 'news':
        return (
          <div className="bg-orange-100 p-2 rounded-lg">
            <NewspaperIcon className="h-4 w-4 text-orange-600" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-lg">
            <BellIcon className="h-4 w-4 text-gray-600" />
          </div>
        );
    }
  };

  return (
    <div className="w-96 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-xl shadow-2xl py-3 z-50 border border-white/20 dark:border-slate-700/50">
      <div className="px-4 py-3 border-b border-white/20 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
          <Link 
            to="/dash/notifications" 
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            onClick={onClose}
          >
            View All
          </Link>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-200 mt-1">
          {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="text-center py-8 px-4">
            <BellIcon className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No notifications yet</p>
          </div>
        )}

        {/* Unread Notifications */}
        {!loading && unreadNotifications.length > 0 && (
          <div className="px-4 py-3">
            <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">NEW</h4>
            <div className="space-y-2">
              {unreadNotifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className="flex items-start space-x-3 p-2.5 hover:bg-white/40 dark:hover:bg-slate-700/40 rounded-lg group relative cursor-pointer transition-colors"
                  onClick={() => {
                    if (notification.link) {
                      onClose();
                      window.location.href = notification.link;
                    }
                  }}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">{notification.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">{notification.message}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{formatTime(notification.createdAt)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full"
                    title="Mark as read"
                  >
                    <CheckCircleIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Read Notifications */}
        {!loading && recentReadNotifications.length > 0 && (
          <div className="px-4 py-3">
            <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">EARLIER</h4>
            <div className="space-y-2">
              {recentReadNotifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className="flex items-start space-x-3 p-2.5 hover:bg-white/40 dark:hover:bg-slate-700/40 rounded-lg cursor-pointer opacity-70 transition-colors"
                  onClick={() => {
                    if (notification.link) {
                      onClose();
                      window.location.href = notification.link;
                    }
                  }}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">{notification.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">{notification.message}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{formatTime(notification.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;