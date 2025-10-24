// import axios from 'axios'; // Will be used in production
import { mockStudentComplaints, mockDivisionComplaints } from '../data/mockComplaints';

// Mock API functions for development
export const complaintsAPI = {
  // Fetch complaints by type
  fetchComplaints: async (type = 'student') => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = type === 'student' ? mockStudentComplaints : mockDivisionComplaints;
      console.log(`📋 Fetched ${data.length} ${type} complaints`);
      
      return {
        success: true,
        data,
        total: data.length
      };
      
      // Production code:
      // const response = await axios.get(`/api/admin/compliance?type=${type}`);
      // return response.data;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw new Error('Failed to fetch complaints');
    }
  },

  // Fetch single complaint by ID
  fetchComplaintById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const allComplaints = [...mockStudentComplaints, ...mockDivisionComplaints];
      const complaint = allComplaints.find(c => c.id === id);
      
      if (!complaint) {
        throw new Error('Complaint not found');
      }

      console.log(`📄 Fetched complaint: ${complaint.topic}`);
      
      return {
        success: true,
        data: complaint
      };
      
      // Production code:
      // const response = await axios.get(`/api/admin/compliance/${id}`);
      // return response.data;
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw error;
    }
  },

  // Mark complaint as read
  markAsRead: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Find and update complaint in mock data
      const studentComplaint = mockStudentComplaints.find(c => c.id === id);
      const divisionComplaint = mockDivisionComplaints.find(c => c.id === id);
      
      if (studentComplaint) {
        studentComplaint.read = true;
      } else if (divisionComplaint) {
        divisionComplaint.read = true;
      }
      
      console.log(`✅ Marked complaint ${id} as read`);
      
      return { success: true };
      
      // Production code:
      // const response = await axios.patch(`/api/admin/compliance/${id}/read`);
      // return response.data;
    } catch (error) {
      console.error('Error marking complaint as read:', error);
      throw new Error('Failed to mark complaint as read');
    }
  },

  // Send reply to complaint
  sendReply: async (complaintId, message) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const reply = {
        message,
        sender: 'Admin',
        date: new Date().toISOString()
      };
      
      // Find and add reply to complaint
      const allComplaints = [...mockStudentComplaints, ...mockDivisionComplaints];
      const complaint = allComplaints.find(c => c.id === complaintId);
      
      if (complaint) {
        complaint.replies = complaint.replies || [];
        complaint.replies.push(reply);
        complaint.read = true; // Mark as read when replied
      }
      
      console.log(`💬 Reply sent to complaint ${complaintId}`);
      
      return {
        success: true,
        data: reply
      };
      
      // Production code:
      // const response = await axios.post(`/api/admin/compliance/reply`, {
      //   complaintId,
      //   message
      // });
      // return response.data;
    } catch (error) {
      console.error('Error sending reply:', error);
      throw new Error('Failed to send reply');
    }
  },

  // Get complaint statistics
  getComplaintStats: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const allComplaints = [...mockStudentComplaints, ...mockDivisionComplaints];
      
      const stats = {
        total: allComplaints.length,
        unread: allComplaints.filter(c => !c.read).length,
        replied: allComplaints.filter(c => c.replies && c.replies.length > 0).length,
        student: mockStudentComplaints.length,
        division: mockDivisionComplaints.length
      };
      
      console.log('📊 Complaint statistics:', stats);
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new Error('Failed to fetch complaint statistics');
    }
  }
};