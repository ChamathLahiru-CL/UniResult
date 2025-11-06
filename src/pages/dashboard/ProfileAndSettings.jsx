import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const ProfileAndSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    resultAlerts: true,
    examUpdates: true,
    generalAnnouncements: false
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Sample user data - replace with actual user data from your auth system
  const [userData, setUserData] = useState({
    studentId: 'IT21021380',
    email: 'it21021380@my.sliit.lk',
    firstName: 'Chamath',
    lastName: 'Lahiru',
    phoneNumber: '+94 77 123 4567',
    profileImage: null // URL or null
  });

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePhoneNumberChange = (e) => {
    setUserData({
      ...userData,
      phoneNumber: e.target.value
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Add password validation and update logic here
    setIsEditingPassword(false);
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      // Add account deletion logic here
      navigate('/');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({
          ...userData,
          profileImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      {/* Page Header */}
      <div className="relative mb-6">
        <div className="absolute top-0 left-0 w-12 h-12 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-2 right-12 w-16 h-12 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <h1 className="relative text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          Profile & Settings
        </h1>
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'notifications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  {userData.profileImage ? (
                    <img
                      src={userData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-full h-full text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
                <p className="text-sm text-gray-500">JPG or PNG up to 2MB</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student ID</label>
                <input
                  type="text"
                  value={userData.studentId}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">University Email</label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={userData.firstName}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={userData.lastName}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={userData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BellIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={() => handleNotificationChange('emailNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Result Alerts</p>
                      <p className="text-sm text-gray-500">Get notified when new results are published</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.resultAlerts}
                      onChange={() => handleNotificationChange('resultAlerts')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BellIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Exam Updates</p>
                      <p className="text-sm text-gray-500">Receive notifications about exam schedules</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.examUpdates}
                      onChange={() => handleNotificationChange('examUpdates')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BellIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">General Announcements</p>
                      <p className="text-sm text-gray-500">Stay updated with general university announcements</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.generalAnnouncements}
                      onChange={() => handleNotificationChange('generalAnnouncements')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Password Change Section */}
            {!isEditingPassword ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-500">Set a unique password to protect your account</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingPassword(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Account Management */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Management</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left"
                >
                  Log out
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Confirm Logout</h3>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6" />
              <h3 className="text-lg font-medium">Delete Account</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone. Type 'DELETE' to confirm account deletion.
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmation('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE'}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  deleteConfirmation === 'DELETE'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAndSettings;