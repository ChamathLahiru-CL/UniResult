import { isAfter, subDays } from 'date-fns';

export const isActiveMember = (lastActivityDate) => {
  if (!lastActivityDate) return false;
  return isAfter(new Date(lastActivityDate), subDays(new Date(), 7));
};

export const getActivityIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'result':
      return '📄';
    case 'timetable':
      return '🕒';
    case 'news':
      return '📰';
    case 'compliance':
      return '⚙️';
    default:
      return '📋';
  }
};