import React, { useState, useEffect, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  ClockIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import AnnouncementCard from './AnnouncementCard';

// Mock data for announcements
const mockAnnouncements = [
  {
    id: 1,
    topic: "New GPA System Rollout",
    message: "A new GPA calculation system will be implemented starting next week. All students and exam division staff should familiarize themselves with the new grading criteria. The system will automatically convert existing grades to the new scale.",
    audience: "all",
    by: "Admin (Lahiru)",
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    topic: "Exam Schedule Update",
    message: "Due to unforeseen circumstances, the mid-term examinations scheduled for next week have been postponed. New dates will be announced soon.",
    audience: "students",
    by: "Admin (Sarah)",
    timestamp: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    topic: "Result Verification Process",
    message: "All exam division staff are required to complete the result verification training by end of this month. Please contact HR for scheduling your training session.",
    audience: "exam",
    by: "Admin (Lahiru)",
    timestamp: "2024-01-13T09:15:00Z"
  },
  {
    id: 4,
    topic: "System Maintenance Notice",
    message: "The university result system will undergo scheduled maintenance this Saturday from 2 AM to 6 AM. During this time, the system will be temporarily unavailable.",
    audience: "all",
    by: "Admin (Tech Team)",
    timestamp: "2024-01-12T16:45:00Z"
  },
  {
    id: 5,
    topic: "Student Portal Updates",
    message: "New features have been added to the student portal including GPA tracking, notification center, and improved result viewing. Log in to explore the new interface.",
    audience: "students",
    by: "Admin (Sarah)",
    timestamp: "2024-01-11T11:30:00Z"
  },
  {
    id: 6,
    topic: "Grade Submission Deadline",
    message: "Reminder: All grades for the current semester must be submitted by Friday, January 19th. Late submissions will require special approval from the academic office.",
    audience: "exam",
    by: "Admin (Lahiru)",
    timestamp: "2024-01-10T13:20:00Z"
  },
  {
    id: 7,
    topic: "Holiday Schedule Announcement",
    message: "The university will be closed from December 25th to January 2nd for winter holidays. Normal operations will resume on January 3rd. Emergency contacts will remain available.",
    audience: "all",
    by: "Admin (HR)",
    timestamp: "2024-01-09T08:00:00Z"
  },
  {
    id: 8,
    topic: "Security Update Required",
    message: "All users must update their passwords by the end of this month as part of our enhanced security measures. New passwords must meet the updated complexity requirements.",
    audience: "all",
    by: "Admin (Security)",
    timestamp: "2024-01-08T15:30:00Z"
  }
];

const ITEMS_PER_PAGE = 5;
const SEARCH_DEBOUNCE_MS = 600;

const AnnouncementHistoryList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter announcements based on search query
  const filteredAnnouncements = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return mockAnnouncements;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return mockAnnouncements.filter(announcement => 
      announcement.topic.toLowerCase().includes(query) ||
      announcement.message.toLowerCase().includes(query) ||
      announcement.by.toLowerCase().includes(query)
    );
  }, [debouncedSearchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);
  
  const startItem = filteredAnnouncements.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(endIndex, filteredAnnouncements.length);

  const toggleExpanded = (announcementId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(announcementId)) {
        newSet.delete(announcementId);
      } else {
        newSet.add(announcementId);
      }
      return newSet;
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-5 w-5 text-[#246BFD]" />
            <h2 className="text-lg font-semibold text-slate-900">Announcement History</h2>
          </div>
          <div className="text-sm text-slate-500">
            {filteredAnnouncements.length} total announcements
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#246BFD] focus:border-[#246BFD] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="p-6">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <SpeakerWaveIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-slate-500 font-medium mb-2">
              {debouncedSearchQuery ? 'No announcements found' : 'No announcements yet'}
            </h3>
            <p className="text-slate-400 text-sm">
              {debouncedSearchQuery 
                ? 'Try adjusting your search terms' 
                : 'Announcements will appear here once created'
              }
            </p>
          </div>
        ) : currentAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-slate-500 font-medium mb-2">No results on this page</h3>
            <p className="text-slate-400 text-sm">Try going to a different page</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                isExpanded={expandedItems.has(announcement.id)}
                onToggleExpanded={toggleExpanded}
                maxPreviewLength={120}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6">
            <div className="text-sm text-slate-600">
              Showing {startItem}-{endItem} of {filteredAnnouncements.length} announcements
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Prev
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`inline-flex items-center px-3 py-1 border rounded transition-colors ${
                      currentPage === page
                        ? 'bg-[#246BFD] text-white border-[#246BFD]'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementHistoryList;