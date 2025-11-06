import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import ComplaintListCard from './ComplaintListCard';
import { complaintsAPI } from '../../../utils/complaintsAPI';
import { complaintStatuses } from '../../../data/mockComplaints';

const StudentComplianceList = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filterComplaints = useCallback(() => {
    let filtered = [...complaints];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(complaint => 
        complaint.senderName.toLowerCase().includes(query) ||
        complaint.topic.toLowerCase().includes(query) ||
        complaint.enrollmentId.toLowerCase().includes(query) ||
        complaint.email.toLowerCase().includes(query)
      );
    }

    // Status filter
    switch (statusFilter) {
      case 'unread':
        filtered = filtered.filter(c => !c.read);
        break;
      case 'read':
        filtered = filtered.filter(c => c.read);
        break;
      case 'replied':
        filtered = filtered.filter(c => c.replies && c.replies.length > 0);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Sort by submission date (newest first)
    filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    setFilteredComplaints(filtered);
  }, [complaints, searchQuery, statusFilter]);

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter complaints whenever search or filter changes
  useEffect(() => {
    filterComplaints();
  }, [filterComplaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintsAPI.fetchComplaints('student');
      setComplaints(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch student complaints');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium">{error}</div>
        <button 
          onClick={fetchComplaints}
          className="mt-4 px-4 py-2 bg-[#246BFD] text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, topic, enrollment ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent bg-white min-w-[140px]"
            >
              {complaintStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredComplaints.length === complaints.length ? (
            `Showing all ${complaints.length} student complaint${complaints.length !== 1 ? 's' : ''}`
          ) : (
            `Showing ${filteredComplaints.length} of ${complaints.length} student complaint${complaints.length !== 1 ? 's' : ''}`
          )}
        </p>
        {(searchQuery || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="text-sm text-[#246BFD] hover:text-blue-600 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <ComplaintListCard
              key={complaint.id}
              complaint={complaint}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-500 text-lg">No complaints found</div>
            <p className="text-gray-400 mt-2">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No student complaints have been submitted yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentComplianceList;