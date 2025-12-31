import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  DocumentArrowUpIcon,
  CalendarIcon,
  NewspaperIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

const QuickActions = ({ isLoading }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const actions = [
    {
      id: 'result',
      title: 'Upload New Result Sheet',
      description: 'Support Document: PDF, Docs, Excel',
      icon: DocumentArrowUpIcon,
      buttonText: 'Upload',
      acceptedFiles: '.pdf,.doc,.docx,.xls,.xlsx'
    },
    {
      id: 'timetable',
      title: 'Upload New Time Table',
      description: 'Support Document: PDF, JPG, PNG',
      icon: CalendarIcon,
      buttonText: 'Upload',
      acceptedFiles: '.pdf,.jpg,.jpeg,.png'
    },
    {
      id: 'news',
      title: 'Upload New News',
      description: 'Support Document: PDF, JPG, PNG, Text',
      icon: NewspaperIcon,
      buttonText: 'Upload',
      acceptedFiles: '.pdf,.jpg,.jpeg,.png,.txt'
    },
    {
      id: 'compliance',
      title: 'Student Compliance',
      description: 'Student Exam result compliance',
      icon: ClipboardDocumentCheckIcon,
      buttonText: 'Check',
      action: 'check'
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

  const handleUpload = (actionId) => {
    // Create a hidden file input and trigger it
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = actions.find(a => a.id === actionId).acceptedFiles;
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Handle file upload
        console.log(`Uploading ${file.name} for ${actionId}`);
      }
    };
    input.click();
  };

  const handleAction = (action) => {
    if (action.action === 'check') {
      // Handle compliance check
      console.log('Checking student compliance');
    } else {
      handleUpload(action.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 relative"
    >
      {isLoading ? (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg sm:rounded-xl z-10">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : null}
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 md:mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((action) => (
          <motion.div
            key={action.id}
            className={`relative p-4 sm:p-5 md:p-6 rounded-lg border ${
              hoveredCard === action.id
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-200 bg-white'
            } cursor-pointer transition-colors duration-200`}
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredCard(action.id)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className={`
                inline-flex p-2 sm:p-2.5 md:p-3 rounded-lg
                ${hoveredCard === action.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                transition-colors duration-200
              `}>
                <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2">{action.title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2">{action.description}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAction(action)}
                className={`
                  w-full px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium
                  ${hoveredCard === action.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                `}
              >
                {action.buttonText}
              </motion.button>
            </div>

            {/* Animated highlight effect */}
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              initial={false}
              animate={{
                boxShadow: hoveredCard === action.id
                  ? '0 0 0 2px rgba(59, 130, 246, 0.5)'
                  : '0 0 0 0px rgba(59, 130, 246, 0)'
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;