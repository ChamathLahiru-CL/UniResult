import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AcademicCapIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import GPAChart from '../../components/dashboard/GPAChart';
import '../../components/dashboard/GPAComponents.css';

/**
 * GPA Analytics Component
 * Detailed GPA analysis with level-wise breakdown, trends, and insights
 */
const GPAAnalytics = () => {
  const location = useLocation();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [highlightedLevel, setHighlightedLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gpaData, setGpaData] = useState(null);

  // Fetch GPA analytics from backend
  useEffect(() => {
    const fetchGPAAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/gpa/analytics', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setGpaData(result.data);
          } else {
            setError('Failed to fetch GPA data');
          }
        } else {
          setError('Failed to fetch GPA data');
        }
      } catch (err) {
        console.error('Error fetching GPA analytics:', err);
        setError('Error fetching GPA analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchGPAAnalytics();
  }, []);

  // Handle navigation from dashboard GPA card
  useEffect(() => {
    if (location.state?.highlightLevel) {
      setHighlightedLevel(location.state.highlightLevel);
      // Clear highlight after 3 seconds
      setTimeout(() => setHighlightedLevel(null), 3000);
      
      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const getGradeColor = (gpa) => {
    if (!gpa) return 'text-gray-400';
    if (gpa >= 3.7) return 'text-green-600';
    if (gpa >= 3.0) return 'text-blue-600';
    if (gpa >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBgColor = (gpa) => {
    if (!gpa) return 'from-gray-50 to-gray-100';
    if (gpa >= 3.7) return 'from-green-50 to-green-100';
    if (gpa >= 3.0) return 'from-blue-50 to-blue-100';
    if (gpa >= 2.5) return 'from-yellow-50 to-yellow-100';
    return 'from-red-50 to-red-100';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GPA Analytics...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !gpaData) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">{error || 'No GPA data available'}</p>
          <p className="text-sm text-gray-500">Please check back after results are uploaded</p>
        </div>
      </div>
    );
  }

  // Show no results state
  if (!gpaData.hasResults) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No results found</p>
          <p className="text-sm text-gray-500">Your GPA will appear here once results are available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GPA Analytics</h1>
              <p className="text-gray-600">Detailed academic performance analysis</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{gpaData.overall.currentGPA}</div>
            <div className="text-sm text-gray-500">Overall GPA</div>
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">
                {gpaData.overall.completedCredits}/{gpaData.overall.totalCredits}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Target GPA</p>
              <p className="text-2xl font-bold text-gray-900">{gpaData.overall.targetGPA}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projected GPA</p>
              <p className="text-2xl font-bold text-gray-900">{gpaData.overall.projectedGPA}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <ArrowPathIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* GPA Progress Chart */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">GPA Progress</h2>
        <div className="h-80">
          <GPAChart 
            data={Object.values(gpaData.levels).map(level => level.gpa).filter(gpa => gpa !== null && gpa > 0)}
            labels={Object.values(gpaData.levels)
              .filter(level => level.gpa !== null && level.gpa > 0)
              .map(level => level.level)}
            targetGPA={gpaData.overall.targetGPA}
            showTarget={true}
          />
        </div>
      </div>

      {/* Level-wise GPA Breakdown */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Level-wise GPA Breakdown</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(gpaData.levels).map(([levelKey, levelData]) => (
            <div
              key={levelKey}
              className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                highlightedLevel === levelKey 
                  ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg animate-pulse' 
                  : selectedLevel === levelKey 
                    ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100' 
                    : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-blue-200'
              }`}
              onClick={() => setSelectedLevel(selectedLevel === levelKey ? null : levelKey)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{levelData.level}</h3>
                {levelData.trend && (
                  <div className={`flex items-center space-x-1 ${
                    levelData.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {levelData.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">
                      {levelData.trend === 'up' ? '+' : ''}{levelData.trendValue}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${getGradeBgColor(levelData.gpa)} bg-clip-text ${getGradeColor(levelData.gpa)}`}>
                    {levelData.gpa || '--'}
                  </div>
                  <div className="text-sm text-gray-500">Level GPA</div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <div>Credits: {levelData.creditHours}</div>
                  <div>Semesters: {levelData.semesters.length}</div>
                </div>
              </div>

              {/* Semester breakdown */}
              {selectedLevel === levelKey && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  {levelData.semesters.map((semester, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{semester.semester}</span>
                      <span className={`font-medium ${getGradeColor(semester.gpa)}`}>
                        {semester.gpa || (semester.status === 'in-progress' ? 'In Progress' : 'Upcoming')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Level Analysis */}
      {selectedLevel && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {gpaData.levels[selectedLevel].level} - Detailed Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gpaData.levels[selectedLevel].semesters.map((semester, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{semester.semester}</h4>
                  <div className={`text-2xl font-bold ${getGradeColor(semester.gpa)}`}>
                    {semester.gpa || '--'}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Credits:</span>
                    <span className="font-medium">{semester.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subjects:</span>
                    <span className="font-medium">{semester.subjects}</span>
                  </div>
                  {semester.status && (
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium capitalize ${
                        semester.status === 'in-progress' ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {semester.status.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GPAAnalytics;