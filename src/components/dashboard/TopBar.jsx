import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon, 
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

/**
 * TopBar component for the dashboard
 * Contains mobile menu toggle button, user info, and logout functionality
 */
const TopBar = ({ toggleSidebar, toggleCollapse, isCollapsed, isSidebarVisible }) => {
  // State for user dropdown menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Dummy user data - would come from auth context in a real app
  const user = {
    name: 'Lahiru',
    avatar: null, // Use null for default icon, otherwise would be a URL
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="flex justify-between items-center h-14 px-3">
        {/* Left section with logo and toggle buttons */}
        <div className="flex items-center space-x-3">
          {/* Single sidebar toggle button */}
          <button
            type="button"
            className="group flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 border border-blue-100 hover:border-blue-200 focus:outline-none transition-all duration-200 hover:shadow-md relative"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-200"></div>
            <div className="flex flex-col items-center">
              {isCollapsed ? (
                <>
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h15" />
                  </svg>
                  <span className="text-[10px] text-blue-600 font-medium mt-0.5 hidden md:block">Menu</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H4" />
                  </svg>
                  <span className="text-[10px] text-blue-600 font-medium mt-0.5 hidden md:block">Menu</span>
                </>
              )}
            </div>
          </button>

          {/* Logo */}
          <div className="flex items-center ml-1">
           <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-md">Uni</span>
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-extrabold drop-shadow-md">Result</span>
            </h1>
          </div>
        </div>

          {/* Right section with notifications and user profile */}
        <div className="flex items-center space-x-3">
          {/* Notification button */}
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="absolute top-0 right-0 h-4 w-4 bg-blue-600 text-white text-xs flex items-center justify-center rounded-full -mt-1 -mr-1">3</span>
          </button>

          {/* User profile button */}
          <div className="relative">
            <button 
              className="flex items-center space-x-1 p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-6 w-6 rounded-full object-cover" 
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCircleIcon className="h-5 w-5 text-blue-600" />
                </div>
              )}
              <span className="text-sm text-gray-700">{user.name}</span>
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>          {/* Dropdown menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-1.5 z-10 border border-gray-100 overflow-hidden transition-all duration-300 animate-fadeIn transform">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">student@uwu.ac.lk</p>
              </div>
              <Link 
                to="/dash/profile" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              <Link 
                to="/dash/settings" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <Link 
                to="/" 
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <svg className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;