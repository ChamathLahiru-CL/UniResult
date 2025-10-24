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
      navigate(`/admin/compliance/${complaint.id}`);
    }
  };

  const isUnread = !complaint.read;
  const hasReplies = complaint.replies && complaint.replies.length > 0;
  
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
              status={complaint.senderType} 
              size="sm"
            />
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
              {formatDate(complaint.submittedAt)}
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
                {complaint.senderName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {complaint.email}
              </span>
            </div>
          </div>

          {/* ID/Enrollment */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              {complaint.senderType === 'student' ? 'Enrollment ID:' : 'Faculty ID:'}
            </span>
            <span className="text-sm font-mono text-gray-700">
              {complaint.enrollmentId}
            </span>
          </div>

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
                <span>Submitted {formatDate(complaint.submittedAt)}</span>
              </div>
              {hasReplies && (
                <div className="flex items-center gap-1">
                  <ChatBubbleLeftRightIcon className="h-3 w-3" />
                  <span>{complaint.replies.length} reply{complaint.replies.length !== 1 ? 'ies' : ''}</span>
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