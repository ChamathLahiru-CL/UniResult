import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/useAuth';
import NotificationDropdown from './NotificationDropdown';

/**
 * TopBar Component
 * 
 * Main navigation header that contains:
 * 1. Sidebar toggle controls
 * 2. Logo/brand
 * 3. Notification system
 * 4. User profile dropdown
 * 
 * Features:
 * - Real-time notification updates
 * - Unread notification counter
 * - Interactive dropdowns for notifications and user menu
 * - Responsive design
 * - Click-outside behavior for dropdowns
 */
const TopBar = ({ toggleMobileMenu, toggleCollapse, isCollapsed, isMobile, isMobileMenuOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userData, setUserData] = useState({
    name: 'Loading...',
    email: 'loading...',
    avatar: null,
    firstName: '',
    lastName: ''
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  /**
   * Fetch user profile data from backend
   */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('http://localhost:5000/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data');
        }

        // Set user data with proper display name
        const displayName = data.data.firstName 
          ? `${data.data.firstName}${data.data.lastName ? ' ' + data.data.lastName : ''}`
          : data.data.name || 'User';

        setUserData({
          name: displayName,
          email: data.data.email,
          avatar: data.data.profileImage || null,
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || ''
        });

        setIsLoadingUser(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  /**
   * Fetch notifications from backend
   * Currently using dummy data, but in production would:
   * 1. Connect to real API endpoint
   * 2. Implement real-time updates (WebSocket/polling)
   * 3. Handle loading states and errors
   * 4. Include pagination for large datasets
   */
  useEffect(() => {
    // TODO: Replace with actual API call
    const dummyNotifications = [
      {
        id: 1,
        type: 'result',
        message: 'Your Programming Fundamentals results are now available',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        isRead: false
      },
      {
        id: 2,
        type: 'gpa',
        message: 'Your GPA has been updated for Semester 2',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false
      },
      {
        id: 3,
        type: 'exam',
        message: 'New exam schedule posted for Database Systems',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: true
      }
    ];
    setNotifications(dummyNotifications);
  }, []);

  /**
   * Update current date and time every second
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /**
   * Format date and time for display
   */
  const formatDateTime = (date) => {
    const dateOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const timeOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    };
    
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    
    return { formattedDate, formattedTime };
  };

  /**
   * Marks a notification as read
   * Updates the notification state and would sync with backend in production
   * 
   * @param {string|number} notificationId - ID of the notification to mark as read
   */
  const handleMarkAsRead = (notificationId) => {
    // Update local state
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    ));
    // TODO: Sync with backend API
  };

  /**
   * Handles clicking outside of dropdowns
   * Automatically closes dropdowns when clicking anywhere else on the page
   * Uses event delegation for better performance
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-dropdown') && !event.target.closest('.notification-button')) {
        setIsNotificationOpen(false);
      }
      if (!event.target.closest('.user-dropdown') && !event.target.closest('.user-button')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-100">
        <div className="flex justify-between items-center h-14 px-3">
          {/* Left section with logo and toggle buttons */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            {isMobile ? (
              <button
                type="button"
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            ) : (
              // Desktop collapse button
              <button
                type="button"
                className="group flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 border border-blue-100 hover:border-blue-200 focus:outline-none transition-all duration-200 hover:shadow-md relative"
                onClick={toggleCollapse}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-200"></div>
                <div className="flex flex-col items-center">
                  {isCollapsed ? (
                    <ChevronRightIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronLeftIcon className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center ml-1">
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-md">Uni</span>
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-extrabold drop-shadow-md">Result</span>
              </h1>
            </div>
          </div>

          {/* Right section with date/time, notifications and user profile */}
          <div className="flex items-center space-x-4">
            {/* Date and Time Display - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span className="text-sm">{formatDateTime(currentDateTime).formattedDate}</span>
              <span className="text-sm">|</span>
              <span className="text-sm">{formatDateTime(currentDateTime).formattedTime}</span>
            </div>

            {/* Notification button */}
            <div className="relative">
              <button 
                className="notification-button p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 relative"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <BellIcon className="h-5 w-5" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-blue-600 text-white text-xs flex items-center justify-center rounded-full -mt-1 -mr-1">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-10">
                  <NotificationDropdown 
                    notifications={notifications}
                    onClose={() => setIsNotificationOpen(false)}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </div>
              )}
            </div>

            {/* User profile button and dropdown */}
            <div className="relative">
              <button 
                className="user-button flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.name} 
                    className="h-8 w-8 rounded-full object-cover" 
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCircleIcon className="h-7 w-7 text-blue-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {isLoadingUser ? 'Loading...' : userData.name}
                </span>
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="user-dropdown absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{userData.name}</p>
                    <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                  </div>
                  <Link 
                    to="/dash/profile" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <UserCircleIcon className="h-4 w-4 mr-2 text-gray-500" />
                    Your Profile
                  </Link>
                  <Link 
                    to="/dash/settings" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => {
                      setShowSignOutConfirm(true);
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <svg className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full transform transition-all animate-fadeIn">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Sign out</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to sign out? You'll need to sign in again to access your account.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                onClick={() => setShowSignOutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-150"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;