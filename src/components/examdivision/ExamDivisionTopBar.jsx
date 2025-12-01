import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
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

const ExamDivisionTopBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [profile, setProfile] = useState({ name: 'Loading...', role: 'Exam Officer' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        setProfile({ name: 'Guest', role: 'Exam Officer' });
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/exam-division/profile', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const member = data.data;
            setProfile({
              name: `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'User',
              role: member.position || 'Exam Officer'
            });
          }
        } else {
          console.error('Failed to fetch profile for topbar');
          setProfile({ name: 'User', role: 'Exam Officer' });
        }
      } catch (error) {
        console.error('Error fetching profile for topbar:', error);
        setProfile({ name: 'User', role: 'Exam Officer' });
      }
    };

    fetchProfile();
  }, [user]);

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
  };

  const confirmSignOut = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/exam/profile');
    setShowProfileMenu(false);
  };

  const handleSettingsClick = () => {
    navigate('/exam/profile');
    setShowProfileMenu(false);
  };

  return (
    <header className="bg-white shadow-sm z-40 sticky top-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Menu Button and Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-2"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="lg:flex lg:items-center">
              <h3 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-md">Uni</span>
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-extrabold drop-shadow-md">Result Exam Division</span>
              </h3>
            </div>
          </div>

          {/* Center section - Date/Time and Notifications */}
          <div className="flex-1 flex items-center justify-center px-2 lg:justify-end">
            <div className="hidden sm:flex items-center text-gray-500 space-x-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm hidden md:inline">{currentDate}</span>
                <span className="text-sm hidden md:inline">|</span>
                <span className="text-sm">{currentTime}</span>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <BellIcon className="h-5 w-5 text-gray-400" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </motion.button>
            </div>
          </div>

          {/* Right section - User Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <span className="text-sm font-medium text-gray-700">{profile.name}</span>
                    <span className="text-xs text-gray-500">{profile.role}</span>
                  </div>
                </div>
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </motion.button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div className="py-1" role="menu">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={handleProfileClick}
                    >
                      Your Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={handleSettingsClick}
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
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6"
          >
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={confirmSignOut}
              >
                Sign out
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowSignOutConfirm(false)}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile date display */}
      <div className="lg:hidden border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{currentDate}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 rounded-full hover:bg-gray-100 relative"
          >
            <BellIcon className="h-5 w-5 text-gray-400" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default ExamDivisionTopBar;