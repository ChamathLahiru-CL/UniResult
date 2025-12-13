import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import TimeTableUploadForm from '../../components/exam/TimeTableUploadForm';
import TimeTableHistoryList from '../../components/exam/TimeTableHistoryList';
import FilePreviewModal from '../../components/exam/FilePreviewModal';
import ExamFilterBar from '../../components/exam/ExamFilterBar';
import { getRelativeTimeFilter } from '../../utils/formatDate';

const ExamTimeTableUploadPage = () => {
  const [timeTables, setTimeTables] = useState([]);
  const [filteredTimeTables, setFilteredTimeTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [timeRangeFilter, setTimeRangeFilter] = useState('all');

  // Fetch timetables from API
  const fetchTimeTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/timetable', {
        headers
      });

      if (response.ok) {
        const result = await response.json();
        const transformedData = result.data.map(item => ({
          id: item._id,
          faculty: item.faculty,
          year: item.year,
          uploadedBy: item.uploadedByName,
          uploadedByUsername: item.uploadedByUsername,
          uploadedByEmail: item.uploadedByEmail,
          uploadedByRole: item.uploadedByRole,
          fileName: item.originalFileName,
          fileUrl: `http://localhost:5000${item.fileUrl}`,
          type: item.fileType === 'pdf' ? 'pdf' : 'image',
          uploadedAt: item.createdAt,
          fileSize: `${(item.fileSize / 1024).toFixed(1)} KB`
        }));
        setTimeTables(transformedData);
        setFilteredTimeTables(transformedData);
      }
    } catch (error) {
      console.error('Failed to fetch timetables:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeTables();
  }, []);

  // Filter time tables whenever filters change
  useEffect(() => {
    let filtered = [...timeTables];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(timeTable =>
        timeTable.fileName.toLowerCase().includes(query) ||
        timeTable.faculty.toLowerCase().includes(query) ||
        timeTable.year.toLowerCase().includes(query) ||
        timeTable.uploadedBy.toLowerCase().includes(query) ||
        (timeTable.uploadedByUsername && timeTable.uploadedByUsername.toLowerCase().includes(query)) ||
        (timeTable.uploadedByEmail && timeTable.uploadedByEmail.toLowerCase().includes(query))
      );
    }

    // Faculty filter
    if (facultyFilter) {
      filtered = filtered.filter(timeTable => timeTable.faculty === facultyFilter);
    }

    // Year filter
    if (yearFilter) {
      filtered = filtered.filter(timeTable => timeTable.year === yearFilter);
    }

    // Time range filter
    const timeFilter = getRelativeTimeFilter(timeRangeFilter);
    filtered = filtered.filter(timeTable => timeFilter(timeTable.uploadedAt));

    // Sort by upload date (newest first)
    filtered.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    setFilteredTimeTables(filtered);
  }, [timeTables, searchQuery, facultyFilter, yearFilter, timeRangeFilter]);

  const handleUploadSuccess = () => {
    // Refresh the data from API
    fetchTimeTables();
  };

  const handlePreview = (timeTable) => {
    setSelectedFile(timeTable);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedFile(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFacultyFilter('');
    setYearFilter('');
    setTimeRangeFilter('all');
  };

  const hasActiveFilters = searchQuery || facultyFilter || yearFilter || timeRangeFilter !== 'all';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ClockIcon className="h-8 w-8 text-[#246BFD]" />
            <h1 className="text-3xl font-bold text-gray-900">Time Table Upload</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Upload and manage exam time tables for different faculties
          </p>
        </div>

        {/* 1. New Time Table Upload Section - Full Width */}
        <div className="mb-12">
          <TimeTableUploadForm onUploadSuccess={handleUploadSuccess} />
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
                    <p className="text-2xl font-bold text-gray-900">{timeTables.length}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Technological Studies</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {timeTables.filter(tt => tt.faculty === 'Technological Studies').length}
                    </p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">PDF Files</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {timeTables.filter(tt => tt.type === 'pdf').length}
                    </p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Image Files</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {timeTables.filter(tt => tt.type === 'image').length}
                    </p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Past Time Tables List Section - Full Width */}
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="w-full">
            <ExamFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              facultyFilter={facultyFilter}
              onFacultyFilterChange={setFacultyFilter}
              yearFilter={yearFilter}
              onYearFilterChange={setYearFilter}
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
                  {yearFilter && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Year: {yearFilter}
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
              {filteredTimeTables.length === timeTables.length ? (
                `Showing all ${timeTables.length} time table${timeTables.length !== 1 ? 's' : ''}`
              ) : (
                `Showing ${filteredTimeTables.length} of ${timeTables.length} time table${timeTables.length !== 1 ? 's' : ''}`
              )}
            </p>
          </div>

          {/* Time Tables List */}
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
            <TimeTableHistoryList
              timeTables={filteredTimeTables}
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

export default ExamTimeTableUploadPage;