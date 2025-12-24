import React, { useState, useMemo } from 'react';
import { format, isAfter, subDays } from 'date-fns';
import { 
  UsersIcon, 
  CheckCircleIcon, 
  BuildingLibraryIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline';
import FilterBar from '../../components/admin/students/FilterBar';

const AdminStudentManagementPage = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@uniresult.edu',
      department: 'ICT',
      program: 'BSc in Computer Science',
      degree: 'BSc in Computer Science',
      year: 2,
      matricNumber: 'EN20241001',
      status: 'Active',
      registrationDate: '2025-10-20'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@uniresult.edu',
      department: 'BBA',
      program: 'BBA in Marketing',
      degree: 'BBA in Marketing',
      year: 3,
      matricNumber: 'EN20231002',
      status: 'Active',
      registrationDate: '2025-10-23'
    },
    {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex.johnson@uniresult.edu',
      department: 'ICT',
      program: 'BSc in IT',
      degree: 'BSc in IT',
      year: 1,
      matricNumber: 'EN20251003',
      status: 'Suspended',
      registrationDate: '2025-09-15'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@uniresult.edu',
      department: 'BBA',
      program: 'BBA in Finance',
      degree: 'BBA in Finance',
      year: 4,
      matricNumber: 'EN20201004',
      status: 'Active',
      registrationDate: '2025-10-19'
    },
    {
      id: 5,
      name: 'Mike Chen',
      email: 'mike.chen@uniresult.edu',
      department: 'CST',
      program: 'BSc in Data Science',
      degree: 'BSc in Data Science',
      year: 2,
      matricNumber: 'EN20241005',
      status: 'Active',
      registrationDate: '2025-10-21'
    },
    {
      id: 6,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@uniresult.edu',
      department: 'EET',
      program: 'BSc in Electrical Engineering',
      degree: 'BSc in Electrical Engineering',
      year: 3,
      matricNumber: 'EN20231006',
      status: 'Active',
      registrationDate: '2025-10-18'
    },
    {
      id: 7,
      name: 'David Kumar',
      email: 'david.kumar@uniresult.edu',
      department: 'BBST',
      program: 'BSc in Business Studies',
      degree: 'BSc in Business Studies',
      year: 1,
      matricNumber: 'EN20251007',
      status: 'Active',
      registrationDate: '2025-10-22'
    },
    {
      id: 8,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@uniresult.edu',
      department: 'CST',
      program: 'BSc in Artificial Intelligence',
      degree: 'BSc in Artificial Intelligence',
      year: 4,
      matricNumber: 'EN20201008',
      status: 'Suspended',
      registrationDate: '2025-09-20'
    },
    {
      id: 9,
      name: 'Robert Zhang',
      email: 'robert.zhang@uniresult.edu',
      department: 'Faculty of Technological Studies',
      program: 'BSc in Technology Management',
      degree: 'BSc in Technology Management',
      year: 2,
      matricNumber: 'EN20241009',
      status: 'Active',
      registrationDate: '2025-10-19'
    },
    {
      id: 10,
      name: 'Maria Garcia',
      email: 'maria.garcia@uniresult.edu',
      department: 'Applied Science',
      program: 'BSc in Applied Physics',
      degree: 'BSc in Applied Physics',
      year: 3,
      matricNumber: 'EN20231010',
      status: 'Active',
      registrationDate: '2025-10-17'
    },
    {
      id: 11,
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@uniresult.edu',
      department: 'Medicine',
      program: 'MBBS',
      degree: 'MBBS',
      year: 1,
      matricNumber: 'EN20251011',
      status: 'Active',
      registrationDate: '2025-10-21'
    },
    {
      id: 12,
      name: 'Jennifer Lee',
      email: 'jennifer.lee@uniresult.edu',
      department: 'Agriculture',
      program: 'BSc in Agriculture',
      degree: 'BSc in Agriculture',
      year: 2,
      matricNumber: 'EN20241012',
      status: 'Active',
      registrationDate: '2025-10-16'
    },
    {
      id: 13,
      name: 'Michael Brown',
      email: 'michael.brown@uniresult.edu',
      department: 'Finance',
      program: 'BSc in Banking & Finance',
      degree: 'BSc in Banking & Finance',
      year: 4,
      matricNumber: 'EN20201013',
      status: 'Suspended',
      registrationDate: '2025-09-25'
    }
  ]);
  const [loading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    year: '',
    faculty: '',
    degree: '',
    status: ''
  });

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
        `"${student.name}"`,
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
        student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
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

  const handleSuspend = (id) => {
    if (window.confirm('Are you sure you want to suspend this student?')) {
      setStudents(students.map(student => 
        student.id === id ? { ...student, status: 'Suspended' } : student
      ));
    }
  };

  const handleActivate = (id) => {
    if (window.confirm('Are you sure you want to activate this student?')) {
      setStudents(students.map(student => 
        student.id === id ? { ...student, status: 'Active' } : student
      ));
    }
  };

  const handleRemove = (id) => {
    if (window.confirm('Are you sure you want to remove this student? This action cannot be undone.')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Student Management</h1>
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
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
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