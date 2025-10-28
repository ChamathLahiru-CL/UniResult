import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, DocumentTextIcon, 
  CalendarIcon, BellIcon, ChartBarIcon,
  ArrowTrendingUpIcon, UserCircleIcon,
  Cog6ToothIcon as CogIcon,
  QuestionMarkCircleIcon, XMarkIcon
} from '@heroicons/react/24/outline';

/**
 * Sidebar component for dashboard navigation
 * Contains main navigation links and footer links
 * Highlights active route based on current URL
 */
const Sidebar = ({ isCollapsed, isMobile, onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Function to handle navigation with scroll to top and mobile menu close
  const handleNavigation = (path) => {
    // Close mobile menu when navigating (if in mobile mode)
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }

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
    { 
      name: 'Dashboard', 
      icon: HomeIcon, 
      path: '/dash',
      tooltip: 'Overview Dashboard'
    },
    { 
      name: 'Results', 
      icon: DocumentTextIcon, 
      path: '/dash/results',
      tooltip: 'View Examination Results'
    },
    { 
      name: 'GPA Analytics', 
      icon: ChartBarIcon, 
      path: '/dash/gpa-trend',
      tooltip: 'GPA Performance Analytics'
    },
    { 
      name: 'Exam Timetable', 
      icon: CalendarIcon, 
      path: '/dash/exam-time-table',
      tooltip: 'View Exam Schedule'
    },
    { 
      name: 'Academic Progress', 
      icon: ArrowTrendingUpIcon, 
      path: '/dash/progress',
      tooltip: 'Track Academic Progress'
    },
    { 
      name: 'Notifications', 
      icon: BellIcon, 
      path: '/dash/notifications',
      tooltip: 'View Notifications',
      badge: 2
    },
  ];

  // Footer navigation items
  const footerItems = [
    { 
      name: 'Profile', 
      icon: UserCircleIcon, 
      path: '/dash/profile',
      tooltip: 'Manage your student profile'
    },
    { 
      name: 'Settings', 
      icon: CogIcon, 
      path: '/dash/settings',
      tooltip: 'Customize your preferences'
    },
    { 
      name: 'Help & Support', 
      icon: QuestionMarkCircleIcon, 
      path: '/dash/help',
      tooltip: 'Get assistance and documentation'
    },
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
    <div className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    } ${isMobile ? 'shadow-xl' : ''}`}>
      
      {/* Header with brand logo and mobile close button */}
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4">
        {!isCollapsed && (
          <Link 
            to="/dash"
            className="flex items-center focus:outline-none"
            onClick={() => isMobile && onCloseMobile && onCloseMobile()}
          >
            <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-md">Uni</span>
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-extrabold drop-shadow-md">Result</span>
            </h1>
          </Link>
        )}

        {isCollapsed && !isMobile && (
          <Link 
            to="/dash"
            className="flex items-center justify-center w-full focus:outline-none"
          >
            <h1 className="text-xl font-bold text-blue-600">UR</h1>
          </Link>
        )}

        {/* Mobile close button - Styled like admin dashboard */}
        {isMobile && (
          <button
            onClick={() => {
              console.log('Close button clicked');
              if (onCloseMobile) {
                onCloseMobile();
              }
            }}
            className="p-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
            type="button"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Main navigation section */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.name} className="relative group">
            <button
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-2.5 rounded-lg transition-all duration-200 group relative focus:outline-none ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center justify-center relative">
                <item.icon className={`h-5 w-5 ${
                  isActive(item.path) ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
                }`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-xs flex items-center justify-center rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              
              {!isCollapsed && (
                <span className={`ml-3 text-sm ${isActive(item.path) ? 'font-semibold' : ''} whitespace-nowrap`}>
                  {item.name}
                </span>
              )}

              {/* Active indicator for collapsed state */}
              {isCollapsed && isActive(item.path) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></div>
              )}
            </button>

            {/* Tooltip for collapsed state */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                {item.tooltip}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
              </div>
            )}
          </div>
        ))}
      </nav>
      
      {/* Footer navigation section */}
      <div className="mt-auto border-t border-gray-200 bg-gray-50">
        <div className="px-3 py-4">
          {footerItems.map((item) => (
            <div key={item.name} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-2.5 rounded-lg transition-all duration-200 group relative focus:outline-none ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                } mb-1 last:mb-0`}
              >
                <div className="flex items-center justify-center">
                  <item.icon className={`h-5 w-5 ${
                    isActive(item.path) ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
                  }`} />
                </div>
                
                {!isCollapsed && (
                  <span className={`ml-3 text-sm ${isActive(item.path) ? 'font-semibold' : ''} whitespace-nowrap`}>
                    {item.name}
                  </span>
                )}

                {/* Active indicator for collapsed state */}
                {isCollapsed && isActive(item.path) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></div>
                )}
              </button>

              {/* Tooltip for collapsed state */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {item.tooltip}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;