/**
 * Help Page Component
 * Main help and support page with all support features
 * 
 * This component provides a comprehensive help and support interface including:
 * - Emergency notices
 * - Search functionality
 * - Quick help cards
 * - FAQ section
 * - Contact support
 * - User feedback system
 * 
 * @module Help
 */

import React, { useState } from 'react';
import { XMarkIcon as XIcon, HandThumbUpIcon as ThumbUpIcon, HandThumbDownIcon as ThumbDownIcon } from '@heroicons/react/24/outline';
import HelpSearch from '../../components/help/HelpSearch';
import QuickHelp from '../../components/help/QuickHelp';
import FAQ from '../../components/help/FAQ';
import ContactSupport from '../../components/help/ContactSupport';

// Initial state for emergency notices
const initialEmergencyNotices = [
  {
    id: 1,
    title: 'System Maintenance',
    message: 'Scheduled maintenance on October 10, 2025. Service may be intermittent.',
    severity: 'warning'
  }
];

/**
 * Main Help component that provides user support features
 * @returns {JSX.Element} Help and support page
 */
const Help = () => {
  // State management for various features
  const [showEmergencyNotice, setShowEmergencyNotice] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  console.log('Help component rendered');

  /**
   * Handles user feedback submission
   * @param {boolean} isHelpful - Whether the user found the help content helpful
   */
  const handleFeedback = (isHelpful) => {
    setShowFeedback(false);
    setFeedbackSubmitted(true);
    // TODO: Send feedback to backend
    console.log('Feedback submitted:', { isHelpful, suggestion });
  };

  /**
   * Handles search query changes
   * @param {string} query - The search query entered by the user
   */
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Emergency Notice Section */}
      {showEmergencyNotice && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg relative">
          <button
            onClick={() => setShowEmergencyNotice(false)}
            className="absolute right-4 top-4 text-yellow-400 hover:text-yellow-500"
            aria-label="Close emergency notice"
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"
                   aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">{initialEmergencyNotices[0].title}</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {initialEmergencyNotices[0].message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Search Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How can we help you?
        </h1>
        <HelpSearch onSearch={handleSearch} query={searchQuery} />
      </div>

      {/* Quick Help Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Help</h2>
        <QuickHelp />
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <FAQ />
      </section>

      {/* Contact Support Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Need More Help?</h2>
        <ContactSupport />
      </section>

      {/* Feedback Widget */}
      {showFeedback && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <button
            onClick={() => setShowFeedback(false)}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-500"
            aria-label="Close feedback"
          >
            <XIcon className="h-4 w-4" />
          </button>
          <h4 className="font-medium text-gray-900 mb-3">Was this helpful?</h4>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => handleFeedback(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-150"
              aria-label="Mark as helpful"
            >
              <ThumbUpIcon className="h-5 w-5" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-150"
              aria-label="Mark as not helpful"
            >
              <ThumbDownIcon className="h-5 w-5" />
              <span>No</span>
            </button>
          </div>
          <textarea
            placeholder="Any suggestions for improvement?"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            aria-label="Suggestions for improvement"
          />
        </div>
      )}

      {/* Feedback Submitted Message */}
      {feedbackSubmitted && (
        <div className="fixed bottom-4 right-4 bg-green-50 text-green-800 px-6 py-4 rounded-lg shadow-lg animate-fadeIn">
          Thank you for your feedback!
        </div>
      )}
    </div>
  );
};

export default Help;