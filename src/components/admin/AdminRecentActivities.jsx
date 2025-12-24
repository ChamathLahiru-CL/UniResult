import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  ArrowTopRightOnSquareIcon,
  BellIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { mockActivities, ACTIVITY_TYPES, activityColors } from '../../data/mockActivities';

const AdminRecentActivities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch('http://localhost:5000/api/activities?limit=10', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication failed');
          }
          throw new Error('Failed to fetch activities');
        }

        const result = await response.json();

        if (result.success) {
          // Transform API data to match component expectations
          const transformedActivities = result.data.map(activity => ({
            id: activity.id,
            type: activity.type,
            title: activity.activityName || activity.description || 'Activity',
            description: activity.description,
            timestamp: activity.timestamp,
            status: activity.status || 'READ',
            priority: activity.priority || 'NORMAL',
            user: activity.performedBy || activity.performedByName || 'System',
            link: activity.link
          }));

          setActivities(transformedActivities);
        } else {
          // Fallback to mock data if API fails
          console.warn('API failed, using mock data');
          setActivities(mockActivities.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error.message);
        // Fallback to mock data
        setActivities(mockActivities.slice(0, 10));
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Get activities (use fetched data or fallback to mock)
  const recentActivities = activities.length > 0 ? activities : mockActivities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  const getActivityIcon = (type, priority) => {
    if (priority === 'HIGH') {
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
    }
    
    switch (type) {
      case ACTIVITY_TYPES.COMPLIANCE:
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case ACTIVITY_TYPES.RESULT_UPLOAD:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case ACTIVITY_TYPES.TIMETABLE_UPLOAD:
        return <CalendarIcon className="h-5 w-5 text-blue-500" />;
      case ACTIVITY_TYPES.NEWS_UPLOAD:
        return <InformationCircleIcon className="h-5 w-5 text-purple-500" />;
      case ACTIVITY_TYPES.STUDENT_REGISTRATION:
        return <DocumentTextIcon className="h-5 w-5 text-indigo-500" />;
      case ACTIVITY_TYPES.SYSTEM_MAINTENANCE:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return `Today, ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const getActivityBgColor = (type, status) => {
    const colors = activityColors[type];
    if (status === 'NEW') {
      return `${colors?.bg} border-l-4 border-l-blue-400`;
    }
    return colors?.bg || 'bg-gray-50';
  };

  const handleActivityClick = () => {
    // Navigate to the activities page for all activity types
    navigate('/admin/activities');
  };

  const handleViewAllActivities = () => {
    navigate('/admin/activities');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BellIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
            <p className="text-sm text-gray-500">Latest administrative activities and system events</p>
          </div>
        </div>
        <button
          onClick={handleViewAllActivities}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <span>View All</span>
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-start justify-between p-4 rounded-lg border border-gray-100 bg-gray-50 animate-pulse">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0 p-2 bg-gray-200 rounded-lg w-10 h-10"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))
        ) : error ? (
          // Error state
          <div className="text-center py-8">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">Failed to load activities</h3>
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : recentActivities.length === 0 ? (
          // Empty state
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No recent activities</h3>
            <p className="text-sm text-gray-500">Activities will appear here as they occur.</p>
          </div>
        ) : (
          recentActivities.map((activity) => (
          <div
            key={activity.id}
            onClick={() => handleActivityClick(activity)}
            className={`
              relative flex items-start justify-between p-4 rounded-lg border border-gray-100 
              activity-card-hover cursor-pointer transition-all duration-200
              group ${getActivityBgColor(activity.type, activity.status)}
              ${activity.status === 'NEW' ? 'activity-new-indicator' : ''}
            `}
          >
            {/* Activity Content */}
            <div className="flex items-start space-x-4 flex-1">
              {/* Icon */}
              <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                {getActivityIcon(activity.type, activity.priority)}
              </div>
              
              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-medium text-gray-800 group-hover:text-gray-900 line-clamp-2">
                    {activity.title}
                  </h3>
                  {/* Status and Priority Indicators */}
                  <div className="flex items-center space-x-2 ml-3">
                    {activity.status === 'NEW' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                    {activity.priority === 'HIGH' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {activity.description}
                </p>
                
                {/* Metadata */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>{formatTimestamp(activity.timestamp)}</span>
                    {activity.user && (
                      <>
                        <span>•</span>
                        <span>{activity.user.name}</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0 ml-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleActivityClick(activity);
                }}
                className="text-blue-600 text-sm border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
              >
                View Details
              </button>
            </div>

            {/* New Activity Indicator */}
            {activity.status === 'NEW' && (
              <div className="absolute top-2 right-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full notification-pulse"></div>
              </div>
            )}
          </div>
        )))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Showing {recentActivities.length} recent activities
          </span>
          <button
            onClick={handleViewAllActivities}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            View complete activity log →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRecentActivities;
