import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { DocumentTextIcon, ArrowRightIcon, BoltIcon } from '@heroicons/react/24/outline';
import QuickActions from '../../components/examdivision/QuickActions';
import LastUpdatedResults from '../../components/examdivision/LastUpdatedResults';
import RecentActivities from '../../components/examdivision/RecentActivities';
import ExamDivisionStats from '../../components/examdivision/ExamDivisionStats';

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
            className="mb-1 sm:mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-5 text-white shadow-xl">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                Welcome back, {user?.name || 'Exam Officer'}! 👋
              </h1>
              <p className="text-blue-100 text-sm sm:text-base">Here's what's happening in your exam division today</p>
            </div>
          </motion.div>

          {/* Statistics Overview */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <ExamDivisionStats isLoading={isLoading} />
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <QuickActions isLoading={isLoading} />
          </motion.div>

          {/* Last Updated Results - Full Width */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <DocumentTextIcon className="w-6 h-6 mr-3" />
                  Last Updated Results
                </h2>
                <p className="text-blue-100 mt-1">Recently uploaded result sheets</p>
              </div>
              <div className="p-6">
                <LastUpdatedResults isLoading={isLoading} />
              </div>
            </div>
          </motion.div>

          {/* Recent Activities Section */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <BoltIcon className="w-6 h-6 mr-3" />
                      Recent Activities
                    </h2>
                    <p className="text-blue-100 mt-1">Your latest exam division activities</p>
                  </div>
                  <button
                    onClick={() => navigate('/exam/activities')}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span>View All Activities</span>
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <RecentActivities
                  isLoading={isLoading}
                  filter="myActivities"
                  userId={user?.id}
                  limit={5}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ExamDivision;