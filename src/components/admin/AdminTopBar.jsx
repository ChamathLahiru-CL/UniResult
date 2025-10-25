import React, { useState, useEffect} from 'react';
import { 
  Bars3Icon, 
  UserCircleIcon, 
  BellIcon,
  CalendarIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import NotificationDropdown from './NotificationDropdown';
import { mockActivities } from '../../data/mockActivities';

const AdminTopBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Get unread notification count
  const unreadCount = mockActivities.filter(activity => activity.status === 'NEW').length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });


  const handleSignOut = () => {
    setShowSignOutConfirm(true);
    setShowProfileMenu(false);
    setShowNotifications(false);
  };

  const confirmSignOut = () => {
    logout();
    navigate('/');
  };

  // Close dropdowns when clicking profile button
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  return (
    <header className="bg-white shadow-sm z-40 sticky top-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Menu Button and Title */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-2"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="lg:flex lg:items-center lg:space-x-3">
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-md">Uni</span>
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-extrabold drop-shadow-md">Result Admin Home Page</span>
              </h1>
            </div>
          </div>

          {/* Right section - Date, Notifications, and Profile */}
          <div className="flex items-center">
            <div className="hidden sm:flex items-center text-gray-500 mr-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm hidden md:inline">{currentDate}</span>
                <span className="text-sm hidden md:inline">|</span>
                <span className="text-sm">{currentTime}</span>
              </div>
              <div className="h-6 w-px bg-gray-200 mx-4"></div>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-gray-100 relative transition-colors"
                >
                  <BellIcon className="h-5 w-5 text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                  )}
                </button>
                <NotificationDropdown 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                />
              </div>
            </div>
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <span className="text-sm font-medium text-gray-700">Lahiru</span>
                    <span className="text-xs text-gray-500">Administrator</span>
                  </div>
                </div>
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Your Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Settings
                    </button>
                    <div className="h-px bg-gray-200 my-1"></div>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      role="menuitem"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Sign out
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to sign out? You'll need to sign in again to access your account.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={confirmSignOut}
              >
                Sign out
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowSignOutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

          {/* Mobile date display */}
      <div className="lg:hidden border-t border-gray-200">
        <div className="flex items-center justify-end text-sm text-gray-500 px-4 py-2">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{currentDate}</span>
          </div>
          <div className="h-4 w-px bg-gray-200 mx-4"></div>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1 rounded-full hover:bg-gray-100 relative transition-colors"
            >
              <BellIcon className="h-5 w-5 text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              )}
            </button>
            <NotificationDropdown 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
