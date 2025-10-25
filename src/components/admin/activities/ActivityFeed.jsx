import React from 'react';
import { format, isToday, isYesterday, isSameWeek } from 'date-fns';
import ActivityCard from './ActivityCard';

const ActivityFeed = ({ activities, isLoading = false }) => {
  // Group activities by date
  const groupActivitiesByDate = (activities) => {
    const groups = {};
    
    activities.forEach(activity => {
      const activityDate = new Date(activity.timestamp);
      let groupKey;
      
      if (isToday(activityDate)) {
        groupKey = 'Today';
      } else if (isYesterday(activityDate)) {
        groupKey = 'Yesterday';
      } else if (isSameWeek(activityDate, new Date(), { weekStartsOn: 1 })) {
        groupKey = format(activityDate, 'EEEE'); // Day name
      } else {
        groupKey = format(activityDate, 'MMMM d, yyyy');
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(activity);
    });
    
    return groups;
  };

  const groupedActivities = groupActivitiesByDate(activities);
  const groupKeys = Object.keys(groupedActivities);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, cardIndex) => (
                <div key={cardIndex} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
        <p className="text-gray-600">No activities match your current filters. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupKeys.map((dateGroup) => (
        <div key={dateGroup} className="space-y-4">
          {/* Date Header */}
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900">{dateGroup}</h3>
            <div className="ml-3 flex-1 h-px bg-gray-200"></div>
            <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {groupedActivities[dateGroup].length} {groupedActivities[dateGroup].length === 1 ? 'activity' : 'activities'}
            </span>
          </div>

          {/* Activities for this date */}
          <div className="space-y-3">
            {groupedActivities[dateGroup].map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      ))}

      {/* Load More (if needed for pagination) */}
      {activities.length >= 20 && (
        <div className="text-center py-6">
          <button className="px-6 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium">
            Load More Activities
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;