import { format, parseISO, isAfter, subDays } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy • hh:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const isWithinDays = (dateString, days) => {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    const cutoffDate = subDays(new Date(), days);
    return isAfter(date, cutoffDate);
  } catch (error) {
    console.error('Error checking date range:', error);
    return false;
  }
};

export const getRelativeTimeFilter = (filterType) => {
  switch (filterType) {
    case 'last7days':
      return (dateString) => isWithinDays(dateString, 7);
    case 'last30days':
      return (dateString) => isWithinDays(dateString, 30);
    case 'all':
    default:
      return () => true;
  }
};