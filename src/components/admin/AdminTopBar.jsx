import React, { useState } from 'react';
import { 
  Bars3Icon, 
  UserCircleIcon, 
  BellIcon,
  CalendarIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const AdminTopBar = ({ onMenuClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white shadow-sm z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Menu Button and Title */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="hidden lg:flex lg:items-center lg:space-x-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Uni<span className="text-blue-600">Result</span>
              </span>
            </div>
          </div>

          {/* Center section - Date and Notifications */}
          <div className="flex-1 flex items-center justify-center px-2 lg:justify-end">
            <div className="hidden sm:flex items-center text-gray-500 space-x-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm hidden md:inline">{currentDate}</span>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <BellIcon className="h-5 w-5 text-gray-400" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
            </div>
          </div>

          {/* Right section - User Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
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

      {/* Mobile date display */}
      <div className="lg:hidden border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{currentDate}</span>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100 relative">
            <BellIcon className="h-5 w-5 text-gray-400" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
