/**
 * Utility function to dispatch announcements to appropriate endpoints
 * @param {Object} announcementData - The announcement data to dispatch
 * @returns {Promise} - Promise resolving when all dispatches are complete
 */
export const sendAnnouncementDispatcher = async (announcementData) => {
  try {
    // Store the main announcement
    const announcementResponse = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(announcementData),
    });

    if (!announcementResponse.ok) {
      throw new Error('Failed to save announcement');
    }

    // Prepare notification data for target audiences
    const notificationData = {
      title: announcementData.topic,
      message: announcementData.message,
      type: 'announcement',
      from: announcementData.by,
      timestamp: announcementData.timestamp,
      priority: announcementData.priority || 'medium',
      read: false
    };

    // Dispatch to appropriate notification endpoints
    const notificationPromises = [];

    if (announcementData.audience === 'students' || announcementData.audience === 'all') {
      notificationPromises.push(
        fetch('/api/student/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...notificationData,
            audience: 'students'
          }),
        })
      );
    }

    if (announcementData.audience === 'exam' || announcementData.audience === 'all') {
      notificationPromises.push(
        fetch('/api/exam/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...notificationData,
            audience: 'exam'
          }),
        })
      );
    }

    // Wait for all notification dispatches to complete
    const notificationResponses = await Promise.all(notificationPromises);
    
    // Check if any notification dispatch failed
    notificationResponses.forEach((response, index) => {
      if (!response.ok) {
        console.warn(`Failed to dispatch notification to endpoint ${index + 1}`);
      }
    });

    // Log the announcement activity
    const activityData = {
      type: 'announcement',
      message: `Sent new announcement "${announcementData.topic}" to ${getAudienceLabel(announcementData.audience)}`,
      timestamp: announcementData.timestamp,
      by: announcementData.by,
      metadata: {
        announcementId: announcementResponse.id,
        audience: announcementData.audience,
        recipientCount: getEstimatedRecipientCount(announcementData.audience)
      }
    };

    const activityResponse = await fetch('/api/admin/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });

    if (!activityResponse.ok) {
      console.warn('Failed to log announcement activity');
    }

    return {
      success: true,
      announcementId: announcementResponse.id,
      notificationsSent: notificationPromises.length
    };

  } catch (error) {
    console.error('Error in announcement dispatcher:', error);
    throw error;
  }
};

/**
 * Get human-readable label for audience type
 * @param {string} audience - The audience type (all, students, exam)
 * @returns {string} - Human-readable label
 */
export const getAudienceLabel = (audience) => {
  const labels = {
    all: 'All Users',
    students: 'Students',
    exam: 'Exam Division'
  };
  return labels[audience] || audience;
};

/**
 * Get estimated recipient count for an audience
 * @param {string} audience - The audience type
 * @returns {number} - Estimated number of recipients
 */
export const getEstimatedRecipientCount = (audience) => {
  // These would typically come from your backend/database
  const estimates = {
    all: 1250, // Total users
    students: 1000, // Student users
    exam: 25 // Exam division staff
  };
  return estimates[audience] || 0;
};

/**
 * Validate announcement data before sending
 * @param {Object} data - Announcement data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateAnnouncementData = (data) => {
  const errors = {};

  if (!data.topic || data.topic.trim().length === 0) {
    errors.topic = 'Topic is required';
  } else if (data.topic.length > 100) {
    errors.topic = 'Topic must be less than 100 characters';
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Message is required';
  } else if (data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (data.message.length > 2000) {
    errors.message = 'Message must be less than 2000 characters';
  }

  if (!data.audience || !['all', 'students', 'exam'].includes(data.audience)) {
    errors.audience = 'Please select a valid audience';
  }

  if (!data.priority || !['low', 'medium', 'high', 'critical'].includes(data.priority)) {
    errors.priority = 'Please select a valid priority level';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Format announcement timestamp for display
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} - Formatted timestamp
 */
export const formatAnnouncementTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};