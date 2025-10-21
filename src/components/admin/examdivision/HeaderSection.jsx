import React from 'react';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const HeaderSection = ({ onAddMember }) => {
  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Exam Division — Members
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage, review and maintain exam division users
          </p>
        </div>
        
        <button
          onClick={onAddMember}
          className="inline-flex items-center px-4 py-2 bg-[#246BFD] text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add Member
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;