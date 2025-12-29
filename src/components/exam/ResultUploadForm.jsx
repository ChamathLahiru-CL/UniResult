import React, { useState } from 'react';
import { CloudArrowUpIcon, DocumentIcon, PhotoIcon, XMarkIcon, DocumentTextIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { facultyOptions } from '../../data/mockTimeTables';
import { departmentOptions, creditOptions, levelOptions, semesterOptions } from '../../data/mockResults';
import { validateFileType, getFileType, formatFileSize } from '../../utils/validateFileType';
import { notificationDispatcher, showNotificationToast } from '../../utils/notificationDispatcher';
import UploadProgressBar from './UploadProgressBar';

const ResultUploadForm = ({ onUploadSuccess }) => {
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCredits, setSelectedCredits] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setError('');

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const validation = validateFileType(file);
    if (!validation.isValid) {
      setError(validation.error);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (getFileType(file) === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    // Reset file input
    const fileInput = document.getElementById('result-file-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFaculty || !selectedDepartment || !selectedLevel || !selectedSemester || !selectedCredits || !subjectName || !selectedFile) {
      setError('Please fill all required fields and select a file before uploading.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    console.log('📤 Starting PDF upload...');
    console.log('Form data:', {
      faculty: selectedFaculty,
      department: selectedDepartment,
      level: selectedLevel,
      semester: selectedSemester,
      credits: selectedCredits,
      subjectName,
      courseCode,
      academicYear,
      degreeProgram,
      file: selectedFile?.name
    });

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('faculty', selectedFaculty);
      formData.append('department', selectedDepartment);
      formData.append('level', selectedLevel);
      formData.append('semester', selectedSemester);
      formData.append('credits', selectedCredits);
      formData.append('subjectName', subjectName);
      formData.append('courseCode', courseCode || '');
      formData.append('academicYear', academicYear || '');
      formData.append('degreeProgram', degreeProgram || '');

      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('🚀 Sending request to backend...');
      
      const response = await fetch('http://localhost:5000/api/results/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Upload failed:', errorData);
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result);

      // Dispatch notifications
      await notificationDispatcher(result.data);

      // Show success message
      showNotificationToast('success', `Result sheet uploaded successfully for ${subjectName}!`);

      // Reset form
      resetForm();

      // Call success callback with transformed data
      const transformedData = {
        id: result.data._id,
        faculty: result.data.faculty,
        department: result.data.department,
        year: result.data.year,
        credits: result.data.credits,
        subjectName: result.data.subjectName,
        uploadedBy: result.data.uploadedByName,
        uploadedByUsername: result.data.uploadedByUsername,
        uploadedByEmail: result.data.uploadedByEmail,
        uploadedByRole: result.data.uploadedByRole,
        fileName: result.data.originalFileName,
        fileUrl: result.data.fileUrl,
        type: result.data.fileType,
        uploadedAt: result.data.createdAt,
        fileSize: formatFileSize(result.data.fileSize)
      };

      onUploadSuccess(transformedData);

    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Upload failed. Please try again.');
      showNotificationToast('error', error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setSelectedFaculty('');
    setSelectedDepartment('');
    setSelectedLevel('');
    setSelectedSemester('');
    setSelectedCredits('');
    setSubjectName('');
    setCourseCode('');
    setAcademicYear('');
    setDegreeProgram('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    const fileInput = document.getElementById('result-file-upload');
    if (fileInput) fileInput.value = '';
  };

  const isFormValid = selectedFaculty && selectedDepartment && selectedLevel && selectedSemester && selectedCredits && subjectName && selectedFile && !isUploading;

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <DocumentIcon className="w-4 h-4 text-red-500" />;
      case 'docx':
        return <DocumentTextIcon className="w-4 h-4 text-blue-500" />;
      case 'excel':
        return <TableCellsIcon className="w-4 h-4 text-green-500" />;
      case 'image':
        return <PhotoIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <DocumentIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <CloudArrowUpIcon className="h-6 w-6 text-[#246BFD]" />
        <h2 className="text-xl font-semibold text-gray-900">Upload New Result Sheet</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject Name */}
        <div>
          <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-2">
            Subject Name <span className="text-red-500">*</span>
          </label>
          <input
            id="subjectName"
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            disabled={isUploading}
            placeholder="Enter subject name"
            className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Faculty and Department Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Faculty Selection */}
          <div>
            <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
              Select Faculty <span className="text-red-500">*</span>
            </label>
            <select
              id="faculty"
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value);
                setSelectedDepartment(''); // Reset department when faculty changes
              }}
              disabled={isUploading}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Choose a faculty...</option>
              {facultyOptions.map((faculty) => (
                <option key={faculty.value} value={faculty.value}>
                  {faculty.label}
                </option>
              ))}
            </select>
          </div>

          {/* Department Selection */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Select Department <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              disabled={isUploading || !selectedFaculty}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Choose a department...</option>
              {departmentOptions
                .filter(dept => {
                  // Filter departments based on selected faculty
                  const facultyDeptMap = {
                    'Faculty of Technological Studies': ['ICT', 'ET', 'BST'],
                    'Faculty of Applied Science': ['SET', 'CST', 'IIT'],
                    'Faculty of Management': ['ENM', 'EAG', 'English Lit'],
                    'Faculty of Agriculture': ['TEA'],
                    'Faculty of Medicine': ['DOC']
                  };
                  return facultyDeptMap[selectedFaculty]?.includes(dept.value);
                })
                .map((department) => (
                  <option key={department.value} value={department.value}>
                    {department.label}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Level, Semester and Credits Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level Selection */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              Select Level <span className="text-red-500">*</span>
            </label>
            <select
              id="level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              disabled={isUploading}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Choose a level...</option>
              {levelOptions.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Selection */}
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
              Select Semester <span className="text-red-500">*</span>
            </label>
            <select
              id="semester"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={isUploading}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Choose a semester...</option>
              {semesterOptions.map((semester) => (
                <option key={semester.value} value={semester.value}>
                  {semester.label}
                </option>
              ))}
            </select>
          </div>

          {/* Credits Selection */}
          <div>
            <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-2">
              Select Credits <span className="text-red-500">*</span>
            </label>
            <select
              id="credits"
              value={selectedCredits}
              onChange={(e) => setSelectedCredits(e.target.value)}
              disabled={isUploading}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Choose credits...</option>
              {creditOptions.map((credit) => (
                <option key={credit.value} value={credit.value}>
                  {credit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Code, Academic Year and Degree Program Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Course Code */}
          <div>
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-2">
              Course Code
            </label>
            <input
              id="courseCode"
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              disabled={isUploading}
              placeholder="e.g., ICT 233"
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Academic Year */}
          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
            <input
              id="academicYear"
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              disabled={isUploading}
              placeholder="e.g., 2024/2025"
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Degree Program */}
          <div>
            <label htmlFor="degreeProgram" className="block text-sm font-medium text-gray-700 mb-2">
              Degree Program
            </label>
            <input
              id="degreeProgram"
              type="text"
              value={degreeProgram}
              onChange={(e) => setDegreeProgram(e.target.value)}
              disabled={isUploading}
              placeholder="e.g., Bachelor of ICT"
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#246BFD] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="result-file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Result Sheet <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              id="result-file-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.docx,.xls,.xlsx"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            <label
              htmlFor="result-file-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${selectedFile
                  ? 'border-green-300 bg-green-50'
                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                }
                ${isUploading ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudArrowUpIcon className="w-8 h-8 mb-3 text-slate-400" />
                <p className="mb-2 text-sm text-slate-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">PDF, DOCX, Excel, JPG, PNG (MAX. 10MB)</p>
              </div>
            </label>
          </div>
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-300"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(getFileType(selectedFile))}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getFileIcon(getFileType(selectedFile))}
                    <span className="text-xs text-gray-600 capitalize">
                      {getFileType(selectedFile)} File
                    </span>
                  </div>
                </div>
              </div>
              {!isUploading && (
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        <UploadProgressBar progress={uploadProgress} isVisible={isUploading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors
            ${isFormValid
              ? 'bg-[#246BFD] text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isUploading ? 'Uploading...' : 'Upload Result Sheet'}
        </button>
      </form>
    </div>
  );
};

export default ResultUploadForm;