import React, { useState, useMemo, useEffect } from 'react';
import { format, isAfter, subDays } from 'date-fns';
import { 
  UsersIcon, 
  CheckCircleIcon, 
  UserGroupIcon, 
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import AddExamMemberModal from '../../components/admin/AddExamMemberModal';
import { useAuth } from '../../context/useAuth';

const AdminExamDivisionPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch exam division members from the database
  useEffect(() => {
    fetchMembers();
    
    // Set up auto-refresh every 2 minutes (120000 milliseconds)
    const refreshInterval = setInterval(() => {
      fetchMembers();
    }, 120000);

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [user]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.token) {
        console.log('No user token available');
        return;
      }

      console.log('Fetching exam division members...');
      const response = await fetch('http://localhost:5000/api/exam-division/members', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exam division members');
      }

      const data = await response.json();
      console.log('Exam division members fetched:', data);

      if (data.success && data.data) {
        // Transform the data to match the frontend format
        const transformedMembers = data.data.map(member => ({
          id: member._id,
          name: member.nameWithInitial,
          email: member.email,
          phone: member.phoneNumber,
          universityId: member.username,
          role: member.position,
          status: member.status,
          joinDate: member.joinDate,
          lastActive: member.lastActive
        }));

        setMembers(transformedMembers);
      }
    } catch (error) {
      console.error('Error fetching exam division members:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleDownload = () => {
    const csvData = [
      ['ID', 'Name', 'Email', 'University ID', 'Role', 'Status', 'Join Date', 'Last Active'],
      ...filteredMembers.map(member => [
        member.id,
        member.name,
        member.email,
        member.universityId,
        member.role,
        member.status,
        format(new Date(member.joinDate), 'yyyy-MM-dd'),
        format(new Date(member.lastActive), 'yyyy-MM-dd HH:mm')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam-division-members-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isRecentActivity = (lastActiveDate) => {
    const sevenDaysAgo = subDays(new Date(), 7);
    return isAfter(new Date(lastActiveDate), sevenDaysAgo);
  };

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = !filters.search || 
        member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.universityId.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = !filters.role || member.role === filters.role;
      const matchesStatus = !filters.status || member.status === filters.status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, filters]);

  // Statistics calculations
  const statistics = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter(member => member.status === 'Active').length;
    
    const uniqueRoles = new Set(members.map(member => member.role)).size;
    
    const sevenDaysAgo = subDays(new Date(), 7);
    const recentActivity = members.filter(member => 
      isAfter(new Date(member.lastActive), sevenDaysAgo)
    ).length;

    return {
      totalMembers,
      activeMembers,
      uniqueRoles,
      recentActivity
    };
  }, [members]);

  const handleSuspend = async (id) => {
    if (window.confirm('Are you sure you want to suspend this member?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/exam-division/members/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ status: 'Suspended' })
        });

        if (response.ok) {
          alert('Member suspended successfully');
          fetchMembers(); // Refresh the list
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to suspend member');
        }
      } catch (error) {
        console.error('Error suspending member:', error);
        alert('Error suspending member');
      }
    }
  };

  const handleActivate = async (id) => {
    if (window.confirm('Are you sure you want to activate this member?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/exam-division/members/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ status: 'Active' })
        });

        if (response.ok) {
          alert('Member activated successfully');
          fetchMembers(); // Refresh the list
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to activate member');
        }
      } catch (error) {
        console.error('Error activating member:', error);
        alert('Error activating member');
      }
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to remove this member? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/exam-division/members/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (response.ok) {
          alert('Member removed successfully');
          fetchMembers(); // Refresh the list
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to remove member');
        }
      } catch (error) {
        console.error('Error removing member:', error);
        alert('Error removing member');
      }
    }
  };

  const handleMemberAdded = () => {
    // Refresh the members list from the database
    fetchMembers();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Exam Division - Member Management</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Member
          </button>
        </div>
      </div>

      {/* Add Member Modal */}
      <AddExamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMemberAdded={handleMemberAdded}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.totalMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.activeMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Roles</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.uniqueRoles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Activity</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.recentActivity}</p>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <ExamDivisionFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onDownload={handleDownload}
        totalMembers={filteredMembers.length}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  University ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-gray-500">Loading members...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-red-500">
                      <p className="font-medium">Error loading members</p>
                      <p className="text-sm mt-1">{error}</p>
                      <button
                        onClick={fetchMembers}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No members found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    onSuspend={handleSuspend}
                    onActivate={handleActivate}
                    onRemove={handleRemove}
                    isRecentActivity={isRecentActivity}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Filter Bar Component
const ExamDivisionFilterBar = ({ filters, onFilterChange, onDownload, totalMembers }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search members..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filters.role}
            onChange={(e) => onFilterChange('role', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="Exam Officer">Exam Officer</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Assistant Coordinator">Assistant Coordinator</option>
            <option value="Senior Coordinator">Senior Coordinator</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {totalMembers} member{totalMembers !== 1 ? 's' : ''} found
          </span>
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

// Member Row Component
const MemberRow = ({ member, onSuspend, onActivate, onRemove, isRecentActivity }) => {
  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'Suspended':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRoleBadge = (role) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
    switch (role) {
      case 'Senior Coordinator':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'Coordinator':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Assistant Coordinator':
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      case 'Exam Officer':
        return `${baseClasses} bg-teal-100 text-teal-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{member.name}</div>
            <div className="text-sm text-gray-500">{member.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{member.universityId}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={getRoleBadge(member.role)}>
          {member.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={getStatusBadge(member.status)}>
          {member.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {format(new Date(member.lastActive), 'MMM dd, yyyy')}
        </div>
        <div className="text-sm text-gray-500">
          {format(new Date(member.lastActive), 'HH:mm')}
        </div>
        {isRecentActivity(member.lastActive) && (
          <div className="flex items-center mt-1">
            <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="ml-1 text-xs text-green-600">Recent</span>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          {member.status === 'Active' && (
            <button
              onClick={() => onSuspend(member.id)}
              className="text-yellow-600 hover:text-yellow-900 px-3 py-1 rounded"
            >
              Suspend
            </button>
          )}
          {(member.status === 'Inactive' || member.status === 'Suspended') && (
            <button
              onClick={() => onActivate(member.id)}
              className="text-green-600 hover:text-green-900 px-3 py-1 rounded"
            >
              Activate
            </button>
          )}
          <button
            onClick={() => onRemove(member.id)}
            className="text-red-600 hover:text-red-900 px-3 py-1 rounded"
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminExamDivisionPage;