import React from 'react';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const MembersTable = ({ members = [], loading, error, onView, onRemove }) => {
  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!members.length) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No members found</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-red-100 text-red-700',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              University ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Last Active
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {members.map((member) => (
            <tr
              key={member.id}
              className="hover:bg-slate-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                {member.role && (
                  <div className="text-sm text-gray-500">{member.role}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{member.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{member.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{member.universityId}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(member.status || 'active')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {member.lastActiveAt
                    ? format(new Date(member.lastActiveAt), 'MMM d, yyyy')
                    : '—'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onView(member)}
                  className="text-blue-600 hover:text-blue-900 inline-flex items-center mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
                >
                  <EyeIcon className="h-5 w-5" />
                  <span className="sr-only">View details</span>
                </button>
                <button
                  onClick={() => onRemove(member)}
                  className="text-red-600 hover:text-red-900 inline-flex items-center focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-1"
                >
                  <TrashIcon className="h-5 w-5" />
                  <span className="sr-only">Remove member</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;