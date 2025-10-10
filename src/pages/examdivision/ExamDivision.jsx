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

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Last Updated Results */}
            <motion.div
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <LastUpdatedResults isLoading={isLoading} />
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <RecentActivities isLoading={isLoading} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ExamDivision;