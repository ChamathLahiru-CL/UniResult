import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  ClockIcon,
  AcademicCapIcon,
  UsersIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/admin', current: true },
    { name: 'Update Result', icon: DocumentTextIcon, href: '/admin/update-result', current: false },
    { name: 'Recent Activities', icon: ClockIcon, href: '/admin/activities', current: false },
    { name: 'Exam Division', icon: AcademicCapIcon, href: '/admin/exam-division', current: false },
    { name: 'Students', icon: UsersIcon, href: '/admin/students', current: false },
  ];

  const bottomNav = [
    { name: 'Profile', icon: UserIcon, href: '/admin/profile' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings' },
    { name: 'Help', icon: QuestionMarkCircleIcon, href: '/admin/help' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none lg:relative ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and close button */}
        <div className="flex items-center justify-between h-16 px-6">
          <Link to="/admin" className="text-2xl font-bold text-[#246BFD]">
            UniResult
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col h-[calc(100%-4rem)] px-4">
          <div className="flex-1 space-y-1 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 ${
                  item.current ? 'bg-blue-50 text-[#246BFD]' : ''
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-gray-200 py-4 space-y-1">
            {bottomNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
