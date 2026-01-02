import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  PaperClipIcon, 
  UserGroupIcon,
  ClipboardDocumentIcon,
  PlusCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const CompliancePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history'); // 'submit' or 'history' - default to history to show status updates
  const [formData, setFormData] = useState({
    topic: '',
    recipient: '',
    importance: '',
    message: '',
    selectedGroups: [],
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Past compliances state
  const [compliances, setCompliances] = useState([]);
  const [loadingCompliances, setLoadingCompliances] = useState(false);
  const [expandedCompliance, setExpandedCompliance] = useState(null);

  // Fetch user's past compliances
  useEffect(() => {
    if (activeTab === 'history') {
      fetchCompliances();
    }
  }, [activeTab]);

  const fetchCompliances = async () => {
    setLoadingCompliances(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setErrors({ fetch: 'You must be logged in' });
        return;
      }

      const response = await fetch('http://localhost:5000/api/compliance/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCompliances(result.data);
      } else {
        setErrors({ fetch: result.message || 'Failed to load compliances' });
      }
    } catch (error) {
      console.error('Error fetching compliances:', error);
      setErrors({ fetch: 'Network error' });
    } finally {
      setLoadingCompliances(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'in-progress':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'closed':
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setErrors({ submit: 'You must be logged in to submit a compliance' });
        setIsSubmitting(false);
        return;
      }

      // Create FormData for file upload
      const submitFormData = new FormData();
      submitFormData.append('topic', formData.topic);
      submitFormData.append('recipient', formData.recipient);
      submitFormData.append('importance', formData.importance);
      submitFormData.append('message', formData.message);
      submitFormData.append('selectedGroups', JSON.stringify(formData.selectedGroups));

      // Append files
      files.forEach((file) => {
        submitFormData.append('attachments', file);
      });

      const response = await fetch('http://localhost:5000/api/compliance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: submitFormData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitSuccess(true);
        
        // Reset form
        setFormData({
          topic: '',
          recipient: '',
          importance: '',
          message: '',
          selectedGroups: []
        });
        setFiles([]);
        
        // Show success message
        setTimeout(() => {
          navigate('/dash/notifications', {
            state: { message: 'Compliance submitted successfully!' }
          });
        }, 2000);
      } else {
        setErrors({ submit: result.message || 'Failed to submit compliance' });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting compliance:', error);
      setErrors({ submit: 'Network error. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
            <ClipboardDocumentIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Compliance Center</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
            Submit new compliance or view your submission history
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-1 flex space-x-1">
            <button
              onClick={() => setActiveTab('submit')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'submit'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Submit New</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ClockIcon className="h-5 w-5" />
              <span>My Compliances</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'submit' ? (
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-blue-100">

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-green-800 font-semibold">Compliance Submitted Successfully!</p>
                <p className="text-green-600 text-sm">Redirecting to notifications...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <p className="text-red-800 font-semibold">Submission Failed</p>
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Topic Input */}
          <div className="border-b pb-4 sm:pb-6">
            <div className="flex items-center mb-2">
              <div className="bg-blue-50 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3">
                <ClipboardDocumentIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <label htmlFor="topic" className="text-base sm:text-lg font-medium text-gray-900">
                Main Topic
              </label>
            </div>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-lg border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base
                transition-all duration-200 hover:border-blue-300 p-3
                ${errors.topic ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              placeholder="E.g., Result Discrepancy, Exam Schedule Issue"
            />
            {errors.topic && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {errors.topic}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="font-medium text-blue-600">💡 Tip:</span> Choose a clear, specific topic that best describes your compliance
            </p>
          </div>

          {/* Recipient Select */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <UserGroupIcon className="h-5 w-5 text-purple-600" />
              </div>
              <label htmlFor="recipient" className="block text-lg font-semibold text-gray-900">
                Who to send to?
              </label>
            </div>
            <select
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-lg border-2 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base
                transition-all duration-200 hover:border-purple-300 p-3
                ${errors.recipient ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
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
            <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="font-medium text-purple-600">💡 Tip:</span> Select the appropriate department to handle your compliance
            </p>
          </div>

          {/* Importance Select */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
              </div>
              <label htmlFor="importance" className="block text-lg font-semibold text-gray-900">
                Compliance Importance
              </label>
            </div>
            <select
              id="importance"
              name="importance"
              value={formData.importance}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-lg border-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-base
                transition-all duration-200 hover:border-amber-300 p-3
                ${errors.importance ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
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
            <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="font-medium text-amber-600">💡 Tip:</span> Select the urgency level that best matches your compliance needs
            </p>
          </div>

          {/* Message Textarea */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <label htmlFor="message" className="block text-lg font-semibold text-gray-900">
                Message
              </label>
            </div>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-lg border-2 shadow-sm focus:border-green-500 focus:ring-green-500 text-base
                transition-all duration-200 hover:border-green-300 p-3
                ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              placeholder="Describe your compliance in detail..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <PaperClipIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <label className="block text-lg font-semibold text-gray-900">
                Attachments
              </label>
            </div>
            <div className="mt-1 flex justify-center px-3 sm:px-6 py-4 sm:py-6 border-2 border-indigo-200 border-dashed rounded-lg bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200">
              <div className="space-y-2 sm:space-y-3 text-center">
                <div className="flex flex-col items-center">
                  <PaperClipIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-blue-500 mb-2" />
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <label htmlFor="file-upload" className="relative cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 hover:bg-blue-50 border border-blue-200 transition-all duration-200">
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
                    <span className="text-xs sm:text-sm text-gray-600">or drag and drop</span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-[10px] sm:text-xs text-gray-500 space-y-1">
                  <p>Accepted: PNG, JPG, PDF, TXT, DOCX</p>
                  <p>Max size: 10MB per file</p>
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
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-rose-100 rounded-lg mr-3">
                <UserGroupIcon className="h-5 w-5 text-rose-600" />
              </div>
              <label className="block text-lg font-semibold text-gray-900">
                Select which group to send this to
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {['Teachers', 'Exam Officers', 'Admin Staff'].map((group) => (
                <label
                  key={group}
                  className={`relative flex items-center p-2 sm:p-4 cursor-pointer rounded-lg border ${
                    formData.selectedGroups.includes(group)
                      ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  } transition-all duration-200`}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedGroups.includes(group)}
                    onChange={() => handleGroupChange(group)}
                    className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-2 sm:ml-3">
                    <span className={`text-xs sm:text-sm ${formData.selectedGroups.includes(group) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
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
              disabled={isSubmitting || submitSuccess}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition duration-200 ease-in-out transform ${
                isSubmitting || submitSuccess
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : submitSuccess ? (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Submitted Successfully
                </>
              ) : (
                <>
                  <span className="mr-2">Submit Compliance</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
        ) : (
          // History Tab
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">My Compliance History</h3>
                  <p className="text-sm text-gray-600 mt-1">View and track all your submitted compliances</p>
                </div>
                <button
                  onClick={fetchCompliances}
                  disabled={loadingCompliances}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh compliances"
                >
                  <ArrowPathIcon className={`h-5 w-5 ${loadingCompliances ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {loadingCompliances ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your compliances...</p>
              </div>
            ) : compliances.length === 0 ? (
              <div className="p-12 text-center">
                <ClipboardDocumentIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No compliances yet</p>
                <p className="text-sm text-gray-500">Submit your first compliance using the "Submit New" tab</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {compliances.map((compliance) => (
                  <div key={compliance._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Left side */}
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getStatusIcon(compliance.status)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {compliance.topic}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(compliance.status)}`}>
                                {compliance.status.replace('-', ' ').toUpperCase()}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getImportanceColor(compliance.importance)}`}>
                                {compliance.importance}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                To: {compliance.recipient === 'exam-division' ? 'Exam Division' : 'Admin'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              <ClockIcon className="inline h-4 w-4 mr-1" />
                              Submitted: {formatDate(compliance.createdAt)}
                            </p>
                            {compliance.selectedGroups && compliance.selectedGroups.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {compliance.selectedGroups.map((group, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200">
                                    {group}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedCompliance === compliance._id && (
                          <div className="mt-4 pl-8 space-y-4 animate-fadeIn">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">Message:</h5>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap">{compliance.message}</p>
                            </div>

                            {compliance.attachments && compliance.attachments.length > 0 && (
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Attachments:</h5>
                                <div className="space-y-2">
                                  {compliance.attachments.map((attachment, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                      <div className="flex items-center space-x-2">
                                        <PaperClipIcon className="h-5 w-5 text-blue-500" />
                                        <span className="text-sm text-gray-700">{attachment.originalName}</span>
                                        <span className="text-xs text-gray-400">
                                          ({(attachment.size / (1024 * 1024)).toFixed(2)} MB)
                                        </span>
                                      </div>
                                      <a
                                        href={`http://localhost:5000${attachment.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                      >
                                        View
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {compliance.response && compliance.response.message && (
                              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <div className="flex items-center space-x-2 mb-2">
                                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                  <h5 className="text-sm font-semibold text-green-800">Admin Response:</h5>
                                </div>
                                <p className="text-sm text-green-700 mb-2">{compliance.response.message}</p>
                                <p className="text-xs text-green-600">
                                  Responded by {compliance.response.respondedByName} on {formatDate(compliance.response.respondedAt)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right side - View Details Button */}
                      <button
                        onClick={() => setExpandedCompliance(expandedCompliance === compliance._id ? null : compliance._id)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        {expandedCompliance === compliance._id ? (
                          <>
                            <ChevronUpIcon className="h-5 w-5" />
                            <span>Hide Details</span>
                          </>
                        ) : (
                          <>
                            <EyeIcon className="h-5 w-5" />
                            <span>View Details</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompliancePage;