import React, { useState } from 'react';
import { UserIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import NewsUploadForm from '../../components/examdivision/news/NewsUploadForm';
import PastNewsFeed from '../../components/examdivision/news/PastNewsFeed';

const ExamNewsPage = () => {
  const [activeTab, setActiveTab] = useState('my');
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
    { id: 'my', name: 'My News', icon: UserIcon },
    { id: 'all', name: 'All News', icon: GlobeAltIcon },
  ];

  const handleNewsUploaded = () => {
    // Trigger refresh of the news feed
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-2xl font-semibold text-slate-800 mb-1">News Upload</h1>
        <p className="text-slate-500 text-sm">
          Post important exam-related announcements to selected faculties and manage previously uploaded news.
        </p>
      </div>

      {/* News Upload Form Section */}
      <div className="mb-8 animate-fade-in-up">
        <NewsUploadForm onNewsUploaded={handleNewsUploaded} />
      </div>

      {/* Divider */}
      <hr className="border border-slate-200 my-8 animate-fade-in" />

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

      {/* Past News Feed Section */}
      <div className="animate-fade-in-up">
        <PastNewsFeed key={refreshKey} activeFilter={activeTab} />
      </div>
    </div>
  );
};

export default ExamNewsPage;