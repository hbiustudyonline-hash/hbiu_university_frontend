// Grade to GPA conversion
export const gradeToPoints = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0
};

// Convert percentage to letter grade
export function percentageToGrade(percentage) {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 60) return 'D';
  return 'F';
}

// Calculate GPA from courses
export function calculateGPA(courses) {
  if (!courses || courses.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  courses.forEach(course => {
    const credits = course.credits || 0;
    const gradePoints = gradeToPoints[course.grade] || 0;
    totalPoints += gradePoints * credits;
    totalCredits += credits;
  });
  
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
}

// Calculate semester GPA from enrollments
export function calculateSemesterGPA(enrollments, courses) {
  const semesterCourses = enrollments
    .filter(e => e.grade && e.status === 'completed')
    .map(e => {
      const course = courses.find(c => c.id === e.course_id);
      return {
        credits: course?.credits || 3,
        grade: e.grade
      };
    });
  
  return calculateGPA(semesterCourses);
}