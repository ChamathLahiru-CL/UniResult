import React, { useMemo } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// Updated departments and degrees based on requirements
const departments = [
  { id: 'ICT', name: 'ICT' },
  { id: 'CST', name: 'CST' },
  { id: 'EET', name: 'EET' },
  { id: 'BBST', name: 'BBST' },
  { id: 'BBA', name: 'BBA' },
  { id: 'Technological Studies', name: 'Technological Studies' },
  { id: 'Applied Science', name: 'Applied Science' },
  { id: 'Medicine', name: 'Medicine' },
  { id: 'Agriculture', name: 'Agriculture' },
  { id: 'Finance', name: 'Finance' }
];

const degrees = {
  'ICT': [
    'BSc in Computer Science',
    'BSc in IT',
    'BSc in Software Engineering',
    'BSc in Information Systems'
  ],
  'CST': [
    'BSc in Computer Science & Technology',
    'BSc in Data Science',
    'BSc in Artificial Intelligence'
  ],
  'EET': [
    'BSc in Electrical Engineering',
    'BSc in Electronic Engineering',
    'BSc in Telecommunication Engineering'
  ],
  'BBST': [
    'BSc in Business Studies',
    'BSc in Business Information Systems',
    'BSc in Business Analytics'
  ],
  'BBA': [
    'BBA in Marketing',
    'BBA in Finance',
    'BBA in Human Resources',
    'BBA in Operations Management'
  ],
  'Technological Studies': [
    'BSc in Technology Management',
    'BSc in Industrial Technology',
    'BSc in Manufacturing Technology'
  ],
  'Applied Science': [
    'BSc in Applied Physics',
    'BSc in Applied Chemistry',
    'BSc in Applied Mathematics'
  ],
  'Medicine': [
    'MBBS',
    'BSc in Nursing',
    'BSc in Medical Technology'
  ],
  'Agriculture': [
    'BSc in Agriculture',
    'BSc in Agricultural Technology',
    'BSc in Food Science'
  ],
  'Finance': [
    'BSc in Finance',
    'BSc in Banking & Finance',
    'BSc in Financial Management'
  ]
};

const FilterBar = ({ filters, onFilterChange, onDownload, totalStudents }) => {
  const years = ["1", "2", "3", "4"];

  const availableDegrees = useMemo(() => {
    if (!filters.faculty) return [];
    return degrees[filters.faculty] || [];
  }, [filters.faculty]);

  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Search by name or enrollment number..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Filters:</span>
          </div>

          {/* Year Filter */}
          <select
            value={filters.year}
            onChange={(e) => onFilterChange('year', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>

          {/* Faculty Filter */}
          <select
            value={filters.faculty}
            onChange={(e) => {
              onFilterChange('faculty', e.target.value);
              onFilterChange('degree', ''); // Reset degree when faculty changes
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>

          {/* Degree Filter */}
          <select
            value={filters.degree}
            onChange={(e) => onFilterChange('degree', e.target.value)}
            disabled={!filters.faculty}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">All Degrees</option>
            {availableDegrees.map((degree) => (
              <option key={degree} value={degree}>
                {degree}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>

          {/* Clear Filters */}
          {(filters.year || filters.faculty || filters.degree || filters.status || filters.search) && (
            <button
              onClick={() => {
                onFilterChange('year', '');
                onFilterChange('faculty', '');
                onFilterChange('degree', '');
                onFilterChange('status', '');
                onFilterChange('search', '');
              }}
              className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}

          {/* Download Report Button */}
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors text-sm"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>Showing {totalStudents} students</span>
          {(filters.search || filters.faculty || filters.year || filters.degree || filters.status) && (
            <span className="text-blue-600">• Filters applied</span>
          )}
        </div>
        
        {/* Show recently registered indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs">New (Last 7 days)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;