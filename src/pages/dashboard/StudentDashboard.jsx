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
  const [gpaData, setGpaData] = useState({
    overallGPA: 0,
    semester: 0,
    levelGPAs: {
      100: null,
      200: null,
      300: null,
      400: null
    },
    loading: true
  });

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

  // Fetch GPA analytics from backend
  useEffect(() => {
    const fetchGPAData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found');
          setGpaData(prev => ({ ...prev, loading: false }));
          return;
        }

        const response = await fetch('http://localhost:5000/api/gpa/analytics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (response.ok && result.success && result.data.hasResults) {
          // Transform backend data to component format
          const levelGPAs = {};
          let currentSemester = 0;
          
          // Extract level GPAs
          Object.entries(result.data.levels).forEach(([levelKey, levelData]) => {
            levelGPAs[levelKey] = levelData.gpa || null;
            
            // Calculate current semester from semesters with data
            if (levelData.semesters && levelData.semesters.length > 0) {
              const completedSemesters = levelData.semesters.filter(s => s.gpa > 0).length;
              const levelNum = parseInt(levelKey);
              const semestersBeforeLevel = ((levelNum / 100) - 1) * 2;
              currentSemester = Math.max(currentSemester, semestersBeforeLevel + completedSemesters);
            }
          });

          setGpaData({
            overallGPA: result.data.overall.currentGPA || 0,
            semester: currentSemester,
            levelGPAs: levelGPAs,
            loading: false
          });
        } else {
          // No results yet - show empty state
          setGpaData({
            overallGPA: 0,
            semester: 0,
            levelGPAs: {
              100: null,
              200: null,
              300: null,
              400: null
            },
            loading: false
          });
        }
      } catch (error) {
        console.error('Error fetching GPA data:', error);
        setGpaData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchGPAData();
  }, []);
  
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
      
      {/* Main Grid Layout with enhanced mobile responsiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* GPA Summary Card */}
        <div className="col-span-1 transform transition-all duration-300 md:hover:scale-[1.02] hover:shadow-lg">
          <GPASummary 
            overallGPA={gpaData.overallGPA} 
            semester={gpaData.semester}
            levelGPAs={gpaData.levelGPAs}
            loading={gpaData.loading}
          />
        </div>
        
        {/* Last Updated Results Panel */}
        <div className="col-span-1 transform transition-all duration-300 md:hover:scale-[1.02] hover:shadow-lg">
          <LastUpdatedResults />
        </div>
        
        {/* Quick Actions Panel */}
        <div className="col-span-1 transform transition-all duration-300 md:hover:scale-[1.02] hover:shadow-lg">
          <QuickActions />
        </div>
        
        {/* GPA Trend Chart */}
        <div className="col-span-1 transform transition-all duration-300 md:hover:scale-[1.02] hover:shadow-lg">
          <GPATrend data={gpaChartData} />
        </div>
        
        {/* Recent Notifications - Full Width */}
        <div className="col-span-1 lg:col-span-2 transform transition-all duration-300 md:hover:scale-[1.01] hover:shadow-lg">
          <RecentNotifications />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;