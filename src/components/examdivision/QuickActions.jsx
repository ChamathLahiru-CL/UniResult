import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  DocumentArrowUpIcon,
  CalendarIcon,
  NewspaperIcon,
  ClipboardDocumentCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const QuickActions = ({ isLoading }) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const actions = [
    {
      id: 'result',
      title: 'Upload New Result Sheet',
      description: 'Support Document: PDF, Docs, Excel',
      icon: DocumentArrowUpIcon,
      buttonText: 'Upload',
      path: '/exam/new-result'
    },
    {
      id: 'timetable',
      title: 'Upload New Time Table',
      description: 'Support Document: PDF, JPG, PNG',
      icon: CalendarIcon,
      buttonText: 'Upload',
      path: '/exam/time-table'
    },
    {
      id: 'news',
      title: 'Upload New News',
      description: 'Support Document: PDF, JPG, PNG, Text',
      icon: NewspaperIcon,
      buttonText: 'Upload',
      path: '/exam/news'
    },
    {
      id: 'compliance',
      title: 'Student Compliance',
      description: 'Student Exam result compliance',
      icon: ClipboardDocumentCheckIcon,
      buttonText: 'Check',
      path: '/exam/compliance'
    }
  ];

  const cardVariants = {
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  const handleAction = (action) => {
    navigate(action.path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <BoltIcon className="w-6 h-6 mr-3" />
          Quick Actions
        </h2>
        <p className="text-cyan-100 mt-1">Common tasks and shortcuts</p>
      </div>

      {isLoading ? (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg p-6 space-y-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action) => (
              <motion.div
                key={action.id}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                variants={cardVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredCard(action.id)}
                onHoverEnd={() => setHoveredCard(null)}
                onClick={() => handleAction(action)}
              >
                <div className="space-y-4">
                  <div className={`
                    inline-flex p-3 rounded-xl transition-all duration-300
                    ${hoveredCard === action.id
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-blue-50 group-hover:to-blue-100 group-hover:text-blue-600'
                    }
                  `}>
                    <action.icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {action.description}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                      ${hoveredCard === action.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    `}
                  >
                    {action.buttonText}
                  </motion.button>
                </div>

                {/* Subtle background pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QuickActions;