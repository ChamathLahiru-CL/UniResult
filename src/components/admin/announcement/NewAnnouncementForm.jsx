import React, { useState } from 'react';
import { PaperAirplaneIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const NewAnnouncementForm = () => {
  const [formData, setFormData] = useState({
    audience: 'all',
    topic: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const audienceOptions = [
    { value: 'all', label: 'All Users', description: 'Send to students and exam division' },
    { value: 'students', label: 'Students', description: 'Send only to student users' },
    { value: 'exam', label: 'Exam Division', description: 'Send only to exam division staff' }
  ];

  const priorityOptions = [
    { 
      value: 'low', 
      label: 'Low Priority', 
      description: 'General information, non-urgent',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    { 
      value: 'medium', 
      label: 'Medium Priority', 
      description: 'Important information, moderate urgency',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      value: 'high', 
      label: 'High Priority', 
      description: 'Urgent information, immediate attention required',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      value: 'critical', 
      label: 'Critical', 
      description: 'Emergency or system-critical announcement',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    } else if (formData.topic.length > 100) {
      newErrors.topic = 'Topic must be less than 100 characters';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleAudienceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      audience: value
    }));
  };

  const simulateAnnouncementDispatch = async (announcementData) => {
    // Simulate API calls
    console.log('Sending announcement:', announcementData);
    
    // Main announcement storage
    console.log('POST /api/admin/announcements', announcementData);
    
    // Dispatch to appropriate notification endpoints
    const notificationData = {
      title: announcementData.topic,
      message: announcementData.message,
      type: 'announcement',
      from: 'Admin',
      timestamp: new Date().toISOString(),
      priority: announcementData.priority
    };
    
    if (announcementData.audience === 'students' || announcementData.audience === 'all') {
      console.log('POST /api/student/notifications', notificationData);
    }
    
    if (announcementData.audience === 'exam' || announcementData.audience === 'all') {
      console.log('POST /api/exam/notifications', notificationData);
    }
    
    // Log to admin activities
    const activityData = {
      type: 'announcement',
      message: `Sent new ${announcementData.priority} priority announcement "${announcementData.topic}" to ${getAudienceLabel(announcementData.audience)}`,
      timestamp: new Date().toISOString(),
      by: 'Admin (Lahiru)'
    };
    console.log('POST /api/admin/activities', activityData);
    
    return Promise.resolve();
  };

  const getAudienceLabel = (audience) => {
    const option = audienceOptions.find(opt => opt.value === audience);
    return option ? option.label : audience;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const announcementData = {
        topic: formData.topic.trim(),
        message: formData.message.trim(),
        audience: formData.audience,
        priority: formData.priority,
        by: 'Admin (Lahiru)',
        timestamp: new Date().toISOString()
      };
      
      await simulateAnnouncementDispatch(announcementData);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Clear form
      setFormData({
        audience: 'all',
        topic: '',
        message: '',
        priority: 'medium'
      });
      
    } catch (error) {
      console.error('Error sending announcement:', error);
      // Handle error (show error toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center space-x-3 mb-6">
        <PaperAirplaneIcon className="h-5 w-5 text-[#246BFD]" />
        <h2 className="text-lg font-semibold text-slate-900">Create New Announcement</h2>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Announcement sent successfully!</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipient Selector */}
        <fieldset className="space-y-3">
          <legend className="font-semibold text-slate-700 text-sm">Send To:</legend>
          <div className="space-y-2">
            {audienceOptions.map((option) => (
              <label key={option.value} className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  value={option.value}
                  name="audience"
                  checked={formData.audience === option.value}
                  onChange={(e) => handleAudienceChange(e.target.value)}
                  className="mt-1 h-4 w-4 text-[#246BFD] focus:ring-[#246BFD] border-slate-300"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900 group-hover:text-[#246BFD]">
                    {option.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Priority Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Priority Level <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange(e)}
            name="priority"
            className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#246BFD] focus:border-[#246BFD] transition-colors bg-white"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            {priorityOptions.map((option) => (
              formData.priority === option.value && (
                <div key={option.value} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${option.bgColor} ${option.color}`}>
                  {option.label}
                </div>
              )
            ))}
          </div>
        </div>

        {/* Topic Input */}
        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700">
            Topic <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            placeholder="Enter announcement topic (e.g., New GPA System Rollout)"
            className={`w-full border ${errors.topic ? 'border-red-300' : 'border-slate-300'} rounded-md px-4 py-2 focus:ring-2 focus:ring-[#246BFD] focus:border-[#246BFD] transition-colors`}
            maxLength={100}
          />
          <div className="flex justify-between items-center">
            {errors.topic && (
              <div className="flex items-center space-x-1 text-red-600 text-xs">
                <ExclamationTriangleIcon className="h-3 w-3" />
                <span>{errors.topic}</span>
              </div>
            )}
            <span className="text-xs text-slate-500 ml-auto">
              {formData.topic.length}/100
            </span>
          </div>
        </div>

        {/* Message Textarea */}
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Enter your announcement message here..."
            rows={5}
            className={`w-full border ${errors.message ? 'border-red-300' : 'border-slate-300'} rounded-md px-4 py-2 focus:ring-2 focus:ring-[#246BFD] focus:border-[#246BFD] transition-colors resize-none`}
          />
          {errors.message && (
            <div className="flex items-center space-x-1 text-red-600 text-xs">
              <ExclamationTriangleIcon className="h-3 w-3" />
              <span>{errors.message}</span>
            </div>
          )}
          <div className="text-xs text-slate-500">
            {formData.message.length} characters (minimum 10)
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 bg-[#246BFD] text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-[#246BFD] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4" />
                <span>Send Announcement</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewAnnouncementForm;