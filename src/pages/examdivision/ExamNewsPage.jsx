import React from 'react';
import NewsUploadForm from '../../components/examdivision/news/NewsUploadForm';
import PastNewsFeed from '../../components/examdivision/news/PastNewsFeed';

const ExamNewsPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-2xl font-semibold text-slate-800 mb-1">News Upload</h1>
        <p className="text-slate-500 text-sm">
          Post important exam-related announcements to selected faculties and manage previously uploaded news.
        </p>
      </div>

      {/* News Upload Form Section */}
      <div className="mb-8 animate-fade-in-up">
        <NewsUploadForm />
      </div>

      {/* Divider */}
      <hr className="border border-slate-200 my-8 animate-fade-in" />

      {/* Past News Feed Section */}
      <div className="animate-fade-in-up">
        <PastNewsFeed />
      </div>
    </div>
  );
};

export default ExamNewsPage;