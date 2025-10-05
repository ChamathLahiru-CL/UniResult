/**
 * HelpSearch Component
 * Smart search bar with auto-suggestions for help topics
 */
import React, { useState } from 'react';
import { MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';

const HelpSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock suggestions - would be replaced with actual search logic
  const suggestions = [
    "How to check my semester GPA?",
    "Where to find my exam results?",
    "How to download result sheets?",
    "Reset password instructions",
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          placeholder="Search help... (e.g., How to check GPA?)"
          className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Auto-suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
          {suggestions
            .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 transition-colors duration-150"
                onClick={() => {
                  setSearchQuery(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default HelpSearch;