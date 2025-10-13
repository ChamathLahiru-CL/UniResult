import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const AdminFooter = () => {
  const quickLinks = [
    { name: 'User Management', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Result Updates', href: '/admin/results', icon: DocumentTextIcon },
    { name: 'Exam Division', href: '/admin/exam-division', icon: AcademicCapIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  ];

  const resources = [
    { name: 'Admin Guide', href: '/admin/guide', icon: QuestionMarkCircleIcon },
    { name: 'Security Policy', href: '/admin/security', icon: ShieldCheckIcon },
    { name: 'System Settings', href: '/admin/settings', icon: CogIcon },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              UniResult Admin
            </h2>
            <p className="text-sm text-gray-500 max-w-md">
              Centralized administration platform for result management and academic performance analytics.
            </p>
            {/* Brand Links - Hidden on Mobile */}
            <div className="hidden sm:flex sm:space-x-4">
              <span className="text-sm text-gray-500">© {new Date().getFullYear()} UniResult</span>
              <Link to="/admin/privacy" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/admin/terms" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors"
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
                    className="flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors"
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
              <Link to="/admin/privacy" className="text-xs text-gray-500 hover:text-purple-600">
                Privacy
              </Link>
              <Link to="/admin/terms" className="text-xs text-gray-500 hover:text-purple-600">
                Terms
              </Link>
            </div>
            <p className="text-xs text-gray-500">
              Admin Portal v2.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;