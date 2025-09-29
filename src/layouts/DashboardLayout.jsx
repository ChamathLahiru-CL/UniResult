import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import Footer from '../components/dashboard/Footer';

/**
 * Main Dashboard Layout component
 * Serves as the container for all dashboard pages
 * Includes responsive sidebar, topbar, main content area, and footer
 */
const DashboardLayout = () => {
  // State to control sidebar visibility and collapse state
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Toggle sidebar visibility for all views
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Toggle sidebar collapse (minimized state)
  const toggleCollapse = () => {
    if (!isSidebarVisible) {
      setIsSidebarVisible(true);
    }
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50/30 to-white">
      {/* Sidebar component with transitions */}
      <div className={`fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out z-30 ${
        isSidebarVisible 
          ? isCollapsed 
            ? 'translate-x-0 w-16' 
            : 'translate-x-0 w-64'
          : '-translate-x-full w-64'
      }`}>
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      {/* Main content area with dynamic margin */}
      <div className={`flex flex-col flex-grow transition-all duration-300 ${
        isSidebarVisible 
          ? isCollapsed 
            ? 'ml-16' 
            : 'ml-64' 
          : 'ml-0'
      }`}>
        {/* Top bar with toggle buttons for sidebar */}
        <TopBar 
          toggleSidebar={toggleSidebar} 
          toggleCollapse={toggleCollapse} 
          isCollapsed={isCollapsed}
          isSidebarVisible={isSidebarVisible} />
        
        {/* Page content - rendered via React Router outlet */}
        <main className="flex-grow px-3 py-2 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-white">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
        
        {/* Footer component */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;