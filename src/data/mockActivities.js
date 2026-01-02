import { subDays, subHours, subMinutes } from 'date-fns';

// Activity types
export const ACTIVITY_TYPES = {
  COMPLIANCE: 'COMPLIANCE',
  RESULT_UPLOAD: 'RESULT_UPLOAD',
  RESULT_DELETED: 'RESULT_DELETED',
  TIMETABLE_UPLOAD: 'TIMETABLE_UPLOAD',
  NEWS_UPLOAD: 'NEWS_UPLOAD',
  STUDENT_REGISTRATION: 'STUDENT_REGISTRATION',
  SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE'
};

// Activity status
export const ACTIVITY_STATUS = {
  NEW: 'NEW',
  READ: 'READ',
  CRITICAL: 'CRITICAL',
  INFO: 'INFO'
};

// Mock activities data
export const mockActivities = [
  // Recent compliance alerts
  {
    id: 1,
    type: ACTIVITY_TYPES.COMPLIANCE,
    title: 'Grade Discrepancy Report',
    description: 'Student reported incorrect marks in ICT Module',
    timestamp: subMinutes(new Date(), 15),
    status: ACTIVITY_STATUS.NEW,
    metadata: {
      sender: 'Lahiru Jayasooriya',
      studentId: 'EN20241001',
      module: 'ICT Advanced Programming',
      complianceType: 'Grade Discrepancy'
    },
    link: '/admin/compliance/1',
    icon: '📣',
    priority: 'HIGH'
  },
  {
    id: 2,
    type: ACTIVITY_TYPES.STUDENT_REGISTRATION,
    title: 'New Student Registration',
    description: 'Ameen Musthafa joined the system',
    timestamp: subHours(new Date(), 2),
    status: ACTIVITY_STATUS.NEW,
    metadata: {
      studentName: 'Ameen Musthafa',
      enrollmentNumber: 'UOV20251117',
      degree: 'BSc in IT',
      department: 'ICT',
      registrationDate: new Date()
    },
    link: '/admin/students',
    icon: '👨‍🎓',
    priority: 'MEDIUM'
  },
  {
    id: 3,
    type: ACTIVITY_TYPES.RESULT_UPLOAD,
    title: 'Semester Results Uploaded',
    description: 'BSc ICT Semester 2 results published',
    timestamp: subHours(new Date(), 4),
    status: ACTIVITY_STATUS.INFO,
    metadata: {
      uploader: 'Dr. Kamani Perera',
      year: '2nd Year',
      degree: 'BSc in Computer Science',
      department: 'ICT',
      resultCount: 54,
      errors: 3,
      semester: 'Semester 2'
    },
    link: '/exam/results',
    icon: '📄',
    priority: 'HIGH'
  },
  {
    id: 4,
    type: ACTIVITY_TYPES.NEWS_UPLOAD,
    title: 'University Announcement',
    description: 'Important notice about exam schedule changes',
    timestamp: subHours(new Date(), 6),
    status: ACTIVITY_STATUS.READ,
    metadata: {
      poster: 'Prof. Silva',
      topic: 'Exam Schedule Update - December 2025',
      targetFaculties: ['ICT', 'BBA', 'CST'],
      category: 'Academic'
    },
    link: '/exam/news',
    icon: '📰',
    priority: 'MEDIUM'
  },
  {
    id: 5,
    type: ACTIVITY_TYPES.TIMETABLE_UPLOAD,
    title: 'Exam Timetable Updated',
    description: 'Final exam timetable for ICT faculty uploaded',
    timestamp: subHours(new Date(), 8),
    status: ACTIVITY_STATUS.INFO,
    metadata: {
      uploader: 'Exam Division',
      faculty: 'ICT',
      format: 'PDF',
      fileSize: '2.4 MB',
      academicYear: '2024/2025'
    },
    link: '/exam/time-table',
    icon: '📅',
    priority: 'MEDIUM'
  },
  {
    id: 6,
    type: ACTIVITY_TYPES.COMPLIANCE,
    title: 'Result Verification Request',
    description: 'Student requesting result verification for BBA Finance',
    timestamp: subHours(new Date(), 10),
    status: ACTIVITY_STATUS.NEW,
    metadata: {
      sender: 'Sarah Wilson',
      studentId: 'EN20201004',
      module: 'Financial Management',
      complianceType: 'Result Verification'
    },
    link: '/admin/compliance/2',
    icon: '📣',
    priority: 'MEDIUM'
  },
  {
    id: 7,
    type: ACTIVITY_TYPES.SYSTEM_MAINTENANCE,
    title: 'System Update Completed',
    description: 'Platform maintenance and security patches applied',
    timestamp: subHours(new Date(), 12),
    status: ACTIVITY_STATUS.INFO,
    metadata: {
      admin: 'System Administrator',
      updateType: 'Security Patch',
      affectedModules: ['Student Portal', 'Admin Dashboard'],
      downtime: '15 minutes',
      version: 'v1.2.1'
    },
    link: '/admin/system-logs',
    icon: '🛠️',
    priority: 'LOW'
  },
  {
    id: 8,
    type: ACTIVITY_TYPES.STUDENT_REGISTRATION,
    title: 'New Student Registration',
    description: 'Mike Chen joined the system',
    timestamp: subDays(new Date(), 1),
    status: ACTIVITY_STATUS.READ,
    metadata: {
      studentName: 'Mike Chen',
      enrollmentNumber: 'EN20241005',
      degree: 'BSc in Data Science',
      department: 'CST',
      registrationDate: subDays(new Date(), 1)
    },
    link: '/admin/students',
    icon: '👨‍🎓',
    priority: 'MEDIUM'
  },
  {
    id: 9,
    type: ACTIVITY_TYPES.RESULT_UPLOAD,
    title: 'Assignment Results Posted',
    description: 'BBA Marketing assignment results uploaded',
    timestamp: subDays(new Date(), 1),
    status: ACTIVITY_STATUS.INFO,
    metadata: {
      uploader: 'Dr. Priya Sharma',
      year: '3rd Year',
      degree: 'BBA in Marketing',
      department: 'BBA',
      resultCount: 28,
      errors: 0,
      assignmentType: 'Mid-term Assignment'
    },
    link: '/exam/results',
    icon: '📄',
    priority: 'MEDIUM'
  },
  {
    id: 10,
    type: ACTIVITY_TYPES.TIMETABLE_UPLOAD,
    title: 'Lecture Timetable Updated',
    description: 'Weekly lecture schedule for EET department',
    timestamp: subDays(new Date(), 2),
    status: ACTIVITY_STATUS.READ,
    metadata: {
      uploader: 'Academic Office',
      faculty: 'EET',
      format: 'PDF',
      fileSize: '1.8 MB',
      weekRange: 'Week 10-12'
    },
    link: '/exam/time-table',
    icon: '📅',
    priority: 'LOW'
  },
  {
    id: 11,
    type: ACTIVITY_TYPES.COMPLIANCE,
    title: 'Attendance Appeal',
    description: 'Student appealing attendance shortage',
    timestamp: subDays(new Date(), 2),
    status: ACTIVITY_STATUS.READ,
    metadata: {
      sender: 'David Kumar',
      studentId: 'EN20251007',
      module: 'Business Analytics',
      complianceType: 'Attendance Appeal'
    },
    link: '/admin/compliance/3',
    icon: '📣',
    priority: 'MEDIUM'
  },
  {
    id: 12,
    type: ACTIVITY_TYPES.SYSTEM_MAINTENANCE,
    title: 'Database Backup Completed',
    description: 'Weekly database backup and optimization',
    timestamp: subDays(new Date(), 3),
    status: ACTIVITY_STATUS.INFO,
    metadata: {
      admin: 'Database Administrator',
      updateType: 'Routine Backup',
      affectedModules: ['All Systems'],
      downtime: '5 minutes',
      backupSize: '2.1 GB'
    },
    link: '/admin/system-logs',
    icon: '🛠️',
    priority: 'LOW'
  }
];

// Activity color schemes
export const activityColors = {
  [ACTIVITY_TYPES.COMPLIANCE]: {
    bg: 'bg-orange-50',
    border: 'border-orange-500',
    text: 'text-orange-800',
    badge: 'bg-orange-100 text-orange-800'
  },
  [ACTIVITY_TYPES.RESULT_UPLOAD]: {
    bg: 'bg-blue-50',
    border: 'border-blue-600',
    text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-800'
  },
  [ACTIVITY_TYPES.RESULT_DELETED]: {
    bg: 'bg-red-50',
    border: 'border-red-600',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-800'
  },
  [ACTIVITY_TYPES.TIMETABLE_UPLOAD]: {
    bg: 'bg-purple-50',
    border: 'border-purple-600',
    text: 'text-purple-800',
    badge: 'bg-purple-100 text-purple-800'
  },
  [ACTIVITY_TYPES.NEWS_UPLOAD]: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  [ACTIVITY_TYPES.STUDENT_REGISTRATION]: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-800',
    badge: 'bg-green-100 text-green-800'
  },
  [ACTIVITY_TYPES.SYSTEM_MAINTENANCE]: {
    bg: 'bg-gray-100',
    border: 'border-gray-500',
    text: 'text-gray-700',
    badge: 'bg-gray-200 text-gray-700'
  }
};

// Activity category labels
export const activityLabels = {
  [ACTIVITY_TYPES.COMPLIANCE]: 'Compliance',
  [ACTIVITY_TYPES.RESULT_UPLOAD]: 'Result Upload',
  [ACTIVITY_TYPES.TIMETABLE_UPLOAD]: 'Timetable',
  [ACTIVITY_TYPES.NEWS_UPLOAD]: 'News',
  [ACTIVITY_TYPES.STUDENT_REGISTRATION]: 'Registration',
  [ACTIVITY_TYPES.SYSTEM_MAINTENANCE]: 'System'
};