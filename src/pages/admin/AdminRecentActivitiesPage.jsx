import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ClockIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import ActivityFilterBar from '../../components/admin/activities/ActivityFilterBar';
import ActivityFeed from '../../components/admin/activities/ActivityFeed';

const AdminRecentActivitiesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activityStats, setActivityStats] = useState({
    total: 0,
    new: 0,
    critical: 0,
    today: 0
  });
  const [filters, setFilters] = useState({
    timeRange: 'all',
    type: 'all',
    status: 'all',
    priority: 'all'
  });

  // Fetch activities from API
  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();

      if (filters.timeRange !== 'all') queryParams.append('timeRange', filters.timeRange);
      if (filters.type !== 'all') queryParams.append('type', filters.type);
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.priority !== 'all') queryParams.append('priority', filters.priority);

      const response = await fetch(`http://localhost:5000/api/activities?${queryParams}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setActivities(result.data);
      } else {
        console.error('Failed to fetch activities');
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch activity statistics
  const fetchActivityStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/activities/stats', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setActivityStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching activity stats:', error);
    }
  }, []);

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    fetchActivityStats();
  }, [fetchActivityStats]);

  // Filter activities based on current filters (client-side filtering for additional control)
  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Additional client-side filtering if needed
    // (Most filtering is done server-side, but we can add client-side filters here)

    return filtered;
  }, [activities]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setFilters({
        timeRange: 'all',
        type: 'all',
        status: 'all',
        priority: 'all'
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/activities/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        // Refresh activities to show updated status
        fetchActivities();
        fetchActivityStats();
      } else {
        console.error('Failed to mark activities as read');
      }
    } catch (error) {
      console.error('Error marking activities as read:', error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <ClockIcon className="h-8 w-8 text-blue-600" />
              Recent Activities
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and track all administrative activities and system events
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              <CheckCircleIcon className="h-4 w-4" />
              Mark All Read
            </button>
          </div>
        </div>
      </div>

      {/* Activity Filter Bar */}
      <ActivityFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        activityStats={activityStats}
      />

      {/* Results Summary */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredActivities.length} of {activityStats.total} activities
          </span>
          {filteredActivities.length !== activityStats.total && (
            <span className="text-blue-600">
              {activityStats.total - filteredActivities.length} activities filtered out
            </span>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed
        activities={filteredActivities}
        isLoading={isLoading}
      />

      {/* Additional Actions */}
      {filteredActivities.length > 0 && (
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
              <BellIcon className="h-4 w-4" />
              Enable Notifications
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors">
              <ExclamationTriangleIcon className="h-4 w-4" />
              View Critical Only
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
              <CheckCircleIcon className="h-4 w-4" />
              Export Activity Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecentActivitiesPage;