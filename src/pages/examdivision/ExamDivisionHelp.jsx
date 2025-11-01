import React, { useState } from 'react';
import {
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  ArrowRightIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  DocumentArrowDownIcon,
  GlobeAltIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';

const ExamDivisionHelp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [_showContactForm, setShowContactForm] = useState(false);

  // Help categories with comprehensive options
  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: BookOpenIcon, color: 'blue' },
    { id: 'result-management', name: 'Result Management', icon: DocumentTextIcon, color: 'green' },
    { id: 'exam-scheduling', name: 'Exam Scheduling', icon: CalendarIcon, color: 'purple' },
    { id: 'student-management', name: 'Student Management', icon: UserGroupIcon, color: 'orange' },
    { id: 'compliance', name: 'Compliance & Reports', icon: ClipboardDocumentCheckIcon, color: 'red' },
    { id: 'notifications', name: 'Notifications', icon: BellIcon, color: 'yellow' },
    { id: 'security', name: 'Security & Access', icon: ShieldCheckIcon, color: 'indigo' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: ExclamationTriangleIcon, color: 'pink' },
  ];

  // Quick help cards
  const quickHelp = [
    {
      title: 'Upload Exam Results',
      description: 'Learn how to upload and verify exam results',
      category: 'result-management',
      type: 'guide',
      readTime: '5 min',
      rating: 4.8,
    },
    {
      title: 'Create Exam Schedule',
      description: 'Step-by-step guide to creating exam schedules',
      category: 'exam-scheduling',
      type: 'video',
      readTime: '8 min',
      rating: 4.9,
    },
    {
      title: 'Student Compliance Forms',
      description: 'Managing and reviewing student compliance submissions',
      category: 'compliance',
      type: 'guide',
      readTime: '6 min',
      rating: 4.7,
    },
    {
      title: 'Security Best Practices',
      description: 'Essential security guidelines for exam officers',
      category: 'security',
      type: 'article',
      readTime: '10 min',
      rating: 4.9,
    },
  ];

  // Comprehensive help content
  const helpContent = [
    {
      category: 'getting-started',
      title: 'Welcome to Exam Division Portal',
      description: 'Complete overview of the exam division management system',
      content: 'Get started with your exam division dashboard. Learn about key features, navigation, and essential workflows for efficient exam management.',
      type: 'guide',
      readTime: '3 min',
      lastUpdated: '2024-10-30',
      featured: true,
    },
    {
      category: 'getting-started',
      title: 'Dashboard Overview',
      description: 'Understanding your dashboard and key metrics',
      content: 'Learn how to interpret dashboard metrics, access quick actions, and navigate through different sections of the portal.',
      type: 'article',
      readTime: '4 min',
      lastUpdated: '2024-10-29',
    },
    {
      category: 'result-management',
      title: 'Result Upload Process',
      description: 'Step-by-step guide for uploading exam results',
      content: 'Detailed instructions on how to upload, verify, and publish exam results. Includes data formatting requirements and validation steps.',
      type: 'guide',
      readTime: '8 min',
      lastUpdated: '2024-10-28',
      featured: true,
    },
    {
      category: 'result-management',
      title: 'Result Verification & Approval',
      description: 'Quality assurance for exam results',
      content: 'Learn the verification process, approval workflows, and how to handle result corrections or disputes.',
      type: 'guide',
      readTime: '6 min',
      lastUpdated: '2024-10-27',
    },
    {
      category: 'result-management',
      title: 'Bulk Result Operations',
      description: 'Managing large datasets efficiently',
      content: 'Advanced techniques for handling bulk result uploads, batch processing, and managing large exam datasets.',
      type: 'video',
      readTime: '12 min',
      lastUpdated: '2024-10-26',
    },
    {
      category: 'exam-scheduling',
      title: 'Creating Exam Schedules',
      description: 'Design and publish exam timetables',
      content: 'Comprehensive guide on creating exam schedules, managing conflicts, and coordinating with different departments.',
      type: 'guide',
      readTime: '10 min',
      lastUpdated: '2024-10-25',
    },
    {
      category: 'exam-scheduling',
      title: 'Room and Resource Management',
      description: 'Allocating exam venues and resources',
      content: 'Learn how to manage exam rooms, allocate resources, and handle scheduling conflicts effectively.',
      type: 'article',
      readTime: '7 min',
      lastUpdated: '2024-10-24',
    },
    {
      category: 'student-management',
      title: 'Student Registration & Enrollment',
      description: 'Managing student exam registrations',
      content: 'Process for handling student exam registrations, managing enrollment data, and updating student information.',
      type: 'guide',
      readTime: '5 min',
      lastUpdated: '2024-10-23',
    },
    {
      category: 'compliance',
      title: 'Compliance Report Generation',
      description: 'Creating compliance and audit reports',
      content: 'Guide to generating various compliance reports, understanding audit requirements, and maintaining documentation.',
      type: 'guide',
      readTime: '9 min',
      lastUpdated: '2024-10-22',
    },
    {
      category: 'notifications',
      title: 'Notification Management',
      description: 'Setting up and managing system notifications',
      content: 'Configure notification preferences, manage alert systems, and communicate effectively with stakeholders.',
      type: 'article',
      readTime: '4 min',
      lastUpdated: '2024-10-21',
    },
    {
      category: 'security',
      title: 'Data Security & Privacy',
      description: 'Protecting sensitive exam and student data',
      content: 'Essential security practices, data protection guidelines, and privacy compliance for exam management.',
      type: 'guide',
      readTime: '8 min',
      lastUpdated: '2024-10-20',
      featured: true,
    },
    {
      category: 'troubleshooting',
      title: 'Common Issues & Solutions',
      description: 'Resolving frequent problems',
      content: 'Solutions to common issues including upload errors, system connectivity problems, and data validation failures.',
      type: 'troubleshooting',
      readTime: '6 min',
      lastUpdated: '2024-10-19',
    },
  ];

  // Filter content based on search and category
  const filteredContent = helpContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get color classes for categories
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      pink: 'bg-pink-50 text-pink-700 border-pink-200',
    };
    return colors[color] || colors.blue;
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return VideoCameraIcon;
      case 'guide': return BookOpenIcon;
      case 'article': return DocumentTextIcon;
      case 'troubleshooting': return ExclamationTriangleIcon;
      default: return InformationCircleIcon;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center mb-4">
            <QuestionMarkCircleIcon className="h-10 w-10 text-blue-500 mr-4" />
            Exam Division Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers, guides, and resources to help you manage exams effectively
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg"
              placeholder="Search for help articles, guides, and tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickHelp.map((item, index) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg ${getColorClasses(categories.find(c => c.id === item.category)?.color || 'blue')}`}>
                        <TypeIcon className="h-6 w-6" />
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        {item.rating}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {item.readTime}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                        Read more
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    selectedCategory === category.id
                      ? getColorClasses(category.color)
                      : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Help Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredContent.map((item, index) => {
                const TypeIcon = getTypeIcon(item.type);
                const category = categories.find(c => c.id === item.category);
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getColorClasses(category?.color || 'blue')}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getColorClasses(category?.color || 'blue')}`}>
                              {category?.name}
                            </span>
                            {item.featured && (
                              <span className="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {item.readTime}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <p className="text-gray-700 text-sm line-clamp-2 mb-4">{item.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                          Read article
                          <ArrowRightIcon className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 mr-2" />
                Need More Help?
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Contact Support
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    Call
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    Email
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Download User Manual
                </a>
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                  <VideoCameraIcon className="h-4 w-4 mr-2" />
                  Video Tutorials
                </a>
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                  <GlobeAltIcon className="h-4 w-4 mr-2" />
                  System Status
                </a>
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                  <LanguageIcon className="h-4 w-4 mr-2" />
                  Language Support
                </a>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-medium">v2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Update:</span>
                  <span className="font-medium">Oct 30, 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <span className="flex items-center font-medium text-green-600">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDivisionHelp;