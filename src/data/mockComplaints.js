export const mockStudentComplaints = [
  {
    id: "SC001",
    senderType: "student",
    senderName: "Alice Johnson",
    email: "alice.johnson@student.uniresult.edu",
    enrollmentId: "UNI2021001",
    topic: "Grade Discrepancy in Computer Science 101",
    message: "Dear Admin,\n\nI believe there is an error in my final grade for CS101. According to my calculations and the grading rubric provided, I should have received a B+ instead of a C+. I have attached my assignments and exam papers for your review.\n\nI would appreciate if you could look into this matter and provide clarification.\n\nThank you for your time.\n\nBest regards,\nAlice Johnson",
    read: false,
    submittedAt: "2025-10-22T09:15:00Z",
    replies: []
  },
  {
    id: "SC002",
    senderType: "student",
    senderName: "Michael Chen",
    email: "michael.chen@student.uniresult.edu",
    enrollmentId: "UNI2020045",
    topic: "Missing Assignment Grade",
    message: "Hello,\n\nI submitted my Data Structures assignment on October 15th, but I notice it hasn't been graded yet and it's not showing in my transcript. The deadline was October 16th, so I submitted it on time.\n\nCould you please check the status of this assignment?\n\nRegards,\nMichael Chen",
    read: true,
    submittedAt: "2025-10-20T14:30:00Z",
    replies: [
      {
        message: "Hi Michael,\n\nI've checked with the professor and your assignment was received on time. The delay in grading was due to a technical issue with our system. Your grade has now been updated in the system.\n\nBest regards,\nAdmin Team",
        sender: "Admin",
        date: "2025-10-21T10:20:00Z"
      }
    ]
  },
  {
    id: "SC003",
    senderType: "student",
    senderName: "Sarah Rodriguez",
    email: "sarah.rodriguez@student.uniresult.edu",
    enrollmentId: "UNI2022012",
    topic: "Exam Schedule Conflict",
    message: "Dear Administration,\n\nI have two final exams scheduled at the same time on December 15th:\n- Mathematics 202 at 9:00 AM\n- Physics 101 at 9:00 AM\n\nThis creates a conflict that I cannot resolve on my own. Could you please help me reschedule one of these exams?\n\nThank you,\nSarah Rodriguez",
    read: false,
    submittedAt: "2025-10-21T16:45:00Z",
    replies: []
  },
  {
    id: "SC004",
    senderType: "student",
    senderName: "David Williams",
    email: "david.williams@student.uniresult.edu",
    enrollmentId: "UNI2021078",
    topic: "Transcript Request Issue",
    message: "Hi,\n\nI requested an official transcript two weeks ago for my job application, but I haven't received it yet. The application deadline is approaching, and I really need this document.\n\nCould you please expedite this request or let me know the current status?\n\nUrgent response needed.\n\nThanks,\nDavid Williams",
    read: true,
    submittedAt: "2025-10-19T11:20:00Z",
    replies: []
  }
];

export const mockDivisionComplaints = [
  {
    id: "DC001",
    senderType: "exam_officer",
    senderName: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@faculty.uniresult.edu",
    enrollmentId: "FAC2019003",
    topic: "System Access Issues",
    message: "Dear IT Admin,\n\nI'm having trouble accessing the grade submission system. When I try to log in, I get an error message saying 'Invalid credentials' even though I'm using the correct username and password.\n\nThis is urgent as I need to submit final grades by tomorrow.\n\nPlease assist ASAP.\n\nDr. Emily Rodriguez\nComputer Science Department",
    read: false,
    submittedAt: "2025-10-23T08:30:00Z",
    replies: []
  },
  {
    id: "DC002",
    senderType: "exam_officer",
    senderName: "Prof. Michael Thompson",
    email: "michael.thompson@faculty.uniresult.edu",
    enrollmentId: "FAC2018015",
    topic: "Exam Room Allocation Problem",
    message: "Hello Admin Team,\n\nThere's a problem with the exam room allocation for Mathematics 301 final exam. The system shows Room A-101 is assigned, but that room is too small for 45 students.\n\nWe need a larger venue or multiple rooms. The exam is scheduled for next week.\n\nPlease resolve this scheduling conflict.\n\nBest regards,\nProf. Michael Thompson",
    read: true,
    submittedAt: "2025-10-22T13:15:00Z",
    replies: [
      {
        message: "Prof. Thompson,\n\nWe've reassigned your exam to the Main Auditorium which can accommodate 200 students. The updated room information has been sent to all registered students.\n\nAdmin Team",
        sender: "Admin",
        date: "2025-10-22T15:30:00Z"
      }
    ]
  },
  {
    id: "DC003",
    senderType: "exam_officer",
    senderName: "Dr. Lisa Park",
    email: "lisa.park@faculty.uniresult.edu",
    enrollmentId: "FAC2020007",
    topic: "Grade Submission Deadline Extension Request",
    message: "Dear Administration,\n\nDue to a family emergency, I was unable to complete grading for Chemistry 205 by the original deadline. I need a 3-day extension to ensure all grades are accurate and fair.\n\nThe emergency has been resolved, and I can complete grading by October 26th.\n\nPlease confirm if this extension is acceptable.\n\nThank you for understanding,\nDr. Lisa Park",
    read: false,
    submittedAt: "2025-10-23T10:45:00Z",
    replies: []
  }
];

export const complaintTypes = [
  { value: 'student', label: 'Student Compliance' },
  { value: 'division', label: 'Exam Division Compliance' }
];

export const complaintStatuses = [
  { value: 'all', label: 'All Complaints' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' }
];