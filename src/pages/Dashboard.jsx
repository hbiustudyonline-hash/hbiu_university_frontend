import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AppLayout from "@/components/AppLayout";
import { 
  BookOpen, 
  Plus,
  GraduationCap,
  Edit
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import StatsGrid from "../components/dashboard/StatsGrid";
import CourseCard from "../components/dashboard/CourseCard";
import UpcomingAssignments from "../components/dashboard/UpcomingAssignments";
import RecentAnnouncements from "../components/dashboard/RecentAnnouncements";
import StudentIDCard from "../components/student/StudentIDCard";
import ProfileEditor from "../components/student/ProfileEditor";

export default function Dashboard() {
  const { user } = useAuth();
  const [loadingError, setLoadingError] = useState(null);
  const navigate = useNavigate();

  const { data: courses, isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        const result = await base44.entities.Course.list('-created_date');
        console.log('Courses loaded:', result);
        return result;
      } catch (error) {
        console.error('Failed to load courses:', error);
        setLoadingError('Failed to load courses: ' + error.message);
        throw error;
      }
    },
    initialData: [],
  });

  const { data: enrollments } = useQuery({
    queryKey: ['enrollments', user?.email],
    queryFn: () => user ? base44.entities.Enrollment.filter({ student_email: user.email }) : [],
    enabled: !!user,
    initialData: [],
  });

  const { data: assignments } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => base44.entities.Assignment.list('-due_date', 10),
    initialData: [],
  });

  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => base44.entities.Announcement.list('-created_date', 5),
    initialData: [],
  });

  const isInstructor = user?.role === 'admin';
  
  const myCourses = isInstructor 
    ? courses.filter(c => c.instructor === user?.email)
    : courses.filter(c => enrollments.some(e => e.course_id === c.id));

  const upcomingAssignments = assignments
    .filter(a => myCourses.some(c => c.id === a.course_id))
    .slice(0, 5);

  const completedAssignments = assignments
    .filter(a => myCourses.some(c => c.id === a.course_id) && a.status === 'completed');

  // Debug information
  if (loadingError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-4">{loadingError}</p>
          <p className="text-sm text-gray-500">
            Make sure the Django backend server is running on http://127.0.0.1:8001
          </p>
        </Card>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">API Error</h2>
          <p className="text-gray-600 mb-4">Failed to load data from the server</p>
          <p className="text-sm text-gray-500">
            Backend Status: {coursesError.message || 'Unknown error'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <AppLayout>
      {/* Purple Header Section with margin and rounded edges */}
      <div className="p-6 pt-8">
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white rounded-2xl shadow-lg">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <p className="text-purple-100 text-lg">Welcome back, {user?.full_name || 'Student'}</p>
              </div>
              <div className="ml-auto">
                <ProfileEditor user={user} trigger={
                  <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                } />
              </div>
            </div>

            {/* Stats in Header */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-sm text-purple-100 mb-1">My Courses</div>
                <div className="text-3xl font-bold">{myCourses.length}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-sm text-purple-100 mb-1">Assignments</div>
                <div className="text-3xl font-bold">{upcomingAssignments.length}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-sm text-purple-100 mb-1">Completed</div>
                <div className="text-3xl font-bold">{completedAssignments.length}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-sm text-purple-100 mb-1">Grade Average</div>
                <div className="text-3xl font-bold">85%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8 space-y-8">

        {/* Stats Grid */}
        <StatsGrid 
          courses={myCourses}
          assignments={upcomingAssignments}
          isInstructor={isInstructor}
        />

        {/* Student ID Card Section (only for students) */}
        {!isInstructor && user && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Student ID Card</h2>
              <p className="text-gray-500 mt-1">Your official HBIU student identification</p>
            </div>
            <StudentIDCard user={user} />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Courses Section - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {isInstructor ? 'My Courses' : 'Enrolled Courses'}
              </h2>
              {isInstructor && (
                <Link to={createPageUrl("Courses")}>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Course
                  </Button>
                </Link>
              )}
            </div>

            {coursesLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="h-32 bg-gray-200" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myCourses.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isInstructor ? 'No courses created yet' : 'No courses enrolled'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {isInstructor 
                    ? 'Start by creating your first course' 
                    : 'Browse available courses to get started'}
                </p>
                <Link to={createPageUrl("Courses")}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {isInstructor ? 'Create Course' : 'Browse Courses'}
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {myCourses.slice(0, 4).map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <UpcomingAssignments 
              assignments={upcomingAssignments}
              courses={myCourses}
            />
            <RecentAnnouncements 
              announcements={announcements}
              courses={myCourses}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
