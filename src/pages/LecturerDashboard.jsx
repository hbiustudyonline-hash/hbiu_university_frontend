import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  BookOpen,
  Users,
  ClipboardList,
  GraduationCap,
  Video,
  TrendingUp,
  Calendar,
  Bell,
  Edit,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import LecturerCourses from "../components/lecturer/LecturerCourses";
import LecturerGrades from "../components/lecturer/LecturerGrades";
import LecturerSubmissions from "../components/lecturer/LecturerSubmissions";
import LecturerLiveClasses from "../components/lecturer/LecturerLiveClasses";
import LecturerStats from "../components/lecturer/LecturerStats";
import DegreeManagement from "../components/degree/DegreeManagement";
import LecturerIDCard from "../components/lecturer/LecturerIDCard";
import LecturerStudents from "../components/lecturer/LecturerStudents";
import LecturerCurriculum from "../components/lecturer/LecturerCurriculum";
import LecturerOralExams from "../components/lecturer/LecturerOralExams";
import LecturerAnnouncements from "../components/lecturer/LecturerAnnouncements";
import LecturerAnalytics from "../components/lecturer/LecturerAnalytics";

export default function LecturerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Admin sees ALL courses, lecturers see only their own
  // This query now fetches all courses if the user is loaded.
  const { data: coursesFetchedRaw } = useQuery({
    queryKey: ['all-courses-for-dashboard'], // Generic key as this fetches all courses regardless of user role
    queryFn: () => {
      if (!user) return []; // Only fetch once user data is available
      return base44.entities.Course.list(); // Fetch ALL courses initially
    },
    enabled: !!user, // Enable query only when user object is not null
    initialData: [],
  });

  // Filter courses based on user role: admins see all, lecturers see only their own
  const displayCourses = user?.role === 'admin'
    ? coursesFetchedRaw // Admins see all courses
    : coursesFetchedRaw.filter(c => c.instructor === user?.email); // Lecturers see only their courses

  const { data: allAssignments } = useQuery({
    queryKey: ['all-assignments'],
    queryFn: () => base44.entities.Assignment.list(),
    initialData: [],
  });

  const { data: allSubmissions } = useQuery({
    queryKey: ['all-submissions'],
    queryFn: () => base44.entities.Submission.list('-submitted_at'),
    initialData: [],
  });

  const { data: allEnrollments } = useQuery({
    queryKey: ['all-enrollments'],
    queryFn: () => base44.entities.Enrollment.list(),
    initialData: [],
  });

  // These derived states now use `displayCourses` instead of the raw `courses` data
  const myCourseIds = displayCourses.map(c => c.id);
  const myAssignments = allAssignments.filter(a => myCourseIds.includes(a.course_id));
  const mySubmissions = allSubmissions.filter(s =>
    myAssignments.some(a => a.id === s.assignment_id)
  );
  const myEnrollments = allEnrollments.filter(e => myCourseIds.includes(e.course_id));

  const pendingGrading = mySubmissions.filter(s => !s.score && s.status === 'submitted').length;
  const totalStudents = myEnrollments.filter(e => e.status === 'active').length;

  return (
    <Layout currentPageName="LecturerDashboard">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Lecturer Dashboard
                </h1>
                <p className="text-purple-100 text-lg">
                  Welcome back, {user?.full_name}
                  {user?.role === 'admin' && <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded">Admin Access - All Courses</span>}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-purple-100 text-sm mb-1">{user?.role === 'admin' ? 'Total Courses' : 'My Courses'}</p>
                <p className="text-3xl font-bold text-white">{displayCourses.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-purple-100 text-sm mb-1">Total Students</p>
                <p className="text-3xl font-bold text-white">{totalStudents}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-purple-100 text-sm mb-1">Assignments</p>
                <p className="text-3xl font-bold text-white">{myAssignments.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-purple-100 text-sm mb-1">Pending Grading</p>
                <p className="text-3xl font-bold text-white">{pendingGrading}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex overflow-x-auto bg-white shadow-md rounded-xl p-1">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-12 bg-transparent">
              <TabsTrigger value="overview" className="flex items-center gap-1 text-xs md:text-sm" title="Overview">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="idcard" className="flex items-center gap-1 text-xs md:text-sm" title="ID Card">
                <span className="text-lg">🆔</span>
                <span className="hidden sm:inline">ID Card</span>
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-1 text-xs md:text-sm" title="Students">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Students</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-1 text-xs md:text-sm" title="Courses">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Courses</span>
              </TabsTrigger>
              <TabsTrigger value="curriculum" className="flex items-center gap-1 text-xs md:text-sm" title="Curriculum">
                <span className="text-lg">📚</span>
                <span className="hidden sm:inline">Curriculum</span>
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex items-center gap-1 text-xs md:text-sm" title="Submissions">
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Submissions</span>
              </TabsTrigger>
              <TabsTrigger value="grades" className="flex items-center gap-1 text-xs md:text-sm" title="Grades">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Grades</span>
              </TabsTrigger>
              <TabsTrigger value="live" className="flex items-center gap-1 text-xs md:text-sm" title="Live Classes">
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Live</span>
              </TabsTrigger>
              <TabsTrigger value="degrees" className="flex items-center gap-1 text-xs md:text-sm" title="Degrees">
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">Degrees</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs md:text-sm" title="Analytics">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="oralexams" className="flex items-center gap-1 text-xs md:text-sm" title="Oral Exams">
                <span className="text-lg">🎤</span>
                <span className="hidden sm:inline">Oral</span>
              </TabsTrigger>
              <TabsTrigger value="announcements" className="flex items-center gap-1 text-xs md:text-sm" title="Announcements">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">AI Announce</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-6">
            <LecturerStats
              courses={displayCourses}
              submissions={mySubmissions}
              enrollments={myEnrollments}
              assignments={myAssignments}
            />
          </TabsContent>

          <TabsContent value="idcard" className="mt-6">
            <LecturerIDCard />
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <LecturerStudents />
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            {/* Pass displayCourses and isAdmin prop to LecturerCourses */}
            <LecturerCourses courses={displayCourses} user={user} isAdmin={user?.role === 'admin'} />
          </TabsContent>

          <TabsContent value="curriculum" className="mt-6">
            <LecturerCurriculum />
          </TabsContent>

          <TabsContent value="submissions" className="mt-6">
            <LecturerSubmissions
              submissions={mySubmissions}
              assignments={myAssignments}
              courses={displayCourses}
            />
          </TabsContent>

          <TabsContent value="grades" className="mt-6">
            <LecturerGrades
              courses={displayCourses}
              enrollments={myEnrollments}
            />
          </TabsContent>

          <TabsContent value="live" className="mt-6">
            <LecturerLiveClasses courses={displayCourses} user={user} />
          </TabsContent>

          <TabsContent value="degrees" className="mt-6">
            <DegreeManagement />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <LecturerAnalytics />
          </TabsContent>

          <TabsContent value="oralexams" className="mt-6">
            <LecturerOralExams />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <LecturerAnnouncements />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </Layout>
  );
}
