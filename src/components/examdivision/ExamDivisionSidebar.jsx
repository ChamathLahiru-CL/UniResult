import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Squares2X2Icon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  CalendarIcon,
  NewspaperIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  UserGroupIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const ExamDivisionSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/exam', icon: Squares2X2Icon },
    { name: 'Results Management', href: '/exam/results', icon: DocumentArrowUpIcon },
    { name: 'New Result Upload', href: '/exam/new-result', icon: DocumentTextIcon },
    { name: 'New Time Table Update', href: '/exam/time-table', icon: CalendarIcon },
    { name: 'News Upload', href: '/exam/news', icon: NewspaperIcon },
    { name: 'Student Compliance', href: '/exam/compliance', icon: ClipboardDocumentCheckIcon },
    { name: 'Submit Complaint', href: '/exam/complaints', icon: ExclamationTriangleIcon },
    { name: 'Recent Activities', href: '/exam/activities', icon: ClockIcon },
    { name: 'Exam Members', href: '/exam/members', icon: UserGroupIcon },
  ];

  const bottomNav = [
    { name: 'Profile & Settings', href: '/exam/profile', icon: UserCircleIcon },
    { name: 'Help', href: '/exam/help', icon: QuestionMarkCircleIcon },
  ];


  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        to={item.href}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 transition-colors duration-200
          ${isActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-700 hover:bg-gray-100'
          }`}
      >
        <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
        <span>{item.name}</span>
        {isActive && (
          <div
            className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full transition-all duration-300 ease-in-out"
          />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:fixed`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link
            to="/exam"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity duration-200"
          >
            UniResult
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col justify-between h-[calc(100%-4rem)] px-4 pt-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-gray-200 pt-4">
            {bottomNav.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default ExamDivisionSidebar;