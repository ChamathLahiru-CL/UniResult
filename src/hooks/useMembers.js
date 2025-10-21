import { useState, useEffect } from 'react';
// import axios from 'axios'; // Uncomment when connecting to real API

// Mock data for development
const mockMembers = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@uniresult.edu',
    phone: '(123) 456-7890',
    universityId: 'EXM001',
    role: 'Exam Officer',
    status: 'active',
    lastActiveAt: '2025-10-15T08:30:00Z'
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@uniresult.edu',
    phone: '(123) 567-8901',
    universityId: 'EXM002',
    role: 'Coordinator',
    status: 'active',
    lastActiveAt: '2025-10-19T14:45:00Z'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@uniresult.edu',
    phone: '(123) 678-9012',
    universityId: 'EXM003',
    role: 'Exam Officer',
    status: 'inactive',
    lastActiveAt: '2025-09-28T11:15:00Z'
  }
];

const mockActivities = {
  '1': [
    {
      id: 'act1',
      memberId: '1',
      type: 'upload_result',
      description: 'Uploaded final results for CS101',
      createdAt: '2025-10-15T08:35:00Z'
    },
    {
      id: 'act2',
      memberId: '1',
      type: 'news_upload',
      description: 'Published exam schedule announcement',
      createdAt: '2025-10-14T09:20:00Z'
    },
    {
      id: 'act3',
      memberId: '1',
      type: 'compliance_check',
      description: 'Completed compliance review for Fall exams',
      createdAt: '2025-10-12T13:45:00Z'
    }
  ],
  '2': [
    {
      id: 'act4',
      memberId: '2',
      type: 'update_timetable',
      description: 'Updated timetable for Engineering department',
      createdAt: '2025-10-19T14:30:00Z'
    },
    {
      id: 'act5',
      memberId: '2',
      type: 'upload_result',
      description: 'Uploaded mid-term results for ENG205',
      createdAt: '2025-10-16T11:25:00Z'
    }
  ],
  '3': [
    {
      id: 'act6',
      memberId: '3',
      type: 'news_upload',
      description: 'Published lab assessment guidelines',
      createdAt: '2025-09-28T10:50:00Z'
    }
  ]
};

const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all members (with mock data)
  const fetchMembers = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For development, use mock data instead of real API call
      // const response = await axios.get('/api/admin/exam-division/members');
      // setMembers(response.data);
      setMembers(mockMembers);
      setError(null);
    } catch (err) {
      setError('Failed to load members. Please try again.');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new member
  const addMember = async (memberData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // For development, use mock data instead of real API call
      // const response = await axios.post('/api/admin/exam-division/members', memberData);
      const newMember = {
        id: `${Date.now()}`, // Generate unique ID
        ...memberData,
        status: 'active',
        lastActiveAt: new Date().toISOString()
      };
      setMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add member');
    }
  };

  // Remove member
  const removeMember = async (memberId) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For development, use mock data instead of real API call
      // await axios.delete(`/api/admin/exam-division/members/${memberId}`);
      setMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  // Fetch member details
  const fetchDetails = async (memberId) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // For development, use mock data instead of real API call
      // const response = await axios.get(`/api/admin/exam-division/members/${memberId}`);
      const member = mockMembers.find(m => m.id === memberId);
      if (!member) throw new Error('Member not found');
      return member;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch member details');
    }
  };

  // Fetch member activity
  const fetchActivity = async (memberId) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For development, use mock data instead of real API call
      // const response = await axios.get(`/api/admin/exam-division/members/${memberId}/activity`);
      const activities = mockActivities[memberId] || [];
      return activities;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch member activity');
    }
  };

  // Initial load
  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    error,
    refresh: fetchMembers,
    addMember,
    removeMember,
    fetchDetails,
    fetchActivity,
  };
};

export default useMembers;