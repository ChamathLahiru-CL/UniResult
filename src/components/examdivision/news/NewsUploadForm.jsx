/**
 * News Management System for UniResult
 * ===================================
 * This module is part of the News page development (October 2025)
 *
 * Purpose:
 * - Provides a form interface for uploading and managing news items
 * - Supports multiple news types (Announcement, Important Notice, etc.)
 * - Handles file attachments and faculty-specific news
 *
 * Features:
 * - News type categorization
 * - Faculty-specific targeting
 * - File attachment support
 * - Form validation
 * - API integration
 * - Responsive design
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

// News Upload Form Component - Handles creation and submission of news items
const NewsUploadForm = ({ onNewsUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  // News Types Configuration
  // Defines all possible types of news that can be posted in the system
  // Each type includes an ID, display name, and helpful description
  const newsTypes = [
    { id: 'Announcement', name: 'Announcement', description: 'General announcements and updates' },
    { id: 'Important Notice', name: 'Important Notice', description: 'Critical information requiring attention' },
    { id: 'Exam Update', name: 'Exam Update', description: 'Examination schedules and updates' },
    { id: 'General Information', name: 'General Information', description: 'General information and notices' },
    { id: 'Urgent Alert', name: 'Urgent Alert', description: 'Urgent alerts requiring immediate action' }
  ];

  // Faculty List Configuration
  // Defines all faculties in the university system
  // Used for targeting news to specific faculty departments
  const faculties = [
    { id: 'Faculty of Technological Studies', name: 'Faculty of Technological Studies' },
    { id: 'Faculty of Applied Science', name: 'Faculty of Applied Science' },
    { id: 'Faculty of Management', name: 'Faculty of Management' },
    { id: 'Faculty of Agriculture', name: 'Faculty of Agriculture' },
    { id: 'Faculty of Medicine', name: 'Faculty of Medicine' },
    { id: 'All Faculties', name: 'All Faculties' }
  ];

  // Form Submission Handler
  // Processes the news submission with file attachment support
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const formData = new FormData();
      formData.append('newsTopic', data.newsTopic);
      formData.append('faculty', data.faculty);
      formData.append('newsType', data.newsType);
      formData.append('newsMessage', data.newsMessage);
      formData.append('priority', data.priority || 'medium');

      if (selectedFile) {
        formData.append('attachment', selectedFile);
      }

      const response = await fetch('http://localhost:5000/api/news', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('News uploaded successfully:', result);

        // Reset form
        reset();
        setSelectedFile(null);
        setSubmitSuccess(true);

        // Notify parent component
        if (onNewsUploaded) {
          onNewsUploaded();
        }

        // Hide success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload news');
      }
    } catch (error) {
      console.error('Error uploading news:', error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // File Upload Handler
  // Manages file selection for news attachments
  // Supports various file types (PDF, DOC, JPG, PNG, TXT)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          News uploaded successfully!
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* News Topic */}
        <div>
          <label htmlFor="newsTopic" className="block text-sm font-medium text-gray-700 mb-1">
            News Topic *
          </label>
          <input
            type="text"
            id="newsTopic"
            {...register('newsTopic', { required: 'News topic is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter news topic"
          />
          {errors.newsTopic && (
            <p className="mt-1 text-sm text-red-600">{errors.newsTopic.message}</p>
          )}
        </div>

        {/* News Type Selector */}
        <div>
          <label htmlFor="newsType" className="block text-sm font-medium text-gray-700 mb-1">
            News Type *
          </label>
          <select
            id="newsType"
            {...register('newsType', { required: 'News type is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select news type...</option>
            {newsTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.newsType && (
            <p className="mt-1 text-sm text-red-600">{errors.newsType.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {newsTypes.find(t => t.id === watch('newsType'))?.description}
          </p>
        </div>

        {/* Faculty Selector */}
        <div>
          <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">
            Target Faculty *
          </label>
          <select
            id="faculty"
            {...register('faculty', { required: 'Faculty is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a faculty...</option>
            {faculties.map(faculty => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
          {errors.faculty && (
            <p className="mt-1 text-sm text-red-600">{errors.faculty.message}</p>
          )}
        </div>

        {/* Priority Level */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority Level
          </label>
          <select
            id="priority"
            {...register('priority')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* News Message */}
        <div>
          <label htmlFor="newsMessage" className="block text-sm font-medium text-gray-700 mb-1">
            News Message *
          </label>
          <textarea
            id="newsMessage"
            {...register('newsMessage', { required: 'News message is required' })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter your news message here..."
          />
          {errors.newsMessage && (
            <p className="mt-1 text-sm text-red-600">{errors.newsMessage.message}</p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attach File (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              {!selectedFile ? (
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-sm text-gray-600">{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="ml-2 text-sm text-red-600 hover:text-red-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500">
                PDF, DOC, JPG, PNG or TXT up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#246BFD] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isSubmitting ? 'Uploading...' : 'Post News'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsUploadForm;