import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  EyeIcon, 
  ClockIcon, 
  UserIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import StatusBadge from '../../ui/StatusBadge';
import { formatDate } from '../../../utils/formatDate';

const ComplaintListCard = ({ complaint, onClick }) => {
  const navigate = useNavigate();
  
  const handleViewMore = () => {
    if (onClick) {
      onClick(complaint);
    } else {
      // Use MongoDB _id for navigation
      navigate(`/admin/compliance/${complaint._id}`);
    }
  };

  // Adapt to database field names
  const isUnread = !complaint.isRead;
  const hasReplies = complaint.response && complaint.response.message;
  const complaintStatus = complaint.status || 'pending';
  
  // Get sender information - use submitter fields or fallback to legacy student fields
  const senderName = complaint.submitterName || complaint.studentName || 'Unknown';
  const senderEmail = complaint.submitterEmail || complaint.studentEmail || '';
  const senderType = complaint.submitterType || 'student';
  const enrollmentId = complaint.submitterIndexNumber || complaint.studentIndexNumber || complaint.submitterEmail || '';
  const submittedDate = complaint.createdAt || complaint.submittedAt;

  // Get status badge colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in-review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending':
        return 'Pending';
      case 'in-review':
        return 'In Review';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
      default:
        return 'Pending';
    }
  };
  
  return (
    <div 
      className={`rounded-lg shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer ${
        isUnread
          ? 'bg-blue-50 border-l-4 border-blue-500 border border-blue-200'
          : 'bg-white border border-slate-200 hover:border-slate-300'
      }`}
      onClick={handleViewMore}
    >
      <div className="p-6">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge 
              status={senderType} 
              size="sm"
            />
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(complaintStatus)}`}>
              {getStatusLabel(complaintStatus)}
            </span>
            {isUnread && (
              <StatusBadge 
                status="new" 
                size="sm"
              />
            )}
            {hasReplies && (
              <StatusBadge 
                status="replied" 
                size="sm"
              />
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {formatDate(submittedDate)}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-3">
          {/* Sender info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-900">
                {senderName}
              </span>
            </div>
            {senderEmail && (
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {senderEmail}
                </span>
              </div>
            )}
          </div>

          {/* ID/Enrollment */}
          {enrollmentId && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                {senderType === 'student' ? 'Enrollment ID:' : 'ID:'}
              </span>
              <span className="text-sm font-mono text-gray-700">
                {enrollmentId}
              </span>
            </div>
          )}

          {/* Topic */}
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${
              isUnread ? 'text-blue-900' : 'text-gray-900'
            }`}>
              {complaint.topic}
            </h3>
          </div>

          {/* Message preview */}
          <div>
            <p className="text-gray-600 text-sm line-clamp-2">
              {complaint.message.length > 150 
                ? `${complaint.message.substring(0, 150)}...`
                : complaint.message
              }
            </p>
          </div>

          {/* Footer with actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                <span>Submitted {formatDate(submittedDate)}</span>
              </div>
              {hasReplies && (
                <div className="flex items-center gap-1">
                  <ChatBubbleLeftRightIcon className="h-3 w-3" />
                  <span>Replied</span>
                </div>
              )}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewMore();
              }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                isUnread
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-[#246BFD] text-white hover:bg-blue-600'
              }`}
            >
              <EyeIcon className="h-4 w-4" />
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintListCard;