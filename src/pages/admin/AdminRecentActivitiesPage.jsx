import React, { useState, useMemo } from 'react';
import { 
  ClockIcon, 
  BellIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';
import ActivityFilterBar from '../../components/admin/activities/ActivityFilterBar';
import ActivityFeed from '../../components/admin/activities/ActivityFeed';
import { mockActivities } from '../../data/mockActivities';

const AdminRecentActivitiesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: 'all',
    type: 'all',
    status: 'all',
    priority: 'all'
  });

  // Filter activities based on current filters
  const filteredActivities = useMemo(() => {
    let filtered = [...mockActivities];

    // Time range filter
    if (filters.timeRange !== 'all') {
      filtered = filtered.filter(activity => {
        const activityDate = activity.timestamp;
        switch (filters.timeRange) {
          case 'today':
            return isToday(activityDate);
          case 'week':
            return isThisWeek(activityDate);
          case 'month':
            return isThisMonth(activityDate);
          default:
            return true;
        }
      });
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(activity => activity.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(activity => activity.priority === filters.priority);
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [filters]);

  // Calculate activity statistics
  const activityStats = useMemo(() => {
    return {
      total: mockActivities.length,
      new: mockActivities.filter(a => a.status === 'NEW').length,
      critical: mockActivities.filter(a => a.priority === 'HIGH').length,
      today: mockActivities.filter(a => isToday(a.timestamp)).length
    };
  }, []);

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

  const handleMarkAllAsRead = () => {
    // In a real app, this would make an API call
    console.log('Marking all activities as read...');
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
            Showing {filteredActivities.length} of {mockActivities.length} activities
          </span>
          {filteredActivities.length !== mockActivities.length && (
            <span className="text-blue-600">
              {mockActivities.length - filteredActivities.length} activities filtered out
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