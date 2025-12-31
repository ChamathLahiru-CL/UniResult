import { isAfter, subDays } from 'date-fns';

export const isActiveMember = (lastActivityDate) => {
  if (!lastActivityDate) return false;
  return isAfter(new Date(lastActivityDate), subDays(new Date(), 7));
};

export const getActivityIcon = (type) => {
  if (!type) return '📋';
  
  const lowerType = type.toLowerCase();
  
  // Check for activity types from backend
  if (lowerType.includes('result')) return '📄';
  if (lowerType.includes('timetable')) return '🕒';
  if (lowerType.includes('news')) return '📰';
  if (lowerType.includes('compliance')) return '⚙️';
  if (lowerType.includes('upload')) return '📤';
  if (lowerType.includes('login')) return '🔐';
  if (lowerType.includes('update')) return '🔄';
  if (lowerType.includes('system')) return '⚙️';
  
  return '📋';
};