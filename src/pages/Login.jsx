import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import logo from '../assets/images/logo.png';
import { useAuth } from '../context/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student', // Default role is student
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create user object with additional security token
      const user = { 
        id: formData.username,
        name: formData.username,
        role: formData.role,
        token: 'dummy-auth-token-' + Date.now(), // Add a token for auth persistence
        loginTime: new Date().toISOString()
      };
      
      // Log in the user using AuthContext
      login(user);
      
      // Get the redirect path from location state or use default based on role
      const locationState = location.state;
      const redirectPath = locationState?.from || 
        (formData.role === 'student' ? '/dash' :
         formData.role === 'admin' ? '/admin' :
         formData.role === 'examDiv' ? '/exam' : '/');
      
      // Navigate to the intended page or role-based dashboard
      navigate(redirectPath, { replace: true });
      
      console.log('Login successful:', user);
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Combined Card */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg">
        {/* Login Form Side */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-10 flex flex-col justify-center relative">
          {/* Subtle decorative elements */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-br-full opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-tl-full opacity-50"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-md">Uni</span>
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-extrabold drop-shadow-md">Result</span>
              </h1>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-[15px] text-gray-600">
                Please input your username & password to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="transition-all duration-300 transform hover:-translate-y-1">
                <Input
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your enrollment number"
                  autoComplete="username"
                />
              </div>

              <div className="transition-all duration-300 transform hover:-translate-y-1">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={() => (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                  onIconClick={() => setShowPassword(!showPassword)}
                />
              </div>
              
              <div className="mt-4 mb-2">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="role" className="block text-gray-700 text-sm font-medium">
                    Select Your Role
                  </label>
                  <div className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-1.5 ${
                        formData.role === 'student' ? 'bg-blue-500' : 
                        formData.role === 'admin' ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                    ></div>
                    <span className="text-xs font-medium text-gray-600">
                      {formData.role === 'student' ? 'Student Access' : 
                       formData.role === 'admin' ? 'Admin Access' : 'Exam Division Access'}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    autoComplete="off"
                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-all duration-300 ease-in-out shadow-sm hover:shadow hover:border-blue-300 appearance-none"
                  >
                    <option value="student" className="py-2">Student</option>
                    <option value="admin" className="py-2">Administrator</option>
                    <option value="examDiv" className="py-2">Exam Division</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember Me"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  name="rememberMe"
                  id="rememberMe"
                />
                <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200 underline-offset-2 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-2">
                  {error}
                </div>
              )}
              
              <div className="mt-2">
                <Button 
                  type="submit" 
                  fullWidth 
                  disabled={isLoading}
                  className="py-3 text-base shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </div>
                  ) : 'Login Now'}
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">or login with</span>
                </div>
              </div>

              <Button
                variant="google"
                fullWidth
                icon={FcGoogle}
                onClick={() => console.log('Google login clicked')}
                className="shadow-sm hover:shadow transition-all duration-300 border border-gray-300"
              >
                Continue with Google
              </Button>

              <div className="text-center mt-8 border-t border-gray-100 pt-6">
                <span className="text-gray-600 text-sm">Don't have an account? </span>
                <Link to="/signup" className="text-blue-500 hover:text-blue-600 text-sm font-medium ml-1 transition-colors duration-200 hover:underline underline-offset-2">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Branding Side with Blurred Background */}
        <div className="w-full md:w-1/2 bg-blue-50 relative overflow-hidden">
          {/* Blurred background elements
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-blue-300 mix-blend-multiply filter blur-xl opacity-70"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-blue-400 mix-blend-multiply filter blur-xl opacity-70"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-blue-200 mix-blend-multiply filter blur-lg opacity-70"></div>
          </div> */}
          
          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center z-10">
            {/* Animated logo container with glow effect */}
            <div className="relative mb-0 transform hover:scale-105 transition-transform duration-500">
              <div className="absolute -inset-1 bg-blue-200 opacity-30 rounded-full blur-xl animate-pulse"></div>
              {/* <div className="relative bg-white bg-opacity-80 rounded-full p-5 shadow-xl"> */}
              <div>
                <img 
                  src={logo} 
                  alt="UniResult Logo" 
                  className="w-100 h-100 object-contain drop-shadow-lg" 
                />
              </div>
              <div className="absolute -bottom-2 w-full h-4 bg-blue-1000 opacity-20 blur-md"></div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Welcome to the <span className="text-blue-600">UniResult</span> Platform
            </h1>
            <p className="text-base md:text-lg text-gray-700 max-w-md mb-6">
              Please input your username & password to continue
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mb-8">
              <div className="bg-white bg-opacity-70 p-3 rounded-lg shadow-sm text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Students</h3>
                <p className="text-xs text-gray-600 mt-1">View exam results</p>
              </div>
              
              <div className="bg-white bg-opacity-70 p-3 rounded-lg shadow-sm text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Exam Division</h3>
                <p className="text-xs text-gray-600 mt-1">Manage exams</p>
              </div>
              
              <div className="bg-white bg-opacity-70 p-3 rounded-lg shadow-sm text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Admin</h3>
                <p className="text-xs text-gray-600 mt-1">System management</p>
              </div>
            </div>
            <div className="flex justify-center mt-10 space-x-3">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;