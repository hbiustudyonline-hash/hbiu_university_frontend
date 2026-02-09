import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  Award,
  TrendingUp,
  CheckCircle,
  Activity,
  GraduationCap
} from "lucide-react";

export default function CollegeOverview({ college, courses, staff, users, enrollments, degrees }) {
  const students = users.filter(u => u.role === 'user');
  const lecturers = users.filter(u => u.role === 'admin');
  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');
  const publishedCourses = courses.filter(c => c.status === 'published');
  const approvedDegrees = degrees.filter(d => d.status === 'approved');

  const completionRate = enrollments.length > 0
    ? ((completedEnrollments.length / enrollments.length) * 100).toFixed(1)
    : 0;

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      change: `${activeEnrollments.length} active enrollments`
    },
    {
      title: "Lecturers",
      value: lecturers.length,
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      change: `Teaching ${publishedCourses.length} courses`
    },
    {
      title: "Staff Members",
      value: staff.length,
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      change: `${staff.filter(s => s.available_for_appointments).length} available`
    },
    {
      title: "Published Courses",
      value: publishedCourses.length,
      icon: BookOpen,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      change: `${courses.length} total courses`
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      change: `${completedEnrollments.length} completed`
    },
    {
      title: "Degrees Issued",
      value: approvedDegrees.length,
      icon: Award,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      change: `${degrees.length} total degrees`
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{college.name} Overview</h2>
        <p className="text-gray-500">Key performance indicators and college statistics</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* College Information */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>College Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Dean</p>
              <p className="text-lg font-semibold text-gray-900">{college.dean || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Contact Email</p>
              <p className="text-lg font-semibold text-gray-900">{college.email}</p>
            </div>
            {college.phone && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="text-lg font-semibold text-gray-900">{college.phone}</p>
              </div>
            )}
            {college.website && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Website</p>
                <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 hover:text-blue-700">
                  Visit Website
                </a>
              </div>
            )}
          </div>
          {college.description && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-700">{college.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-gray-900">Active Status</p>
              </div>
              <p className="text-sm text-gray-600">College is operational with {activeEnrollments.length} active enrollments</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <p className="font-semibold text-gray-900">Course Activity</p>
              </div>
              <p className="text-sm text-gray-600">{publishedCourses.length} published courses available for enrollment</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <p className="font-semibold text-gray-900">Graduate Success</p>
              </div>
              <p className="text-sm text-gray-600">{approvedDegrees.length} degrees successfully issued</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}