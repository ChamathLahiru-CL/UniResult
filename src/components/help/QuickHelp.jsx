/**
 * QuickHelp Component
 * Grid of quick help cards for common issues
 */
import React from 'react';
import {
  KeyIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  PhoneIcon
} from '@heroicons/react/outline';

const QuickHelp = () => {
  const helpCards = [
    {
      title: 'Login & Account Issues',
      icon: KeyIcon,
      description: 'Password reset, account access, and security',
      color: 'blue'
    },
    {
      title: 'Viewing Results',
      icon: ChartBarIcon,
      description: 'How to check grades and calculate GPA',
      color: 'green'
    },
    {
      title: 'Downloading Reports',
      icon: DocumentTextIcon,
      description: 'Get result sheets and transcripts',
      color: 'purple'
    },
    {
      title: 'System/Technical Issues',
      icon: CogIcon,
      description: 'Browser problems and error messages',
      color: 'orange'
    },
    {
      title: 'Contact University Support',
      icon: PhoneIcon,
      description: 'Get help from our support team',
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const classes = {
      blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
      green: 'bg-green-50 text-green-600 group-hover:bg-green-600',
      purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600',
      orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600',
      red: 'bg-red-50 text-red-600 group-hover:bg-red-600'
    };
    return classes[color] || classes.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {helpCards.map((card, index) => (
        <button
          key={index}
          className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${getColorClasses(card.color)} group-hover:text-white transition-colors duration-200`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{card.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickHelp;