import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderSection from '../../components/admin/examdivision/HeaderSection';
import Toolbar from '../../components/admin/examdivision/Toolbar';
import MembersTable from '../../components/admin/examdivision/MembersTable';
import MemberDetailsDrawer from '../../components/admin/examdivision/MemberDetailsDrawer';
import AddMemberModal from '../../components/admin/examdivision/AddMemberModal';
import ConfirmRemoveModal from '../../components/admin/examdivision/ConfirmRemoveModal';
import useMembers from '../../hooks/useMembers';

const AdminExamDivisionPage = () => {
  const navigate = useNavigate();
  const { memberId } = useParams();
  
  // State management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState({ field: 'name', direction: 'asc' });

  // Custom hook for member data and operations
  const {
    members,
    loading,
    error,
    addMember,
    removeMember,
    fetchDetails,
    fetchActivity,
  } = useMembers();
  
  // Initialize selected member from URL param if available
  useEffect(() => {
    if (memberId && members) {
      const member = members.find(m => m.id === memberId);
      if (member) {
        setSelectedMember(member);
      }
    }
  }, [memberId, members]);

  // Handle view member details
  const handleViewMember = async (member) => {
    setSelectedMember(member);
    navigate(`/admin/exam-division/${member.id}`);
  };

  // Handle member removal
  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    
    try {
      await removeMember(selectedMember.id);
      setIsRemoveModalOpen(false);
      setSelectedMember(null);
      // Show success toast
    } catch (error) {
      // Show error toast
      console.error('Failed to remove member:', error);
    }
  };

  // Handle adding new member
  const handleAddMember = async (data) => {
    try {
      await addMember(data);
      setIsAddModalOpen(false);
      // Show success toast
    } catch (error) {
      // Show error toast
      console.error('Failed to add member:', error);
    }
  };

  // Filter and sort members
  const filteredMembers = members
    ?.filter(member => {
      const matchesSearch = searchQuery.toLowerCase() === '' ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.universityId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' ||
        member.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const field = sortBy.field;
      const direction = sortBy.direction === 'asc' ? 1 : -1;
      return direction * (a[field] < b[field] ? -1 : 1);
    });

  return (
    <div className="container mx-auto px-4 lg:px-8 pb-12 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <HeaderSection onAddMember={() => setIsAddModalOpen(true)} />

      {/* Toolbar */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Main Content */}
      <div className="mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <MembersTable
            members={filteredMembers}
            loading={loading}
            error={error}
            onView={handleViewMember}
            onRemove={(member) => {
              setSelectedMember(member);
              setIsRemoveModalOpen(true);
            }}
          />
        </div>
      </div>

      {/* Modals and Drawers */}
      <MemberDetailsDrawer
        isOpen={!!selectedMember}
        member={selectedMember}
        onClose={() => {
          setSelectedMember(null);
          navigate('/admin/exam-division');
        }}
        fetchDetails={fetchDetails}
        fetchActivity={fetchActivity}
      />

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMember}
      />

      <ConfirmRemoveModal
        isOpen={isRemoveModalOpen}
        member={selectedMember}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleRemoveMember}
      />
    </div>
  );
};

export default AdminExamDivisionPage;