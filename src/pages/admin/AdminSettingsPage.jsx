import React, { useState } from 'react';
import { 
  CogIcon,
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BellIcon,
  ShieldCheckIcon,
  ServerIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    universityName: 'Sri Lanka Institute of Information Technology',
    academicYear: '2024/2025',
    currentSemester: 'Semester 1',
    timeZone: 'Asia/Colombo',
    dateFormat: 'DD/MM/YYYY',
    resultPublishDelay: 24, // hours
    maxFileSize: 10 // MB
  });

  // Academic Settings State
  const [academicSettings, setAcademicSettings] = useState({
    gradingSystem: 'GPA',
    maxGPA: 4.0,
    passingGrade: 2.0,
    gradeCategories: [
      { grade: 'A+', min: 3.7, max: 4.0 },
      { grade: 'A', min: 3.3, max: 3.69 },
      { grade: 'A-', min: 3.0, max: 3.29 },
      { grade: 'B+', min: 2.7, max: 2.99 },
      { grade: 'B', min: 2.3, max: 2.69 },
      { grade: 'B-', min: 2.0, max: 2.29 },
      { grade: 'C+', min: 1.7, max: 1.99 },
      { grade: 'C', min: 1.3, max: 1.69 },
      { grade: 'C-', min: 1.0, max: 1.29 },
      { grade: 'F', min: 0.0, max: 0.99 }
    ],
    allowRetakes: true,
    maxRetakeAttempts: 2,
    resultVisibilityDelay: 2 // hours after publishing
  });

  // User Management Settings State
  const [userSettings, setUserSettings] = useState({
    autoApproveStudents: false,
    requireEmailVerification: true,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    accountLockoutDuration: 15 // minutes
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    resultPublishNotification: true,
    examScheduleNotification: true,
    systemMaintenanceNotification: true,
    notificationRetentionDays: 30
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuthentication: false,
    auditLogging: true,
    dataEncryption: true,
    backupFrequency: 'daily',
    backupRetentionDays: 30,
    maintenanceMode: false,
    allowedIPRanges: [],
    apiRateLimit: 1000 // requests per hour
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    databaseOptimization: 'auto',
    cacheEnabled: true,
    cacheDuration: 60, // minutes
    logLevel: 'info',
    performanceMonitoring: true,
    automaticUpdates: false,
    debugMode: false
  });

  const handleSaveSettings = async (settingsType) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would make actual API calls to save settings
      console.log(`Saving ${settingsType} settings:`, eval(`${settingsType}Settings`));
      
      // Show success message
      alert(`${settingsType.charAt(0).toUpperCase() + settingsType.slice(1)} settings saved successfully!`);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = (settingsType) => {
    setConfirmAction(() => () => {
      // Reset logic for each settings type
      if (settingsType === 'general') {
        setGeneralSettings({
          universityName: 'Sri Lanka Institute of Information Technology',
          academicYear: '2024/2025',
          currentSemester: 'Semester 1',
          timeZone: 'Asia/Colombo',
          dateFormat: 'DD/MM/YYYY',
          resultPublishDelay: 24,
          maxFileSize: 10
        });
      }
      // Add reset logic for other settings types...
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'academic', name: 'Academic', icon: AcademicCapIcon },
    { id: 'users', name: 'User Management', icon: UserGroupIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'system', name: 'System', icon: ServerIcon }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure and manage your exam result management system</p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">General Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University Name</label>
                  <input
                    type="text"
                    value={generalSettings.universityName}
                    onChange={(e) => setGeneralSettings({...generalSettings, universityName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <select
                    value={generalSettings.academicYear}
                    onChange={(e) => setGeneralSettings({...generalSettings, academicYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                    <option value="2026/2027">2026/2027</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
                  <select
                    value={generalSettings.currentSemester}
                    onChange={(e) => setGeneralSettings({...generalSettings, currentSemester: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Summer Term">Summer Term</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select
                    value={generalSettings.timeZone}
                    onChange={(e) => setGeneralSettings({...generalSettings, timeZone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Asia/Colombo">Asia/Colombo (UTC+05:30)</option>
                    <option value="UTC">UTC (UTC+00:00)</option>
                    <option value="Asia/Dhaka">Asia/Dhaka (UTC+06:00)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <select
                    value={generalSettings.dateFormat}
                    onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Result Publish Delay (Hours)</label>
                  <input
                    type="number"
                    value={generalSettings.resultPublishDelay}
                    onChange={(e) => setGeneralSettings({...generalSettings, resultPublishDelay: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="168"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max File Upload Size (MB)</label>
                  <input
                    type="number"
                    value={generalSettings.maxFileSize}
                    onChange={(e) => setGeneralSettings({...generalSettings, maxFileSize: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => handleResetToDefaults('general')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={() => handleSaveSettings('general')}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Academic Settings */}
        {activeTab === 'academic' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grading System</label>
                  <select
                    value={academicSettings.gradingSystem}
                    onChange={(e) => setAcademicSettings({...academicSettings, gradingSystem: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="GPA">GPA (4.0 Scale)</option>
                    <option value="Percentage">Percentage (0-100)</option>
                    <option value="Letter">Letter Grades (A-F)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum GPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={academicSettings.maxGPA}
                    onChange={(e) => setAcademicSettings({...academicSettings, maxGPA: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Passing Grade</label>
                  <input
                    type="number"
                    step="0.1"
                    value={academicSettings.passingGrade}
                    onChange={(e) => setAcademicSettings({...academicSettings, passingGrade: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Retake Attempts</label>
                  <input
                    type="number"
                    value={academicSettings.maxRetakeAttempts}
                    onChange={(e) => setAcademicSettings({...academicSettings, maxRetakeAttempts: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="5"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={academicSettings.allowRetakes}
                    onChange={(e) => setAcademicSettings({...academicSettings, allowRetakes: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Allow Retake Examinations</span>
                </label>
              </div>

              {/* Grade Categories Table */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Grade Categories</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min GPA</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max GPA</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {academicSettings.gradeCategories.map((category, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {category.grade}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.min.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.max.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => handleResetToDefaults('academic')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={() => handleSaveSettings('academic')}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* User Management Settings */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Management Configuration</h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={userSettings.autoApproveStudents}
                    onChange={(e) => setUserSettings({...userSettings, autoApproveStudents: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Auto-approve student registrations</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={userSettings.requireEmailVerification}
                    onChange={(e) => setUserSettings({...userSettings, requireEmailVerification: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Require email verification for new accounts</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    value={userSettings.sessionTimeout}
                    onChange={(e) => setUserSettings({...userSettings, sessionTimeout: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="5"
                    max="480"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={userSettings.maxLoginAttempts}
                    onChange={(e) => setUserSettings({...userSettings, maxLoginAttempts: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="3"
                    max="10"
                  />
                </div>
              </div>

              {/* Password Policy */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Password Policy</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Length</label>
                    <input
                      type="number"
                      value={userSettings.passwordPolicy.minLength}
                      onChange={(e) => setUserSettings({
                        ...userSettings,
                        passwordPolicy: {...userSettings.passwordPolicy, minLength: parseInt(e.target.value)}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      min="6"
                      max="20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userSettings.passwordPolicy.requireUppercase}
                        onChange={(e) => setUserSettings({
                          ...userSettings,
                          passwordPolicy: {...userSettings.passwordPolicy, requireUppercase: e.target.checked}
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Require uppercase letters</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userSettings.passwordPolicy.requireNumbers}
                        onChange={(e) => setUserSettings({
                          ...userSettings,
                          passwordPolicy: {...userSettings.passwordPolicy, requireNumbers: e.target.checked}
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Require numbers</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={userSettings.passwordPolicy.requireSpecialChars}
                        onChange={(e) => setUserSettings({
                          ...userSettings,
                          passwordPolicy: {...userSettings.passwordPolicy, requireSpecialChars: e.target.checked}
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Require special characters</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => handleResetToDefaults('users')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={() => handleSaveSettings('users')}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Configuration</h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.pushNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.resultPublishNotification}
                    onChange={(e) => setNotificationSettings({...notificationSettings, resultPublishNotification: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Result Publish Notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.examScheduleNotification}
                    onChange={(e) => setNotificationSettings({...notificationSettings, examScheduleNotification: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Exam Schedule Notifications</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.systemMaintenanceNotification}
                    onChange={(e) => setNotificationSettings({...notificationSettings, systemMaintenanceNotification: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">System Maintenance Notifications</span>
                </label>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Retention (Days)</label>
                <input
                  type="number"
                  value={notificationSettings.notificationRetentionDays}
                  onChange={(e) => setNotificationSettings({...notificationSettings, notificationRetentionDays: parseInt(e.target.value)})}
                  className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  min="7"
                  max="365"
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => handleResetToDefaults('notifications')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={() => handleSaveSettings('notifications')}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={securitySettings.twoFactorAuthentication}
                    onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuthentication: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={securitySettings.auditLogging}
                    onChange={(e) => setSecuritySettings({...securitySettings, auditLogging: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Audit Logging</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={securitySettings.dataEncryption}
                    onChange={(e) => setSecuritySettings({...securitySettings, dataEncryption: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Data Encryption</span>
                </label>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={securitySettings.maintenanceMode}
                      onChange={(e) => setSecuritySettings({...securitySettings, maintenanceMode: e.target.checked})}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-red-700">Enable Maintenance Mode</span>
                  </label>
                  <p className="text-xs text-red-600 mt-1 ml-7">This will make the system inaccessible to users</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                  <select
                    value={securitySettings.backupFrequency}
                    onChange={(e) => setSecuritySettings({...securitySettings, backupFrequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Retention (Days)</label>
                  <input
                    type="number"
                    value={securitySettings.backupRetentionDays}
                    onChange={(e) => setSecuritySettings({...securitySettings, backupRetentionDays: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="7"
                    max="365"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limit (per hour)</label>
                  <input
                    type="number"
                    value={securitySettings.apiRateLimit}
                    onChange={(e) => setSecuritySettings({...securitySettings, apiRateLimit: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="100"
                    max="10000"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => handleResetToDefaults('security')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={() => handleSaveSettings('security')}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Configuration</h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={systemSettings.cacheEnabled}
                    onChange={(e) => setSystemSettings({...systemSettings, cacheEnabled: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable System Cache</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={systemSettings.performanceMonitoring}
                    onChange={(e) => setSystemSettings({...systemSettings, performanceMonitoring: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Performance Monitoring</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={systemSettings.automaticUpdates}
                    onChange={(e) => setSystemSettings({...systemSettings, automaticUpdates: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Automatic Updates</span>
                </label>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={systemSettings.debugMode}
                      onChange={(e) => setSystemSettings({...systemSettings, debugMode: e.target.checked})}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-yellow-700">Enable Debug Mode</span>
                  </label>
                  <p className="text-xs text-yellow-600 mt-1 ml-7">Only enable for troubleshooting</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Database Optimization</label>
                  <select
                    value={systemSettings.databaseOptimization}
                    onChange={(e) => setSystemSettings({...systemSettings, databaseOptimization: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="auto">Automatic</option>
                    <option value="manual">Manual</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cache Duration (Minutes)</label>
                  <input
                    type="number"
                    value={systemSettings.cacheDuration}
                    onChange={(e) => setSystemSettings({...systemSettings, cacheDuration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="5"
                    max="1440"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
                  <select
                    value={systemSettings.logLevel}
                    onChange={(e) => setSystemSettings({...systemSettings, logLevel: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => handleResetToDefaults('system')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={() => handleSaveSettings('system')}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center space-x-3 text-yellow-600 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6" />
              <h3 className="text-lg font-medium">Confirm Reset</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to reset these settings to their default values? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;