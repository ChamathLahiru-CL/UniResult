import React, { useState, useEffect, useMemo } from 'react';
import { format, isAfter, subDays } from 'date-fns';
import { 
  UsersIcon, 
  CheckCircleIcon, 
  BuildingLibraryIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline';
import FilterBar from '../../components/admin/students/FilterBar';

const AdminStudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    year: '',
    faculty: '',
    degree: '',
    status: ''
  });

  // Fetch students data on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/students', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error('Failed to fetch students');
      }

      const result = await response.json();

      if (result.success) {
        setStudents(result.data);
      } else {
        setError(result.message || 'Failed to load students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({
        search: '',
        year: '',
        faculty: '',
        degree: '',
        status: ''
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleDownload = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Department', 'Program', 'Degree', 'Year', 'Matric Number', 'Status', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        `"${student.name || 'Unknown'}"`,
        `"${student.email}"`,
        `"${student.department}"`,
        `"${student.program}"`,
        `"${student.degree}"`,
        student.year,
        `"${student.matricNumber}"`,
        `"${student.status}"`,
        `"${format(new Date(student.registrationDate), 'MMM dd, yyyy')}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `students_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isNewStudent = (registrationDate) => {
    const sevenDaysAgo = subDays(new Date(), 7);
    return isAfter(new Date(registrationDate), sevenDaysAgo);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = !filters.search || 
        (student.name && student.name.toLowerCase().includes(filters.search.toLowerCase())) ||
        student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.matricNumber.toLowerCase().includes(filters.search.toLowerCase());

      const matchesYear = !filters.year || student.year.toString() === filters.year;
      const matchesFaculty = !filters.faculty || student.department === filters.faculty;
      const matchesDegree = !filters.degree || student.program === filters.degree;
      const matchesStatus = !filters.status || student.status === filters.status;

      return matchesSearch && matchesYear && matchesFaculty && matchesDegree && matchesStatus;
    });
  }, [students, filters]);

  // Statistics calculations
  const statistics = useMemo(() => {
    const totalStudents = students.length;
    const activeStudents = students.filter(student => student.status === 'Active').length;
    
    const uniqueDepartments = new Set(students.map(student => student.department)).size;
    
    const sevenDaysAgo = subDays(new Date(), 7);
    const recentRegistrations = students.filter(student => 
      isAfter(new Date(student.registrationDate), sevenDaysAgo)
    ).length;

    return {
      totalStudents,
      activeStudents,
      uniqueDepartments,
      recentRegistrations
    };
  }, [students]);

  const handleSuspend = async (id) => {
    if (!window.confirm('Are you sure you want to suspend this student?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${id}/suspend`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Suspended by admin' })
      });

      if (!response.ok) {
        throw new Error('Failed to suspend student');
      }

      // Update local state
      setStudents(students.map(student => 
        student.id === id ? { ...student, status: 'Suspended' } : student
      ));
    } catch (error) {
      console.error('Error suspending student:', error);
      alert('Failed to suspend student. Please try again.');
    }
  };

  const handleActivate = async (id) => {
    if (!window.confirm('Are you sure you want to activate this student?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${id}/activate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to activate student');
      }

      // Update local state
      setStudents(students.map(student => 
        student.id === id ? { ...student, status: 'Active' } : student
      ));
    } catch (error) {
      console.error('Error activating student:', error);
      alert('Failed to activate student. Please try again.');
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this student? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove student');
      }

      // Update local state
      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Failed to remove student. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Student Management</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.activeStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <BuildingLibraryIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.uniqueDepartments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <CalendarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Registrations</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.recentRegistrations}</p>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onDownload={handleDownload}
        totalStudents={filteredStudents.length}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Degree
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year & Matric
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className={`hover:bg-gray-50 ${isNewStudent(student.registrationDate) ? 'border-l-4 border-green-400' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {student.name ? student.name.split(' ').map(n => n[0]).join('') : 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name || 'Unknown Student'}
                            </div>
                            {isNewStudent(student.registrationDate) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.department}</div>
                      <div className="text-sm text-gray-500">{student.program}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.degree}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Year {student.year}</div>
                      <div className="text-sm text-gray-500">{student.matricNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${student.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(student.registrationDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => {/* Handle view */}}
                      >
                        View
                      </button>
                      {student.status === 'Active' ? (
                        <button
                          className="text-orange-600 hover:text-orange-900"
                          onClick={() => handleSuspend(student.id)}
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleActivate(student.id)}
                        >
                          Activate
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleRemove(student.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentManagementPage;