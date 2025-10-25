import { subDays, subHours } from 'date-fns';

// Mock data for student result uploads
export const mockResultUploads = [
  {
    id: "res_001",
    date: subHours(new Date(), 2),
    degree: "ICT",
    subject: "Database Management Systems",
    level: 200,
    semester: 4,
    uploadedBy: {
      name: "Lahiru Jayasooriya",
      id: "EXM20251100",
      memberId: "132",
      email: "lahiru.j@university.edu",
      department: "ICT"
    },
    statistics: {
      totalStudents: 45,
      passedStudents: 38,
      failedStudents: 7,
      averageGrade: 72.5,
      highestGrade: 95,
      lowestGrade: 32
    },
    status: "completed",
    fileSize: "2.1 MB",
    uploadTime: "2 minutes"
  },
  {
    id: "res_002",
    date: subHours(new Date(), 6),
    degree: "CST",
    subject: "Data Structures and Algorithms",
    level: 200,
    semester: 3,
    uploadedBy: {
      name: "Kamani Perera",
      id: "EXM20251101",
      memberId: "145",
      email: "kamani.p@university.edu",
      department: "CST"
    },
    statistics: {
      totalStudents: 52,
      passedStudents: 47,
      failedStudents: 5,
      averageGrade: 78.2,
      highestGrade: 98,
      lowestGrade: 41
    },
    status: "completed",
    fileSize: "2.8 MB",
    uploadTime: "3 minutes"
  },
  {
    id: "res_003",
    date: subHours(new Date(), 12),
    degree: "EET",
    subject: "Circuit Analysis",
    level: 100,
    semester: 2,
    uploadedBy: {
      name: "Ruwan Silva",
      id: "EXM20251102",
      memberId: "167",
      email: "ruwan.s@university.edu",
      department: "EET"
    },
    statistics: {
      totalStudents: 38,
      passedStudents: 32,
      failedStudents: 6,
      averageGrade: 69.8,
      highestGrade: 89,
      lowestGrade: 28
    },
    status: "completed",
    fileSize: "1.9 MB",
    uploadTime: "1 minute"
  },
  {
    id: "res_004",
    date: subDays(new Date(), 1),
    degree: "ICT",
    subject: "Object Oriented Programming",
    level: 200,
    semester: 3,
    uploadedBy: {
      name: "Nimali Fernando",
      id: "EXM20251103",
      memberId: "189",
      email: "nimali.f@university.edu",
      department: "ICT"
    },
    statistics: {
      totalStudents: 48,
      passedStudents: 41,
      failedStudents: 7,
      averageGrade: 74.1,
      highestGrade: 92,
      lowestGrade: 35
    },
    status: "completed",
    fileSize: "2.4 MB",
    uploadTime: "2 minutes"
  },
  {
    id: "res_005",
    date: subDays(new Date(), 1),
    degree: "BBST",
    subject: "Business Statistics",
    level: 100,
    semester: 1,
    uploadedBy: {
      name: "Pradeep Kumar",
      id: "EXM20251104",
      memberId: "201",
      email: "pradeep.k@university.edu",
      department: "BBST"
    },
    statistics: {
      totalStudents: 42,
      passedStudents: 35,
      failedStudents: 7,
      averageGrade: 68.9,
      highestGrade: 87,
      lowestGrade: 29
    },
    status: "completed",
    fileSize: "2.2 MB",
    uploadTime: "4 minutes"
  },
  {
    id: "res_006",
    date: subDays(new Date(), 2),
    degree: "CST",
    subject: "Computer Networks",
    level: 300,
    semester: 5,
    uploadedBy: {
      name: "Saman Rathnayake",
      id: "EXM20251105",
      memberId: "224",
      email: "saman.r@university.edu",
      department: "CST"
    },
    statistics: {
      totalStudents: 35,
      passedStudents: 31,
      failedStudents: 4,
      averageGrade: 79.6,
      highestGrade: 96,
      lowestGrade: 44
    },
    status: "completed",
    fileSize: "1.8 MB",
    uploadTime: "2 minutes"
  },
  {
    id: "res_007",
    date: subDays(new Date(), 2),
    degree: "BBA",
    subject: "Financial Management",
    level: 300,
    semester: 6,
    uploadedBy: {
      name: "Chandani Wickramasinghe",
      id: "EXM20251106",
      memberId: "245",
      email: "chandani.w@university.edu",
      department: "BBA"
    },
    statistics: {
      totalStudents: 39,
      passedStudents: 33,
      failedStudents: 6,
      averageGrade: 71.4,
      highestGrade: 88,
      lowestGrade: 31
    },
    status: "completed",
    fileSize: "2.1 MB",
    uploadTime: "3 minutes"
  },
  {
    id: "res_008",
    date: subDays(new Date(), 3),
    degree: "ICT",
    subject: "Web Development",
    level: 300,
    semester: 5,
    uploadedBy: {
      name: "Lahiru Jayasooriya",
      id: "EXM20251100",
      memberId: "132",
      email: "lahiru.j@university.edu",
      department: "ICT"
    },
    statistics: {
      totalStudents: 44,
      passedStudents: 40,
      failedStudents: 4,
      averageGrade: 81.2,
      highestGrade: 97,
      lowestGrade: 48
    },
    status: "completed",
    fileSize: "3.1 MB",
    uploadTime: "5 minutes"
  },
  {
    id: "res_009",
    date: subDays(new Date(), 3),
    degree: "EET",
    subject: "Digital Electronics",
    level: 200,
    semester: 4,
    uploadedBy: {
      name: "Ruwan Silva",
      id: "EXM20251102",
      memberId: "167",
      email: "ruwan.s@university.edu",
      department: "EET"
    },
    statistics: {
      totalStudents: 41,
      passedStudents: 36,
      failedStudents: 5,
      averageGrade: 73.8,
      highestGrade: 91,
      lowestGrade: 39
    },
    status: "completed",
    fileSize: "2.3 MB",
    uploadTime: "3 minutes"
  },
  {
    id: "res_010",
    date: subDays(new Date(), 4),
    degree: "BBST",
    subject: "Research Methodology",
    level: 400,
    semester: 7,
    uploadedBy: {
      name: "Pradeep Kumar",
      id: "EXM20251104",
      memberId: "201",
      email: "pradeep.k@university.edu",
      department: "BBST"
    },
    statistics: {
      totalStudents: 28,
      passedStudents: 25,
      failedStudents: 3,
      averageGrade: 76.5,
      highestGrade: 93,
      lowestGrade: 42
    },
    status: "completed",
    fileSize: "1.7 MB",
    uploadTime: "2 minutes"
  },
  {
    id: "res_011",
    date: subDays(new Date(), 5),
    degree: "CST",
    subject: "Software Engineering",
    level: 300,
    semester: 6,
    uploadedBy: {
      name: "Kamani Perera",
      id: "EXM20251101",
      memberId: "145",
      email: "kamani.p@university.edu",
      department: "CST"
    },
    statistics: {
      totalStudents: 37,
      passedStudents: 34,
      failedStudents: 3,
      averageGrade: 82.1,
      highestGrade: 99,
      lowestGrade: 51
    },
    status: "completed",
    fileSize: "2.6 MB",
    uploadTime: "4 minutes"
  },
  {
    id: "res_012",
    date: subDays(new Date(), 6),
    degree: "BBA",
    subject: "Marketing Management",
    level: 200,
    semester: 4,
    uploadedBy: {
      name: "Chandani Wickramasinghe",
      id: "EXM20251106",
      memberId: "245",
      email: "chandani.w@university.edu",
      department: "BBA"
    },
    statistics: {
      totalStudents: 43,
      passedStudents: 38,
      failedStudents: 5,
      averageGrade: 70.7,
      highestGrade: 86,
      lowestGrade: 33
    },
    status: "completed",
    fileSize: "2.4 MB",
    uploadTime: "3 minutes"
  },
  {
    id: "res_013",
    date: subDays(new Date(), 7),
    degree: "ICT",
    subject: "Machine Learning",
    level: 400,
    semester: 8,
    uploadedBy: {
      name: "Nimali Fernando",
      id: "EXM20251103",
      memberId: "189",
      email: "nimali.f@university.edu",
      department: "ICT"
    },
    statistics: {
      totalStudents: 31,
      passedStudents: 28,
      failedStudents: 3,
      averageGrade: 84.3,
      highestGrade: 98,
      lowestGrade: 55
    },
    status: "completed",
    fileSize: "2.9 MB",
    uploadTime: "6 minutes"
  },
  {
    id: "res_014",
    date: subDays(new Date(), 8),
    degree: "EET",
    subject: "Power Systems",
    level: 400,
    semester: 7,
    uploadedBy: {
      name: "Saman Rathnayake",
      id: "EXM20251105",
      memberId: "224",
      email: "saman.r@university.edu",
      department: "CST"
    },
    statistics: {
      totalStudents: 26,
      passedStudents: 23,
      failedStudents: 3,
      averageGrade: 77.9,
      highestGrade: 94,
      lowestGrade: 46
    },
    status: "completed",
    fileSize: "2.0 MB",
    uploadTime: "3 minutes"
  },
  {
    id: "res_015",
    date: subDays(new Date(), 10),
    degree: "BBST",
    subject: "Operations Management",
    level: 300,
    semester: 5,
    uploadedBy: {
      name: "Pradeep Kumar",
      id: "EXM20251104",
      memberId: "201",
      email: "pradeep.k@university.edu",
      department: "BBST"
    },
    statistics: {
      totalStudents: 34,
      passedStudents: 29,
      failedStudents: 5,
      averageGrade: 72.3,
      highestGrade: 89,
      lowestGrade: 37
    },
    status: "completed",
    fileSize: "2.1 MB",
    uploadTime: "2 minutes"
  }
];

// Degree options for filtering
export const degreeOptions = [
  { value: 'all', label: 'All Degrees' },
  { value: 'ICT', label: 'ICT - Information & Communication Technology' },
  { value: 'CST', label: 'CST - Computer Science & Technology' },
  { value: 'EET', label: 'EET - Electrical & Electronic Technology' },
  { value: 'BBST', label: 'BBST - Bachelor of Business Studies' },
  { value: 'BBA', label: 'BBA - Bachelor of Business Administration' }
];

// Level options for filtering
export const levelOptions = [
  { value: 'all', label: 'All Levels' },
  { value: '100', label: '100 Level' },
  { value: '200', label: '200 Level' },
  { value: '300', label: '300 Level' },
  { value: '400', label: '400 Level' }
];

// Semester options for filtering
export const semesterOptions = [
  { value: 'all', label: 'All Semesters' },
  { value: '1', label: 'Semester 1' },
  { value: '2', label: 'Semester 2' },
  { value: '3', label: 'Semester 3' },
  { value: '4', label: 'Semester 4' },
  { value: '5', label: 'Semester 5' },
  { value: '6', label: 'Semester 6' },
  { value: '7', label: 'Semester 7' },
  { value: '8', label: 'Semester 8' }
];

// Status options for filtering
export const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'processing', label: 'Processing' },
  { value: 'failed', label: 'Failed' }
];

// Export helper functions
export const getTotalResults = () => mockResultUploads.length;
export const getResultsByDegree = (degree) => 
  degree === 'all' ? mockResultUploads : mockResultUploads.filter(result => result.degree === degree);
export const getResultsByLevel = (level) => 
  level === 'all' ? mockResultUploads : mockResultUploads.filter(result => result.level.toString() === level);
export const getResultsBySemester = (semester) => 
  semester === 'all' ? mockResultUploads : mockResultUploads.filter(result => result.semester.toString() === semester);
export const getResultById = (id) => mockResultUploads.find(result => result.id === id);