import React, { useState } from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  BookOpenIcon,
  HashtagIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import ResultRow from './ResultRow';

const ResultTable = ({ results, onSort, sortConfig }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getSortIcon = (field) => {
    if (sortConfig.field === field) {
      return sortConfig.direction === 'asc' ? 
        <ChevronUpIcon className="h-4 w-4" /> : 
        <ChevronDownIcon className="h-4 w-4" />;
    }
    return <ChevronUpIcon className="h-4 w-4 opacity-0 group-hover:opacity-50" />;
  };

  const SortableHeader = ({ field, children, icon: Icon }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-100 cursor-pointer select-none group hover:bg-slate-200 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="h-4 w-4 text-slate-500" />}
        <span>{children}</span>
        <div className="flex items-center">
          {getSortIcon(field)}
        </div>
      </div>
    </th>
  );

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpenIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">No result uploads match your current filters. Try adjusting your search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <SortableHeader field="date" icon={CalendarDaysIcon}>
                Upload Date
              </SortableHeader>
              <SortableHeader field="faculty" icon={AcademicCapIcon}>
                Faculty
              </SortableHeader>
              <SortableHeader field="degree" icon={AcademicCapIcon}>
                Degree
              </SortableHeader>
              <SortableHeader field="subject" icon={BookOpenIcon}>
                Subject
              </SortableHeader>
              <SortableHeader field="level" icon={HashtagIcon}>
                Level
              </SortableHeader>
              <SortableHeader field="semester" icon={HashtagIcon}>
                Semester
              </SortableHeader>
              <SortableHeader field="uploadedBy.name" icon={UserGroupIcon}>
                Uploaded By
              </SortableHeader>
              <SortableHeader field="statistics.totalStudents" icon={ChartBarIcon}>
                Statistics
              </SortableHeader>
              <SortableHeader field="status" icon={CheckCircleIcon}>
                Status
              </SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-100">
                <div className="flex items-center space-x-2">
                  <EyeIcon className="h-4 w-4 text-slate-500" />
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {results.map((result, index) => (
              <ResultRow 
                key={result.id} 
                result={result}
                isHovered={hoveredRow === index}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary */}
      <div className="bg-slate-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center space-x-4">
            <span>Showing {results.length} result uploads</span>
            <span>•</span>
            <span>{results.reduce((acc, result) => acc + result.statistics.totalStudents, 0)} total students</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Average Grade: {(results.reduce((acc, result) => acc + result.statistics.averageGrade, 0) / results.length).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultTable;