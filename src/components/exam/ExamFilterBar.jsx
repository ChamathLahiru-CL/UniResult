import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { facultyOptions, yearOptions } from '../../data/mockTimeTables';

const ExamFilterBar = ({
  searchQuery,
  onSearchChange,
  facultyFilter,
  onFacultyFilterChange,
  yearFilter,
  onYearFilterChange,
  timeRangeFilter,
  onTimeRangeFilterChange
}) => {
  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' }
  ];

  return (
    <div className="flex flex-wrap gap-3 items-center justify-between bg-slate-50 p-4 rounded-md">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[250px]">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by filename or faculty..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent text-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <FunnelIcon className="h-5 w-5 text-gray-500" />

        {/* Faculty Filter */}
        <select
          value={facultyFilter}
          onChange={(e) => onFacultyFilterChange(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent text-sm bg-white"
        >
          <option value="">All Faculties</option>
          {facultyOptions.map((faculty) => (
            <option key={faculty.value} value={faculty.value}>
              {faculty.label}
            </option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={yearFilter}
          onChange={(e) => onYearFilterChange(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent text-sm bg-white"
        >
          <option value="">All Years</option>
          {yearOptions.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>

        {/* Time Range Filter */}
        <select
          value={timeRangeFilter}
          onChange={(e) => onTimeRangeFilterChange(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent text-sm bg-white"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ExamFilterBar;