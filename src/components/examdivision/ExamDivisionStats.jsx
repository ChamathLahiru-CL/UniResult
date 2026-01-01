import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ExamDivisionStats = ({ isLoading }) => {
  const [stats, setStats] = useState({
    totalResults: 0,
    totalStudents: 0,
    pendingCompliance: 0,
    recentUploads: 0,
    totalUploads: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch results data
        const resultsResponse = await fetch('http://localhost:5000/api/results', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json();
          if (resultsData.success && Array.isArray(resultsData.data)) {
            const results = resultsData.data;
            const totalResults = results.reduce((sum, result) => sum + (result.resultCount || 0), 0);
            const recentUploads = results.filter(result => {
              const uploadDate = new Date(result.createdAt);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return uploadDate >= weekAgo;
            }).length;

            setStats(prev => ({
              ...prev,
              totalResults,
              recentUploads,
              totalUploads: results.length
            }));
          }
        }

        // Fetch compliance data
        const complianceResponse = await fetch('http://localhost:5000/api/compliance', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (complianceResponse.ok) {
          const complianceData = await complianceResponse.json();
          if (complianceData.success && Array.isArray(complianceData.data)) {
            const pendingCount = complianceData.data.filter(item => item.status === 'pending').length;
            setStats(prev => ({
              ...prev,
              pendingCompliance: pendingCount
            }));
          }
        }

      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (!isLoading) {
      fetchStats();
    }
  }, [isLoading]);

  const statCards = [
    {
      id: 'totalResults',
      title: 'Total Results',
      value: stats.totalResults,
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 'totalUploads',
      title: 'Total Uploads',
      value: stats.totalUploads,
      icon: ArrowTrendingUpIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-600'
    },
    {
      id: 'recentUploads',
      title: 'Recent Uploads (7 days)',
      value: stats.recentUploads,
      icon: ClockIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600'
    },
    {
      id: 'pendingCompliance',
      title: 'Pending Compliance',
      value: stats.pendingCompliance,
      icon: stats.pendingCompliance > 0 ? ExclamationTriangleIcon : CheckCircleIcon,
      color: stats.pendingCompliance > 0 ? 'from-orange-500 to-orange-600' : 'from-emerald-500 to-emerald-600',
      bgColor: stats.pendingCompliance > 0 ? 'from-orange-50 to-orange-100' : 'from-emerald-50 to-emerald-100',
      textColor: stats.pendingCompliance > 0 ? 'text-orange-600' : 'text-emerald-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.id}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -2 }}
        >
          {/* Gradient background overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

          <div className="relative p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${card.color} shadow-lg`}>
                <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${card.color} shadow-sm`}></div>
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{card.title}</p>
              <p className={`text-xl sm:text-2xl font-bold ${card.textColor}`}>
                {card.value.toLocaleString()}
              </p>
            </div>

            {/* Subtle pattern overlay */}
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 opacity-5">
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-transparent rounded-full transform translate-x-4 sm:translate-x-6 -translate-y-4 sm:-translate-y-6"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ExamDivisionStats;