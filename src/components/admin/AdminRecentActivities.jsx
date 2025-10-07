import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

const AdminRecentActivities = () => {
  const activities = [
    {
      id: 1,
      title: 'ICT, 200 level semester 3 Stat result Update',
      time: 'Today, 10:30 AM',
    },
    {
      id: 2,
      title: 'This Month activity diagram update',
      time: 'Today, 10:30 AM',
    },
    {
      id: 3,
      title: 'Upcoming exam timetable update',
      time: 'Today, 10:30 AM',
    },
    {
      id: 4,
      title: 'Stat 200 Level result updated',
      time: 'Today, 10:30 AM',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ClockIcon className="h-5 w-5 text-[#246BFD]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">{activity.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
            <button className="text-[#246BFD] text-sm border border-[#246BFD] px-3 py-1 rounded-md hover:bg-blue-50">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRecentActivities;
