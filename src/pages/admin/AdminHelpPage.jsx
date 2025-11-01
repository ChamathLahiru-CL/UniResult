import React, { useState } from 'react';
import {
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BellIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

// Helper component for rendering category icons
const CategoryIcon = ({ category }) => {
  const iconMap = {
    'getting-started': AcademicCapIcon,
    'user-management': UserGroupIcon,
    'result-management': DocumentTextIcon,
    'notifications': BellIcon,
    'security': ShieldCheckIcon,
    'system-settings': Cog6ToothIcon,
    'analytics': ChartBarIcon,
    'support': ChatBubbleLeftRightIcon,
  };
  const Icon = iconMap[category];
  return Icon ? <Icon className="h-6 w-6 text-blue-500 mr-3" /> : null;
};

// Main AdminHelpPage component
const AdminHelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: AcademicCapIcon },
    { id: 'user-management', name: 'User Management', icon: UserGroupIcon },
    { id: 'result-management', name: 'Result Management', icon: DocumentTextIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security & Access', icon: ShieldCheckIcon },
    { id: 'system-settings', name: 'System Settings', icon: Cog6ToothIcon },
    { id: 'analytics', name: 'Analytics & Reports', icon: ChartBarIcon },
    { id: 'support', name: 'Support', icon: ChatBubbleLeftRightIcon },
  ];

  const helpContent = [
    {
      category: 'getting-started',
      title: 'Administrator Dashboard Overview',
      content: 'Welcome to the UniResult Admin Dashboard. As an administrator, you have complete control over the system. The dashboard provides quick access to key metrics, recent activities, and system status.',
    },
    {
      category: 'user-management',
      title: 'Managing User Accounts',
      content: 'Learn how to create, modify, and manage user accounts. This includes setting user roles, resetting passwords, and managing access permissions.',
    },
    {
      category: 'user-management',
      title: 'Bulk User Operations',
      content: 'Efficiently manage multiple users through bulk operations like importing user lists, batch role assignments, and mass notifications.',
    },
    {
      category: 'result-management',
      title: 'Result Upload and Verification',
      content: 'Step-by-step guide for uploading exam results, verifying data accuracy, and publishing results to students.',
    },
    {
      category: 'result-management',
      title: 'Result Modification Process',
      content: 'Learn the proper procedure for modifying published results, including approval workflows and audit logging.',
    },
    {
      category: 'notifications',
      title: 'System Notifications',
      content: 'Configure and manage system-wide notifications, announcements, and alerts. Learn how to target specific user groups.',
    },
    {
      category: 'security',
      title: 'Security Best Practices',
      content: 'Essential security guidelines for administrators, including password policies, access control, and audit logging.',
    },
    {
      category: 'security',
      title: 'Access Control Management',
      content: 'Detailed guide on managing role-based access control, permissions, and security policies.',
    },
    {
      category: 'system-settings',
      title: 'System Configuration',
      content: 'Learn how to configure system-wide settings, including academic year settings, result publishing rules, and notification preferences.',
    },
    {
      category: 'analytics',
      title: 'Analytics Dashboard',
      content: 'Understanding and utilizing the analytics dashboard for monitoring system usage, user engagement, and academic performance trends.',
    },
    {
      category: 'support',
      title: 'Technical Support',
      content: 'Contact information and procedures for getting technical support, reporting issues, and requesting system modifications.',
    },
  ];

  const filteredContent = helpContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fadeIn">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <QuestionMarkCircleIcon className="h-8 w-8 text-blue-500 mr-3" />
              Admin Help Center
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Comprehensive guide for system administrators
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Topics
          </button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Help Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <CategoryIcon category={item.category} />
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {item.content}
                </p>
                <button
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  onClick={() => {/* TODO: Implement expand/collapse or modal view */}}
                >
                  Learn more
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2">
                Need Additional Support?
              </h2>
              <p className="text-blue-100">
                Contact our technical team for personalized assistance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Open Support Ticket
              </button>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors">
                Live Chat Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHelpPage;
