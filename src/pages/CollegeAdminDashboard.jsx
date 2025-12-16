import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  Award,
  Activity,
  ArrowLeft
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CollegeOverview from "../components/college-admin/CollegeOverview";
import CollegeStaffTab from "../components/college-admin/CollegeStaffTab";
import CollegeUsersTab from "../components/college-admin/CollegeUsersTab";
import CollegeCoursesTab from "../components/college-admin/CollegeCoursesTab";
import CollegeGradesTab from "../components/college-admin/CollegeGradesTab";
import CollegeAnalyticsTab from "../components/college-admin/CollegeAnalyticsTab";
import CollegeDegreesTab from "../components/college-admin/CollegeDegreesTab";

const DEFAULT_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e9169732a67849215a4ffc/842f33fc2_IMG-20250913-WA0054.jpg";

export default function CollegeAdminDashboard() {
  const [searchParams] = useSearchParams();
  const collegeId = searchParams.get('id');
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: college, isLoading: collegeLoading } = useQuery({
    queryKey: ['college', collegeId],
    queryFn: async () => {
      const colleges = await base44.entities.College.list();
      return colleges.find(c => c.id === collegeId);
    },
    enabled: !!collegeId,
  });

  const { data: courses } = useQuery({
    queryKey: ['college-courses', collegeId],
    queryFn: () => base44.entities.Course.filter({ college_id: collegeId }),
    enabled: !!collegeId,
    initialData: [],
  });

  const { data: staff } = useQuery({
    queryKey: ['college-staff', collegeId],
    queryFn: () => base44.entities.CollegeStaff.filter({ college_id: collegeId }),
    enabled: !!collegeId,
    initialData: [],
  });

  const { data: allUsers } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  const { data: allEnrollments } = useQuery({
    queryKey: ['all-enrollments'],
    queryFn: () => base44.entities.Enrollment.list(),
    initialData: [],
  });

  const { data: allDegrees } = useQuery({
    queryKey: ['all-degrees'],
    queryFn: () => base44.entities.Degree.list(),
    initialData: [],
  });

  const { data: allSubmissions } = useQuery({
    queryKey: ['all-submissions'],
    queryFn: () => base44.entities.Submission.list(),
    initialData: [],
  });

  // Filter data for this college
  const collegeUsers = allUsers.filter(u => u.college_id === collegeId);
  const courseIds = courses.map(c => c.id);
  const collegeEnrollments = allEnrollments.filter(e => courseIds.includes(e.course_id));
  const collegeDegrees = allDegrees.filter(d => d.college_name === college?.name);

  if (collegeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading college dashboard...</p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">College Not Found</h2>
          <p className="text-gray-500 mb-4">The college you're looking for doesn't exist.</p>
          <Link to={createPageUrl("Colleges")}>
            <Button>Return to Colleges</Button>
          </Link>
        </div>
      </div>
    );
  }

  const logoUrl = college.logo || DEFAULT_LOGO;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24" />
          
          <div className="relative z-10">
            <Link to={createPageUrl("CollegeDetail") + `?id=${collegeId}`}>
              <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to College
              </Button>
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl p-2">
                <img src={logoUrl} alt={college.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {college.name}
                </h1>
                <p className="text-blue-100 text-lg">College Administration</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-white">{courses.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Staff Members</p>
                <p className="text-3xl font-bold text-white">{staff.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Students</p>
                <p className="text-3xl font-bold text-white">{collegeUsers.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Degrees Issued</p>
                <p className="text-3xl font-bold text-white">{collegeDegrees.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 bg-white shadow-md rounded-xl p-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Grades</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="degrees" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Degrees</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <CollegeOverview
              college={college}
              courses={courses}
              staff={staff}
              users={collegeUsers}
              enrollments={collegeEnrollments}
              degrees={collegeDegrees}
            />
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <CollegeStaffTab college={college} staff={staff} />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <CollegeUsersTab college={college} users={collegeUsers} />
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <CollegeCoursesTab college={college} courses={courses} />
          </TabsContent>

          <TabsContent value="grades" className="mt-6">
            <CollegeGradesTab
              college={college}
              courses={courses}
              enrollments={collegeEnrollments}
              users={collegeUsers}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <CollegeAnalyticsTab
              college={college}
              courses={courses}
              users={collegeUsers}
              enrollments={collegeEnrollments}
              submissions={allSubmissions}
            />
          </TabsContent>

          <TabsContent value="degrees" className="mt-6">
            <CollegeDegreesTab college={college} degrees={collegeDegrees} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}