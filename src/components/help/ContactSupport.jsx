/**
 * ContactSupport Component
 * Contact form and support options
 */
import React, { useState } from 'react';
import { MailIcon, PhoneIcon } from '@heroicons/react/outline';

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issue: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Contact Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">
              Describe your issue
            </label>
            <textarea
              id="issue"
              value={formData.issue}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
          >
            Submit Request
          </button>
        </form>
      </div>

      {/* Quick Contact Options */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contact</h3>
          <div className="space-y-4">
            <a
              href="mailto:support@university.edu"
              className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors duration-150"
            >
              <MailIcon className="h-5 w-5" />
              <span>support@university.edu</span>
            </a>
            <a
              href="tel:+94771234567"
              className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors duration-150"
            >
              <PhoneIcon className="h-5 w-5" />
              <span>+94 77 123 4567</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Hours</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
            <p>Sunday: Closed</p>
            <p className="text-xs text-gray-500 mt-4">
              * Emergency support available 24/7 for critical system issues
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;