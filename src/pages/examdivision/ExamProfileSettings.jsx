import React, { useState } from 'react';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  PencilIcon,
  KeyIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';
import Toggle from '../../components/Toggle';
import Button, { SuccessButton, LoadingButton } from '../../components/Button';

const ExamProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: 'Chamath',
    lastName: 'Lahiru',
    employeeId: 'EMP2024001',
    email: 'chamath.lahiru@university.lk',
    phone: '+94 77 123 4567',
    department: 'Exam Division',
    position: 'Exam Officer',
    joinDate: '2024-01-15',
    address: '123 University Road, Colombo 07',
    emergencyContact: '+94 77 987 6543',
    profileImage: null
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    examReminders: true,
    resultNotifications: true,
    systemAlerts: true,
    weeklyReports: false,
    twoFactorAuth: true,
    sessionTimeout: '30',
    loginAlerts: true,
    darkMode: false,
    compactView: false,
    autoSave: true,
    language: 'en'
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image under 2MB');
    }
  };

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    alert('Profile updated successfully!');
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Password change requested');
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Handle setting change
  const handleSettingChange = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  // Handle dropdown setting change
  const handleDropdownChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: UserCircleIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'preferences', name: 'Preferences', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserCircleIcon className="h-8 w-8 text-blue-500 mr-3" />
            Profile & Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account information, security settings, and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 mr-3 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-500">Update your personal and professional details</p>
                </div>
                
                <div className="p-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                        {profileData.profileImage ? (
                          <img src={profileData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                            <span className="text-2xl font-bold text-white">
                              {profileData.firstName[0]}{profileData.lastName[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                        <PencilIcon className="h-4 w-4 text-white" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{`${profileData.firstName} ${profileData.lastName}`}</h3>
                      <p className="text-gray-600">{profileData.position}</p>
                      <p className="text-sm text-gray-500">ID: {profileData.employeeId}</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Personal Information */}
                      <div className="sm:col-span-2">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <IdentificationIcon className="h-5 w-5 text-gray-400 mr-2" />
                          Personal Information
                        </h4>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                        <input
                          type="text"
                          value={profileData.employeeId}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Join Date</label>
                        <input
                          type="date"
                          value={profileData.joinDate}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500"
                        />
                      </div>

                      {/* Contact Information */}
                      <div className="sm:col-span-2">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6 flex items-center">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                          Contact Information
                        </h4>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                        <input
                          type="tel"
                          value={profileData.emergencyContact}
                          onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      {/* Professional Information */}
                      <div className="sm:col-span-2">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6 flex items-center">
                          <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
                          Professional Information
                        </h4>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <input
                          type="text"
                          value={profileData.department}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Position</label>
                        <input
                          type="text"
                          value={profileData.position}
                          onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <SuccessButton type="submit">
                        Save Changes
                      </SuccessButton>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Password Change */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <KeyIcon className="h-5 w-5 text-gray-400 mr-2" />
                      Change Password
                    </h2>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handlePasswordChange}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Current Password</label>
                          <div className="mt-1 relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">New Password</label>
                          <div className="mt-1 relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button
                          type="submit"
                          variant="success"
                          leftIcon={KeyIcon}
                        >
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
                    <p className="text-sm text-gray-500">Manage your account security preferences</p>
                  </div>
                  <div className="p-6 space-y-6">
                    <Toggle
                      enabled={settings.twoFactorAuth}
                      onChange={() => handleSettingChange('twoFactorAuth')}
                      label="Two-Factor Authentication"
                      description="Add an extra layer of security to your account"
                    />
                    
                    <Toggle
                      enabled={settings.loginAlerts}
                      onChange={() => handleSettingChange('loginAlerts')}
                      label="Login Alerts"
                      description="Get notified of new login attempts"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                      <select
                        value={settings.sessionTimeout}
                        onChange={(e) => handleDropdownChange('sessionTimeout', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                        <option value="480">8 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-500">Choose how you want to receive notifications</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* General Notifications */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <BellIcon className="h-5 w-5 text-gray-400 mr-2" />
                        General Notifications
                      </h3>
                      <div className="space-y-4">
                        <Toggle
                          enabled={settings.emailNotifications}
                          onChange={() => handleSettingChange('emailNotifications')}
                          label="Email Notifications"
                          description="Receive updates via email"
                        />
                        
                        <Toggle
                          enabled={settings.smsNotifications}
                          onChange={() => handleSettingChange('smsNotifications')}
                          label="SMS Notifications"
                          description="Receive updates via text message"
                        />

                        <Toggle
                          enabled={settings.pushNotifications}
                          onChange={() => handleSettingChange('pushNotifications')}
                          label="Push Notifications"
                          description="Receive browser push notifications"
                        />
                      </div>
                    </div>

                    {/* Exam Division Specific */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                        Exam Division Notifications
                      </h3>
                      <div className="space-y-4">
                        <Toggle
                          enabled={settings.examReminders}
                          onChange={() => handleSettingChange('examReminders')}
                          label="Exam Reminders"
                          description="Get notified about upcoming exams"
                        />
                        
                        <Toggle
                          enabled={settings.resultNotifications}
                          onChange={() => handleSettingChange('resultNotifications')}
                          label="Result Notifications"
                          description="Notifications for result processing"
                        />

                        <Toggle
                          enabled={settings.systemAlerts}
                          onChange={() => handleSettingChange('systemAlerts')}
                          label="System Alerts"
                          description="Important system notifications"
                        />

                        <Toggle
                          enabled={settings.weeklyReports}
                          onChange={() => handleSettingChange('weeklyReports')}
                          label="Weekly Reports"
                          description="Receive weekly activity summaries"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Application Preferences</h2>
                  <p className="text-sm text-gray-500">Customize your application experience</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Appearance */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <ComputerDesktopIcon className="h-5 w-5 text-gray-400 mr-2" />
                        Appearance
                      </h3>
                      <div className="space-y-4">
                        <Toggle
                          enabled={settings.darkMode}
                          onChange={() => handleSettingChange('darkMode')}
                          label="Dark Mode"
                          description="Enable dark theme"
                        />
                        
                        <Toggle
                          enabled={settings.compactView}
                          onChange={() => handleSettingChange('compactView')}
                          label="Compact View"
                          description="Use more compact interface"
                        />
                      </div>
                    </div>

                    {/* System Preferences */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Cog6ToothIcon className="h-5 w-5 text-gray-400 mr-2" />
                        System Preferences
                      </h3>
                      <div className="space-y-4">
                        <Toggle
                          enabled={settings.autoSave}
                          onChange={() => handleSettingChange('autoSave')}
                          label="Auto Save"
                          description="Automatically save form data"
                        />

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                          <select
                            value={settings.language}
                            onChange={(e) => handleDropdownChange('language', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="en">English</option>
                            <option value="si">Sinhala</option>
                            <option value="ta">Tamil</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamProfileSettings;