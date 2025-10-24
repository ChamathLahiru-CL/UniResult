import React from 'react';

const TabSelector = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.value || tab}
            onClick={() => onTabChange(tab.value || tab)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              (activeTab === (tab.value || tab))
                ? 'border-[#246BFD] text-[#246BFD]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors duration-200`}
          >
            {tab.label || tab}
            {tab.count !== undefined && (
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                (activeTab === (tab.value || tab))
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabSelector;