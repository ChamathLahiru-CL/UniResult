import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  UserIcon, 
  EnvelopeIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import StatusBadge from '../../components/admin/compliance/StatusBadge';
import ReplyForm from '../../components/admin/compliance/ReplyForm';
import ComplianceDetailView from '../../components/admin/compliance/ComplianceDetailView';
import { complaintsAPI } from '../../utils/complaintsAPI';

const ComplianceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    unread: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchComplaintDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await complaintsAPI.getComplaintById(id);
      setComplaint(data);
      
      // Mark as read if not already read
      if (!data.isRead) {
        await complaintsAPI.markAsRead(id);
        setComplaint(prev => ({ ...prev, isRead: true }));
      }
    } catch (err) {
      setError('Failed to load complaint details. Please try again.');
      console.error('Error fetching complaint detail:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await complaintsAPI.getComplaintStats();
      setStats(response.data || response);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintDetail();
    fetchStats();
  }, [fetchComplaintDetail]);

  const handleReplySubmit = async (replyData) => {
    try {
      const updatedComplaint = await complaintsAPI.addReply(id, replyData);
      setComplaint(updatedComplaint);
      setShowReplyForm(false);
    } catch (err) {
      console.error('Error adding reply:', err);
      // Handle error - could show notification
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedComplaint = await complaintsAPI.updateStatus(id, newStatus);
      setComplaint(updatedComplaint);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPDF(true);
      await complaintsAPI.downloadPDF(id);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/admin/compliance')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Compliance
        </button>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            {error || 'Complaint Not Found'}
          </h2>
          <p className="text-red-600 text-sm mb-4">
            {error || 'The requested complaint could not be found or may have been removed.'}
          </p>
          <button
            onClick={() => navigate('/admin/compliance')}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Return to Compliance Management
          </button>
        </div>
      </div>
    );
  }

  // Adapt to database field names - after error checks
  const isStudent = complaint?.submitterType === 'student';
  const senderName = complaint?.submitterName || complaint?.studentName || 'Unknown';
  const email = complaint?.submitterEmail || complaint?.studentEmail || '';
  const enrollmentId = complaint?.submitterIndexNumber || complaint?.studentIndexNumber || '';
  const submittedDate = complaint?.createdAt || complaint?.submittedAt;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/admin/compliance')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="text-sm sm:text-base">Back to Compliance</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statsLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border animate-pulse">
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-lg p-3 w-12 h-12"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="bg-orange-50 rounded-lg p-3">
                  <ClockIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="bg-green-50 rounded-lg p-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="bg-red-50 rounded-lg p-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Complaint Detail Section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Complaint #{complaint._id.slice(-8)}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">
                  Submitted {new Date(submittedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <StatusBadge status={complaint.status} />
            </div>
          </div>
          
          {/* Action Buttons - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download as PDF"
            >
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="whitespace-nowrap">{downloadingPDF ? 'Downloading...' : 'Download PDF'}</span>
            </button>
            
            <select
              value={complaint.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm w-full sm:w-auto"
            >
              <option value="pending">Pending</option>
              <option value="in-review">In Review</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            {!showReplyForm && (
              <button
                onClick={() => setShowReplyForm(true)}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 flex-shrink-0" />
                <span>Reply</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Complaint Details */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <ComplianceDetailView complaint={complaint} />
          
          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4 sm:mt-6">
              <ReplyForm
                onSubmit={handleReplySubmit}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          {/* Complainant Information */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {isStudent ? 'Student Information' : 'Division Information'}
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <UserIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 break-words">{senderName}</p>
                  <p className="text-xs text-gray-500">Name</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 break-all">{email}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>

              {enrollmentId && (
                <div className="flex items-start gap-3">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 break-words">{enrollmentId}</p>
                    <p className="text-xs text-gray-500">{isStudent ? 'Enrollment ID' : 'ID'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Attachments</h3>
              
              <div className="space-y-2">
                {complaint.attachments.map((attachment, index) => (
                  <div key={index} className="flex gap-2">
                    <a 
                      href={`http://localhost:5000${attachment.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                    >
                      View
                    </a>
                    <a 
                      href={`http://localhost:5000${attachment.url}`}
                      download
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Activity Timeline</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">Complaint submitted</p>
                  <p className="text-xs text-gray-500 break-words">
                    {new Date(submittedDate).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {complaint.isRead && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">Marked as read</p>
                    <p className="text-xs text-gray-500">
                      {complaint.readBy && complaint.readBy.length > 0 ? 'Recently' : 'Just now'}
                    </p>
                  </div>
                </div>
              )}

              {complaint.response && complaint.response.message && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 break-words">Admin reply sent by {complaint.response.respondedByName}</p>
                    <p className="text-xs text-gray-500 break-words">
                      {new Date(complaint.response.respondedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDetailPage;