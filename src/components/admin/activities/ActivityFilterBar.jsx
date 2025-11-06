import React from 'react';
import { FunnelIcon, ClockIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ACTIVITY_TYPES, activityLabels } from '../../../data/mockActivities';

const ActivityFilterBar = ({ filters, onFilterChange, activityStats }) => {
  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const statusFilters = [
    { value: 'all', label: 'All Status', icon: null },
    { value: 'NEW', label: 'New', icon: ExclamationTriangleIcon },
    { value: 'READ', label: 'Read', icon: CheckCircleIcon },
    { value: 'CRITICAL', label: 'Critical', icon: ExclamationTriangleIcon }
  ];

  const typeFilters = [
    { value: 'all', label: 'All Types' },
    ...Object.values(ACTIVITY_TYPES).map(type => ({
      value: type,
      label: activityLabels[type]
    }))
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{activityStats.total}</p>
          <p className="text-sm text-blue-600">Total Activities</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{activityStats.new}</p>
          <p className="text-sm text-red-600">New</p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <p className="text-2xl font-bold text-orange-600">{activityStats.critical}</p>
          <p className="text-sm text-orange-600">Critical</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{activityStats.today}</p>
          <p className="text-sm text-green-600">Today</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">Filters:</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Time Filter */}
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <select
              value={filters.timeRange}
              onChange={(e) => onFilterChange('timeRange', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            >
              {timeFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {typeFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          {/* Clear Filters */}
          {(filters.timeRange !== 'all' || filters.type !== 'all' || filters.status !== 'all' || filters.priority !== 'all') && (
            <button
              onClick={() => onFilterChange('clear')}
              className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.timeRange !== 'all' || filters.type !== 'all' || filters.status !== 'all' || filters.priority !== 'all') && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <span>Active filters:</span>
          <div className="flex gap-2">
            {filters.timeRange !== 'all' && (
              <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {timeFilters.find(f => f.value === filters.timeRange)?.label}
              </span>
            )}
            {filters.type !== 'all' && (
              <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                {activityLabels[filters.type]}
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {filters.status}
              </span>
            )}
            {filters.priority !== 'all' && (
              <span className="inline-flex px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                {filters.priority} Priority
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFilterBar;