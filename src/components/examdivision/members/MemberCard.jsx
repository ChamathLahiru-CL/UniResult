import React from 'react';
import { isActiveMember } from '../../../utils/memberUtils';
import { format } from 'date-fns';

export const MemberCard = ({ member, onViewMore }) => {
  const isActive = isActiveMember(member.lastActivity);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
          <p className="text-gray-600 text-sm">{member.mobile}</p>
        </div>
        <span className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
        `}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Role:</span>
          <span className="ml-2">{member.role}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Latest Activity:</span>
          <span className="ml-2 text-xs">
            {format(new Date(member.lastActivity), 'MMM d, yyyy h:mm a')}
          </span>
        </div>
      </div>

      <button
        onClick={() => onViewMore(member)}
        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        View More
      </button>
    </div>
  );
};