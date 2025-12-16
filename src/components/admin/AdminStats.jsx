import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function AdminStats({ users, courses, enrollments, submissions }) {
  const students = users.filter(u => u.role === 'user');
  const lecturers = users.filter(u => u.role === 'admin');
  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');
  const publishedCourses = courses.filter(c => c.status === 'published');
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted' && !s.score);

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      change: "+12% from last month"
    },
    {
      title: "Active Lecturers",
      value: lecturers.length,
      icon: UserCheck,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      change: "+3 new this month"
    },
    {
      title: "Published Courses",
      value: publishedCourses.length,
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      change: `${courses.length} total courses`
    },
    {
      title: "Active Enrollments",
      value: activeEnrollments.length,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      change: `${completedEnrollments.length} completed`
    },
    {
      title: "Pending Grading",
      value: pendingSubmissions.length,
      icon: Clock,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      change: "Needs attention"
    },
    {
      title: "Completion Rate",
      value: `${enrollments.length > 0 ? Math.round((completedEnrollments.length / enrollments.length) * 100) : 0}%`,
      icon: Award,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      change: "Overall performance"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">System Overview</h2>
        <p className="text-gray-500">Real-time statistics and system health</p>
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

      {/* Quick Actions */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <p className="font-semibold text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-500">Add or edit users</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-left">
              <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
              <p className="font-semibold text-gray-900">Create Course</p>
              <p className="text-sm text-gray-500">New course setup</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left">
              <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
              <p className="font-semibold text-gray-900">Review Grades</p>
              <p className="text-sm text-gray-500">Check student performance</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-left">
              <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
              <p className="font-semibold text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-500">System insights</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">All Systems Operational</p>
                <p className="text-sm text-gray-500">Last checked: Just now</p>
              </div>
            </div>
            {pendingSubmissions.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{pendingSubmissions.length} submissions pending grading</p>
                  <p className="text-sm text-gray-500">Requires lecturer attention</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}