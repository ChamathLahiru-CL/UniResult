import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { MemberCard } from '../../components/examdivision/members/MemberCard';
import { SearchMembers } from '../../components/examdivision/members/SearchMembers';
import { isActiveMember } from '../../utils/memberUtils';

const ExamDivisionMembers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberList, setMemberList] = useState([]);

  const fetchMembers = useCallback(async () => {
    if (!user?.token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/exam-division/members', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch members');
      }

      const payload = await res.json();

      if (!payload || !payload.data) {
        setMemberList([]);
        return;
      }

      // Map backend member shape to the frontend components' expected shape
      const mapped = payload.data.map(m => ({
        id: m._id,
        name: m.nameWithInitial || `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.username,
        mobile: m.phoneNumber || '',
        role: m.position || m.role || 'Coordinator',
        lastActivity: m.lastActive || m.joinDate || new Date().toISOString(),
        email: m.email || '',
        nic: m.nic || m.username || '',
        joinDate: m.joinDate || m.createdAt || new Date().toISOString(),
        activities: m.activities || [],
        uploads: m.uploads || { results: 0, timetables: 0, news: 0 }
      }));

      setMemberList(mapped);
    } catch (err) {
      console.error('Error fetching exam division members:', err);
      setError(err.message || 'Error fetching members');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.token) return;
    fetchMembers();

    const interval = setInterval(() => {
      fetchMembers();
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [user, fetchMembers]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
  };

  const handleViewMember = (member) => {
    navigate(`/exam/members/${member.id}`);
  };

  const filteredMembers = memberList.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.mobile.includes(searchQuery) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true :
      (statusFilter === 'active' ? isActiveMember(member.lastActivity) : !isActiveMember(member.lastActivity));
    const matchesRole = roleFilter === 'all' ? true : member.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Division Members</h1>
        <p className="text-gray-600">
          Manage and monitor exam division staff activities and responsibilities
        </p>
      </div>

      <SearchMembers
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onRoleFilter={handleRoleFilter}
        statusFilter={statusFilter}
        roleFilter={roleFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {isLoading ? (
          <div className="col-span-3 text-center text-gray-500">Loading members...</div>
        ) : error ? (
          <div className="col-span-3 text-center text-red-500">
            <p>Error loading members: {error}</p>
            <button
              onClick={fetchMembers}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500">No members found.</div>
        ) : (
          filteredMembers.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              onViewMore={() => handleViewMember(member)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExamDivisionMembers;