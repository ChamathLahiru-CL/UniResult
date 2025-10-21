import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import ActivityTimeline from './ActivityTimeline';

const MemberDetailsDrawer = ({ isOpen, member, onClose, fetchDetails, fetchActivity }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState(null);
  const [activities, setActivities] = useState([]);

  const loadMemberData = useCallback(async () => {
    if (!member) return;
    
    try {
      setLoading(true);
      const [memberDetails, memberActivities] = await Promise.all([
        fetchDetails(member.id),
        fetchActivity(member.id)
      ]);
      setDetails(memberDetails);
      setActivities(memberActivities);
      setError(null);
    } catch (err) {
      setError('Failed to load member details');
      console.error('Error loading member details:', err);
    } finally {
      setLoading(false);
    }
  }, [member, fetchDetails, fetchActivity]);

  useEffect(() => {
    if (isOpen && member) {
      loadMemberData();
    }
  }, [isOpen, member, loadMemberData]);

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="px-6 py-6 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                          Member Details
                        </Dialog.Title>
                        <button
                          type="button"
                          className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={onClose}
                        >
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {loading ? (
                      <div className="flex-1 px-6 py-6">
                        <div className="animate-pulse space-y-4">
                          <div className="h-4 bg-slate-100 rounded w-3/4" />
                          <div className="h-4 bg-slate-100 rounded w-1/2" />
                          <div className="h-4 bg-slate-100 rounded w-2/3" />
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex-1 px-6 py-6">
                        <p className="text-red-600">{error}</p>
                      </div>
                    ) : details ? (
                      <>
                        {/* Member Information */}
                        <div className="px-6 py-6 border-b border-gray-200">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-medium text-gray-900">
                                {details.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {details.role || 'Exam Division Member'}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(details.status)}`}>
                                {details.status?.charAt(0).toUpperCase() + details.status?.slice(1) || 'Active'}
                              </span>
                              {details.lastActiveAt && (
                                <span className="text-xs text-gray-500">
                                  Last active: {new Date(details.lastActiveAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900">{details.email}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                <dd className="mt-1 text-sm text-gray-900">{details.phone}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">University ID</dt>
                                <dd className="mt-1 text-sm text-gray-900">{details.universityId}</dd>
                              </div>
                            </dl>
                          </div>

                          {/* Link to Exam Division */}
                          <div className="mt-6">
                            <a
                              href={`/exam/members/${details.id}`}
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                            >
                              Open in Exam Division
                              <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                            </a>
                          </div>
                        </div>

                        {/* Activity Timeline */}
                        <div className="px-6 py-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-4">Activity History</h4>
                          <ActivityTimeline activities={activities} />
                        </div>
                      </>
                    ) : null}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MemberDetailsDrawer;