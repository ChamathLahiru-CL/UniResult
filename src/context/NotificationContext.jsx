/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count from backend
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setUnreadCount(result.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Refresh count (can be called from anywhere)
  const refreshCount = () => {
    fetchUnreadCount();
  };

  // Decrease count (when marking as read)
  const decreaseCount = (amount = 1) => {
    setUnreadCount(prev => Math.max(0, prev - amount));
  };

  // Reset count to 0 (when marking all as read)
  const resetCount = () => {
    setUnreadCount(0);
  };

  // Fetch count on mount and set up polling
  useEffect(() => {
    fetchUnreadCount();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    unreadCount,
    refreshCount,
    decreaseCount,
    resetCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
