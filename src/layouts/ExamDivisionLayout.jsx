import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ExamDivisionSidebar from '../components/examdivision/ExamDivisionSidebar';
import ExamDivisionTopBar from '../components/examdivision/ExamDivisionTopBar';

const ExamDivisionLayout = () => {
  // Set sidebar to be open by default on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

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