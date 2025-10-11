import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import LastUpdatedResults from '../../components/admin/LastUpdatedResults';
import AdminRecentActivities from '../../components/admin/AdminRecentActivities';
import { useAuth } from '../../context/useAuth';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    if (user.role !== 'admin') {
      const dashboardPath = 
        user.role === 'student' ? '/dash' :
        user.role === 'examDiv' ? '/exam' : '/';
      navigate(dashboardPath, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {/* Welcome Message */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-800">Welcome, {user?.name || 'Admin'}</h1>
              <p className="text-gray-600 mt-2">Admin Home Page Overview</p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              {/* Last Updated Results */}
              <LastUpdatedResults />

              {/* Recent Activities */}
              <AdminRecentActivities />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
