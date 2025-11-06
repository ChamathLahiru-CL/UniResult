import React from 'react';
import {
  ClockIcon,
  CheckIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          label: 'Pending',
          icon: ClockIcon,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-500',
          borderColor: 'border-yellow-200'
        };
      case 'in-review':
        return {
          label: 'In Review',
          icon: MagnifyingGlassIcon,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-200'
        };
      case 'resolved':
        return {
          label: 'Resolved',
          icon: CheckIcon,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          iconColor: 'text-green-500',
          borderColor: 'border-green-200'
        };
      case 'closed':
        return {
          label: 'Closed',
          icon: XCircleIcon,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-500',
          borderColor: 'border-gray-200'
        };
      default:
        return {
          label: 'Unknown',
          icon: ClockIcon,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-500',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.bgColor} ${config.borderColor}`}>
      <IconComponent className={`h-3.5 w-3.5 ${config.iconColor}`} />
      <span className={`text-xs font-medium ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
};

export default StatusBadge;