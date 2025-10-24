export const mockStudents = [
  {
    id: "S1001",
    name: "John Doe",
    year: "2",
    degree: "BSc in Computer Science",
    faculty: "ICT",
    enrollmentNumber: "EN20241001",
    email: "john.doe@uniresult.edu",
    status: "active",
    registeredAt: "2025-10-20T08:30:00Z",
    dob: "2003-05-15",
    address: "123 Campus Drive, University Heights",
    phone: "+94 71 234 5678"
  },
  {
    id: "S1002",
    name: "Jane Smith",
    year: "3",
    degree: "BBA in Marketing",
    faculty: "BBA",
    enrollmentNumber: "EN20231002",
    email: "jane.smith@uniresult.edu",
    status: "active",
    registeredAt: "2025-10-23T10:15:00Z",
    dob: "2002-08-22",
    address: "456 University Avenue, College Park",
    phone: "+94 77 345 6789"
  },
  {
    id: "S1003",
    name: "Alex Johnson",
    year: "1",
    degree: "BSc in IT",
    faculty: "ICT",
    enrollmentNumber: "EN20251003",
    email: "alex.johnson@uniresult.edu",
    status: "suspended",
    registeredAt: "2025-09-15T14:20:00Z",
    dob: "2004-03-10",
    address: "789 Student Lane, Academic City",
    phone: "+94 75 456 7890",
    suspensionReason: "Academic misconduct - Exam violation"
  }
];

export const faculties = [
  { id: "ICT", name: "Information & Communication Technology" },
  { id: "CST", name: "Computing & Software Technology" },
  { id: "BBA", name: "Business Administration" },
  { id: "ENG", name: "Engineering" }
];

export const degrees = {
  ICT: [
    "BSc in Computer Science",
    "BSc in Software Engineering",
    "BSc in Data Science"
  ],
  CST: [
    "BSc in Computing",
    "BSc in Information Systems",
    "BSc in Cybersecurity"
  ],
  BBA: [
    "BBA in Marketing",
    "BBA in Finance",
    "BBA in Human Resource Management"
  ],
  ENG: [
    "BEng in Mechanical Engineering",
    "BEng in Civil Engineering",
    "BEng in Electrical Engineering"
  ]
};