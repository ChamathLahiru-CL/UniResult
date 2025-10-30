import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon, PaperClipIcon, UserGroupIcon } from '@heroicons/react/24/outline';

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

  const importanceColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Submit Compliance</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please fill out the form below to submit your compliance to the Exam Division.
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
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.topic ? 'border-red-500' : ''}`}
              placeholder="Enter the main topic of your compliance"
            />
            {errors.topic && (
              <p className="mt-1 text-sm text-red-600">{errors.topic}</p>
            )}
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
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.recipient ? 'border-red-500' : ''}`}
            >
              <option value="">Select recipient...</option>
              <option value="admin">Admin</option>
              <option value="exam-division">Exam Division</option>
            </select>
            {errors.recipient && (
              <p className="mt-1 text-sm text-red-600">{errors.recipient}</p>
            )}
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
              {Object.keys(importanceColors).map((level) => (
                <option
                  key={level}
                  value={level}
                  className={importanceColors[level]}
                >
                  {level}
                </option>
              ))}
            </select>
            {errors.importance && (
              <p className="mt-1 text-sm text-red-600">{errors.importance}</p>
            )}
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
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload files</span>
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
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, PDF, TXT, DOCX up to 10MB each
                </p>
              </div>
            </div>
            {files.length > 0 && (
              <ul className="mt-2 divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="py-2 flex items-center text-sm text-gray-600">
                    <PaperClipIcon className="h-5 w-5 mr-2 text-gray-400" />
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Group Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select which group to send this to
            </label>
            <div className="space-y-2">
              {['Teachers', 'Exam Officers', 'Admin Staff'].map((group) => (
                <label key={group} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.selectedGroups.includes(group)}
                    onChange={() => handleGroupChange(group)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{group}</span>
                </label>
              ))}
            </div>
            {errors.groups && (
              <p className="mt-1 text-sm text-red-600">{errors.groups}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Submit Compliance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompliancePage;