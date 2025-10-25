import React, { useState, useMemo } from 'react';
import { 
  DocumentChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import ResultTable from '../../components/admin/results/ResultTable';
import { 
  mockResultUploads, 
  degreeOptions, 
  levelOptions, 
  semesterOptions, 
  statusOptions 
} from '../../data/mockResultUploads';

const AdminStudentResultPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    degree: 'all',
    level: 'all',
    semester: 'all',
    status: 'all'
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'date',
    direction: 'desc'
  });

  // Filter and search results
  const filteredResults = useMemo(() => {
    let filtered = mockResultUploads;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(result => 
        result.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.uploadedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.uploadedBy.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.degree !== 'all') {
      filtered = filtered.filter(result => result.degree === filters.degree);
    }
    if (filters.level !== 'all') {
      filtered = filtered.filter(result => result.level.toString() === filters.level);
    }
    if (filters.semester !== 'all') {
      filtered = filtered.filter(result => result.semester.toString() === filters.semester);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(result => result.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];

      // Handle nested fields
      if (sortConfig.field.includes('.')) {
        const fields = sortConfig.field.split('.');
        aValue = fields.reduce((obj, field) => obj[field], a);
        bValue = fields.reduce((obj, field) => obj[field], b);
      }

      // Handle date sorting
      if (sortConfig.field === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, filters, sortConfig]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalStudents = filteredResults.reduce((acc, result) => acc + result.statistics.totalStudents, 0);
    const averageGrade = filteredResults.length > 0 
      ? (filteredResults.reduce((acc, result) => acc + result.statistics.averageGrade, 0) / filteredResults.length).toFixed(1)
      : 0;
    const completedUploads = filteredResults.filter(result => result.status === 'completed').length;
    
    return {
      totalUploads: filteredResults.length,
      totalStudents,
      averageGrade,
      completedUploads
    };
  }, [filteredResults]);

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      degree: 'all',
      level: 'all',
      semester: 'all',
      status: 'all'
    });
    setSearchTerm('');
  };

  const exportToExcel = () => {
    // Create CSV content
    const headers = ['Date', 'Degree', 'Subject', 'Level', 'Semester', 'Uploader', 'Uploader ID', 'Total Students', 'Average Grade', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredResults.map(result => [
        new Date(result.date).toISOString().split('T')[0],
        result.degree,
        `"${result.subject}"`,
        result.level,
        result.semester,
        `"${result.uploadedBy.name}"`,
        result.uploadedBy.id,
        result.statistics.totalStudents,
        result.statistics.averageGrade,
        result.status
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `student_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DocumentChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">Student Result Management</h1>
              <p className="text-gray-600 mt-1">Monitor and manage result uploads from Exam Division</p>
            </div>
          </div>
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Uploads</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalUploads}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DocumentChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalStudents}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Grade</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.averageGrade}%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.completedUploads}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Filters & Search</h3>
          </div>
          {(filters.degree !== 'all' || filters.level !== 'all' || filters.semester !== 'all' || filters.status !== 'all' || searchTerm) && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by subject, degree, or uploader..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Degree Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
            <select
              value={filters.degree}
              onChange={(e) => handleFilterChange('degree', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {degreeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {levelOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select
              value={filters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {semesterOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.degree !== 'all' || filters.level !== 'all' || filters.semester !== 'all' || filters.status !== 'all' || searchTerm) && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Search: "{searchTerm}"
              </span>
            )}
            {filters.degree !== 'all' && (
              <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                {degreeOptions.find(opt => opt.value === filters.degree)?.label}
              </span>
            )}
            {filters.level !== 'all' && (
              <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Level {filters.level}
              </span>
            )}
            {filters.semester !== 'all' && (
              <span className="inline-flex px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                Semester {filters.semester}
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                {statusOptions.find(opt => opt.value === filters.status)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredResults.length} of {mockResultUploads.length} result uploads
        </p>
      </div>

      {/* Results Table */}
      <ResultTable 
        results={filteredResults}
        onSort={handleSort}
        sortConfig={sortConfig}
      />
    </div>
  );
};

export default AdminStudentResultPage;