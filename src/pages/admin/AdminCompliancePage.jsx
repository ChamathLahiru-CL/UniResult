import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import TabSelector from '../../components/admin/compliance/TabSelector';
import StudentComplianceList from '../../components/admin/compliance/StudentComplianceList';
import DivisionComplianceList from '../../components/admin/compliance/DivisionComplianceList';
import { complaintsAPI } from '../../utils/complaintsAPI';

const AdminCompliancePage = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    studentComplaints: 0,
    examDivisionComplaints: 0,
    unread: 0
  });
  const [loading, setLoading] = useState(true);
  const [exportingReport, setExportingReport] = useState(false);

  // Fetch statistics on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await complaintsAPI.getComplaintStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      setExportingReport(true);
      await complaintsAPI.exportComplianceReport();
    } catch (err) {
      console.error('Error exporting report:', err);
      alert('Failed to export report. Please try again.');
    } finally {
      setExportingReport(false);
    }
  };

  const tabs = [
    {
      id: 'students',
      label: 'Student Complaints',
      icon: UserGroupIcon,
      count: stats.studentComplaints
    },
    {
      id: 'divisions',
      label: 'Division Complaints',
      icon: BuildingOfficeIcon,
      count: stats.examDivisionComplaints
    }
  ];

  const statisticsCards = [
    {
      id: 'total',
      name: 'Total Complaints',
      value: stats.total.toString(),
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'pending',
      name: 'Pending Review',
      value: stats.pending.toString(),
      icon: ClockIcon,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 'resolved',
      name: 'Resolved',
      value: stats.resolved.toString(),
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'unread',
      name: 'Unread',
      value: stats.unread.toString(),
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Compliance Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and respond to student and division complaints
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportReport}
              disabled={exportingReport}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export compliance report as PDF"
            >
              {exportingReport ? 'Exporting...' : 'Export Report'}
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Send Announcement
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-lg p-3 w-12 h-12"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          statisticsCards.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.id} className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className={`${stat.bgColor} rounded-lg p-3`}>
                    <IconComponent className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-6 py-4">
          <TabSelector
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'students' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Student Complaints
                </h2>
                <p className="text-sm text-gray-600">
                  Review and respond to complaints submitted by students regarding academic issues, 
                  administrative processes, or campus services.
                </p>
              </div>
              <StudentComplianceList />
            </div>
          )}

          {activeTab === 'divisions' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Division Complaints
                </h2>
                <p className="text-sm text-gray-600">
                  Handle complaints and feedback from exam divisions, departments, 
                  and administrative units within the university system.
                </p>
              </div>
              <DivisionComplianceList />
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {/* Activity Items */}
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">John Doe</span> submitted a new complaint about 
                  <span className="font-medium"> exam scheduling</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Complaint #<span className="font-medium">COM-2024-001</span> was marked as resolved
                </p>
                <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Computer Science Department</span> raised concerns about 
                  <span className="font-medium"> result processing delays</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Admin reply sent to complaint #<span className="font-medium">COM-2024-003</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCompliancePage;