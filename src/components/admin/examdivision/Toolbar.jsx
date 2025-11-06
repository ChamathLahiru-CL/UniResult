import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Toolbar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchQuery || '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(localSearchValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchValue, onSearchChange]);

  const handleSearchChange = (e) => {
    setLocalSearchValue(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={localSearchValue}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={`${sortBy.field}-${sortBy.direction}`}
          onChange={(e) => {
            const [field, direction] = e.target.value.split('-');
            onSortChange({ field, direction });
          }}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="lastActiveAt-desc">Last Active</option>
        </select>
      </div>
    </div>
  );
};

export default Toolbar;