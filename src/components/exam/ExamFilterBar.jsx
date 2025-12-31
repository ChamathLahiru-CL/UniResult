import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { facultyOptions } from '../../data/mockTimeTables';
import { levelOptions, semesterOptions } from '../../data/mockResults';

const ExamFilterBar = ({
  searchQuery,
  onSearchChange,
  facultyFilter,
  onFacultyFilterChange,
  levelFilter,
  onLevelFilterChange,
  semesterFilter,
  onSemesterFilterChange,
  timeRangeFilter,
  onTimeRangeFilterChange
}) => {
  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' }
  ];

  return (
    <div className="bg-slate-50 p-3 sm:p-4 rounded-md space-y-3">
      {/* Search Input */}
      <div className="relative w-full">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by filename or faculty..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent text-xs sm:text-sm"
        />
      </div>

      {/* Filters - Grid Layout with 2 columns */}
      <div className="flex items-start gap-2 sm:gap-3">
        <FunnelIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 shrink-0 mt-2" />
        
        <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3">
          {/* Faculty Filter */}
          <select
            value={facultyFilter}
            onChange={(e) => onFacultyFilterChange(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent text-xs sm:text-sm bg-white"
          >
            <option value="">All Faculties</option>
            {facultyOptions.map((faculty) => (
              <option key={faculty.value} value={faculty.value}>
                {faculty.label}
              </option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => onLevelFilterChange(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent text-xs sm:text-sm bg-white"
          >
            <option value="">All Levels</option>
            {levelOptions.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            value={semesterFilter}
            onChange={(e) => onSemesterFilterChange(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent text-xs sm:text-sm bg-white"
          >
            <option value="">All Semesters</option>
            {semesterOptions.map((semester) => (
              <option key={semester.value} value={semester.value}>
                {semester.label}
              </option>
            ))}
          </select>

          {/* Time Range Filter */}
          <select
            value={timeRangeFilter}
            onChange={(e) => onTimeRangeFilterChange(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent text-xs sm:text-sm bg-white"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ExamFilterBar;