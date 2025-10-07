import React from 'react';

const LastUpdatedResults = () => {
  const results = [
    { date: '2024-06-01', degree: 'CST', subject: 'Acme Corporation', level: '100', semester: '01' },
    { date: '2024-06-02', degree: 'ICT', subject: 'Bravo Solutions', level: '100', semester: '01' },
    { date: '2024-06-02', degree: 'ICT', subject: "Charlie's Workshop", level: '200', semester: '4' },
    { date: '2024-06-03', degree: 'EET', subject: 'Delta Retail', level: '400', semester: '7' },
    { date: '2024-06-04', degree: 'BST', subject: 'Echo Enterprises', level: '300', semester: '5' },
    // Add more results as needed
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Last Updated Result</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Degree
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Semester
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {result.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {result.degree}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {result.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {result.level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {result.semester}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-[#246BFD] text-sm border border-[#246BFD] px-3 py-1 rounded-md hover:bg-blue-50">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LastUpdatedResults;
