import React from 'react';
import { 
  ClockIcon, 
  UserGroupIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const AnnouncementCard = ({ 
  announcement, 
  isExpanded, 
  onToggleExpanded, 
  maxPreviewLength = 120 
}) => {
  const getAudienceConfig = (audience) => {
    const configs = {
      students: {
        label: 'Students',
        bgClass: 'bg-yellow-50',
        borderClass: 'border-yellow-400',
        badgeClass: 'bg-yellow-100 text-yellow-800',
        iconColor: 'text-yellow-600'
      },
      exam: {
        label: 'Exam Division',
        bgClass: 'bg-blue-50',
        borderClass: 'border-blue-600',
        badgeClass: 'bg-blue-100 text-blue-800',
        iconColor: 'text-blue-600'
      },
      all: {
        label: 'All Users',
        bgClass: 'bg-green-50',
        borderClass: 'border-green-600',
        badgeClass: 'bg-green-100 text-green-800',
        iconColor: 'text-green-600'
      }
    };
    return configs[audience] || configs.all;
  };

  const truncateMessage = (message, maxLength) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const audienceConfig = getAudienceConfig(announcement.audience);
  const needsTruncation = announcement.message.length > maxPreviewLength;

  return (
    <div 
      className={`${audienceConfig.bgClass} ${audienceConfig.borderClass} border-l-4 rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-2 leading-tight">
            {announcement.topic}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <UserGroupIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{announcement.by}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {format(new Date(announcement.timestamp), 'MMM dd, yyyy • h:mm a')}
              </span>
            </div>
          </div>
        </div>
        <span className={`${audienceConfig.badgeClass} text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-3`}>
          {audienceConfig.label}
        </span>
      </div>

      {/* Message */}
      <div className="mb-3">
        <p className="text-slate-700 leading-relaxed">
          {isExpanded 
            ? announcement.message 
            : truncateMessage(announcement.message, maxPreviewLength)
          }
        </p>
      </div>

      {/* Toggle Button */}
      {needsTruncation && (
        <button
          onClick={() => onToggleExpanded(announcement.id)}
          className="inline-flex items-center space-x-1 text-sm text-[#246BFD] hover:text-blue-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#246BFD] focus:ring-offset-2 rounded-md px-1 py-0.5"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Show less content' : 'Show more content'}
        >
          {isExpanded ? (
            <>
              <EyeSlashIcon className="h-4 w-4" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <EyeIcon className="h-4 w-4" />
              <span>Read More</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AnnouncementCard;