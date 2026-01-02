import React from 'react';
import {
  DocumentTextIcon,
  UserGroupIcon,
  BookOpenIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const ResultSummary = ({ results }) => {
  // Calculate summary statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthResults = results.filter(result => {
    const resultDate = new Date(result.timestamp);
    return resultDate.getMonth() === currentMonth && 
           resultDate.getFullYear() === currentYear;
  });

  const totalUploads = results.length; // Show total uploads instead of just this month
  const thisMonthCount = thisMonthResults.length;

  // Get unique uploaders and find most active
  const uploaderCounts = results.reduce((acc, result) => {
    acc[result.uploadedBy] = (acc[result.uploadedBy] || 0) + 1;
    return acc;
  }, {});

  const mostActiveUploader = Object.entries(uploaderCounts).reduce((a, b) => 
    b[1] > a[1] ? b : a, ['', 0])[0];

  // Get unique subjects
  const uniqueSubjects = new Set(results.map(result => result.subject));
  
  // Calculate average uploads per subject
  const avgUploadsPerSubject = totalUploads / (uniqueSubjects.size || 1);

  // Calculate total student results
  const totalStudentResults = results.reduce((sum, result) => sum + (result.count || 0), 0);

  const summaryItems = [
    {
      title: 'Total Result Sheets',
      value: totalUploads,
      subtitle: `${thisMonthCount} this month`,
      icon: DocumentTextIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Most Active Uploader',
      value: mostActiveUploader || 'N/A',
      subtitle: uploaderCounts[mostActiveUploader] ? `${uploaderCounts[mostActiveUploader]} uploads` : '',
      icon: UserGroupIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Student Results',
      value: totalStudentResults.toLocaleString(),
      subtitle: `${uniqueSubjects.size} subjects`,
      icon: BookOpenIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Avg. Results per Sheet',
      value: totalUploads > 0 ? (totalStudentResults / totalUploads).toFixed(1) : '0',
      subtitle: `${avgUploadsPerSubject.toFixed(1)} sheets/subject`,
      icon: ChartBarIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {summaryItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className={`${item.bgColor} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
              <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">{item.title}</h3>
              <p className={`text-lg sm:text-xl font-semibold ${item.color} truncate`}>{item.value}</p>
              {item.subtitle && (
                <p className="text-xs text-gray-400 mt-1 truncate">{item.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultSummary;