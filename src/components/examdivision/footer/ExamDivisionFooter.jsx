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
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Exam Division Portal
            </h2>
            <p className="text-sm text-gray-500 max-w-md">
              Streamlined examination management and result processing platform for academic excellence.
            </p>
            {/* Brand Links - Hidden on Mobile */}
            <div className="hidden sm:flex sm:space-x-4">
              <span className="text-sm text-gray-500">© {new Date().getFullYear()} UniResult</span>
              <Link to="/exam/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/exam/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase mb-4">
              Quick Access
            </h3>
            <ul className="space-y-3">
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

          {/* Resources Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
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

        {/* Mobile View Additional Info */}
        <div className="mt-8 border-t border-gray-200 pt-4 sm:hidden">
          <div className="text-center space-y-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} UniResult
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/exam/privacy" className="text-xs text-gray-500 hover:text-blue-600">
                Privacy
              </Link>
              <Link to="/exam/terms" className="text-xs text-gray-500 hover:text-blue-600">
                Terms
              </Link>
            </div>
            <p className="text-xs text-gray-500">
              Exam Division Portal v2.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ExamDivisionFooter;