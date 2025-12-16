import React from 'react';
import AdminGrades from "../admin/AdminGrades";

export default function CollegeGradesTab({ college, courses, enrollments, users }) {
  const students = users.filter(u => u.role === 'user');

  return (
    <div>
      <AdminGrades 
        enrollments={enrollments}
        courses={courses}
        students={students}
      />
    </div>
  );
}