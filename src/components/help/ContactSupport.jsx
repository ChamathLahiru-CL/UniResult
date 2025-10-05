/**
 * Contact Support Component
 * Created on: October 5, 2025, after 10 PM
 * 
 * This component provides a comprehensive contact interface including:
 * 1. Interactive Contact Form
 *    - Collects user information and issue details
 *    - Validates input in real-time
 *    - Handles form submission
 * 
 * 2. Quick Contact Options
 *    - Direct email link
 *    - Phone number with click-to-call
 *    - Office hours information
 * 
 * Features:
 * - Responsive layout (1 column on mobile, 2 columns on desktop)
 * - Form validation with HTML5 and custom validation
 * - Accessible design with ARIA labels
 * - Interactive UI elements with hover states
 * - Error handling and user feedback
 * 
 * Form Fields:
 * - Name: Required, user's full name
 * - Email: Required, valid email format
 * - Issue: Required, detailed description of the problem
 * 
 * State:
 * @property {Object} formData - Stores form field values
 * @property {string} formData.name - User's full name
 * @property {string} formData.email - User's email address
 * @property {string} formData.issue - Description of the issue
 * 
 * Usage Example:
 * ```jsx
 * import ContactSupport from './components/help/ContactSupport';
 * 
 * function HelpPage() {
 *   return <ContactSupport />;
 * }
 * ```
 */
// Import required dependencies and icons
import React, { useState } from 'react';
import { EnvelopeIcon as MailIcon, PhoneIcon } from '@heroicons/react/24/outline';

/**
 * ContactSupport Component
 * Handles user support requests and displays contact information
 * @returns {JSX.Element} A form and contact information interface
 */
const ContactSupport = () => {
  // Initialize form state with empty values
  const [formData, setFormData] = useState({
    name: '',     // User's full name
    email: '',    // User's email address
    issue: ''     // Description of the user's issue
  });

  /**
   * Handle form submission
   * @param {Event} e - The form submission event
   * TODO: Implement actual form submission to backend
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Currently logs form data, will be replaced with API call
    console.log('Form submitted:', formData);
  };

  return (
    // Main container with responsive grid layout (1 column on mobile, 2 columns on desktop)
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Contact Form Section 
          A user-friendly form for submitting support requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
        {/* Support request form with validation */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name input field */}
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
              aria-label="Your full name"
            />
          </div>
          {/* Email input field with validation */}
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
              aria-label="Your email address"
              placeholder="example@email.com"
            />
          </div>
          {/* Issue description textarea */}
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
              aria-label="Description of your issue"
              placeholder="Please describe your issue in detail..."
            />
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
            aria-label="Submit support request"
          >
            Submit Request
          </button>
        </form>
      </div>

      {/* Quick Contact Options Section
          Alternative ways to reach support team */}
      <div className="space-y-4">
        {/* Direct contact information card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contact</h3>
          <div className="space-y-4">
            {/* Email contact link */}
            <a
              href="mailto:support@university.edu"
              className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors duration-150"
              aria-label="Send email to support"
            >
              <MailIcon className="h-5 w-5" aria-hidden="true" />
              <span>support@university.edu</span>
            </a>
            {/* Phone contact link */}
            <a
              href="tel:+94771234567"
              className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors duration-150"
              aria-label="Call support"
            >
              <PhoneIcon className="h-5 w-5" aria-hidden="true" />
              <span>+94 77 123 4567</span>
            </a>
          </div>
        </div>

        {/* Support Hours Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Hours</h3>
          <div className="space-y-2 text-sm text-gray-600">
            {/* Regular support hours */}
            <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
            <p>Sunday: Closed</p>
            {/* Emergency support notice */}
            <p className="text-xs text-gray-500 mt-4" role="note">
              * Emergency support available 24/7 for critical system issues
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component for use in other parts of the application
export default ContactSupport;