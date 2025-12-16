import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
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
  Award // Added Award icon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import LecturerCourses from "../components/lecturer/LecturerCourses";
import LecturerGrades from "../components/lecturer/LecturerGrades";
import LecturerSubmissions from "../components/lecturer/LecturerSubmissions";
import LecturerLiveClasses from "../components/lecturer/LecturerLiveClasses";
import LecturerStats from "../components/lecturer/LecturerStats";
import DegreeManagement from "../components/degree/DegreeManagement"; // Added DegreeManagement import

export default function LecturerDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

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
    <div className="min-h-screen p-4 md:p-8">
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-white shadow-md rounded-xl p-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Submissions</span>
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Grades</span>
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Live Classes</span>
            </TabsTrigger>
            {/* New TabsTrigger for Degrees */}
            <TabsTrigger value="degrees" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Degrees</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <LecturerStats
              courses={displayCourses}
              submissions={mySubmissions}
              enrollments={myEnrollments}
              assignments={myAssignments}
            />
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            {/* Pass displayCourses and isAdmin prop to LecturerCourses */}
            <LecturerCourses courses={displayCourses} user={user} isAdmin={user?.role === 'admin'} />
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

          {/* New TabsContent for Degrees */}
          <TabsContent value="degrees" className="mt-6">
            <DegreeManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
