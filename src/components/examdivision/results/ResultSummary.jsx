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

  const totalUploads = thisMonthResults.length;

  // Get unique uploaders and find most active
  const uploaderCounts = thisMonthResults.reduce((acc, result) => {
    acc[result.uploadedBy] = (acc[result.uploadedBy] || 0) + 1;
    return acc;
  }, {});

  const mostActiveUploader = Object.entries(uploaderCounts).reduce((a, b) => 
    b[1] > a[1] ? b : a, ['', 0])[0];

  // Get unique subjects
  const uniqueSubjects = new Set(thisMonthResults.map(result => result.subject));
  
  // Calculate average uploads per subject
  const avgUploadsPerSubject = totalUploads / (uniqueSubjects.size || 1);

  const summaryItems = [
    {
      title: 'Total Results This Month',
      value: totalUploads,
      icon: DocumentTextIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Most Active Uploader',
      value: mostActiveUploader || 'N/A',
      icon: UserGroupIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Subjects Updated',
      value: uniqueSubjects.size,
      icon: BookOpenIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Avg. Upload per Subject',
      value: avgUploadsPerSubject.toFixed(1),
      icon: ChartBarIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {summaryItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${item.bgColor} p-3 rounded-lg`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
              <p className={`text-xl font-semibold ${item.color}`}>{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultSummary;