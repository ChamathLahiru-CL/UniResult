import React, { useState } from 'react';
import { UserIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import RecentActivities from '../../components/examdivision/RecentActivities';

const ExamActivities = () => {
  const [activeTab, setActiveTab] = useState('my');

  const tabs = [
    { id: 'my', name: 'My Activity', icon: UserIcon },
    { id: 'all', name: 'All Activity Types', icon: GlobeAltIcon },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Activity Log</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track all exam division activities and updates
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="sm:hidden">
          <select
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4 bg-white p-4 rounded-lg shadow" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    ${activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                    px-4 py-2 font-medium text-sm rounded-md flex items-center transition-colors duration-150
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                  {tab.id === activeTab && (
                    <span className="ml-2 bg-blue-200 text-blue-800 py-0.5 px-2.5 rounded-full text-xs">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <RecentActivities activeFilter={activeTab} />
      </div>
    </div>
  );
};

export default ExamActivities;