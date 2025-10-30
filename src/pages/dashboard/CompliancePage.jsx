import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  PaperClipIcon, 
  UserGroupIcon,
  ClipboardDocumentIcon 
} from '@heroicons/react/24/outline';

const CompliancePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    recipient: '',
    importance: '',
    message: '',
    selectedGroups: [],
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const importanceConfig = {
    Low: {
      color: 'bg-green-100 text-green-800',
      icon: '🟢',
      description: 'General inquiry or minor issue'
    },
    Medium: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: '🟡',
      description: 'Important issue requiring attention'
    },
    High: {
      color: 'bg-red-100 text-red-800',
      icon: '🔴',
      description: 'Urgent matter needing immediate attention'
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    setFiles(fileList);
  };

  const handleGroupChange = (group) => {
    setFormData(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(group)
        ? prev.selectedGroups.filter(g => g !== group)
        : [...prev.selectedGroups, group]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }
    if (!formData.recipient) {
      newErrors.recipient = 'Please select a recipient';
    }
    if (!formData.importance) {
      newErrors.importance = 'Please select importance level';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    if (formData.selectedGroups.length === 0) {
      newErrors.groups = 'Please select at least one group';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Mock submission
    console.log('Submitting compliance:', {
      ...formData,
      files: files.map(f => f.name)
    });

    // Show success message
    alert('Compliance submitted successfully!');
    
    // Navigate to notifications section
    navigate('/dash/notifications');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-100 transition-all duration-300 hover:shadow-xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <ClipboardDocumentIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Submit Compliance</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Please fill out the form below to submit your compliance to the Exam Division.
            We'll ensure your request is processed promptly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Input */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Main Topic
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                transition-all duration-200 hover:border-blue-300
                ${errors.topic ? 'border-red-500' : ''}`}
              placeholder="E.g., Result Discrepancy, Exam Schedule Issue"
            />
            {errors.topic && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {errors.topic}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Choose a clear, specific topic that best describes your compliance</p>
          </div>

          {/* Recipient Select */}
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
              Who to send to?
            </label>
            <select
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                transition-all duration-200 hover:border-blue-300
                ${errors.recipient ? 'border-red-500' : ''}`}
            >
              <option value="">Select recipient...</option>
              <option value="admin" className="py-2">Admin</option>
              <option value="exam-division" className="py-2">Exam Division</option>
            </select>
            {errors.recipient && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {errors.recipient}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Select the appropriate department to handle your compliance</p>
          </div>

          {/* Importance Select */}
          <div>
            <label htmlFor="importance" className="block text-sm font-medium text-gray-700">
              Compliance Importance
            </label>
            <select
              id="importance"
              name="importance"
              value={formData.importance}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.importance ? 'border-red-500' : ''}`}
            >
              <option value="">Select importance...</option>
              {Object.entries(importanceConfig).map(([level, config]) => (
                <option
                  key={level}
                  value={level}
                  className={config.color}
                >
                  {config.icon} {level} - {config.description}
                </option>
              ))}
            </select>
            {errors.importance && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {errors.importance}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Select the urgency level of your compliance</p>
          </div>

          {/* Message Textarea */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.message ? 'border-red-500' : ''}`}
              placeholder="Describe your compliance in detail..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-blue-200 border-dashed rounded-lg bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200">
              <div className="space-y-3 text-center">
                <div className="flex flex-col items-center">
                  <PaperClipIcon className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                  <div className="flex items-center space-x-2">
                    <label htmlFor="file-upload" className="relative cursor-pointer px-4 py-2 bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 hover:bg-blue-50 border border-blue-200 transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Choose files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept=".png,.jpg,.pdf,.txt,.docx"
                        className="sr-only"
                      />
                    </label>
                    <span className="text-sm text-gray-600">or drag and drop</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-500 mb-1">
                    Accepted formats: PNG, JPG, PDF, TXT, DOCX
                  </p>
                  <p className="text-xs text-gray-500">
                    Maximum file size: 10MB per file
                  </p>
                </div>
              </div>
            </div>
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200 border border-gray-200">
                  {files.map((file, index) => (
                    <li key={index} className="py-3 px-4 flex items-center text-sm text-gray-600 hover:bg-gray-100 transition-colors duration-150">
                      <PaperClipIcon className="h-5 w-5 mr-3 text-blue-500" />
                      <span className="flex-1">{file.name}</span>
                      <span className="text-xs text-gray-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Group Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select which group to send this to
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Teachers', 'Exam Officers', 'Admin Staff'].map((group) => (
                <label
                  key={group}
                  className={`relative flex items-center p-4 cursor-pointer rounded-lg border ${
                    formData.selectedGroups.includes(group)
                      ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  } transition-all duration-200`}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedGroups.includes(group)}
                    onChange={() => handleGroupChange(group)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <span className={`text-sm ${formData.selectedGroups.includes(group) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {group}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {errors.groups && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {errors.groups}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">Select all relevant groups that should receive this compliance</p>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <div className="bg-gray-50 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">Before submitting:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Ensure all required fields are filled correctly</li>
                    <li>Double-check your attachments</li>
                    <li>Verify selected recipients</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-[1.02]"
            >
              <span className="mr-2">Submit Compliance</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompliancePage;