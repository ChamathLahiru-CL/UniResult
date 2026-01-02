import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  DocumentChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import ResultTable from '../../components/admin/results/ResultTable';
import { degreeOptions, levelOptions, semesterOptions, statusOptions } from '../../data/mockResultUploads';

const AdminStudentResultPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);

  const scrollTableLeft = () => {
    if (tableRef.current) {
      tableRef.current.scrollLeft();
    }
  };

  const scrollTableRight = () => {
    if (tableRef.current) {
      tableRef.current.scrollRight();
    }
  };
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
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch results from API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch('http://localhost:5000/api/results', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const result = await response.json();

        if (result.success) {
          // Transform backend data to match frontend expectations
          const transformedResults = result.data.map(item => {
            // Extract semester number from semester string (e.g., "1st Semester" -> 1)
            const semesterMatch = item.semester.match(/(\d+)/);
            const semesterNumber = semesterMatch ? parseInt(semesterMatch[1]) : 1;

            return {
              id: item._id,
              subject: item.courseCode
                ? `${item.courseCode} - ${item.subjectName}`
                : item.subjectName,
              degree: item.degreeProgram || `${item.faculty} - ${item.department}`,
              year: item.academicYear || new Date(item.createdAt).getFullYear().toString(),
              semester: semesterNumber,
              uploadedBy: {
                name: item.uploadedByName || 'Unknown User',
                id: item.uploadedByUsername || 'Unknown',
                memberId: item.uploadedBy?._id?.toString() || 'Unknown',
                email: item.uploadedByEmail || 'unknown@example.com',
                department: item.department || 'Unknown'
              },
              statistics: {
                totalStudents: item.resultCount || 0,
                passedStudents: 0, // Will be calculated when viewing details
                failedStudents: 0, // Will be calculated when viewing details
                averageGrade: 0, // Will be calculated when viewing details
                highestGrade: 0, // Will be calculated when viewing details
                lowestGrade: 0 // Will be calculated when viewing details
              },
              status: item.parseStatus || 'pending',
              fileSize: 'Unknown', // Will be calculated when viewing details
              uploadTime: 'Unknown', // Will be calculated when viewing details
              date: item.createdAt,
              faculty: item.faculty,
              department: item.department,
              level: parseInt(item.level) || 100,
              courseCode: item.courseCode,
              subjectName: item.subjectName,
              fileUrl: item.fileUrl,
              parseStatus: item.parseStatus,
              isDeleted: item.isDeleted || false,
              deletedAt: item.deletedAt,
              deletedBy: item.deletedByName,
              deletedByUsername: item.deletedByUsername
            };
          });

          setResults(transformedResults);
        } else {
          setError(result.message || 'Failed to load results');
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Filter and search results
  const filteredResults = useMemo(() => {
    let filtered = results;

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
  }, [results, searchTerm, filters, sortConfig]);

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

  const handleDeleteResult = (result) => {
    setDeleteConfirm(result);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/results/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete result');
      }

      const result = await response.json();
      if (result.success) {
        // Mark the result as deleted in local state instead of removing it
        setResults(prev => prev.map(r => 
          r.id === deleteConfirm.id 
            ? { 
                ...r, 
                isDeleted: true, 
                deletedAt: new Date().toISOString(),
                deletedBy: result.data?.deletedByName || 'Admin',
                deletedByUsername: result.data?.deletedByUsername || 'admin'
              }
            : r
        ));
        setDeleteConfirm(null);
        // Could add a success notification here
      } else {
        setError(result.message || 'Failed to delete result');
      }
    } catch (err) {
      console.error('Error deleting result:', err);
      setError(err.message || 'Failed to delete result');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
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

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DocumentChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">Student Result Management</h1>
              <p className="text-gray-600 mt-1">Loading result uploads...</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">Student Result Management</h1>
              <p className="text-gray-600 mt-1">Unable to load result uploads</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading results
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          Showing {filteredResults.length} of {results.length} result uploads
        </p>
      </div>

      {/* Results Table */}
      <ResultTable 
        ref={tableRef}
        results={filteredResults}
        onSort={handleSort}
        sortConfig={sortConfig}
        onDelete={handleDeleteResult}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Delete Result Upload
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 text-center">
                  Are you sure you want to delete the result upload for <strong>{deleteConfirm.subject}</strong>?
                  <br />
                  <br />
                  <span className="text-red-600 font-medium">
                    This action cannot be undone. All associated student results will be permanently deleted from the database.
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <button
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {deleting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Scroll Controls */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg border p-3">
          <button 
            onClick={scrollTableLeft}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            title="Scroll table left"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={scrollTableRight}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            title="Scroll table right"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentResultPage;