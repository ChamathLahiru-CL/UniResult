import React from 'react';
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
  // Sample data for GPA Summary
  const gpaData = {
    currentGPA: 3.7,
    overallGPA: 3.75,
    semester: 5
  };
  
  // Sample data for last updated results
  const recentResults = [
    { subject: 'Stat', level: 200, semester: 2, grade: 'A+' },
    { subject: 'HCI', level: 200, semester: 4, grade: 'B' },
    { subject: 'Calculus', level: 100, semester: 3, grade: 'C' }
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
  
  // Sample notification data
  const notifications = [
    { 
      type: 'result', 
      message: 'Semester 5 results are now available', 
      time: 'Today, 10:20 AM' 
    },
    { 
      type: 'gpa', 
      message: 'Your GPA has updated', 
      time: 'Today, 10:20 AM' 
    },
    { 
      type: 'exam', 
      message: 'Upcoming exam timetable', 
      time: 'Today, 10:20 AM' 
    },
    { 
      type: 'result', 
      message: 'Stat 200 Level result updated', 
      time: 'Today, 10:20 AM' 
    }
  ];
  
  return (
    <div className="animate-fadeIn">
      {/* Page Header with decorative elements */}
      <div className="relative mb-3">
        <div className="absolute top-0 left-0 w-12 h-12 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-2 right-12 w-16 h-12 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="relative text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Welcome, Lahiru</h1>
            <p className="relative text-gray-500 text-xs">Home Page Overview</p>
          </div>
        </div>
      </div>
      
      {/* Main Grid Layout with enhanced styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* GPA Summary Card */}
        <div className="col-span-1 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
          <GPASummary 
            currentGPA={gpaData.currentGPA} 
            overallGPA={gpaData.overallGPA} 
            semester={gpaData.semester}
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
          <RecentNotifications notifications={notifications} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;