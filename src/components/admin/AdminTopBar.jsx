import React from 'react';
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';

const AdminTopBar = ({ onMenuClick }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="text-gray-600 lg:hidden focus:outline-none"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">UniResult Admin Home</h1>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Lahiru</span>
            <button className="flex items-center focus:outline-none">
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
            </button>
          </div>
          <button className="text-sm text-gray-600 hover:text-gray-800">LogOut</button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
