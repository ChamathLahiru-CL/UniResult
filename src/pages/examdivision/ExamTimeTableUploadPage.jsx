import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import TimeTableUploadForm from '../../components/exam/TimeTableUploadForm';
import TimeTableHistoryList from '../../components/exam/TimeTableHistoryList';
import FilePreviewModal from '../../components/exam/FilePreviewModal';
import ExamFilterBar from '../../components/exam/ExamFilterBar';
import { mockTimeTables } from '../../data/mockTimeTables';
import { getRelativeTimeFilter } from '../../utils/formatDate';

const ExamTimeTableUploadPage = () => {
  const [timeTables, setTimeTables] = useState(mockTimeTables);
  const [filteredTimeTables, setFilteredTimeTables] = useState(mockTimeTables);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [timeRangeFilter, setTimeRangeFilter] = useState('all');

  // Filter time tables whenever filters change
  useEffect(() => {
    let filtered = [...timeTables];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(timeTable => 
        timeTable.fileName.toLowerCase().includes(query) ||
        timeTable.faculty.toLowerCase().includes(query) ||
        timeTable.uploadedBy.toLowerCase().includes(query)
      );
    }

    // Faculty filter
    if (facultyFilter) {
      filtered = filtered.filter(timeTable => timeTable.faculty === facultyFilter);
    }

    // Time range filter
    const timeFilter = getRelativeTimeFilter(timeRangeFilter);
    filtered = filtered.filter(timeTable => timeFilter(timeTable.uploadedAt));

    // Sort by upload date (newest first)
    filtered.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    setFilteredTimeTables(filtered);
  }, [timeTables, searchQuery, facultyFilter, timeRangeFilter]);

  const handleUploadSuccess = (newTimeTable) => {
    setTimeTables(prev => [newTimeTable, ...prev]);
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
    setTimeRangeFilter('all');
  };

  const hasActiveFilters = searchQuery || facultyFilter || timeRangeFilter !== 'all';

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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Upload Form - Left Side */}
          <div className="lg:col-span-2">
            <TimeTableUploadForm onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* History List - Right Side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filter Bar */}
            <div className="flex items-center justify-between">
              <ExamFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                facultyFilter={facultyFilter}
                onFacultyFilterChange={setFacultyFilter}
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
            <TimeTableHistoryList 
              timeTables={filteredTimeTables}
              onPreview={handlePreview}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">ICT Faculty</p>
                <p className="text-2xl font-bold text-gray-900">
                  {timeTables.filter(tt => tt.faculty === 'ICT').length}
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