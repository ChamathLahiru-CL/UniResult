import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

const NewsUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const faculties = [
    { id: 'ICT', name: 'Information & Communication Technology' },
    { id: 'CST', name: 'Computer Science & Technology' },
    { id: 'EET', name: 'Electrical & Electronic Technology' },
    { id: 'BBA', name: 'Business Administration' }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('topic', data.topic);
      formData.append('faculty', data.faculty);
      formData.append('message', data.message);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      // Mock API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);

      // Reset form
      reset();
      setSelectedFile(null);

      // Show success message (you can implement toast notification here)
      alert('News uploaded successfully!');
    } catch (error) {
      console.error('Error uploading news:', error);
      alert('Failed to upload news. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* News Topic */}
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            News Topic
          </label>
          <input
            type="text"
            id="topic"
            {...register('topic', { required: 'Topic is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter news topic"
          />
          {errors.topic && (
            <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
          )}
        </div>

        {/* Faculty Selector */}
        <div>
          <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">
            Select Faculty
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

        {/* News Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            News Message
          </label>
          <textarea
            id="message"
            {...register('message', { required: 'Message is required' })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter your news message here..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
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
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#246BFD] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
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