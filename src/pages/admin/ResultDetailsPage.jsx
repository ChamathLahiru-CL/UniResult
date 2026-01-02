import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  UserIcon,
  DocumentChartBarIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  BookOpenIcon,
  HashtagIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const ResultDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch result details from API
  useEffect(() => {
    const fetchResultDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/results/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Result not found');
          } else {
            throw new Error('Failed to fetch result details');
          }
          return;
        }

        const resultData = await response.json();

        if (resultData.success) {
          setResult(resultData.data);
        } else {
          setError(resultData.message || 'Failed to load result details');
        }
      } catch (err) {
        console.error('Error fetching result details:', err);
        setError(err.message || 'Failed to load result details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResultDetails();
    }
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/results')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DocumentChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-800">Result Upload Details</h1>
                <p className="text-gray-600 mt-1">Loading result details...</p>
              </div>
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
            <button
              onClick={() => navigate('/admin/results')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-800">Result Not Found</h1>
                <p className="text-gray-600 mt-1">Unable to load result details</p>
              </div>
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
                Error loading result
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/admin/results')}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Back to Results</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <DocumentChartBarIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Result not found</h3>
          <p className="text-gray-600 mb-4">The requested result upload could not be found.</p>
          <button
            onClick={() => navigate('/admin/results')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Results</span>
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'processing':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'EEEE, MMMM dd, yyyy');
  };

  const handleViewPdf = () => {
    if (result.fileUrl) {
      // Open PDF in new tab
      window.open(`http://localhost:5000${result.fileUrl}`, '_blank');
    }
  };

  const handleDownloadPdf = () => {
    if (result.fileUrl) {
      const link = document.createElement('a');
      link.href = `http://localhost:5000${result.fileUrl}`;
      link.download = result.originalFileName || 'result.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/results')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DocumentChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-800">Result Upload Details</h1>
                <p className="text-gray-600 mt-1">Comprehensive view of result upload #{result.id}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDownloadPdf}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button 
              onClick={handleViewPdf}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <EyeIcon className="h-4 w-4" />
              <span>View PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Information */}
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Upload Information</h2>
              <div className="flex items-center space-x-2">
                {getStatusIcon(result.parseStatus)}
                <span className={getStatusBadge(result.parseStatus)}>
                  {result.parseStatus.charAt(0).toUpperCase() + result.parseStatus.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Upload Date</p>
                    <p className="font-medium text-gray-900">{formatDate(result.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Degree Program</p>
                    <p className="font-medium text-gray-900">{result.degree}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BookOpenIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Subject</p>
                    <p className="font-medium text-gray-900">{result.subject}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <HashtagIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Academic Level</p>
                    <p className="font-medium text-gray-900">{result.level} Level</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <HashtagIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Semester</p>
                    <p className="font-medium text-gray-900">Semester {result.semester}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DocumentChartBarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">File Information</p>
                    <p className="font-medium text-gray-900">{result.fileSize}</p>
                    <p className="text-sm text-gray-500">Upload time: {result.uploadTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Result Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{result.statistics.totalStudents}</p>
                <p className="text-sm text-blue-700">Total Students</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{result.statistics.passedStudents}</p>
                <p className="text-sm text-green-700">Passed</p>
                <p className="text-xs text-green-600">
                  {((result.statistics.passedStudents / result.statistics.totalStudents) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-900">{result.statistics.failedStudents}</p>
                <p className="text-sm text-red-700">Failed</p>
                <p className="text-xs text-red-600">
                  {((result.statistics.failedStudents / result.statistics.totalStudents) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-900">{result.statistics.averageGrade}%</p>
                <p className="text-sm text-yellow-700">Average Grade</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-900">{result.statistics.highestGrade}%</p>
                <p className="text-sm text-purple-700">Highest Grade</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{result.statistics.lowestGrade}%</p>
                <p className="text-sm text-gray-700">Lowest Grade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Uploader Information */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded By</h3>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <Link 
                  to={`/admin/exam-division/${result.uploadedBy.memberId}`}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {result.uploadedBy.name}
                </Link>
                <p className="text-sm text-gray-500">Exam Division Member</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <HashtagIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Member ID</p>
                  <p className="font-medium text-gray-900">{result.uploadedBy.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{result.uploadedBy.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium text-gray-900">{result.uploadedBy.department}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to={`/admin/exam-division/${result.uploadedBy.memberId}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button 
                onClick={handleViewPdf}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <EyeIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">View PDF</span>
              </button>

              <button 
                onClick={handleDownloadPdf}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Download PDF</span>
              </button>

              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChartBarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Generate Report</span>
              </button>
            </div>
          </div>

          {/* Related Results */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Results</h3>
            <p className="text-sm text-gray-600">Other uploads from this uploader or subject will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDetailsPage;