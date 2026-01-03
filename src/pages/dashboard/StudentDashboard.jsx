import React, { useState, useEffect } from 'react';
import GPASummary from '../../components/dashboard/GPASummary';
import LastUpdatedResults from '../../components/dashboard/LastUpdatedResults';
import QuickActions from '../../components/dashboard/QuickActions';
import GPATrend from '../../components/dashboard/GPATrend';
import RecentNotifications from '../../components/dashboard/RecentNotifications';
import logo from '../../assets/images/logo.png';

/**
 * StudentDashboard Component
 * Modern dashboard page for students with enhanced UI/UX
 * Displays comprehensive overview of academic performance and notifications
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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
      {/* Logo Background */}
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-20 pointer-events-none md:bg-cover"
        style={{ backgroundImage: `url(${logo})` }}
      ></div>
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-blue-500/10 rounded-full mix-blend-multiply filter blur-2xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-cyan-800 dark:from-slate-200 dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent">
                    {isLoadingUser ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      `Welcome back, ${userName}!`
                    )}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                    Your academic dashboard • {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {gpaData.loading ? '...' : gpaData.overallGPA.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">GPA</div>
                </div>
                <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {gpaData.loading ? '...' : gpaData.semester}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Semester</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Primary Cards */}
          <div className="xl:col-span-8 space-y-6">
            {/* GPA Summary - Hero Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative p-6 sm:p-8">
                <GPASummary 
                  overallGPA={gpaData.overallGPA} 
                  semester={gpaData.semester}
                  levelGPAs={gpaData.levelGPAs}
                  loading={gpaData.loading}
                />
              </div>
            </div>

            {/* Two Column Grid for Medium Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Last Updated Results */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] animate-slide-up stagger-2">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-2 right-2 w-8 h-8 bg-green-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative p-6">
                  <LastUpdatedResults />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] animate-slide-up stagger-3">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-2 right-2 w-8 h-8 bg-amber-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative p-6">
                  <QuickActions />
                </div>
              </div>
            </div>

            {/* GPA Trend - Full Width */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] animate-slide-up stagger-4">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-2 right-2 w-8 h-8 bg-indigo-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative p-6">
                <GPATrend data={gpaChartData} />
              </div>
            </div>
          </div>

          {/* Right Column - Secondary Content */}
          <div className="xl:col-span-4 space-y-6">
            {/* Recent Notifications - Full Height Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] h-fit animate-slide-up stagger-5">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-2 right-2 w-8 h-8 bg-cyan-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative p-6">
                <RecentNotifications />
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-slate-100/80 to-slate-200/80 dark:from-slate-700/80 dark:to-slate-600/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] animate-slide-up stagger-3">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-2 right-2 w-8 h-8 bg-slate-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Academic Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Current Level</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {gpaData.loading ? '...' : `Level ${Math.floor(gpaData.semester / 2) * 100 + 100}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Completed Semesters</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {gpaData.loading ? '...' : gpaData.semester}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors cursor-pointer">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Performance Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      gpaData.overallGPA >= 3.5 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      gpaData.overallGPA >= 3.0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      gpaData.overallGPA >= 2.5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {gpaData.overallGPA >= 3.5 ? 'Excellent' :
                       gpaData.overallGPA >= 3.0 ? 'Good' :
                       gpaData.overallGPA >= 2.5 ? 'Average' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {gpaData.loading ? '...' : Object.values(gpaData.levelGPAs).filter(gpa => gpa !== null).length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Levels Completed</div>
            </div>
            <div className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50">
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {gpaData.loading ? '...' : `${((gpaData.overallGPA / 4.0) * 100).toFixed(0)}%`}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Achievement Rate</div>
            </div>
            <div className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Current Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;