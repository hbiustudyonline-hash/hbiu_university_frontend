import React from 'react';
import AdminAnalytics from "../admin/AdminAnalytics";

export default function CollegeAnalyticsTab({ college, courses, users, enrollments, submissions }) {
  return (
    <div>
      <AdminAnalytics
        users={users}
        courses={courses}
        enrollments={enrollments}
        submissions={submissions}
      />
    </div>
  );
}