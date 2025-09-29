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
    <div className={`h-full ${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 border-r border-blue-100 flex flex-col shadow-xl backdrop-blur-sm transition-all duration-300 relative overflow-hidden`}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000"></div>
      
      {/* Brand logo at top of sidebar */}
      <div className="h-16 border-b border-blue-100/50 bg-white/80 backdrop-blur-sm flex items-center justify-center relative z-10 shadow-sm">
        <button 
          onClick={() => handleNavigation('/dash')}
          className="flex items-center justify-center hover:opacity-90 transition-all duration-200 transform hover:scale-105 focus:outline-none"
        >
          {isCollapsed ? (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900">UR</span>
          ) : (
            <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">Uni</span>
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-extrabold drop-shadow-sm">Result</span>
            </h1>
          )}
        </button>
      </div>
      
      {/* Main navigation section */}
      <nav className="flex-grow py-6 px-3 flex flex-col justify-center space-y-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-xl transition-all duration-300 group relative focus:outline-none ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-white/60 hover:shadow-sm hover:text-blue-600'
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
      <div className={`px-3 py-4 border-t border-blue-100/50 bg-gradient-to-b from-white/50 to-blue-50/30 backdrop-blur-sm relative z-10 flex flex-col items-center ${isCollapsed ? 'space-y-2' : ''}`}>
        {footerItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-xl transition-all duration-300 group focus:outline-none ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-white/60 hover:shadow-sm hover:text-blue-600'
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