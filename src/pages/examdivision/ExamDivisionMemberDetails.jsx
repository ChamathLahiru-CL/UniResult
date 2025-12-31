import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  CalendarIcon,
  BriefcaseIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { getActivityIcon, isActiveMember } from '../../utils/memberUtils';

const ExamDivisionMemberDetails = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [member, setMember] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!user?.token) return;
      setIsLoading(true);
      setError(null);

      try {
        // Fetch member basic details
        const memberRes = await fetch(`http://localhost:5000/api/exam-division/members/${memberId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!memberRes.ok) {
          throw new Error('Failed to fetch member details');
        }

        const memberData = await memberRes.json();
        
        // Map the member data
        const mappedMember = {
          id: memberData.data._id,
          name: memberData.data.nameWithInitial || 
                `${memberData.data.firstName || ''} ${memberData.data.lastName || ''}`.trim() || 
                memberData.data.username,
          mobile: memberData.data.phoneNumber || '',
          role: memberData.data.position || memberData.data.role || 'Coordinator',
          lastActivity: memberData.data.lastActive || memberData.data.joinDate || new Date().toISOString(),
          email: memberData.data.email || '',
          nic: memberData.data.nic || memberData.data.username || '',
          joinDate: memberData.data.joinDate || memberData.data.createdAt || new Date().toISOString(),
          uploads: memberData.data.uploads || { results: 0, timetables: 0, news: 0 },
          department: memberData.data.department || 'Exam Division',
          status: isActiveMember(memberData.data.lastActive) ? 'Active' : 'Inactive'
        };

        setMember(mappedMember);

        // Fetch member activities
        const activitiesRes = await fetch(`http://localhost:5000/api/exam-division/members/${memberId}/activities`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.data || []);
        }

      } catch (err) {
        console.error('Error fetching member details:', err);
        setError(err.message || 'Error loading member details');
      } finally {
        setIsLoading(false);
      }
    };

    if (memberId) {
      fetchMemberDetails();
    }
  }, [memberId, user]);

  const tabs = [
    { id: 'info', label: 'Personal Info' },
    { id: 'activities', label: 'Activity Logs' },
    { id: 'uploads', label: 'Upload Analytics' }
  ];

  const chartData = member ? {
    labels: ['Results', 'Timetables', 'News'],
    datasets: [
      {
        label: 'Number of Uploads',
        data: [
          member.uploads.results,
          member.uploads.timetables,
          member.uploads.news
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 1
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Upload Distribution'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/exam/members')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Members
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error || 'Member not found'}</p>
          <button
            onClick={() => navigate('/exam/members')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Members List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/exam/members')}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Members
      </button>

      {/* Member Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-4">
              <IdentificationIcon className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{member.name}</h1>
              <p className="text-blue-100 flex items-center mt-1">
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                {member.role}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              member.status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {member.status}
            </span>
            <p className="text-blue-100 text-sm mt-2 flex items-center justify-end">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Joined {format(new Date(member.joinDate), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-3">
          <EnvelopeIcon className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{member.email || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-3">
          <PhoneIcon className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Mobile</p>
            <p className="font-medium text-gray-900">{member.mobile || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-3">
          <ClockIcon className="h-8 w-8 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Last Activity</p>
            <p className="font-medium text-gray-900">
              {format(new Date(member.lastActivity), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-gray-900">{member.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">NIC</label>
                    <p className="mt-1 text-gray-900">{member.nic}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="mt-1 text-gray-900">{member.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile Number</label>
                    <p className="mt-1 text-gray-900">{member.mobile || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Official Information</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role/Position</label>
                    <p className="mt-1 text-gray-900">{member.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <p className="mt-1 text-gray-900">{member.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Join Date</label>
                    <p className="mt-1 text-gray-900">{format(new Date(member.joinDate), 'MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Summary */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">{member.uploads.results}</p>
                    <p className="text-sm text-gray-600 mt-1">Results Uploaded</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">{member.uploads.timetables}</p>
                    <p className="text-sm text-gray-600 mt-1">Timetables Uploaded</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-yellow-600">{member.uploads.news}</p>
                    <p className="text-sm text-gray-600 mt-1">News Uploaded</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Activity Logs ({activities.length} total)
              </h3>
              {activities.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No activities recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {activities.map((activity, index) => (
                    <div key={activity._id || index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0">
                        <span className="text-3xl">{getActivityIcon(activity.activityType || activity.activityName)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(activity.createdAt || activity.date), 'MMMM d, yyyy h:mm a')}
                        </p>
                        {activity.fileName && (
                          <p className="text-xs text-gray-600 mt-1">File: {activity.fileName}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          activity.activityType?.toLowerCase().includes('upload') ? 'bg-blue-100 text-blue-800' :
                          activity.activityType?.toLowerCase().includes('update') ? 'bg-green-100 text-green-800' :
                          activity.activityType?.toLowerCase().includes('login') ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.activityName || activity.activityType || 'Activity'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'uploads' && chartData && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Upload Analytics</h3>
              <div className="h-96">
                <Bar data={chartData} options={chartOptions} />
              </div>
              
              {/* Additional Statistics */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Uploads</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {member.uploads.results + member.uploads.timetables + member.uploads.news}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Most Uploaded</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {member.uploads.results >= member.uploads.timetables && member.uploads.results >= member.uploads.news ? 'Results' :
                     member.uploads.timetables >= member.uploads.news ? 'Timetables' : 'News'}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Avg. per Month</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {Math.round((member.uploads.results + member.uploads.timetables + member.uploads.news) / 
                      Math.max(1, Math.floor((new Date() - new Date(member.joinDate)) / (30 * 24 * 60 * 60 * 1000))))}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDivisionMemberDetails;
