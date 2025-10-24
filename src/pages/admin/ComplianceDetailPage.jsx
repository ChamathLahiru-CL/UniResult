import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  UserIcon, 
  EnvelopeIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon
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

  const fetchComplaintDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await complaintsAPI.getComplaintById(id);
      setComplaint(data);
      
      // Mark as read if not already read
      if (!data.read) {
        await complaintsAPI.markAsRead(id);
        setComplaint(prev => ({ ...prev, read: true }));
      }
    } catch (err) {
      setError('Failed to load complaint details. Please try again.');
      console.error('Error fetching complaint detail:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComplaintDetail();
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
      // Handle error - could show notification
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

  const isStudent = complaint.type === 'student';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/compliance')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Compliance
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Complaint #{complaint.id}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  Submitted {new Date(complaint.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <StatusBadge status={complaint.status} />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={complaint.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="in-review">In Review</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            {!showReplyForm && (
              <button
                onClick={() => setShowReplyForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Details */}
        <div className="lg:col-span-2">
          <ComplianceDetailView complaint={complaint} />
          
          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-6">
              <ReplyForm
                onSubmit={handleReplySubmit}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Complainant Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isStudent ? 'Student Information' : 'Division Information'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{complaint.senderName}</p>
                  <p className="text-xs text-gray-500">Name</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{complaint.email}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>

              {isStudent ? (
                <div className="flex items-center gap-3">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{complaint.enrollmentId}</p>
                    <p className="text-xs text-gray-500">Enrollment ID</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <BuildingOffice2Icon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{complaint.department}</p>
                    <p className="text-xs text-gray-500">Department</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
              
              <div className="space-y-3">
                {complaint.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <PaperClipIcon className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{attachment.size}</p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Complaint submitted</p>
                  <p className="text-xs text-gray-500">
                    {new Date(complaint.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {complaint.read && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Marked as read</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
              )}

              {complaint.replies && complaint.replies.map((reply, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Admin reply sent</p>
                    <p className="text-xs text-gray-500">
                      {new Date(reply.sentAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDetailPage;