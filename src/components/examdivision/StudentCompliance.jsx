import React, { useState, useEffect } from 'react';
import { 
  ExclamationCircleIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChevronDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const complianceTypes = {
  UNREAD: 'unread',
  IN_PROCEDURE: 'in-procedure',
  DONE: 'done',
  ISSUE: 'issue'
};

const complianceTypeStyles = {
  [complianceTypes.UNREAD]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: <ExclamationCircleIcon className="h-5 w-5 text-blue-500" />,
    badge: 'bg-blue-100 text-blue-600',
    border: 'border-blue-200'
  },
  [complianceTypes.IN_PROCEDURE]: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: <ClockIcon className="h-5 w-5 text-yellow-500" />,
    badge: 'bg-yellow-100 text-yellow-600',
    border: 'border-yellow-200'
  },
  [complianceTypes.DONE]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    badge: 'bg-green-100 text-green-600',
    border: 'border-green-200'
  },
  [complianceTypes.ISSUE]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
    badge: 'bg-red-100 text-red-600',
    border: 'border-red-200'
  }
};

const StudentCompliance = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [compliances, setCompliances] = useState([]);

  // Simulated compliance data - replace with actual API call
  useEffect(() => {
    const dummyCompliances = [
      {
        id: 1,
        type: complianceTypes.UNREAD,
        enrollmentNumber: 'ENG/2023/101',
        studentName: 'John Doe',
        message: 'Final marks not showing in the Programming Fundamentals module for Semester 1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: false
      },
      {
        id: 2,
        type: complianceTypes.UNREAD,
        enrollmentNumber: 'ENG/2023/156',
        studentName: 'Sarah Wilson',
        message: 'Unable to view mid-semester exam results for Database Systems',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isRead: false
      },
      {
        id: 3,
        type: complianceTypes.IN_PROCEDURE,
        enrollmentNumber: 'ENG/2023/145',
        studentName: 'Alice Smith',
        message: 'GPA calculation error in semester 2 - shows 3.2 instead of expected 3.5',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isRead: true
      },
      {
        id: 4,
        type: complianceTypes.IN_PROCEDURE,
        enrollmentNumber: 'ENG/2023/189',
        studentName: 'Emma Brown',
        message: 'Missing marks for Web Development practical assessment component',
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        isRead: true
      },
      {
        id: 5,
        type: complianceTypes.DONE,
        enrollmentNumber: 'ENG/2023/167',
        studentName: 'Bob Wilson',
        message: 'Missing attendance marks in Software Engineering now updated',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        isRead: true
      },
      {
        id: 6,
        type: complianceTypes.DONE,
        enrollmentNumber: 'ENG/2023/134',
        studentName: 'David Chang',
        message: 'Data Structures grade corrected from C to B after recheck',
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
        isRead: true
      },
      {
        id: 7,
        type: complianceTypes.ISSUE,
        enrollmentNumber: 'ENG/2023/178',
        studentName: 'Maria Garcia',
        message: 'System error when accessing final semester results - Error 404',
        timestamp: new Date(Date.now() - 1000 * 60 * 240),
        isRead: true
      },
      {
        id: 8,
        type: complianceTypes.ISSUE,
        enrollmentNumber: 'ENG/2023/112',
        studentName: 'Tom Baker',
        message: 'Incorrect grade posted for Operating Systems - Grade mismatch with official record',
        timestamp: new Date(Date.now() - 1000 * 60 * 300),
        isRead: true
      }
    ];
    setCompliances(dummyCompliances);
  }, []);

  const filterCompliances = (type) => {
    if (type === 'all') return compliances;
    return compliances.filter(compliance => compliance.type === type);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleViewCompliance = (id) => {
    // Implement view functionality
    console.log('Viewing compliance:', id);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Student Compliance
          </h3>
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              Filter
              <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {[
                    { key: 'all', label: 'All Compliances' },
                    { key: complianceTypes.UNREAD, label: 'Unread' },
                    { key: complianceTypes.IN_PROCEDURE, label: 'In Procedure' },
                    { key: complianceTypes.DONE, label: 'Done' },
                    { key: complianceTypes.ISSUE, label: 'Issues' }
                  ].map((option) => (
                    <button
                      key={option.key}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedFilter === option.key ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedFilter(option.key);
                        setIsFilterOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { type: complianceTypes.UNREAD, label: 'Unread' },
            { type: complianceTypes.IN_PROCEDURE, label: 'In Procedure' },
            { type: complianceTypes.DONE, label: 'Done' },
            { type: complianceTypes.ISSUE, label: 'Issues' }
          ].map((stat) => {
            const count = compliances.filter(c => c.type === stat.type).length;
            const styles = complianceTypeStyles[stat.type];
            return (
              <div
                key={stat.type}
                className={`px-4 py-3 rounded-lg ${styles.bg} ${styles.border} border`}
              >
                <div className="flex items-center">
                  {styles.icon}
                  <span className={`ml-2 text-sm font-medium ${styles.text}`}>
                    {stat.label}
                  </span>
                </div>
                <p className={`mt-1 text-2xl font-semibold ${styles.text}`}>{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance List */}
      <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {filterCompliances(selectedFilter).map((compliance) => {
          const styles = complianceTypeStyles[compliance.type];
          return (
            <li
              key={compliance.id}
              className={`px-4 py-4 hover:bg-gray-50 transition-colors duration-150 ${
                !compliance.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0">
                    {styles.icon}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900 truncate">
                        {compliance.enrollmentNumber} - {compliance.studentName}
                      </p>
                      <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}>
                        {compliance.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {compliance.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(compliance.timestamp)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleViewCompliance(compliance.id)}
                  className="ml-4 flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StudentCompliance;