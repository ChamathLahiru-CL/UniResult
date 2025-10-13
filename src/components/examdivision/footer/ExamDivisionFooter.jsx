import React from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  ClockIcon,
  CalendarIcon,
  NewspaperIcon,
  ClipboardDocumentCheckIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const ExamDivisionFooter = () => {
  const quickLinks = [
    { name: 'Result Updates', href: '/exam/update-result', icon: DocumentTextIcon },
    { name: 'Recent Activities', href: '/exam/activities', icon: ClockIcon },
    { name: 'Time Tables', href: '/exam/time-tables', icon: CalendarIcon },
    { name: 'News Upload', href: '/exam/news', icon: NewspaperIcon },
  ];

  const resources = [
    { name: 'Compliance Check', href: '/exam/compliance', icon: ClipboardDocumentCheckIcon },
    { name: 'Performance Stats', href: '/exam/stats', icon: ChartBarIcon },
    { name: 'Help Guide', href: '/exam/guide', icon: QuestionMarkCircleIcon },
    { name: 'Access Control', href: '/exam/access', icon: ShieldCheckIcon },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:py-6 lg:px-2">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-8 xl:col-span-1 xl:pr-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Exam Division Portal
            </h2>
            <p className="text-gray-500 text-sm">
              Streamlined examination management and result processing platform for academic excellence.
            </p>
            <div className="flex space-x-6">
              <span className="text-sm text-gray-500">© {new Date().getFullYear()} UniResult</span>
              <Link to="/exam/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link to="/exam/terms" className="text-sm text-gray-500 hover:text-gray-900">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="mt-12 grid grid-cols-2 gap-2 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">
                  Quick Access
                </h3>
                <ul className="mt-4 space-y-4">
                  {quickLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">
                  Resources
                </h3>
                <ul className="mt-4 space-y-4">
                  {resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View Additional Info */}
        <div className="mt-8 border-t border-gray-200 pt-8 md:hidden">
          <p className="text-xs text-gray-500 text-center">
            Exam Division Portal v2.0 | Last Updated: October 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ExamDivisionFooter;