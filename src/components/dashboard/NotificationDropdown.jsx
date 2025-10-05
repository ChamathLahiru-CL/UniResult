/**
 * NotificationDropdown Component
 * 
 * A dropdown menu that displays user notifications with the following features:
 * - Separates notifications into "NEW" (unread) and "EARLIER" (read) sections
 * - Shows notification type icons with different colors (result, GPA, exam)
 * - Displays relative timestamps (e.g., "2m ago", "1h ago")
 * - Allows marking notifications as read
 * - Links to the full notifications page
 * 
 * @param {Object[]} notifications - Array of notification objects
 * @param {Function} onClose - Function to close the dropdown
 * @param {Function} onMarkAsRead - Function to mark a notification as read
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const NotificationDropdown = ({ notifications, onClose, onMarkAsRead }) => {
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
   * - result: Green checkmark icon
   * - gpa: Blue chart icon
   * - exam: Purple calendar icon
   * - default: Gray bell icon
   * 
   * @param {string} type - The notification type ('result', 'gpa', 'exam')
   * @returns {JSX.Element} Icon component with appropriate styling
   */
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'result':
        return (
          <div className="bg-green-100 p-2 rounded-lg">
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'gpa':
        return (
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        );
      case 'exam':
        return (
          <div className="bg-purple-100 p-2 rounded-lg">
            <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
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
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl py-2 z-10 border border-gray-100">
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          <Link 
            to="/dash/notifications" 
            className="text-xs text-blue-600 hover:text-blue-700"
            onClick={onClose}
          >
            View All
          </Link>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {unreadNotifications.length} unread notifications
        </p>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <div className="px-4 py-2">
            <h4 className="text-xs font-medium text-gray-500 mb-2">NEW</h4>
            <div className="space-y-2">
              {unreadNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg group relative"
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500">{formatTime(notification.timestamp)}</p>
                  </div>
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-50 rounded-full"
                    title="Mark as read"
                  >
                    <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Read Notifications */}
        {recentReadNotifications.length > 0 && (
          <div className="px-4 py-2">
            <h4 className="text-xs font-medium text-gray-500 mb-2">EARLIER</h4>
            <div className="space-y-2">
              {recentReadNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg opacity-75"
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500">{formatTime(notification.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="px-4 py-8 text-center">
            <BellIcon className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900">No notifications</p>
            <p className="mt-1 text-sm text-gray-500">We'll notify you when something arrives.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;