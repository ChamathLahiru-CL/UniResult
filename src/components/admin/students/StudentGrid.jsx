import React from 'react';
import StudentCard from './StudentCard';

const StudentGrid = ({ students, onView, onSuspend, onRemove, onActivate, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="ml-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
                </div>
              </div>
              <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 4.354a4 4 0 110 5.292V12M12 12v3M12 12h5.292a4 4 0 110 5.292M15.293 9.293l-3.292 3.293-3.293-3.293"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {students.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          onView={onView}
          onSuspend={onSuspend}
          onRemove={onRemove}
          onActivate={onActivate}
        />
      ))}
    </div>
  );
};

export default StudentGrid;