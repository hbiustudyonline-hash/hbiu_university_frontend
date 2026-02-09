import React from 'react';
import AdminCourses from "../admin/AdminCourses";

export default function CollegeCoursesTab({ college, courses }) {
  // Filter lecturers who teach in this college
  const collegeLecturers = [];

  return (
    <div>
      <AdminCourses courses={courses} lecturers={collegeLecturers} />
    </div>
  );
}