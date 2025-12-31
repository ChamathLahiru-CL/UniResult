import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const SearchMembers = ({
  onSearch,
  onStatusFilter,
  onRoleFilter,
  statusFilter,
  roleFilter
}) => {
  const roles = [
    'All',
    'Exam Officer',
    'Senior Coordinator',
    'Coordinator',
    'Assistant Coordinator'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="relative">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, mobile or role..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id="role"
            value={roleFilter}
            onChange={(e) => onRoleFilter(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {roles.map(role => (
              <option key={role} value={role.toLowerCase()}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};