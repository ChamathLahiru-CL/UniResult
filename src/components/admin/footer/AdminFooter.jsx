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
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:py-6 lg:px-2">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-8 xl:col-span-1 xl:pr-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              UniResult Admin
            </h2>
            <p className="text-gray-500 text-sm">
              Centralized administration platform for result management and academic performance analytics.
            </p>
            <div className="flex space-x-6">
              <span className="text-sm text-gray-500">© {new Date().getFullYear()} UniResult</span>
              <Link to="/admin/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link to="/admin/terms" className="text-sm text-gray-500 hover:text-gray-900">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="mt-12 grid grid-cols-2 gap-2 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">
                  Quick Links
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
            Admin Portal v2.0 | Last Updated: October 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;