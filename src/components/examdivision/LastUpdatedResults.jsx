import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  EyeIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

const LastUpdatedResults = ({ isLoading }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [hoveredRow, setHoveredRow] = useState(null);

  // Sample data - replace with actual data
  const results = [
    { id: 1, date: '2024-06-01', degree: 'CST', subject: 'Acme Corporation', level: '100', semester: '01' },
    { id: 2, date: '2024-06-02', degree: 'ICT', subject: 'Bravo Solutions', level: '100', semester: '01' },
    { id: 3, date: '2024-06-02', degree: 'ICT', subject: "Charlie's Workshop", level: '200', semester: '4' },
    { id: 4, date: '2024-06-03', degree: 'EET', subject: 'Delta Retail', level: '400', semester: '7' },
    { id: 5, date: '2024-06-04', degree: 'BST', subject: 'Echo Enterprises', level: '300', semester: '5' }
  ];

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  // Animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3
      }
    }),
    hover: {
      scale: 1.01,
      backgroundColor: 'rgba(59, 130, 246, 0.05)'
    }
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4 text-blue-500" /> : 
      <ChevronDownIcon className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Last Updated Results</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['date', 'degree', 'subject', 'level', 'semester', 'action'].map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => column !== 'action' && handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.charAt(0).toUpperCase() + column.slice(1)}</span>
                    {column !== 'action' && <SortIcon column={column} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {sortedResults.map((result, index) => (
                <motion.tr
                  key={result.id}
                  custom={index}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  onHoverStart={() => setHoveredRow(result.id)}
                  onHoverEnd={() => setHoveredRow(null)}
                  className="group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.degree}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.semester}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                        ${hoveredRow === result.id
                          ? 'bg-blue-600 text-white'
                          : 'text-blue-600 bg-blue-50 group-hover:bg-blue-100'
                        }
                        transition-colors duration-200
                      `}
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View Details
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default LastUpdatedResults;