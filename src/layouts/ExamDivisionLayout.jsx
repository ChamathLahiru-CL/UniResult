import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ExamDivisionSidebar from '../components/examdivision/ExamDivisionSidebar';
import ExamDivisionTopBar from '../components/examdivision/ExamDivisionTopBar';

const ExamDivisionLayout = () => {
  // Set sidebar to be closed by default on both mobile and desktop
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ExamDivisionSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ExamDivisionTopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamDivisionLayout;