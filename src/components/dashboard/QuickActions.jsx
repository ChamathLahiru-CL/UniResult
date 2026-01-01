import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline';

/**
 * QuickActions Component
 * Provides shortcut buttons to frequently accessed pages
 * Each button includes an icon and descriptive text
 */
const QuickActions = () => {
  // Quick action buttons configuration
  const actions = [
    {
      name: 'View All Result',
      icon: DocumentTextIcon,
      path: '/student/results',
      description: 'Access complete result history'
    },
    {
      name: 'Go to GPA Analysis',
      icon: ChartBarIcon,
      path: '/student/gpa-trend',
      description: 'Analyze GPA performance over time'
    },
    {
      name: 'Exam Time Table',
      icon: CalendarIcon,
      path: '/student/exam-time-table',
      description: 'View upcoming exams schedule'
    }
  ];

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md border border-gray-200 h-full relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50"></div>
      
      <div className="relative z-10">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-5 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Actions
        </h2>
        
        {/* Action Buttons */}
        <div className="space-y-2 sm:space-y-3">
          {actions.map((action) => (
            <Link
              key={action.name}
              to={action.path.replace('/student/', '/dash/')}
              className="flex items-center p-3 sm:p-4 border border-gray-100 rounded-xl bg-gradient-to-r hover:from-blue-50 hover:to-white hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform md:hover:-translate-y-1 active:scale-95 group"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md group-hover:from-blue-600 group-hover:to-blue-700 transition-colors duration-300 flex-shrink-0">
                <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="ml-3 sm:ml-4 flex-grow min-w-0">
                <span className="block text-xs sm:text-sm font-medium text-gray-800 group-hover:text-blue-700 truncate">{action.name}</span>
                <span className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">{action.description}</span>
              </div>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;