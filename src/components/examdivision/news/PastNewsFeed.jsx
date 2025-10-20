import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const PastNewsFeed = () => {
  const currentUser = 'Lahiru J.'; // Replace with actual logged-in user

  // Mock data - replace with API call
  const [news] = useState([
    {
      id: 1,
      topic: 'Final Exam Time Table Released',
      postedBy: 'Lahiru J.',
      faculty: 'ICT',
      date: '2025-10-18',
      message: 'All final exam schedules are now available. Please check your student portal for detailed information.',
      file: 'exam-time-table-oct2025.pdf',
      type: 'exam'
    },
    {
      id: 2,
      topic: 'Lab Assessment Schedule Update',
      postedBy: 'Chamath K.',
      faculty: 'CST',
      date: '2025-10-17',
      message: 'The lab assessment schedule for Programming Fundamentals has been updated.',
      file: 'lab-schedule-update.pdf',
      type: 'assessment'
    },
    {
      id: 3,
      topic: 'New Exam Guidelines Released',
      postedBy: 'Lahiru J.',
      faculty: 'ICT',
      date: '2025-10-16',
      message: 'Please review the updated exam guidelines for the upcoming examinations.',
      file: 'exam-guidelines-2025.pdf',
      type: 'announcement'
    }
  ]);

  const [expandedNews, setExpandedNews] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');

  const toggleNewsExpansion = (id) => {
    const newExpanded = new Set(expandedNews);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNews(newExpanded);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getNewsTypeColor = (type) => {
    switch (type) {
      case 'exam':
        return 'bg-gradient-to-r from-blue-100 to-cyan-50 text-blue-700 border border-blue-200 shadow-blue-100/50';
      case 'assessment':
        return 'bg-gradient-to-r from-violet-100 to-purple-50 text-purple-700 border border-purple-200 shadow-purple-100/50';
      case 'announcement':
        return 'bg-gradient-to-r from-teal-100 to-emerald-50 text-emerald-700 border border-emerald-200 shadow-emerald-100/50';
      default:
        return 'bg-gradient-to-r from-slate-100 to-gray-50 text-gray-700 border border-gray-200 shadow-gray-100/50';
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFaculty = selectedFaculty === 'all' || item.faculty === selectedFaculty;
    
    return matchesSearch && matchesFaculty;
  });

  const myNews = news.filter(item => item.postedBy === currentUser);

  const NewsCard = ({ newsItem }) => {
    const isExpanded = expandedNews.has(newsItem.id);
    const isMyNews = newsItem.postedBy === currentUser;

    return (
      <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ${
        isMyNews ? 'border-l-4 border-blue-500 bg-gradient-to-br from-blue-50/40 via-blue-50/20 to-transparent' : 'bg-gradient-to-br from-slate-50/80 via-white to-white'
      }`}>
        <div className="p-6 bg-white/40 rounded-xl backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getNewsTypeColor(newsItem.type)}`}>
                    {newsItem.type.charAt(0).toUpperCase() + newsItem.type.slice(1)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-sky-50 text-sky-700 border border-sky-200 shadow-sm ring-1 ring-sky-100/50">
                    {newsItem.faculty}
                  </span>
                  {isMyNews && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-cyan-50 text-blue-700 border border-blue-200 shadow-sm ring-1 ring-blue-100/50 animate-pulse">
                      My Post
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{newsItem.topic}</h3>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                  <span>{newsItem.postedBy}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                  <span>{formatDate(newsItem.date)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => toggleNewsExpansion(newsItem.id)}
              className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label={isExpanded ? "Collapse news" : "Expand news"}
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
              <p className="text-gray-600 text-sm leading-relaxed">{newsItem.message}</p>
              {newsItem.file && (
                <div className="mt-4 flex items-center p-3 bg-gray-50 rounded-lg">
                  <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <a
                    href={`#${newsItem.file}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {newsItem.file}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <Tab.Group>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Tab.List className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              <Tab className={({ selected }) =>
                `px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selected
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }>
                All News
              </Tab>
              <Tab className={({ selected }) =>
                `px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selected
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }>
                My News
              </Tab>
            </Tab.List>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-auto">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Faculties</option>
                <option value="ICT">ICT</option>
                <option value="CST">CST</option>
                <option value="EET">EET</option>
              </select>
            </div>
          </div>

          <Tab.Panels>
            <Tab.Panel>
              <div className="grid gap-4">
                {filteredNews.length > 0 ? (
                  filteredNews.map((item) => <NewsCard key={item.id} newsItem={item} />)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No news items found</p>
                  </div>
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="grid gap-4">
                {myNews.length > 0 ? (
                  myNews.map((item) => <NewsCard key={item.id} newsItem={item} />)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">You haven't posted any news yet</p>
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default PastNewsFeed;