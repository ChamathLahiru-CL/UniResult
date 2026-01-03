import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

/**
 * Footer component for dashboard layout
 * Contains links to legal pages, contact information, and social media
 */
const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-t border-blue-100 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-2 py-4 sm:px-4 md:flex md:items-start md:justify-between text-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-start space-x-3">
              <div className="h-11 w-11">
                <img 
                  src={logo} 
                  alt="UniResult Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Uni</span>
                  <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Result</span>
                </h3>
                <p className="text-[11px] text-gray-600 dark:text-slate-400 mt-1 leading-snug">
                  Your trusted platform for academic result tracking and performance analysis.
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 border border-blue-100">
                <svg className="h-3 w-3 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[10px] font-medium text-blue-600">Fast Results</span>
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 border border-blue-100">
                <svg className="h-3 w-3 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-[10px] font-medium text-blue-600">Real-time Updates</span>
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 border border-blue-100">
                <svg className="h-3 w-3 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-[10px] font-medium text-blue-600">Performance Analytics</span>
              </span>
            </div>
          </div>
          
          {/* About Us */}
          <div className="col-span-1">
            <h3 className="text-gray-800 dark:text-slate-200 font-medium text-sm uppercase tracking-wider mb-3">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 text-xs flex items-center transition-colors duration-200">
                  <svg className="h-3 w-3 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-600 hover:text-blue-600 text-xs flex items-center transition-colors duration-200">
                  <svg className="h-3 w-3 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-blue-600 text-xs flex items-center transition-colors duration-200">
                  <svg className="h-3 w-3 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-gray-800 dark:text-slate-200 font-medium text-sm uppercase tracking-wider mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-blue-600 text-xs flex items-center transition-colors duration-200">
                  <svg className="h-3 w-3 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-blue-600 text-xs flex items-center transition-colors duration-200">
                  <svg className="h-3 w-3 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-600 text-xs flex items-center transition-colors duration-200">
                  <svg className="h-3 w-3 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div className="col-span-1">
            <h3 className="text-gray-800 dark:text-slate-200 font-medium text-sm uppercase tracking-wider mb-3">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-xs text-gray-600">
                <svg className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+94 78 781 0000</span>
              </li>
              <li className="flex items-center text-xs text-gray-600 dark:text-slate-400">
                <svg className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>uniresult@gmail.com</span>
              </li>
              <li className="flex items-center text-xs text-gray-600 dark:text-slate-400">
                <svg className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 University Way, Colombo</span>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div className="col-span-1">
            <h3 className="text-gray-800 dark:text-slate-200 font-medium text-sm uppercase tracking-wider mb-3">Connect With Us</h3>
            <div className="flex space-x-3">
              <a href="https://instagram.com" className="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4 text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://facebook.com" className="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4 text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" className="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4 text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://twitter.com" className="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4 text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
            
            {/* Newsletter signup */}
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-2">Get Our Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="text-xs px-3 py-2 rounded-l-lg border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                />
                <button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-r-lg transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-blue-100 mt-4">
        <div className="max-w-7xl mx-auto px-2 py-3 sm:px-4 flex flex-col md:flex-row md:items-center justify-between">
          <div className="text-gray-500 dark:text-slate-500 text-xs">
            © 2025 UniResult. All rights reserved
          </div>
          <div className="mt-3 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="text-xs text-gray-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Terms of Service</Link>
            <Link to="/cookies" className="text-xs text-gray-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;