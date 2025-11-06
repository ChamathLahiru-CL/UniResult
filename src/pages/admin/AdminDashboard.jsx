import React from 'react';
import { useAuth } from '../../context/useAuth';
import LastUpdatedResults from '../../components/admin/LastUpdatedResults';
import AdminRecentActivities from '../../components/admin/AdminRecentActivities';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
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
  );
};

export default AdminDashboard;
