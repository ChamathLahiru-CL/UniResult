import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PaperClipIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

const PastNewsFeed = ({ activeFilter = 'all' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [expandedNews, setExpandedNews] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/news';

      // Add filters
      const params = new URLSearchParams();
      if (facultyFilter !== 'all') params.append('faculty', facultyFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        let filteredNews = result.data;

        // Filter for "my" news if activeFilter is 'my'
        if (activeFilter === 'my') {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const currentUserId = currentUser.userId || currentUser.id;

          filteredNews = filteredNews.filter(item => {
            // item.uploadedBy is an object from populate, so compare its _id with userId
            const itemUserId = item.uploadedBy._id ? String(item.uploadedBy._id) : String(item.uploadedBy);
            return itemUserId === String(currentUserId);
          });
        }

        // Apply search filter
        if (searchQuery) {
          filteredNews = filteredNews.filter(item =>
            item.newsTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.newsMessage.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setNews(filteredNews);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch news');
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Network error. Please try again.');
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, facultyFilter, typeFilter, searchQuery]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const toggleExpanded = (newsId) => {
    const newExpanded = new Set(expandedNews);
    if (newExpanded.has(newsId)) {
      newExpanded.delete(newsId);
    } else {
      newExpanded.add(newsId);
    }
    setExpandedNews(newExpanded);
  };

  const formatNewsTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      if (isToday(date)) {
        return `Today, ${format(date, 'HH:mm')}`;
      } else if (isYesterday(date)) {
        return `Yesterday, ${format(date, 'HH:mm')}`;
      } else {
        return format(date, 'MMM dd, yyyy HH:mm');
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getRelativeTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error getting relative time:', error);
      return 'Invalid date';
    }
  };

  const getNewsTypeColor = (type) => {
    switch (type) {
      case 'Announcement':
        return 'text-blue-500 bg-blue-100';
      case 'Important Notice':
        return 'text-red-500 bg-red-100';
      case 'Exam Update':
        return 'text-green-500 bg-green-100';
      case 'General Information':
        return 'text-purple-500 bg-purple-100';
      case 'Urgent Alert':
        return 'text-orange-500 bg-orange-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const handlePreview = (fileUrl) => {
    if (fileUrl) {
      window.open(`http://localhost:5000${fileUrl}`, '_blank');
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    if (fileUrl) {
      try {
        const response = await fetch(`http://localhost:5000${fileUrl}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'news-attachment';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        window.open(`http://localhost:5000${fileUrl}`, '_blank');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeFilter === 'my' ? 'My News' : 'All News'}
          </h2>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeFilter === 'my' ? 'My News' : 'All News'}
          </h2>
        </div>
        <div className="p-6 text-center text-red-500">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchNews}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Header with filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeFilter === 'my' ? 'My News' : 'All News'}
          </h2>
          <button
            onClick={fetchNews}
            className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Faculties</option>
            <option value="Technological Studies">Technological Studies</option>
            <option value="Applied Science">Applied Science</option>
            <option value="Management">Management</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Medicine">Medicine</option>
            <option value="All Faculties">All Faculties</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Announcement">Announcement</option>
            <option value="Important Notice">Important Notice</option>
            <option value="Exam Update">Exam Update</option>
            <option value="General Information">General Information</option>
            <option value="Urgent Alert">Urgent Alert</option>
          </select>
        </div>
      </div>

      {/* News List */}
      <div className="divide-y divide-gray-200">
        {news.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="flex justify-center mb-4">
              <DocumentIcon className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-sm">
              {activeFilter === 'my'
                ? 'No news found. Start by uploading your first news item.'
                : 'No news found matching your criteria.'}
            </p>
          </div>
        ) : (
          news.map((item) => {
            const isExpanded = expandedNews.has(item._id);
            return (
              <div
                key={item._id}
                className="p-4 transition-colors duration-200 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* News Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getNewsTypeColor(item.newsType)}`}>
                        {item.newsType}
                      </span>
                      {item.priority === 'urgent' && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                      {activeFilter === 'all' && (
                        <span className="text-xs text-gray-500">
                          by {item.uploadedByName}
                        </span>
                      )}
                    </div>

                    {/* News Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.newsTopic}
                    </h3>

                    {/* News Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <AcademicCapIcon className="w-4 h-4 mr-1" />
                        {item.faculty}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {formatNewsTime(item.createdAt)}
                      </div>
                      <div className="text-gray-400">
                        {getRelativeTime(item.createdAt)}
                      </div>
                    </div>

                    {/* News Message */}
                    <div className="text-gray-700 mb-3">
                      {isExpanded ? (
                        <p className="text-sm leading-relaxed">{item.newsMessage}</p>
                      ) : (
                        <p className="text-sm leading-relaxed line-clamp-2">{item.newsMessage}</p>
                      )}
                    </div>

                    {/* Attachment */}
                    {item.fileUrl && (
                      <div className="flex items-center gap-2 mb-3">
                        <PaperClipIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{item.originalFileName || item.fileName}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handlePreview(item.fileUrl)}
                            className="text-xs text-blue-600 hover:text-blue-700 underline"
                          >
                            Preview
                          </button>
                          <span className="text-gray-400">|</span>
                          <button
                            onClick={() => handleDownload(item.fileUrl, item.originalFileName || item.fileName)}
                            className="text-xs text-green-600 hover:text-green-700 underline"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Expand/Collapse */}
                    <button
                      onClick={() => toggleExpanded(item._id)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUpIcon className="w-4 h-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDownIcon className="w-4 h-4 mr-1" />
                          Read More
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PastNewsFeed;