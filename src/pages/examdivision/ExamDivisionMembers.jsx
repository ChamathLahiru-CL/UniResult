import React, { useState } from 'react';
import { MemberCard } from '../../components/examdivision/members/MemberCard';
import { SearchMembers } from '../../components/examdivision/members/SearchMembers';
import { MemberDetailsModal } from '../../components/examdivision/members/MemberDetailsModal';
import { isActiveMember } from '../../utils/memberUtils';

const ExamDivisionMembers = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Sample data - replace with actual API call
  const memberList = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      mobile: '+94 71 234 5678',
      role: 'Coordinator',
      lastActivity: '2025-10-18T14:30:00',
      email: 'sarah.j@uniresult.edu',
      nic: '199012345678',
      joinDate: '2024-01-15',
      activities: [
        { type: 'result', date: '2025-10-18T14:30:00', description: 'Uploaded ICT1213 Results' },
        { type: 'timetable', date: '2025-10-15T09:15:00', description: 'Updated Year 2 Timetable' },
      ],
      uploads: {
        results: 45,
        timetables: 12,
        news: 8
      }
    },
    // Add more sample members...
  ];

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
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
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
        {filteredMembers.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            onViewMore={() => handleViewMember(member)}
          />
        ))}
      </div>

      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ExamDivisionMembers;