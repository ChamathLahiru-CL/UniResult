import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import Footer from '../components/dashboard/Footer';
import { NotificationProvider } from '../context/NotificationContext';
import logo from '../assets/images/logo.png';

/**
 * Main Dashboard Layout component
 * Serves as the container for all dashboard pages
 * Includes responsive sidebar, topbar, main content area, and footer
 */
const DashboardLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth <= 1024;
      setIsMobile(isMobileView);
      // Close mobile menu when switching to desktop
      if (!isMobileView) {
        setIsMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle sidebar collapse (minimized state) - for desktop only
  const toggleCollapse = useCallback(() => {
    if (!isMobile) {
      setIsCollapsed(prev => !prev);
    }
  }, [isMobile]);

  // Listen for sidebar toggle events from the sidebar button
  useEffect(() => {
    const handleToggleSidebar = () => {
      toggleCollapse();
    };

    window.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggleSidebar', handleToggleSidebar);
  }, [toggleCollapse]);

  return (
    <NotificationProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Mobile backdrop */}
        {isMobile && isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar component with transitions */}
        <div className={`fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out ${
          isMobile 
            ? isMobileMenuOpen 
              ? 'translate-x-0' 
              : '-translate-x-full'
            : isCollapsed 
              ? 'translate-x-0 w-20' 
              : 'translate-x-0 w-64'
        } z-50`}>
          <Sidebar 
            isCollapsed={isCollapsed} 
            isMobile={isMobile}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        </div>

        {/* Main content area with dynamic margin */}
        <div className={`flex flex-col flex-grow transition-all duration-300 ${
          !isMobile && (isCollapsed ? 'lg:ml-20' : 'lg:ml-64')
        }`}>
          {/* Top bar with toggle buttons for sidebar */}
          <TopBar 
            toggleMobileMenu={toggleMobileMenu}
            isMobile={isMobile}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          
          {/* Page content - rendered via React Router outlet */}
          <main className="flex-grow p-6 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
              style={{ backgroundImage: `url(${logo})` }}
            ></div>
            <div className="max-w-full relative z-10">
              <Outlet />
            </div>
          </main>
          
          {/* Footer component */}
          <Footer />
        </div>
      </div>
    </NotificationProvider>
  );
};

export default DashboardLayout;