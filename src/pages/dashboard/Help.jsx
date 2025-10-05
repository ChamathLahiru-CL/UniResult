/**
 * Help Page Component
 * Main help and support page with all support features
 */
import React, { useState } from 'react';
import { XIcon, ThumbUpIcon, ThumbDownIcon } from '@heroicons/react/outline';
import HelpSearch from './HelpSearch';
import QuickHelp from './QuickHelp';
import FAQ from './FAQ';
import ContactSupport from './ContactSupport';

const Help = () => {
  const [showEmergencyNotice, setShowEmergencyNotice] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const handleFeedback = (isHelpful) => {
    setShowFeedback(false);
    setFeedbackSubmitted(true);
    // TODO: Send feedback to backend
    console.log('Feedback submitted:', { isHelpful, suggestion });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Emergency Notice */}
      {showEmergencyNotice && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg relative">
          <button
            onClick={() => setShowEmergencyNotice(false)}
            className="absolute right-4 top-4 text-yellow-400 hover:text-yellow-500"
          >
            <XIcon className="h-5 w-5" />
          </button>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                System Maintenance Notice: The results portal will be under maintenance today from 9 PM to 10 PM.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Search */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How can we help you?
        </h1>
        <HelpSearch />
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
          >
            <XIcon className="h-4 w-4" />
          </button>
          <h4 className="font-medium text-gray-900 mb-3">Was this helpful?</h4>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => handleFeedback(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-150"
            >
              <ThumbUpIcon className="h-5 w-5" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-150"
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
          />
        </div>
      )}

      {/* Feedback Submitted Message */}
      {feedbackSubmitted && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <p className="text-green-600">Thank you for your feedback!</p>
        </div>
      )}
    </div>
  );
};

export default Help;