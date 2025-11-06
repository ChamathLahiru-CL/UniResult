import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useAuth } from '../../context/useAuth';
import QuickActions from '../../components/examdivision/QuickActions';
import LastUpdatedResults from '../../components/examdivision/LastUpdatedResults';
import RecentActivities from '../../components/examdivision/RecentActivities';

const ExamDivision = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('myActivities'); // 'myActivities' or 'otherActivities'

  useEffect(() => {
    // Simulate loading delay for smooth entrance animation
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <motion.div 
          className="container mx-auto px-6 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Welcome Message */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Welcome, {user?.name || 'Exam Officer'}
            </h1>
            <p className="text-gray-600">Exam Division Home Page Overview</p>
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <QuickActions isLoading={isLoading} />
          </motion.div>

          {/* Last Updated Results - Full Width */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Last Updated Results</h2>
              <LastUpdatedResults isLoading={isLoading} />
            </div>
          </motion.div>

          {/* Recent Activities Section with Tabs */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Tabs Header */}
              <div className="border-b border-gray-200">
                <div className="px-6 flex space-x-8">
                  <button
                    onClick={() => setActiveTab('myActivities')}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeTab === 'myActivities'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    My Activities
                  </button>
                  <button
                    onClick={() => setActiveTab('otherActivities')}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeTab === 'otherActivities'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Other Activities
                  </button>
                </div>
              </div>

              {/* Activities Content */}
              <div className="p-6">
                {activeTab === 'myActivities' ? (
                  <RecentActivities 
                    isLoading={isLoading} 
                    filter="myActivities"
                    userId={user?.id} 
                  />
                ) : (
                  <RecentActivities 
                    isLoading={isLoading} 
                    filter="otherActivities"
                    userId={user?.id}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ExamDivision;