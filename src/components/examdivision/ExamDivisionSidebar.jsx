import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
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
} from '@heroicons/react/24/outline';

const ExamDivisionSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/exam', icon: Squares2X2Icon },
    { name: 'Update Result', href: '/exam/update-result', icon: DocumentArrowUpIcon },
    { name: 'New Result Upload', href: '/exam/new-result', icon: DocumentTextIcon },
    { name: 'New Time Table Update', href: '/exam/time-table', icon: CalendarIcon },
    { name: 'News Upload', href: '/exam/news', icon: NewspaperIcon },
    { name: 'Student Compliance', href: '/exam/compliance', icon: ClipboardDocumentCheckIcon },
    { name: 'Recent Activities', href: '/exam/activities', icon: ClockIcon },
    { name: 'Exam Division', href: '/exam/division', icon: UserGroupIcon },
  ];

  const bottomNav = [
    { name: 'Profile', href: '/exam/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/exam/settings', icon: Cog6ToothIcon },
    { name: 'Help', href: '/exam/help', icon: QuestionMarkCircleIcon },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      display: 'block',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
      transitionEnd: {
        display: 'none',
      },
    },
  };

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
          <motion.div
            className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
            layoutId="activeNavIndicator"
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
      <motion.div
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        className="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 lg:static lg:z-0 lg:block"
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            UniResult
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col justify-between h-[calc(100%-4rem)] p-4">
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
      </motion.div>
    </>
  );
};

export default ExamDivisionSidebar;