import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    NewspaperIcon,
    UserGroupIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    EyeIcon,
    ArrowDownTrayIcon,
    PhotoIcon,
    DocumentIcon
} from '@heroicons/react/24/outline';
import { checkForNewNews } from '../../utils/newsNotificationDispatcher';

const News = () => {
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userFaculty, setUserFaculty] = useState(null);

    // Get current user ID from auth context/localStorage
    const getCurrentUserId = () => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                return user.id;
            }
        } catch (error) {
            console.error('Error getting user ID:', error);
        }
        return null;
    };

    // Get current user's faculty from localStorage
    const getCurrentUserFaculty = () => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                console.log('📋 Current user data:', user);
                console.log('📍 All user properties:', Object.keys(user));
                console.log('📍 User faculty:', user.faculty);
                
                // Try different possible faculty property names
                const faculty = user.faculty || user.Faculty || user.facultyName || user.department;
                console.log('🎓 Detected faculty:', faculty);
                
                return faculty;
            }
        } catch (error) {
            console.error('Error getting user faculty:', error);
        }
        return null;
    };

    // Fetch user faculty from backend API
    const fetchUserFaculty = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const response = await fetch('http://localhost:5000/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('👤 User profile from API:', data);
                
                // Extract faculty from the response
                const faculty = data.data?.faculty || data.faculty || data.data?.department || data.department;
                console.log('🎓 Faculty from API:', faculty);
                
                setUserFaculty(faculty);
                return faculty;
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
        return null;
    };

    // Load news from backend
    const loadNews = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Get user's faculty to filter news
            const currentUserFaculty = userFaculty || getCurrentUserFaculty();
            console.log('🎓 Filtering news for faculty:', currentUserFaculty);
            
            // Don't load news if faculty is not available yet
            if (!currentUserFaculty) {
                console.log('⏳ Waiting for user faculty to be loaded...');
                setLoading(false);
                return;
            }
            
            // Build API URL with faculty filter
            const apiUrl = currentUserFaculty 
                ? `http://localhost:5000/api/news?faculty=${encodeURIComponent(currentUserFaculty)}`
                : 'http://localhost:5000/api/news';
            
            console.log('🔗 API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            
            console.log('📰 Received news items:', data.data?.length || 0);
            console.log('📰 News data:', data.data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch news');
            }

            // Get current user ID
            const currentUserId = getCurrentUserId();
            
            console.log('🎓 Current user faculty for filtering:', currentUserFaculty);

            // Transform backend data to match frontend structure
            const transformedNews = data.data
                .filter(news => {
                    // Client-side filtering as fallback
                    // Show news if:
                    // 1. It's for "All Faculties" - visible to everyone
                    // 2. It exactly matches the user's faculty
                    
                    if (!currentUserFaculty) {
                        console.log('⚠️ No user faculty found, showing all news');
                        return true; // If no faculty, show all
                    }
                    
                    const newsFaculty = news.faculty;
                    
                    // Check if news is for all faculties
                    if (newsFaculty === 'All Faculties') {
                        console.log(`✅ "${news.newsTopic}" - All Faculties (visible to everyone)`);
                        return true;
                    }
                    
                    // Exact faculty match (case-insensitive)
                    const isMatch = newsFaculty?.toLowerCase() === currentUserFaculty.toLowerCase();
                    
                    console.log(`${isMatch ? '✅' : '❌'} "${news.newsTopic}": faculty="${newsFaculty}", userFaculty="${currentUserFaculty}", match=${isMatch}`);
                    
                    return isMatch;
                })
                .map(news => ({
                    id: news._id,
                    title: news.newsTopic,
                    content: news.newsMessage,
                    uploader: news.uploadedByRole === 'examDiv' ? 'Exam Division' : 'Admin',
                    uploaderName: news.uploadedByName,
                    date: news.createdAt,
                    priority: news.priority || 'medium',
                    type: news.newsType,
                    faculty: news.faculty,
                    fileUrl: news.fileUrl,
                    fileName: news.originalFileName,
                    isRead: (() => {
                        if (!currentUserId || !news.readBy || news.readBy.length === 0) {
                            return false;
                        }

                        return news.readBy.some(read => {
                            // read.userId is populated with: { _id, username, email, name }
                            // localStorage stores user.id which is actually the username/enrollment number
                            // So we need to compare with the username field, not _id

                            let readUserId = read.userId;

                            // If it's an object (populated), use the username field
                            if (readUserId && typeof readUserId === 'object') {
                                // Compare using username since that's what's in localStorage as user.id
                                return readUserId.username === currentUserId;
                            }

                            // Fallback: if it's just a string _id, this won't match but keep the logic
                            return String(readUserId) === String(currentUserId);
                        });
                    })()
                }));
            
            console.log(`✅ Filtered news items: ${transformedNews.length} out of ${data.data.length}`);

            setNewsItems(transformedNews);

            // Check for new news and create notifications
            checkForNewNews(transformedNews);
        } catch (err) {
            console.error('Error loading news:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load user faculty and news on component mount
    useEffect(() => {
        const loadFacultyAndNews = async () => {
            await fetchUserFaculty();
            loadNews();
        };
        loadFacultyAndNews();
    }, []);
    
    // Reload news when userFaculty changes
    useEffect(() => {
        if (userFaculty) {
            loadNews();
        }
    }, [userFaculty]);

    const markAsRead = async (newsId) => {
        // Validate news ID
        if (!newsId || typeof newsId !== 'string' || newsId.length !== 24) {
            console.error('Invalid news ID:', newsId);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/news/${newsId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Update local state
                setNewsItems(prevItems =>
                    prevItems.map(item =>
                        item.id === newsId ? { ...item, isRead: true } : item
                    )
                );
            } else {
                const responseData = await response.json();
                console.error('Failed to mark as read:', responseData);
            }
        } catch (err) {
            console.error('Error marking news as read:', err);
        }
    };

    // Mark all news as read
    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Mark all unread news as read
            const unreadNews = newsItems.filter(item => !item.isRead);

            await Promise.all(
                unreadNews.map(news => markAsRead(news.id))
            );
        } catch (err) {
            console.error('Error marking all news as read:', err);
        }
    };

    // Filter news
    const filteredNews = newsItems.filter(item => {
        if (filter === 'read') return item.isRead;
        if (filter === 'unread') return !item.isRead;
        return true;
    });

    // Get unread count
    const unreadCount = newsItems.filter(item => !item.isRead).length;

    // Handle news click
    const handleNewsClick = (newsItem) => {
        markAsRead(newsItem.id);
    };

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'from-red-600 to-red-700';
            case 'high':
                return 'from-red-500 to-red-600';
            case 'medium':
                return 'from-yellow-500 to-orange-500';
            case 'low':
                return 'from-green-500 to-green-600';
            default:
                return 'from-blue-500 to-indigo-600';
        }
    };

    // Get icon based on uploader
    const getIcon = (uploader) => {
        switch (uploader) {
            case 'Admin':
                return UserGroupIcon;
            case 'Exam Division':
                return AcademicCapIcon;
            default:
                return NewspaperIcon;
        }
    };

    // Format date to relative time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else {
            return `${days} days ago`;
        }
    };

    if (loading) {
        return (
            <div className="animate-fadeIn p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
                <div className="relative mb-6 sm:mb-8">
                    <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
                    <div className="absolute top-4 right-16 w-16 sm:w-20 h-12 sm:h-16 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
                    <h1 className="relative text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                        News & Announcements
                    </h1>
                    <p className="text-gray-600 text-xs sm:text-sm font-medium">
                        Stay informed with the latest updates from Admin and Exam Division
                    </p>
                </div>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading news...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="animate-fadeIn p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
                <div className="relative mb-6 sm:mb-8">
                    <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
                    <div className="absolute top-4 right-16 w-16 sm:w-20 h-12 sm:h-16 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
                    <h1 className="relative text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                        News & Announcements
                    </h1>
                    <p className="text-gray-600 text-xs sm:text-sm font-medium">
                        Stay informed with the latest updates from Admin and Exam Division
                    </p>
                </div>
                <div className="text-center py-12 px-4 rounded-2xl bg-red-50 border-2 border-red-200">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-100 mb-3 sm:mb-4">
                        <svg className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-2">Error Loading News</h3>
                    <p className="text-xs sm:text-sm text-red-700 max-w-sm mx-auto mb-4">
                        {error}
                    </p>
                    <button
                        onClick={loadNews}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="relative mb-6 sm:mb-8">
                <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
                <div className="absolute top-4 right-16 w-16 sm:w-20 h-12 sm:h-16 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
                <h1 className="relative text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                    News & Announcements
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                    Stay informed with the latest updates from Admin and Exam Division
                </p>
            </div>

            {/* Back to Dashboard Link */}
            <div className="mb-4">
                <Link
                    to="/dash"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-lg shadow-sm p-3 sm:p-4">
                    {/* Tab Navigation */}
                    <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
                        {['all', 'unread', 'read'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`
                  relative whitespace-nowrap py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-xs sm:text-sm capitalize transition-all duration-200
                  focus:outline-none flex-shrink-0
                  ${filter === tab
                                        ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md shadow-blue-200'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }
                  ${tab === 'unread' && unreadCount > 0 ? 'pr-8 sm:pr-10' : ''}
                `}
                            >
                                {tab}
                                {tab === 'unread' && unreadCount > 0 && (
                                    <span className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs bg-red-500 text-white rounded-full min-w-[18px] sm:min-w-[20px] flex items-center justify-center font-bold">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Mark All as Read Button */}
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="w-full sm:w-auto text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg
                shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all duration-200
                hover:translate-y-[-1px] active:translate-y-[1px] focus:outline-none"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {/* News List */}
            <div className="space-y-4">
                {filteredNews.map((news) => {
                    const Icon = getIcon(news.uploader);
                    const isRead = news.isRead;
                    return (
                        <div
                            key={news.id}
                            className={`
                group bg-white rounded-xl shadow-md p-4 sm:p-5 transition-all duration-300 cursor-pointer
                ${isRead
                                    ? 'border border-gray-100 hover:border-gray-200'
                                    : 'border-2 border-blue-300 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-lg shadow-blue-100'
                                }
                hover:shadow-xl hover:transform hover:-translate-y-1
              `}
                            onClick={() => handleNewsClick(news)}
                        >
                            <div className="flex items-start space-x-3 sm:space-x-4">
                                <div className={`
                  p-2.5 sm:p-3 rounded-xl transition-all duration-300 flex-shrink-0 relative
                  ${isRead
                                        ? 'bg-gray-100 group-hover:bg-gray-200'
                                        : 'bg-gradient-to-r from-blue-100 to-indigo-100 group-hover:shadow-md'
                                    }
                `}>
                                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isRead
                                        ? 'text-gray-600 group-hover:text-gray-800'
                                        : 'text-blue-600 group-hover:text-blue-700'
                                        }`} />
                                    {!isRead && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-2">
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm sm:text-base font-semibold pr-2 ${isRead ? 'text-gray-800' : 'text-blue-800'
                                                }`}>
                                                {news.title}
                                            </p>
                                            <span className={`text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${getPriorityColor(news.priority)} text-white`}>
                                                {news.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                {news.uploaderName || news.uploader}
                                            </span>
                                            <span className="text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 w-fit">
                                                {formatTime(news.date)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                                        {news.content}
                                    </p>

                                    {/* File Attachment Section */}
                                    {news.fileUrl && (
                                        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {/* Image Preview */}
                                            {news.fileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(news.fileName) && (
                                                <div className="mb-3">
                                                    <img
                                                        src={`http://localhost:5000${news.fileUrl}`}
                                                        alt={news.fileName}
                                                        className="max-w-full h-auto rounded-lg shadow-sm max-h-96 object-contain"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="hidden items-center justify-center p-4 bg-gray-100 rounded-lg text-gray-500">
                                                        <PhotoIcon className="w-8 h-8 mr-2" />
                                                        <span className="text-sm">Image preview not available</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* File Info and Download Button */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {news.fileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(news.fileName) ? (
                                                        <PhotoIcon className="w-5 h-5 text-blue-600" />
                                                    ) : (
                                                        <DocumentIcon className="w-5 h-5 text-blue-600" />
                                                    )}
                                                    <span className="text-sm text-gray-700 font-medium">
                                                        {news.fileName || 'Attachment'}
                                                    </span>
                                                </div>
                                                <a
                                                    href={`http://localhost:5000${news.fileUrl}`}
                                                    download={news.fileName}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r
                                                        from-green-500 to-green-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200
                                                        hover:translate-y-[-1px] active:translate-y-[1px] focus:outline-none"
                                                >
                                                    <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" />
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                                        <button
                                            onClick={() => handleNewsClick(news)}
                                            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r
                        from-blue-500 to-indigo-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200
                        hover:translate-y-[-1px] active:translate-y-[1px] focus:outline-none"
                                        >
                                            <EyeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                                            Read More
                                        </button>
                                        {!isRead && (
                                            <button
                                                onClick={() => markAsRead(news.id)}
                                                className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600
                          bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 focus:outline-none"
                                            >
                                                <CheckCircleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredNews.length === 0 && (
                    <div className="text-center py-12 sm:py-16 px-4 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200">
                        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 mb-3 sm:mb-4">
                            <NewspaperIcon className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No news</h3>
                        <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
                            {filter === 'unread' ? 'You\'re all caught up! No unread news to show.' :
                                filter === 'read' ? 'No read news in your history yet.' :
                                    'Your news feed is empty. New announcements will appear here.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;