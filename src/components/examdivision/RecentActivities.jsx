import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  UserCircleIcon,
  UsersIcon,
  ArrowPathIcon,
  DocumentIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

const RecentActivities = ({ activeFilter = 'all' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, [activeFilter]);

  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/activities/my-activities';

      // Add type filter based on activeFilter
      const typeMap = {
        my: 'TIMETABLE_UPLOAD',
        all: '' // Show all activity types for current user
      };

      if (activeFilter !== 'all' && typeMap[activeFilter]) {
        url += `?type=${typeMap[activeFilter]}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setActivities(result.data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch activities');
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Network error. Please try again.');
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'timetable':
        return DocumentTextIcon;
      case 'result':
        return DocumentIcon;
      case 'activity':
        return CalendarDaysIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const formatActivityTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return `Today, ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const getRelativeTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'timetable':
        return 'text-blue-500 bg-blue-100';
      case 'result':
        return 'text-green-500 bg-green-100';
      case 'activity':
        return 'text-purple-500 bg-purple-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
        </div>
        <div className="p-6 text-center text-red-500">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchActivities}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
        <button
          onClick={fetchActivities}
          className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4 mr-1" />
          Refresh
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="flex justify-center mb-4">
              <DocumentTextIcon className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-sm">
              {activeFilter === 'my'
                ? 'No recent activities found for you'
                : 'No activities found'}
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            return (
              <div
                key={activity.id}
                className="p-4 transition-colors duration-200 hover:bg-gray-50"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getIconColor(activity.type)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    {activity.faculty && (
                      <p className="text-xs text-blue-600 mt-1">
                        Faculty: {activity.faculty}
                        {activity.year && ` • Year: ${activity.year}`}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {formatActivityTime(activity.timestamp)}
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400">•</span>
                        <span className="ml-1">{getRelativeTime(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
                  >
                    View Details
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivities;