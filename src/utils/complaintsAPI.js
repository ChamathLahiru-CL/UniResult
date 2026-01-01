import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Configure axios headers
const getConfig = () => ({
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  }
});

// API functions for compliance management
export const complaintsAPI = {
  // Fetch complaints by submitter type (for admin)
  fetchComplaints: async (submitterType = 'student') => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      console.log('🔑 Making request with token:', token ? 'Token present' : 'No token');
      console.log('📡 Request URL:', `${API_URL}/compliance?submitterType=${submitterType}&limit=100`);
      
      const response = await axios.get(
        `${API_URL}/compliance?submitterType=${submitterType}&limit=100`,
        getConfig()
      );
      
      console.log(`📋 Fetched ${response.data.data.length} ${submitterType} complaints`);
      
      return {
        success: true,
        data: response.data.data,
        total: response.data.pagination.total,
        stats: response.data.stats
      };
    } catch (error) {
      console.error('❌ Error fetching complaints:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found. Please check backend is running.');
      }
      
      throw new Error(error.response?.data?.message || 'Failed to fetch complaints');
    }
  },

  // Fetch single complaint by ID
  getComplaintById: async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/compliance/${id}`,
        getConfig()
      );
      
      console.log(`📄 Fetched complaint:`, response.data.data);
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw new Error(error.response?.data?.message || 'Complaint not found');
    }
  },

  // Mark complaint as read
  markAsRead: async (id) => {
    try {
      const response = await axios.post(
        `${API_URL}/compliance/${id}/read`,
        {},
        getConfig()
      );
      
      console.log(`✅ Marked complaint ${id} as read`);
      
      return response.data;
    } catch (error) {
      console.error('Error marking complaint as read:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark complaint as read');
    }
  },

  // Update complaint status
  updateStatus: async (id, status, responseMessage = null) => {
    try {
      const response = await axios.put(
        `${API_URL}/compliance/${id}/status`,
        { status, responseMessage },
        getConfig()
      );
      
      console.log(`✅ Updated complaint ${id} status to ${status}`);
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating complaint status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update complaint status');
    }
  },

  // Send reply to complaint (update status with response message)
  addReply: async (complaintId, replyData) => {
    try {
      const response = await axios.put(
        `${API_URL}/compliance/${complaintId}/status`,
        { 
          status: 'in-progress',
          responseMessage: replyData.message 
        },
        getConfig()
      );
      
      console.log(`💬 Reply sent to complaint ${complaintId}`);
      
      return response.data.data;
    } catch (error) {
      console.error('Error sending reply:', error);
      throw new Error(error.response?.data?.message || 'Failed to send reply');
    }
  },

  // Get complaint statistics
  getComplaintStats: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/compliance?limit=1`,
        getConfig()
      );
      
      const stats = response.data.stats || {};
      
      console.log('📊 Complaint statistics:', stats);
      
      return {
        success: true,
        data: {
          total: (stats.studentComplaints || 0) + (stats.examDivisionComplaints || 0),
          unread: stats.unread || 0,
          replied: stats.inProgress || 0,
          student: stats.studentComplaints || 0,
          division: stats.examDivisionComplaints || 0,
          pending: stats.pending || 0,
          resolved: stats.resolved || 0
        }
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch complaint statistics');
    }
  },

  // Download attachment
  downloadAttachment: async (complaintId, attachmentId) => {
    try {
      const response = await axios.get(
        `${API_URL}/compliance/${complaintId}/attachment/${attachmentId}`,
        {
          ...getConfig(),
          responseType: 'blob'
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error downloading attachment:', error);
      throw new Error(error.response?.data?.message || 'Failed to download attachment');
    }
  },

  // Delete complaint (admin only)
  deleteComplaint: async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/compliance/${id}`,
        getConfig()
      );
      
      console.log(`🗑️ Deleted complaint ${id}`);
      
      return response.data;
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete complaint');
    }
  },

  // Download complaint as PDF
  downloadPDF: async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/compliance/${id}/pdf`,
        {
          ...getConfig(),
          responseType: 'blob'
        }
      );
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `complaint-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`📄 Downloaded PDF for complaint ${id}`);
      
      return true;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw new Error(error.response?.data?.message || 'Failed to download PDF');
    }
  }
};