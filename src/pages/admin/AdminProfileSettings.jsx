import { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { 
  BellIcon, 
  ShieldCheckIcon, 
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const AdminProfileSettings = () => {
  // Styles
  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1 transition-colors duration-200 group-hover:text-blue-600";
  const buttonClasses = "inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105";
  const cardClasses = "bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-8";
  const inputGroupClasses = "group relative space-y-1";

  // Active tab state
  const [activeTab, setActiveTab] = useState('Profile');
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Get auth context
  const { user } = useAuth();

  // State for form data
  const [profileData, setProfileData] = useState({
    adminId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: ''
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Fetch admin profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        if (!user?.token) {
          console.log('No user token available');
          return;
        }

        console.log('Fetching profile data with token:', user.token);
        const response = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Profile response status:', response.status);
        const data = await response.json();
        console.log('Profile data received:', data);
        
        if (response.ok && data.data) {
          setProfileData({
            adminId: data.data.adminId || user.adminId || '',
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            email: data.data.email || user.email || '',
            phone: data.data.phoneNumber || '',
            profileImage: data.data.profileImage || ''
          });
        } else {
          console.error('Failed to fetch profile data:', data.message);
          // Set default values from user context if available
          setProfileData(prev => ({
            ...prev,
            adminId: user.adminId || '',
            email: user.email || '',
            firstName: user.firstName || '',
            lastName: user.lastName || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Set default values from user context if available
        setProfileData(prev => ({
          ...prev,
          adminId: user?.adminId || '',
          email: user?.email || '',
          firstName: user?.firstName || '',
          lastName: user?.lastName || ''
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  // State for settings
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: true
  });

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('Password updated successfully');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    // TODO: Implement account deletion API call
    console.log('Account deletion requested');
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Image = reader.result;
          console.log('Uploading profile image...');
          
          const response = await fetch('http://localhost:5000/api/user/profile/image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
              profileImage: base64Image
            })
          });

          const data = await response.json();
          console.log('Image upload response:', data);

          if (response.ok) {
            setProfileData(prev => ({ ...prev, profileImage: data.data.profileImage }));
            alert('Profile image updated successfully');
          } else {
            alert(data.message || 'Failed to update profile image');
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading profile image:', error);
        alert('Error uploading profile image: ' + error.message);
      }
    } else {
      alert('Please select an image under 2MB');
    }
  };

  // Handle profile data update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating profile with data:', profileData);
      
      // Update phone number if changed
      if (profileData.phone) {
        const phoneResponse = await fetch('http://localhost:5000/api/user/phone', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            phoneNumber: profileData.phone
          })
        });

        if (!phoneResponse.ok) {
          const phoneError = await phoneResponse.json();
          throw new Error(phoneError.message || 'Failed to update phone number');
        }
      }

      // Fetch the updated profile data
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Profile update response:', data);

      if (response.ok) {
        // Update the local state with the refreshed data
        setProfileData(prev => ({
          ...prev,
          phone: data.data.phoneNumber || prev.phone || '',
          adminId: data.data.adminId || user.adminId || '',
          email: data.data.email || user.email || '',
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          profileImage: data.data.profileImage || ''
        }));
        alert('Profile updated successfully');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error.message);
    }
  };

  // Handle settings update
  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const renderProfile = () => (
    <div className="p-6 space-y-8">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
      <div className="relative">
        <div className="flex items-start space-x-4">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center transition-transform duration-300 transform group-hover:scale-105">
              {profileData.profileImage ? (
                <img 
                  src={profileData.profileImage} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-4xl font-semibold text-blue-400">
                  {profileData.firstName ? profileData.firstName[0] : ''}
                  {profileData.lastName ? profileData.lastName[0] : ''}
                </div>
              )}
            </div>
            <label 
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <PencilIcon className="h-4 w-4 text-white" />
              <input
                id="profile-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Profile Photo</h2>
            <p className="text-sm text-gray-500">JPG or PNG up to 2MB</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Admin ID */}
          <div className={inputGroupClasses}>
            <label className={labelClasses}>Admin ID</label>
            <input
              type="text"
              value={profileData.adminId}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div className={inputGroupClasses}>
            <label className={labelClasses}>Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className={inputClasses}
            />
          </div>

          {/* First Name */}
          <div className={inputGroupClasses}>
            <label className={labelClasses}>First Name</label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              className={inputClasses}
            />
          </div>

          {/* Last Name */}
          <div className={inputGroupClasses}>
            <label className={labelClasses}>Last Name</label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              className={inputClasses}
            />
          </div>

          {/* Phone */}
          <div className={inputGroupClasses}>
            <label className={labelClasses}>Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className={buttonClasses}>
            Save Changes
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="group p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                Email Notifications
              </h3>
              <p className="text-sm text-gray-500">Manage email notification preferences</p>
            </div>
            <button
              onClick={() => handleSettingChange('emailNotifications')}
              className={`${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:opacity-90`}
            >
              <span
                className={`${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1 shadow-sm`}
              />
            </button>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="group p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                SMS Notifications
              </h3>
              <p className="text-sm text-gray-500">Receive updates via SMS</p>
            </div>
            <button
              onClick={() => handleSettingChange('smsNotifications')}
              className={`${
                settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:opacity-90`}
            >
              <span
                className={`${
                  settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1 shadow-sm`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="p-6 space-y-8">
      {/* Two-Factor Authentication */}
      <div className="group p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-500">Add additional security to your account</p>
          </div>
          <button
            onClick={() => handleSettingChange('twoFactorAuth')}
            className={`${
              settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:opacity-90`}
          >
            <span
              className={`${
                settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1 shadow-sm`}
            />
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Current Password */}
          <div className={inputGroupClasses}>
            <label className={labelClasses}>Current Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className={inputClasses}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showCurrentPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className={inputGroupClasses}>
            <label className={labelClasses}>New Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className={inputClasses}
                placeholder="Choose a new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className={inputGroupClasses}>
            <label className={labelClasses}>Confirm New Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={inputClasses}
                placeholder="Re-enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className={`${buttonClasses} w-full mt-6`}>
            Change Password
          </button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="pt-6 mt-8 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
        <div className="bg-red-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-600">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
          >
            Delete Account
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span>Are you absolutely sure?</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
              >
                Yes, Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
        <p className="text-sm text-gray-500">Manage your account settings and preferences</p>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Profile settings navigation">
            <button
              onClick={() => setActiveTab('Profile')}
              className={`${
                activeTab === 'Profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
              aria-current={activeTab === 'Profile' ? 'page' : undefined}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('Notifications')}
              className={`${
                activeTab === 'Notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
              aria-current={activeTab === 'Notifications' ? 'page' : undefined}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('Security')}
              className={`${
                activeTab === 'Security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
              aria-current={activeTab === 'Security' ? 'page' : undefined}
            >
              Security
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cardClasses}>
          <div className="relative overflow-hidden">
            {/* Tab indicator animation */}
            <div 
              className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300 ease-in-out rounded-t-lg" 
              style={{ 
                width: '33.333%',
                transform: `translateX(${
                  activeTab === 'Profile' ? '0%' : 
                  activeTab === 'Notifications' ? '100%' : 
                  '200%'
                })`
              }}
            />
            
            {/* Tab panels */}
            <div className="relative">
              {activeTab === 'Profile' && renderProfile()}
              {activeTab === 'Notifications' && renderNotifications()}
              {activeTab === 'Security' && renderSecurity()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileSettings;