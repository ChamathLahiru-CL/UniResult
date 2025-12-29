import React, { useState, useEffect } from 'react';
import GPASummary from '../../components/dashboard/GPASummary';
import LastUpdatedResults from '../../components/dashboard/LastUpdatedResults';
import QuickActions from '../../components/dashboard/QuickActions';
import GPATrend from '../../components/dashboard/GPATrend';
import RecentNotifications from '../../components/dashboard/RecentNotifications';

/**
 * StudentDashboard Component
 * Main dashboard page for students
 * Displays overview of academic performance and notifications
 */
const StudentDashboard = () => {
  const [userName, setUserName] = useState('User');
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found');
          setIsLoadingUser(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data');
        }

        // Set user name - prefer firstName, fall back to full name
        const displayName = data.data.firstName || data.data.name.split(' ')[0] || 'User';
        setUserName(displayName);
        setIsLoadingUser(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserName('User');
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  // Sample data for GPA Summary with level-wise breakdown
  const gpaData = {
    overallGPA: 3.75,
    semester: 5,
    levelGPAs: {
      100: 3.65,
      200: 3.80,
      300: 3.70,
      400: null
    }
  };
  
  // Sample data for last updated results with enhanced structure
  const recentResults = [
    { 
      code: 'CSC201',
      subject: 'Data Structures', 
      level: 200, 
      semester: 3, 
      grade: 'A+',
      updateDate: '2025-10-28',
      isNew: true
    },
    { 
      code: 'CSC102',
      subject: 'Programming Fundamentals', 
      level: 100, 
      semester: 2, 
      grade: 'A',
      updateDate: '2025-10-27',
      isNew: true
    },
    { 
      code: 'MTH101',
      subject: 'Mathematics I', 
      level: 100, 
      semester: 1, 
      grade: 'B+',
      updateDate: '2025-10-25',
      isNew: false
    },
    { 
      code: 'ENG101',
      subject: 'English I', 
      level: 100, 
      semester: 1, 
      grade: 'A-',
      updateDate: '2025-10-24',
      isNew: false
    }
  ];
  
  // Sample data for GPA trend
  const gpaChartData = [
    { month: 'JAN', value: 300 },
    { month: 'FEB', value: 350 },
    { month: 'MAR', value: 400 },
    { month: 'APR', value: 450 },
    { month: 'MAY', value: 500 },
    { month: 'JUN', value: 550 },
    { month: 'JUL', value: 700 },
    { month: 'AUG', value: 750 },
    { month: 'SEP', value: 725 },
    { month: 'OCT', value: 675 },
    { month: 'NOV', value: 650 },
    { month: 'DEC', value: 630 }
  ];
  
  return (
    <div className="animate-fadeIn">
      {/* Page Header with decorative elements */}
      <div className="relative mb-3">
        <div className="absolute top-0 left-0 w-12 h-12 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-2 right-12 w-16 h-12 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="relative text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {isLoadingUser ? 'Welcome...' : `Welcome, ${userName}`}
            </h1>
            <p className="relative text-gray-500 text-xs">Home Page Overview</p>
          </div>
        </div>
      </div>
      
      {/* Main Grid Layout with enhanced styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* GPA Summary Card */}
        <div className="col-span-1 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <GPASummary 
            overallGPA={gpaData.overallGPA} 
            semester={gpaData.semester}
            levelGPAs={gpaData.levelGPAs}
          />
        </div>
        
        {/* Last Updated Results Panel */}
        <div className="col-span-1 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <LastUpdatedResults results={recentResults} />
        </div>
        
        {/* Quick Actions Panel */}
        <div className="col-span-1 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <QuickActions />
        </div>
        
        {/* GPA Trend Chart */}
        <div className="col-span-1 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <GPATrend data={gpaChartData} />
        </div>
        
        {/* Recent Notifications - Full Width */}
        <div className="col-span-1 md:col-span-2 mt-2 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
          <RecentNotifications />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;