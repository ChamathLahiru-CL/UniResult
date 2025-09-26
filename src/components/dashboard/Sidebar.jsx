import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, DocumentTextIcon, ChartBarIcon, 
  CalendarIcon, BellIcon, UserCircleIcon, 
  CogIcon, QuestionMarkCircleIcon 
} from '@heroicons/react/24/outline';

/**
 * Sidebar component for dashboard navigation
 * Contains main navigation links and footer links
 * Highlights active route based on current URL
 */
const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Function to handle navigation with scroll to top
  const handleNavigation = (path) => {
    // If we're already on the path, just scroll to top
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to new path and scroll to top
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navigation items with their icons and routes
  const navItems = [
    { name: 'Home Page', icon: HomeIcon, path: '/dash' },
    { name: 'Results', icon: DocumentTextIcon, path: '/dash/results' },
    { name: 'GPA Trend', icon: ChartBarIcon, path: '/dash/gpa-trend' },
    { name: 'Exam Time Table', icon: CalendarIcon, path: '/dash/exam-time-table' },
    { name: 'Notification', icon: BellIcon, path: '/dash/notifications' },
  ];

  // Footer navigation items
  const footerItems = [
    { name: 'Profile', icon: UserCircleIcon, path: '/dash/profile' },
    { name: 'Setting', icon: CogIcon, path: '/dash/settings' },
    { name: 'Help', icon: QuestionMarkCircleIcon, path: '/dash/help' },
  ];

  // Function to check if a nav item is active
  const isActive = (path) => {
    // Exact match for home, prefix match for others
    if (path === '/dash') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`h-full ${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-br from-gray-50 to-white border-r border-gray-200 flex flex-col shadow-lg transition-all duration-300`}>
      {/* Brand logo at top of sidebar */}
      <div className="h-14 border-b border-gray-100 bg-white flex items-center justify-center">
        <button 
          onClick={() => handleNavigation('/dash')}
          className="flex items-center justify-center hover:opacity-75 transition-opacity duration-200"
        >
          {isCollapsed ? (
            <span className="text-xl font-bold text-blue-600 hover:text-blue-700">UR</span>
          ) : (
            <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-md">Uni</span>
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-extrabold drop-shadow-md">Result</span>
            </h1>
          )}
        </button>
      </div>
      
      {/* Main navigation section */}
      <nav className="flex-grow py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-lg transition-all duration-200 group ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center">
              <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}`} />
            </div>
            {!isCollapsed && (
              <span className={`text-sm ml-3 ${isActive(item.path) ? 'font-semibold' : ''} whitespace-nowrap`}>
                {item.name}
              </span>
            )}
          </button>
        ))}
      </nav>
      
      {/* Footer navigation section */}
      <div className={`px-2 py-3 border-t border-gray-100 bg-gray-50 bg-opacity-50 ${isCollapsed ? 'space-y-2' : ''}`}>
        {footerItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-lg transition-all duration-200 group ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center">
              <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}`} />
            </div>
            {!isCollapsed && (
              <span className={`text-sm ml-3 ${isActive(item.path) ? 'font-semibold' : ''} whitespace-nowrap`}>
                {item.name}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;