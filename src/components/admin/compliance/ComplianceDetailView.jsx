import React from 'react';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';

const ComplianceDetailView = ({ complaint }) => {
  if (!complaint) return null;

  return (
    <div className="space-y-6">
      {/* Main Complaint Content */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {complaint.topic}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Category: {complaint.category}</span>
            <span>Priority: {complaint.priority}</span>
            {!complaint.read && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Unread
              </span>
            )}
          </div>
        </div>

        <div className="prose max-w-none">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Complaint Details:</h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        {complaint.additionalInfo && (
          <div className="mt-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Additional Information:</h4>
              <p className="text-blue-800 text-sm whitespace-pre-wrap">
                {complaint.additionalInfo}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Replies Section */}
      {complaint.replies && complaint.replies.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Admin Replies ({complaint.replies.length})
          </h3>
          
          <div className="space-y-4">
            {complaint.replies.map((reply, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {reply.adminName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {reply.adminRole}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(reply.sentAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {reply.message}
                  </p>
                </div>

                {reply.attachments && reply.attachments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {reply.attachments.map((attachment, attachIndex) => (
                        <button
                          key={attachIndex}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                        >
                          📎 {attachment.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Replies State */}
      {(!complaint.replies || complaint.replies.length === 0) && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No replies yet</h3>
            <p className="text-sm text-gray-500">
              This complaint hasn't received any admin responses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceDetailView;