import React from 'react';

const TabSelector = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex items-center space-x-4 sm:space-x-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabSelector;