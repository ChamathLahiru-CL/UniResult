import React, { useState, useEffect } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import ResultUploadForm from '../../components/exam/ResultUploadForm';
import ResultHistoryList from '../../components/exam/ResultHistoryList';
import FilePreviewModal from '../../components/exam/FilePreviewModal';
import ExamFilterBar from '../../components/exam/ExamFilterBar';
import { getRelativeTimeFilter } from '../../utils/formatDate';

const ExamResultUploadPage = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [timeRangeFilter, setTimeRangeFilter] = useState('all');

  // Fetch results from API
  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/results', {
        headers
      });

      if (response.ok) {
        const result = await response.json();
        const transformedData = result.data.map(item => ({
          id: item._id,
          faculty: item.faculty,
          department: item.department,
          level: item.level,
          semester: item.semester,
          credits: item.credits,
          subjectName: item.subjectName,
          resultCount: item.resultCount,
          uploadedBy: item.uploadedByName,
          uploadedByUsername: item.uploadedByUsername,
          uploadedByEmail: item.uploadedByEmail,
          uploadedByRole: item.uploadedByRole,
          fileName: item.originalFileName,
          fileUrl: `http://localhost:5000${item.fileUrl}`,
          type: item.fileType,
          uploadedAt: item.createdAt,
          fileSize: `${(item.fileSize / 1024).toFixed(1)} KB`
        }));
        setResults(transformedData);
        setFilteredResults(transformedData);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Filter results whenever filters change
  useEffect(() => {
    let filtered = [...results];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(result =>
        result.fileName.toLowerCase().includes(query) ||
        result.subjectName.toLowerCase().includes(query) ||
        result.faculty.toLowerCase().includes(query) ||
        result.department.toLowerCase().includes(query) ||
        result.level.toLowerCase().includes(query) ||
        result.semester.toLowerCase().includes(query) ||
        result.uploadedBy.toLowerCase().includes(query) ||
        (result.uploadedByUsername && result.uploadedByUsername.toLowerCase().includes(query)) ||
        (result.uploadedByEmail && result.uploadedByEmail.toLowerCase().includes(query))
      );
    }

    // Faculty filter
    if (facultyFilter) {
      filtered = filtered.filter(result => result.faculty === facultyFilter);
    }

    // Level filter
    if (levelFilter) {
      filtered = filtered.filter(result => result.level === levelFilter);
    }

    // Semester filter
    if (semesterFilter) {
      filtered = filtered.filter(result => result.semester === semesterFilter);
    }

    // Time range filter
    const timeFilter = getRelativeTimeFilter(timeRangeFilter);
    filtered = filtered.filter(result => timeFilter(result.uploadedAt));

    // Sort by upload date (newest first)
    filtered.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    setFilteredResults(filtered);
  }, [results, searchQuery, facultyFilter, levelFilter, semesterFilter, timeRangeFilter]);

  const handleUploadSuccess = () => {
    // Refresh the data from API
    fetchResults();
  };

  const handlePreview = (result) => {
    setSelectedFile(result);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedFile(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFacultyFilter('');
    setLevelFilter('');
    setSemesterFilter('');
    setTimeRangeFilter('all');
  };

  const hasActiveFilters = searchQuery || facultyFilter || levelFilter || semesterFilter || timeRangeFilter !== 'all';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <DocumentTextIcon className="h-8 w-8 text-[#246BFD]" />
            <h1 className="text-3xl font-bold text-gray-900">Result Sheet Upload</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Upload and manage exam result sheets for different subjects and departments
          </p>
        </div>

        {/* 1. New Result Upload Section - Full Width */}
        <div className="mb-12">
          <ResultUploadForm onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* 2. Statistics Cards Section - Full Width */}
        <div className="mb-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-md border-l-4 border-gray-300 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Uploads</p>
                    <p className="text-2xl font-bold text-gray-900">{results.length}</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Faculty of Technological Studies</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {results.filter(r => r.faculty === 'Faculty of Technological Studies').length}
                    </p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">PDF Files</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {results.filter(r => r.type === 'pdf').length}
                    </p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Results</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {results.reduce((sum, r) => sum + (r.resultCount || 0), 0)}
                    </p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Past Results List Section - Full Width */}
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="w-full">
            <ExamFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              facultyFilter={facultyFilter}
              onFacultyFilterChange={setFacultyFilter}
              levelFilter={levelFilter}
              onLevelFilterChange={setLevelFilter}
              semesterFilter={semesterFilter}
              onSemesterFilterChange={setSemesterFilter}
              timeRangeFilter={timeRangeFilter}
              onTimeRangeFilterChange={setTimeRangeFilter}
            />
          </div>

          {/* Active Filters Indicator */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {facultyFilter && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Faculty: {facultyFilter}
                    </span>
                  )}
                  {levelFilter && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Level: {levelFilter}
                    </span>
                  )}
                  {semesterFilter && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Semester: {semesterFilter}
                    </span>
                  )}
                  {timeRangeFilter !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Time: {timeRangeFilter === 'last7days' ? 'Last 7 days' : 'Last 30 days'}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredResults.length === results.length ? (
                `Showing all ${results.length} result sheet${results.length !== 1 ? 's' : ''}`
              ) : (
                `Showing ${filteredResults.length} of ${results.length} result sheet${results.length !== 1 ? 's' : ''}`
              )}
            </p>
          </div>

          {/* Results List */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="divide-y divide-gray-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                          <div className="flex gap-4">
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ResultHistoryList
              results={filteredResults}
              onPreview={handlePreview}
            />
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        file={selectedFile}
      />
    </div>
  );
};

export default ExamResultUploadPage;