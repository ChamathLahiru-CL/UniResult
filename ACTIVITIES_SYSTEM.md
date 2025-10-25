# Admin Recent Activities System

## Overview
The Recent Activities system provides comprehensive monitoring and tracking of all administrative activities and system events in the UniResult application.

## File Structure
```
src/
├── components/admin/activities/
│   ├── ActivityCard.jsx          # Individual activity display component
│   ├── ActivityFilterBar.jsx     # Filtering and statistics interface
│   └── ActivityFeed.jsx          # Main feed container with date grouping
├── data/
│   └── mockActivities.js         # Mock data with comprehensive activity structures
└── pages/admin/
    └── AdminRecentActivitiesPage.jsx  # Main page component
```

## Key Features

### 1. Activity Card (ActivityCard.jsx)
- **Color-coded by type**: Different colors for compliance, results, timetables, etc.
- **Priority badges**: Visual indicators for HIGH, MEDIUM, LOW priority
- **Conditional metadata**: Shows relevant information based on activity type
- **Relative timestamps**: User-friendly time display (e.g., "2 hours ago")
- **Navigation integration**: Ready for routing to detailed views

### 2. Activity Filter Bar (ActivityFilterBar.jsx)
- **Statistics overview**: Total, new, critical, and today's activities
- **Multi-dimensional filtering**:
  - Time range: All time, today, this week, this month
  - Activity type: Compliance, result uploads, timetable uploads, etc.
  - Status: All, new, read, critical
  - Priority: All, high, medium, low
- **Active filter indicators**: Visual badges showing current filters
- **Clear filters functionality**: One-click reset

### 3. Activity Feed (ActivityFeed.jsx)
- **Smart date grouping**: Groups by Today, Yesterday, day names, or full dates
- **Loading states**: Skeleton placeholders during data fetching
- **Empty states**: User-friendly messaging when no activities match filters
- **Activity counting**: Shows count per date group
- **Pagination support**: Built-in "Load More" functionality

### 4. Main Page (AdminRecentActivitiesPage.jsx)
- **Complete admin layout**: Integrates with AdminSidebar and AdminTopBar
- **Real-time filtering**: Instant filter application with useMemo optimization
- **Statistics calculation**: Dynamic stats based on current data
- **Refresh functionality**: Manual data refresh capability
- **Quick actions**: Mark all as read, enable notifications, export logs
- **Responsive design**: Mobile-friendly layout

## Activity Data Structure

### Activity Types
```javascript
ACTIVITY_TYPES = {
  COMPLIANCE: 'COMPLIANCE',
  RESULT_UPLOAD: 'RESULT_UPLOAD', 
  TIMETABLE_UPLOAD: 'TIMETABLE_UPLOAD',
  NEWS_UPLOAD: 'NEWS_UPLOAD',
  STUDENT_REGISTRATION: 'STUDENT_REGISTRATION',
  SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE'
}
```

### Sample Activity Object
```javascript
{
  id: 'ACT_001',
  type: 'COMPLIANCE',
  title: 'New Compliance Report Submitted',
  description: 'Department of Computer Science submitted quarterly compliance report',
  status: 'NEW', // NEW, READ, CRITICAL
  priority: 'HIGH', // HIGH, MEDIUM, LOW
  timestamp: '2024-01-15T10:30:00Z',
  user: {
    id: 'USR_001',
    name: 'Dr. Sarah Johnson',
    role: 'Department Head'
  },
  metadata: {
    department: 'Computer Science',
    reportType: 'Quarterly',
    documentsCount: 15
  }
}
```

## Color Scheme
- **Compliance**: Purple (`bg-purple-100`, `text-purple-800`)
- **Result Upload**: Blue (`bg-blue-100`, `text-blue-800`)
- **Timetable Upload**: Green (`bg-green-100`, `text-green-800`)
- **News Upload**: Yellow (`bg-yellow-100`, `text-yellow-800`)
- **Student Registration**: Indigo (`bg-indigo-100`, `text-indigo-800`)
- **System Maintenance**: Red (`bg-red-100`, `text-red-800`)

## Route Integration
- **Path**: `/admin/activities`
- **Protection**: Requires admin role via ProtectedRoute
- **Layout**: Uses AdminLayout with sidebar and top bar
- **Navigation**: Accessible via admin sidebar menu

## Usage Examples

### Filtering Activities
```javascript
// Filter by today's activities
setFilters({ ...filters, timeRange: 'today' });

// Filter by high priority compliance activities
setFilters({ 
  timeRange: 'all', 
  type: 'COMPLIANCE', 
  priority: 'HIGH' 
});
```

### Adding New Activity Types
1. Add to `ACTIVITY_TYPES` in `mockActivities.js`
2. Update `activityLabels` mapping
3. Add color scheme to `ActivityCard.jsx`
4. Update filter options in `ActivityFilterBar.jsx`

## Development Notes
- Uses `date-fns` for all date formatting and manipulation
- Optimized with `useMemo` for filtering performance
- Responsive design with TailwindCSS
- Loading and empty states included
- Ready for backend API integration
- Supports real-time updates and notifications

## Next Steps
1. **Backend Integration**: Replace mock data with API calls
2. **Real-time Updates**: Add WebSocket for live activity streaming
3. **Detailed Views**: Create individual activity detail pages
4. **Export Functionality**: Implement CSV/PDF export
5. **Advanced Filtering**: Add date range picker and user filtering
6. **Notifications**: Add push notifications for critical activities

## Testing
- Development server: `npm run dev`
- Access at: `http://localhost:5174/admin/activities`
- Login with admin credentials to test full functionality