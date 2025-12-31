import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import QuickActions from '../../components/examdivision/QuickActions';
import LastUpdatedResults from '../../components/examdivision/LastUpdatedResults';
import RecentActivities from '../../components/examdivision/RecentActivities';

const ExamDivision = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay for smooth entrance animation
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <motion.div 
          className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Welcome Message */}
          <motion.div
            className="mb-4 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-1 sm:mb-2 truncate">
              Welcome, {user?.name || 'Exam Officer'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Exam Division Home Page Overview</p>
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div
            className="mb-4 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <QuickActions isLoading={isLoading} />
          </motion.div>

          {/* Last Updated Results - Full Width */}
          <motion.div
            className="mb-4 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-5 md:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Last Updated Results</h2>
              <LastUpdatedResults isLoading={isLoading} />
            </div>
          </motion.div>

          {/* Recent Activities Section */}
          <motion.div
            className="mb-4 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Activities</h2>
                <button
                  onClick={() => navigate('/exam/activities')}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 w-full sm:w-auto"
                >
                  <span className="truncate">View All Activities</span>
                  <svg className="ml-2 w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <RecentActivities 
                isLoading={isLoading} 
                filter="myActivities"
                userId={user?.id}
                limit={5}
              />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ExamDivision;