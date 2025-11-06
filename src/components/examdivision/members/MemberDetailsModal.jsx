import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { getActivityIcon } from '../../../utils/memberUtils';

export const MemberDetailsModal = ({ member, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', label: 'Personal Info' },
    { id: 'activities', label: 'Activity Logs' },
    { id: 'uploads', label: 'Upload Analytics' }
  ];

  const chartData = {
    labels: ['Results', 'Timetables', 'News'],
    datasets: [
      {
        label: 'Number of Uploads',
        data: [
          member.uploads.results,
          member.uploads.timetables,
          member.uploads.news
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)', // Blue
          'rgba(16, 185, 129, 0.5)', // Green
          'rgba(245, 158, 11, 0.5)' // Yellow
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Upload Distribution'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <Dialog.Overlay className="fixed inset-0 bg-black/40 transition-opacity" />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Member Details
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-3 text-sm font-medium
                    ${activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="mt-1">{member.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile</label>
                    <p className="mt-1">{member.mobile}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1">{member.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">NIC</label>
                    <p className="mt-1">{member.nic}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="mt-1">{member.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Join Date</label>
                    <p className="mt-1">{format(new Date(member.joinDate), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="space-y-6">
                {member.activities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(activity.date), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'uploads' && (
              <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};