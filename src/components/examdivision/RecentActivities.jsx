import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  ClockIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  UserCircleIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const RecentActivities = ({ isLoading, filter = 'all', userId }) => {
  // Mock data - In a real app, this would come from an API
  const allActivities = [
    {
      id: 1,
      title: 'ICT, 200 level semester 3 Stat result Update',
      time: 'Today, 10:30 AM',
      type: 'result',
      icon: DocumentTextIcon,
      userId: 'user1', // Current user
    },
    {
      id: 2,
      title: 'This Month activity diagram update',
      time: 'Today, 10:30 AM',
      type: 'activity',
      icon: CalendarDaysIcon,
      userId: 'user1', // Current user
    },
    {
      id: 3,
      title: 'EET Level 400 Semester 7 Results Upload',
      time: 'Today, 09:45 AM',
      type: 'result',
      icon: DocumentTextIcon,
      userId: 'user2',
      userName: 'Sarah',
    },
    {
      id: 4,
      title: 'New Timetable Update - CST Department',
      time: 'Today, 09:15 AM',
      type: 'timetable',
      icon: CalendarDaysIcon,
      userId: 'user3',
      userName: 'Mike',
    },
  ];

  // Filter activities based on the selected tab
  const filteredActivities = allActivities.filter(activity => {
    if (filter === 'myActivities') {
      return activity.userId === userId;
    } else if (filter === 'otherActivities') {
      return activity.userId !== userId;
    }
    return true; // Show all activities if no filter
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    hover: {
      scale: 1.02,
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'result':
        return 'text-green-500 bg-green-100';
      case 'activity':
        return 'text-blue-500 bg-blue-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-gray-200"
      >
        {filteredActivities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="flex justify-center mb-4">
              {filter === 'myActivities' ? (
                <UserCircleIcon className="w-12 h-12 text-gray-400" />
              ) : (
                <UsersIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <p className="text-sm">
              {filter === 'myActivities'
                ? 'No recent activities found for you'
                : 'No activities from other users found'}
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              whileHover="hover"
              className="p-4 transition-colors duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${getIconColor(activity.type)}`}>
                  <activity.icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {activity.time}
                    </div>
                    {activity.userName && (
                      <>
                        <span>•</span>
                        <div className="flex items-center">
                          <UserCircleIcon className="w-4 h-4 mr-1" />
                          {activity.userName}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  View Details
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;