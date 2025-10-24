import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/admin', current: true },
    { name: 'Recent Activities', icon: ClockIcon, href: '/admin/activities', current: false },
    { name: 'Exam Division', icon: UsersIcon, href: '/admin/exam-division', current: false },
    { name: 'Compliance', icon: DocumentTextIcon, href: '/admin/compliance', current: false },
    { name: 'Students', icon: AcademicCapIcon, href: '/admin/students', current: false },
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:fixed lg:top-0 lg:bottom-0`}
      >
        {/* Logo and close button */}
        <div className="flex items-center justify-between h-16 px-6">
          <Link to="/admin" className="text-2xl font-bold text-[#246BFD]">
            <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-md">Uni</span>
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-extrabold drop-shadow-md">Result</span>
              </h1>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col justify-between h-[calc(100vh-4rem)] px-4 pt-2">
          {/* Main Navigation */}
          <div className="space-y-0.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 ${
                  location.pathname === item.href || location.pathname.startsWith(`${item.href}/`) 
                    ? 'bg-blue-50 text-[#246BFD]' 
                    : ''
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="pb-4">
            <div className="border-t border-gray-200 pt-3 space-y-1">
              {bottomNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
