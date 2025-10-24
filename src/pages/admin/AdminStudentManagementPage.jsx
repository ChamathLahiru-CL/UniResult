import React, { useState } from 'react';
import { format } from 'date-fns';

const AdminStudentManagementPage = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@uniresult.edu',
      department: 'ICT',
      program: 'BSc in Computer Science',
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
      year: 1,
      matricNumber: 'EN20251003',
      status: 'Suspended',
      registrationDate: '2025-09-15'
    }
  ]);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Student Management</h1>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name, email, or matric number..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

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
                  <td colSpan="6" className="px-6 py-4 text-center">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
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
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
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