import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import ComplaintListCard from './ComplaintListCard';
import { complaintsAPI } from '../../../utils/complaintsAPI';

const DivisionComplianceList = () => {
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
        complaint.department.toLowerCase().includes(query) ||
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
      setError(null);
      const data = await complaintsAPI.getDivisionComplaints();
      setComplaints(data);
    } catch (err) {
      setError('Failed to load division complaints. Please try again.');
      console.error('Error fetching division complaints:', err);
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
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Error Loading Division Complaints</span>
        </div>
        <p className="text-red-600 text-sm">{error}</p>
        <button 
          onClick={fetchComplaints}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, department, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {filteredComplaints.length === 0 ? (
            "No division complaints found"
          ) : filteredComplaints.length === 1 ? (
            "Showing 1 division complaint"
          ) : (
            `Showing ${filteredComplaints.length} division complaints`
          )}
          {searchQuery && (
            <span className="ml-2 text-blue-600">
              for "{searchQuery}"
            </span>
          )}
        </div>
        
        {filteredComplaints.length > 0 && (
          <div className="text-sm text-gray-500">
            {filteredComplaints.filter(c => !c.read).length} unread
          </div>
        )}
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M34 40v-4a9.971 9.971 0 01.712-3.714" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No division complaints found</h3>
              <p className="text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all' 
                  ? "Try adjusting your search or filter criteria." 
                  : "Division complaints will appear here when submitted."}
              </p>
              {(searchQuery || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <ComplaintListCard
              key={complaint.id}
              complaint={complaint}
              type="division"
            />
          ))
        )}
      </div>

      {/* Load More Section (Future Enhancement) */}
      {filteredComplaints.length >= 10 && (
        <div className="text-center pt-4">
          <button className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Load More Complaints
          </button>
        </div>
      )}
    </div>
  );
};

export default DivisionComplianceList;