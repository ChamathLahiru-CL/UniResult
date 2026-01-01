import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ExamDivisionSidebar from '../components/examdivision/ExamDivisionSidebar';
import ExamDivisionTopBar from '../components/examdivision/ExamDivisionTopBar';
import ExamDivisionFooter from '../components/examdivision/footer/ExamDivisionFooter';

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
    <div className="relative min-h-screen" style={{ backgroundColor: '#e3f2fd' }}>
      {/* Sidebar */}
      <ExamDivisionSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        {/* Top Bar */}
        <ExamDivisionTopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main Content Area with Footer */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-x-hidden overflow-y-auto" style={{ backgroundColor: '#e3f2fd' }}>
            <div className="container mx-auto px-6 py-8">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <ExamDivisionFooter />
        </div>
      </div>
    </div>
  );
};

export default ExamDivisionLayout;