import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

const RecentActivities = ({ activeFilter = 'all', limit = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setActivities([]); // Clear activities when fetching new data

    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/activities/my-activities';

      if (activeFilter === 'all') {
        url = 'http://localhost:5000/api/activities/exam-division';
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const data = limit ? result.data.slice(0, limit) : result.data;
        setActivities(data);
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
  }, [activeFilter, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'timetable_upload':
        return DocumentTextIcon;
      case 'result_upload':
        return DocumentIcon;
      case 'news_post':
        return PhotoIcon;
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
      case 'timetable_upload':
        return 'text-blue-500 bg-blue-100';
      case 'result_upload':
        return 'text-green-500 bg-green-100';
      case 'news_post':
        return 'text-purple-500 bg-purple-100';
      case 'activity':
        return 'text-orange-500 bg-orange-100';
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
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {activeFilter === 'my' ? 'My Activities' : 'All Exam Division Activities'}
          </h2>
          {activeFilter === 'all' && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              See what other exam division members are doing
            </p>
          )}
        </div>
        <button
          onClick={fetchActivities}
          className="inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
        >
          <ArrowPathIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
          Refresh
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <div className="p-4 sm:p-6 text-center text-gray-500">
            <div className="flex justify-center mb-4">
              <DocumentTextIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <p className="text-xs sm:text-sm">
              {activeFilter === 'my'
                ? 'No recent activities found for you'
                : 'No activities found from exam division members'}
            </p>
            {activeFilter === 'all' && (
              <p className="text-xs text-gray-500 mt-1 px-2">
                Activities will appear here when exam division members upload time tables, results, or post news updates
              </p>
            )}
          </div>
        ) : (
          activities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            return (
              <div
                key={activity.id}
                className="p-3 sm:p-4 transition-colors duration-200 hover:bg-gray-50"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  {/* Icon - Hidden on mobile, shown on tablet+ */}
                  <div className={`hidden sm:block p-2 rounded-lg ${getIconColor(activity.type)} shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    {/* Title and badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="text-sm sm:text-base font-medium text-gray-900 break-words">
                        {activity.title}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${activity.type === 'timetable_upload' ? 'bg-blue-100 text-blue-800' :
                          activity.type === 'result_upload' ? 'bg-green-100 text-green-800' :
                            activity.type === 'news_post' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {activity.type === 'timetable_upload' ? 'Time Table' :
                          activity.type === 'result_upload' ? 'Result' :
                            activity.type === 'news_post' ? 'News' :
                              'Activity'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                      {activity.description}
                    </p>

                    {/* Faculty info */}
                    {activity.faculty && (
                      <p className="text-xs text-blue-600 mb-2 break-words">
                        Faculty: {activity.faculty}
                        {activity.year && ` • Year: ${activity.year}`}
                      </p>
                    )}

                    {/* Performer info */}
                    {activeFilter === 'all' && activity.performedByName && (
                      <div className="flex items-center mb-2">
                        <UserCircleIcon className="w-4 h-4 text-purple-500 mr-1 shrink-0" />
                        <p className="text-xs sm:text-sm font-medium text-purple-700 truncate">
                          {activity.performedByName}
                          {activity.performedByUsername && (
                            <span className="text-xs text-purple-500 ml-1">
                              ({activity.performedByUsername})
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 shrink-0" />
                        <span className="whitespace-nowrap">{formatActivityTime(activity.timestamp)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400">•</span>
                        <span className="ml-1">{getRelativeTime(activity.timestamp)}</span>
                      </div>
                    </div>

                    {/* Action buttons - Mobile friendly layout */}
                    <div className="flex flex-wrap gap-2">
                      {activity.fileUrl && (
                        <>
                          <button
                            onClick={() => window.open(activity.fileUrl, '_blank')}
                            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded text-blue-600 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 transition-colors flex-1 sm:flex-initial min-w-[80px]"
                            title="Preview document"
                          >
                            Preview
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const response = await fetch(activity.fileUrl);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = activity.fileName || 'document';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error('Download failed:', error);
                                window.open(activity.fileUrl, '_blank');
                              }
                            }}
                            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded text-green-600 hover:bg-green-50 border border-green-200 hover:border-green-300 transition-colors flex-1 sm:flex-initial min-w-[80px]"
                            title="Download document"
                          >
                            Download
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          if (activity.type === 'timetable_upload') {
                            navigate('/exam/time-table');
                          } else if (activity.type === 'result_upload') {
                            navigate('/exam/results');
                          } else if (activity.type === 'news_post') {
                            navigate('/exam/news');
                          }
                        }}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-300 transition-colors flex-1 sm:flex-initial min-w-[100px]"
                      >
                        View Details
                        <ChevronRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
                      </button>
                    </div>
                  </div>
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