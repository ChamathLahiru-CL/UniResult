import React from 'react';
import NewAnnouncementForm from '../../components/admin/announcement/NewAnnouncementForm';
import AnnouncementHistoryList from '../../components/admin/announcement/AnnouncementHistoryList';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';

const AdminAnnouncementPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
        {/* Page Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#246BFD] rounded-lg">
                <SpeakerWaveIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
                <p className="text-slate-600 mt-1">Send system-wide or group-specific alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* New Announcement Form */}
          <NewAnnouncementForm />
          
          {/* Announcement History */}
          <AnnouncementHistoryList />
        </div>
    </div>
  );
};

export default AdminAnnouncementPage;