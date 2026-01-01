import React, { useState, useEffect } from 'react';
import { 
  ExclamationCircleIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Status mapping from backend to frontend
const statusToType = {
  pending: 'unread',
  'in-progress': 'in-procedure',
  resolved: 'done',
  closed: 'done'
};

const complianceTypes = {
  UNREAD: 'unread',
  IN_PROCEDURE: 'in-procedure',
  DONE: 'done',
  ISSUE: 'issue'
};

const complianceTypeStyles = {
  [complianceTypes.UNREAD]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: <ExclamationCircleIcon className="h-5 w-5 text-blue-500" />,
    badge: 'bg-blue-100 text-blue-600',
    border: 'border-blue-200'
  },
  [complianceTypes.IN_PROCEDURE]: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: <ClockIcon className="h-5 w-5 text-yellow-500" />,
    badge: 'bg-yellow-100 text-yellow-600',
    border: 'border-yellow-200'
  },
  [complianceTypes.DONE]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    badge: 'bg-green-100 text-green-600',
    border: 'border-green-200'
  },
  [complianceTypes.ISSUE]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
    badge: 'bg-red-100 text-red-600',
    border: 'border-red-200'
  }
};

const StudentCompliance = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [compliances, setCompliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCompliance, setExpandedCompliance] = useState(null);
  const [selectedCompliance, setSelectedCompliance] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    unread: 0
  });

  // Fetch compliances from backend
  useEffect(() => {
    fetchCompliances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCompliances = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/compliance/exam-division/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: 100, // Get more items for local filtering
          search: searchQuery || undefined
        }
      });

      if (response.data.success) {
        // Transform backend data to match frontend structure
        const transformedCompliances = response.data.data.map(comp => ({
          id: comp._id,
          type: statusToType[comp.status] || 'unread',
          enrollmentNumber: comp.studentIndexNumber,
          studentName: comp.studentName,
          message: comp.message,
          topic: comp.topic,
          importance: comp.importance,
          recipient: comp.recipient,
          selectedGroups: comp.selectedGroups,
          timestamp: new Date(comp.createdAt),
          isRead: comp.isRead,
          status: comp.status,
          response: comp.response,
          attachments: comp.attachments,
          studentEmail: comp.studentEmail
        }));

        setCompliances(transformedCompliances);
        setStats(response.data.stats || stats);
      }
    } catch (err) {
      console.error('Error fetching compliances:', err);
      setError('Failed to load compliances. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Mark compliance as read
  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/compliance/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setCompliances(prev =>
        prev.map(comp =>
          comp.id === id ? { ...comp, isRead: true } : comp
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  // Download compliance as PDF
  const handleDownloadPDF = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/compliance/${id}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `compliance-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF. Please try again.');
    }
  };

  // Download attachment
  const handleDownloadAttachment = async (complianceId, attachmentId, filename) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/compliance/${complianceId}/attachment/${attachmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading attachment:', err);
      alert('Failed to download attachment. Please try again.');
    }
  };

  // Get file icon based on type
  const getFileIcon = (mimetype) => {
    if (mimetype?.includes('image')) return '🖼️';
    if (mimetype?.includes('pdf')) return '📄';
    if (mimetype?.includes('word') || mimetype?.includes('document')) return '📝';
    if (mimetype?.includes('text')) return '📃';
    return '📎';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompliances();
  };

  const filterCompliances = (type) => {
    if (type === 'all') return compliances;
    return compliances.filter(compliance => compliance.type === type);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleViewCompliance = async (id) => {
    // Mark as read when viewing
    const compliance = compliances.find(c => c.id === id);
    if (compliance && !compliance.isRead) {
      await handleMarkAsRead(id);
    }
    
    // Set selected compliance for detail modal
    setSelectedCompliance(compliance);
  };

  // Toggle expanded compliance for attachments
  const toggleExpanded = (id) => {
    setExpandedCompliance(expandedCompliance === id ? null : id);
  };

  // Close detail modal
  const closeDetailModal = () => {
    setSelectedCompliance(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Student Compliance
          </h3>
          
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search compliances..."
                  className="px-4 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                Filter
                <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {[
                      { key: 'all', label: 'All Compliances' },
                      { key: complianceTypes.UNREAD, label: 'Unread' },
                      { key: complianceTypes.IN_PROCEDURE, label: 'In Procedure' },
                      { key: complianceTypes.DONE, label: 'Done' },
                      { key: complianceTypes.ISSUE, label: 'Issues' }
                    ].map((option) => (
                      <button
                        key={option.key}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          selectedFilter === option.key ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          setSelectedFilter(option.key);
                          setIsFilterOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {[
            { type: complianceTypes.UNREAD, label: 'Unread', count: stats.unread || 0 },
            { type: complianceTypes.IN_PROCEDURE, label: 'In Procedure', count: stats.inProgress || 0 },
            { type: complianceTypes.DONE, label: 'Resolved', count: stats.resolved || 0 },
            { type: complianceTypes.ISSUE, label: 'Pending', count: stats.pending || 0 },
            { type: 'total', label: 'Total', count: stats.total || 0 }
          ].map((stat) => {
            const styles = stat.type === 'total' 
              ? { bg: 'bg-gray-50', text: 'text-gray-700', icon: null, border: 'border-gray-200' }
              : complianceTypeStyles[stat.type];
            return (
              <div
                key={stat.type}
                className={`px-4 py-3 rounded-lg ${styles.bg} ${styles.border} border`}
              >
                <div className="flex items-center">
                  {styles.icon}
                  <span className={`ml-2 text-sm font-medium ${styles.text}`}>
                    {stat.label}
                  </span>
                </div>
                <p className={`mt-1 text-2xl font-semibold ${styles.text}`}>{stat.count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={fetchCompliances}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Compliance List */}
      {!loading && !error && (
        <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          {filterCompliances(selectedFilter).length === 0 ? (
            <li className="px-4 py-12 text-center">
              <p className="text-gray-500">No compliances found</p>
            </li>
          ) : (
            filterCompliances(selectedFilter).map((compliance) => {
              const styles = complianceTypeStyles[compliance.type];
              const isExpanded = expandedCompliance === compliance.id;
              const hasAttachments = compliance.attachments && compliance.attachments.length > 0;
              
              return (
                <li
                  key={compliance.id}
                  className={`px-4 py-4 hover:bg-gray-50 transition-colors duration-150 ${
                    !compliance.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        {styles.icon}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <p className="font-medium text-gray-900 truncate">
                            {compliance.enrollmentNumber} - {compliance.studentName}
                          </p>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}>
                            {compliance.status}
                          </span>
                          {!compliance.isRead && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-medium">
                              New
                            </span>
                          )}
                          {compliance.importance === 'High' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              High Priority
                            </span>
                          )}
                        </div>
                        <p className="mt-1 font-medium text-sm text-gray-700">
                          {compliance.topic}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {compliance.message}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                          <span>{formatDate(compliance.timestamp)}</span>
                          {hasAttachments && (
                            <button
                              onClick={() => toggleExpanded(compliance.id)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                            >
                              <PaperClipIcon className="h-4 w-4" />
                              {compliance.attachments.length} attachment(s)
                              {isExpanded ? (
                                <ChevronUpIcon className="h-3 w-3" />
                              ) : (
                                <ChevronDownIcon className="h-3 w-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadPDF(compliance.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                        title="Download PDF"
                      >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleViewCompliance(compliance.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expandable Attachments Section */}
                  {isExpanded && hasAttachments && (
                    <div className="mt-3 ml-9 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <PaperClipIcon className="h-4 w-4" />
                        Attachments
                      </h4>
                      <div className="space-y-2">
                        {compliance.attachments.map((attachment, index) => (
                          <div
                            key={attachment._id || index}
                            className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-100 hover:border-blue-200 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-lg">{getFileIcon(attachment.mimetype)}</span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate">
                                  {attachment.originalName || attachment.filename}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {formatFileSize(attachment.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadAttachment(
                                compliance.id,
                                attachment._id,
                                attachment.originalName || attachment.filename
                              )}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                              <DocumentArrowDownIcon className="h-4 w-4" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}

      {/* Detail Modal */}
      {selectedCompliance && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeDetailModal}
            ></div>

            {/* Modal panel */}
            <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              {/* Close button */}
              <button
                onClick={closeDetailModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{selectedCompliance.topic}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${complianceTypeStyles[selectedCompliance.type]?.badge}`}>
                    {selectedCompliance.status}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedCompliance.importance === 'High' ? 'bg-red-100 text-red-700' :
                    selectedCompliance.importance === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedCompliance.importance} Priority
                  </span>
                </div>
              </div>

              {/* Student Info */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Student Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 text-gray-900 font-medium">{selectedCompliance.studentName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Index:</span>
                    <span className="ml-2 text-gray-900 font-medium">{selectedCompliance.enrollmentNumber}</span>
                  </div>
                  {selectedCompliance.studentEmail && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2 text-gray-900">{selectedCompliance.studentEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Message</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedCompliance.message}</p>
                </div>
              </div>

              {/* Attachments */}
              {selectedCompliance.attachments && selectedCompliance.attachments.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <PaperClipIcon className="h-4 w-4" />
                    Attachments ({selectedCompliance.attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedCompliance.attachments.map((attachment, index) => (
                      <div
                        key={attachment._id || index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl">{getFileIcon(attachment.mimetype)}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {attachment.originalName || attachment.filename}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatFileSize(attachment.size)} • {attachment.mimetype?.split('/')[1]?.toUpperCase() || 'File'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadAttachment(
                            selectedCompliance.id,
                            attachment._id,
                            attachment.originalName || attachment.filename
                          )}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Response (if any) */}
              {selectedCompliance.response && selectedCompliance.response.message && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Admin Response</h4>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-700">{selectedCompliance.response.message}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Responded by {selectedCompliance.response.respondedByName} on{' '}
                      {new Date(selectedCompliance.response.respondedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Footer with actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => handleDownloadPDF(selectedCompliance.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  Download as PDF
                </button>
                <button
                  onClick={closeDetailModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCompliance;