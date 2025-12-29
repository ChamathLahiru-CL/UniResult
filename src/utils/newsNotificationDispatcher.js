/**
 * News Notification Dispatcher
 * Creates notifications for new news items
 */

// Get existing notifications from localStorage
const getNotifications = () => {
    try {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error loading notifications:', error);
        return [];
    }
};

// Save notifications to localStorage
const saveNotifications = (notifications) => {
    try {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
        console.error('Error saving notifications:', error);
    }
};

// Get last checked news timestamp
const getLastCheckedTime = () => {
    try {
        const saved = localStorage.getItem('lastNewsCheck');
        return saved ? new Date(saved) : null;
    } catch {
        return null;
    }
};

// Update last checked news timestamp
const updateLastCheckedTime = () => {
    try {
        localStorage.setItem('lastNewsCheck', new Date().toISOString());
    } catch (error) {
        console.error('Error updating last check time:', error);
    }
};

/**
 * Create notification for new news
 * @param {Object} newsItem - The news item to create notification for
 */
export const createNewsNotification = (newsItem) => {
    const notifications = getNotifications();
    
    // Check if notification for this news already exists
    const existingNotification = notifications.find(
        n => n.newsId === newsItem.id || n.newsId === newsItem._id
    );
    
    if (existingNotification) {
        return; // Don't create duplicate notification
    }
    
    // Create new notification
    const newNotification = {
        id: Date.now() + Math.random(), // Unique ID
        newsId: newsItem.id || newsItem._id, // Reference to news item
        title: `New ${newsItem.type || 'Announcement'}: ${newsItem.title || newsItem.newsTopic}`,
        message: newsItem.content || newsItem.newsMessage || 'Click to view details',
        type: 'news', // notification type
        time: newsItem.date || newsItem.createdAt || new Date().toISOString(),
        isRead: false,
        link: '/dash/news', // Link to news page
        priority: newsItem.priority || 'medium',
        uploader: newsItem.uploader || newsItem.uploadedByRole === 'examDiv' ? 'Exam Division' : 'Admin'
    };
    
    // Add to beginning of notifications array (newest first)
    notifications.unshift(newNotification);
    
    // Keep only last 50 notifications to avoid localStorage overflow
    const trimmedNotifications = notifications.slice(0, 50);
    
    saveNotifications(trimmedNotifications);
    
    console.log('📢 New news notification created:', newNotification.title);
};

/**
 * Check for new news and create notifications
 * @param {Array} newsItems - Array of news items from API
 */
export const checkForNewNews = (newsItems) => {
    if (!newsItems || newsItems.length === 0) {
        return;
    }
    
    const lastChecked = getLastCheckedTime();
    
    // If this is the first check, just update the timestamp and don't create notifications
    if (!lastChecked) {
        updateLastCheckedTime();
        return;
    }
    
    // Find news items created after last check
    const newNews = newsItems.filter(news => {
        const newsDate = new Date(news.date || news.createdAt);
        return newsDate > lastChecked;
    });
    
    // Create notifications for new news
    newNews.forEach(news => {
        createNewsNotification(news);
    });
    
    // Update last checked time
    updateLastCheckedTime();
    
    if (newNews.length > 0) {
        console.log(`📢 Created ${newNews.length} news notification(s)`);
    }
};

/**
 * Manually trigger notification for a specific news item
 * @param {Object} newsItem - The news item
 */
export const notifyNewsItem = (newsItem) => {
    createNewsNotification(newsItem);
};
