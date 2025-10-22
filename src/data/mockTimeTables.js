export const mockTimeTables = [
  {
    id: "tt001",
    faculty: "ICT",
    uploadedBy: "Dr. Sarah Johnson",
    fileName: "ICT_Sem1_Oct_2025.pdf",
    fileUrl: "/mock/ICT_Sem1_Oct_2025.pdf",
    type: "pdf",
    uploadedAt: "2025-10-22T13:00:00Z",
    fileSize: "240 KB"
  },
  {
    id: "tt002",
    faculty: "EET",
    uploadedBy: "Prof. Michael Chen",
    fileName: "EET_Term2_TimeTable.png",
    fileUrl: "/mock/EET_Term2_TimeTable.png",
    type: "image",
    uploadedAt: "2025-10-20T16:45:00Z",
    fileSize: "1.5 MB"
  },
  {
    id: "tt003",
    faculty: "CST",
    uploadedBy: "Dr. Emily Rodriguez",
    fileName: "CST_Final_Exam_Schedule.jpg",
    fileUrl: "/mock/CST_Final_Exam_Schedule.jpg",
    type: "image",
    uploadedAt: "2025-10-19T09:30:00Z",
    fileSize: "890 KB"
  },
  {
    id: "tt004",
    faculty: "BST",
    uploadedBy: "Dr. Sarah Johnson",
    fileName: "BST_Mid_Term_Oct.pdf",
    fileUrl: "/mock/BST_Mid_Term_Oct.pdf",
    type: "pdf",
    uploadedAt: "2025-10-18T14:20:00Z",
    fileSize: "325 KB"
  },
  {
    id: "tt005",
    faculty: "ICT",
    uploadedBy: "Prof. Michael Chen",
    fileName: "ICT_Lab_Schedule.png",
    fileUrl: "/mock/ICT_Lab_Schedule.png",
    type: "image",
    uploadedAt: "2025-10-15T11:15:00Z",
    fileSize: "2.1 MB"
  }
];

export const facultyOptions = [
  { value: "ICT", label: "Information & Communication Technology" },
  { value: "CST", label: "Computer Science & Technology" },
  { value: "EET", label: "Electrical & Electronic Technology" },
  { value: "BST", label: "Biosystems Technology" }
];

export const allowedFileTypes = [
  { type: "application/pdf", extension: ".pdf", name: "PDF" },
  { type: "image/jpeg", extension: ".jpg", name: "JPEG" },
  { type: "image/jpg", extension: ".jpg", name: "JPG" },
  { type: "image/png", extension: ".png", name: "PNG" }
];