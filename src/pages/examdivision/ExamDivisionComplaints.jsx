import { useState, useEffect, useCallback } from 'react';
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
  ChevronUpIcon,
  DocumentTextIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

const ExamDivisionComplaints = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' or 'history'
  const [formData, setFormData] = useState({
    topic: '',
    importance: '',
    message: '',
    category: '',
    recipient: '',
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Past complaints state
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [expandedComplaint, setExpandedComplaint] = useState(null);

  const fetchComplaints = useCallback(async () => {
    setLoadingComplaints(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch('http://localhost:5000/api/compliance/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data.data || []);
      } else {
        console.error('Failed to fetch complaints');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoadingComplaints(false);
    }
  }, [navigate]);

  // Fetch user's past complaints
  useEffect(() => {
    if (activeTab === 'history') {
      fetchComplaints();
    }
  }, [activeTab, fetchComplaints]);

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
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.importance) {
      newErrors.importance = 'Please select importance level';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (!formData.recipient) {
      newErrors.recipient = 'Please select a recipient';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('topic', formData.topic);
      formDataToSend.append('recipient', formData.recipient.toLowerCase());
      formDataToSend.append('importance', formData.importance);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('selectedGroups', JSON.stringify([formData.category])); // Single category as array

      // Add files
      files.forEach(file => {
        formDataToSend.append('attachments', file);
      });

      const response = await fetch('http://localhost:5000/api/compliance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          topic: '',
          importance: '',
          message: '',
          category: '',
          recipient: '',
        });
        setFiles([]);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        setErrors({ submit: data.message || 'Failed to submit complaint' });
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpanded = (complaintId) => {
    setExpandedComplaint(expandedComplaint === complaintId ? null : complaintId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
              <ExclamationTriangleIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Submit Complaint
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Report issues or concerns to administrators with our streamlined complaint system
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
              <UserGroupIcon className="h-4 w-4 mr-2" />
              Send complaints to Admin or Students
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${activeTab === 'submit'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Submit Complaint</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${activeTab === 'history'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
            >
              <ClockIcon className="h-5 w-5" />
              <span>Complaint History</span>
            </button>
          </div>
        </div>

        {/* Submit Tab */}
        {activeTab === 'submit' && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <ClipboardDocumentIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">New Complaint</h2>
                  <p className="text-blue-100 mt-1">
                    Fill out the form below to submit your complaint
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Success Message */}
                {submitSuccess && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-green-800">
                          Complaint submitted successfully!
                        </h3>
                        <p className="text-green-700 mt-1">
                          Your complaint has been sent to the administrators and will be reviewed shortly.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errors.submit && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start">
                      <div className="bg-red-100 p-2 rounded-full">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-red-800">
                          Submission Failed
                        </h3>
                        <p className="text-red-700 mt-1">{errors.submit}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Topic Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <div className="bg-blue-100 p-1 rounded mr-2">
                        <ExclamationTriangleIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      Complaint Topic *
                    </label>
                    <input
                      type="text"
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className={`block w-full rounded-xl border-2 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-3 transition-all duration-200 ${errors.topic ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Brief description of the issue"
                    />
                    {errors.topic && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.topic}
                      </p>
                    )}
                  </div>

                  {/* Recipient Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <label htmlFor="recipient" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <div className="bg-indigo-100 p-1 rounded mr-2">
                        <UserGroupIcon className="h-4 w-4 text-indigo-600" />
                      </div>
                      Send To *
                    </label>
                    <select
                      id="recipient"
                      name="recipient"
                      value={formData.recipient}
                      onChange={handleInputChange}
                      className={`block w-full rounded-xl border-2 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-3 transition-all duration-200 ${errors.recipient ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select recipient</option>
                      <option value="Admin">👤 Admin</option>
                      <option value="Students">👥 Students</option>
                    </select>
                    {errors.recipient && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.recipient}
                      </p>
                    )}
                  </div>

                  {/* Category Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <div className="bg-purple-100 p-1 rounded mr-2">
                        <ClipboardDocumentIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`block w-full rounded-xl border-2 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-3 transition-all duration-200 ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select category</option>
                      <option value="System Issues">🖥️ System Issues</option>
                      <option value="Result Management">📊 Result Management</option>
                      <option value="User Access">🔐 User Access</option>
                      <option value="Data Accuracy">📈 Data Accuracy</option>
                      <option value="Performance">⚡ Performance</option>
                      <option value="Other">📝 Other</option>
                    </select>
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Importance Level */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow duration-300">
                    <label htmlFor="importance" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <div className="bg-orange-100 p-1 rounded mr-2">
                        <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />
                      </div>
                      Importance Level *
                    </label>
                    <select
                      id="importance"
                      name="importance"
                      value={formData.importance}
                      onChange={handleInputChange}
                      className={`block w-full rounded-xl border-2 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-3 transition-all duration-200 ${errors.importance ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select importance level</option>
                      <option value="Low">🟢 Low - General inquiry or minor issue</option>
                      <option value="Medium">🟡 Medium - Important issue requiring attention</option>
                      <option value="High">🔴 High - Urgent matter needing immediate attention</option>
                    </select>
                    {errors.importance && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.importance}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="bg-purple-100 p-1 rounded mr-2">
                      <DocumentTextIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    Detailed Description *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={8}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`block w-full rounded-xl border-2 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-3 transition-all duration-200 resize-none ${errors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Please provide detailed information about your complaint, including any specific issues, affected users, or steps to reproduce..."
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* File Attachments Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="bg-green-100 p-1 rounded mr-2">
                      <PaperClipIcon className="h-4 w-4 text-green-600" />
                    </div>
                    Attachments (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-8 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-all duration-300 bg-white/50 hover:bg-blue-50/30">
                    <div className="space-y-3 text-center">
                      <div className="bg-blue-100 p-4 rounded-full inline-block">
                        <PaperClipIcon className="mx-auto h-12 w-12 text-blue-600" />
                      </div>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold px-6 py-3 hover:from-blue-700 hover:to-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-md"
                        >
                          <span>Choose files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                        </label>
                        <span className="ml-3 self-center text-gray-500">or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500 max-w-xs">
                        PDF, DOC, DOCX, JPG, PNG files up to 10MB each
                      </p>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                        <DocumentIcon className="h-4 w-4 mr-2 text-gray-500" />
                        Selected files ({files.length})
                      </h4>
                      <div className="space-y-3">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <DocumentIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFiles(files.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-8 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-bold rounded-2xl shadow-lg text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <ArrowPathIcon className="animate-spin -ml-1 mr-4 h-6 w-6" />
                        Submitting Complaint...
                      </>
                    ) : (
                      <>
                        <PlusCircleIcon className="-ml-1 mr-4 h-6 w-6" />
                        Submit Complaint
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Complaint History</h2>
                  <p className="text-blue-100 mt-1">
                    View all your previously submitted complaints
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {loadingComplaints ? (
                <div className="text-center py-12">
                  <ArrowPathIcon className="animate-spin h-8 w-8 text-gray-400 mx-auto" />
                  <p className="mt-4 text-gray-500">Loading your complaints...</p>
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardDocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't submitted any complaints yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div key={complaint._id} className="border border-gray-200 rounded-lg">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(complaint.status)}
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {complaint.topic}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {formatDate(complaint.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImportanceColor(complaint.importance)}`}>
                              {complaint.importance}
                            </span>
                            <button
                              onClick={() => toggleExpanded(complaint._id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {expandedComplaint === complaint._id ? (
                                <ChevronUpIcon className="h-5 w-5" />
                              ) : (
                                <ChevronDownIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {expandedComplaint === complaint._id && (
                          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
                                <p className="text-sm text-gray-900 font-medium">{complaint.selectedGroups?.[0] || 'N/A'}</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">Importance</p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getImportanceColor(complaint.importance)}`}>
                                  {complaint.importance}
                                </span>
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-3">Description</p>
                              <p className="text-sm text-gray-600 leading-relaxed">{complaint.message}</p>
                            </div>

                            {complaint.attachments && complaint.attachments.length > 0 && (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-3">Attachments</p>
                                <div className="space-y-2">
                                  {complaint.attachments.map((attachment, index) => (
                                    <a
                                      key={index}
                                      href={`http://localhost:5000${attachment.url}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      <PaperClipIcon className="h-4 w-4 mr-2" />
                                      {attachment.originalName}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {complaint.response && (
                              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <p className="text-sm font-medium text-green-800 mb-2">Admin Response</p>
                                <p className="text-sm text-green-700 mb-2">{complaint.response.message}</p>
                                <p className="text-xs text-green-600">
                                  Responded by {complaint.response.respondedByName} on {formatDate(complaint.response.respondedAt)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDivisionComplaints;