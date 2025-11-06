import React from 'react';
import StudentCompliance from '../../components/examdivision/StudentCompliance';

const ExamCompliance = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Student Compliance Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage student complaints and compliance issues
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <StudentCompliance />
      </div>
    </div>
  );
};

export default ExamCompliance;