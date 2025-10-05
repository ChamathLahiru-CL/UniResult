/**
 * FAQ Component
 * Expandable accordion sections for frequently asked questions
 */
import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FAQ = () => {
  const [openSection, setOpenSection] = useState(null);

  const faqSections = [
    {
      title: 'Results & GPA',
      questions: [
        {
          q: 'How is my GPA calculated?',
          a: 'Your GPA is calculated based on the credit points and grades obtained in each subject. Each grade has a corresponding grade point value.'
        },
        {
          q: 'When are results typically released?',
          a: 'Results are usually released within 4-6 weeks after the examination period. You will receive a notification when they are available.'
        },
        {
          q: 'Can I appeal my results?',
          a: 'Yes, you can submit a result appeal within 2 weeks of result publication through the examinations office.'
        }
      ]
    },
    {
      title: 'Account & Security',
      questions: [
        {
          q: 'How do I reset my password?',
          a: 'Click on "Forgot Password" on the login page and follow the instructions sent to your university email.'
        },
        {
          q: 'Why am I locked out of my account?',
          a: 'Accounts are temporarily locked after 5 failed login attempts. Wait 30 minutes or contact support for immediate assistance.'
        }
      ]
    },
    {
      title: 'Technical Support',
      questions: [
        {
          q: 'Which browsers are supported?',
          a: 'We recommend using the latest versions of Chrome, Firefox, Safari, or Edge for the best experience.'
        },
        {
          q: 'Why cant I download my results?',
          a: 'Make sure you have a stable internet connection and have cleared your browser cache. If issues persist, contact technical support.'
        }
      ]
    },
    {
      title: 'General University Queries',
      questions: [
        {
          q: 'How do I update my personal information?',
          a: 'Personal information updates should be submitted through the student portal with supporting documentation.'
        },
        {
          q: 'Where can I get official transcripts?',
          a: 'Official transcripts can be requested through the examinations division with a processing time of 3-5 working days.'
        }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {faqSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between"
            onClick={() => setOpenSection(openSection === sectionIndex ? null : sectionIndex)}
          >
            <span>{section.title}</span>
            <ChevronDownIcon 
              className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                openSection === sectionIndex ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          
          {openSection === sectionIndex && (
            <div className="px-6 pb-4">
              <div className="space-y-4">
                {section.questions.map((item, index) => (
                  <div key={index} className="border-t border-gray-100 pt-4">
                    <h4 className="font-medium text-gray-900">{item.q}</h4>
                    <p className="mt-2 text-sm text-gray-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;