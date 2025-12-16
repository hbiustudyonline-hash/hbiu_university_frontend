import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function AdminAnalytics({ users, courses, enrollments, submissions }) {
  const students = users.filter(u => u.role === 'user');
  const lecturers = users.filter(u => u.role === 'admin');
  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');
  const droppedEnrollments = enrollments.filter(e => e.status === 'dropped');
  
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted' && !s.score);
  
  const averageScore = gradedSubmissions.length > 0
    ? (gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length).toFixed(1)
    : 0;

  const completionRate = enrollments.length > 0
    ? ((completedEnrollments.length / enrollments.length) * 100).toFixed(1)
    : 0;

  const retentionRate = enrollments.length > 0
    ? (((enrollments.length - droppedEnrollments.length) / enrollments.length) * 100).toFixed(1)
    : 0;

  // Program distribution
  const programStats = courses.reduce((acc, course) => {
    acc[course.program] = (acc[course.program] || 0) + 1;
    return acc;
  }, {});

  // Course status distribution
  const publishedCourses = courses.filter(c => c.status === 'published').length;
  const draftCourses = courses.filter(c => c.status === 'draft').length;
  const archivedCourses = courses.filter(c => c.status === 'archived').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
        <p className="text-gray-500 mt-1">Comprehensive insights and statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Student Enrollment</p>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{activeEnrollments.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {students.length} total students
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {completedEnrollments.length} completed courses
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Average Score</p>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{averageScore}</p>
            <p className="text-xs text-gray-500 mt-1">
              From {gradedSubmissions.length} submissions
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Retention Rate</p>
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{retentionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {droppedEnrollments.length} dropped
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Program Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(programStats).map(([program, count]) => {
                const percentage = ((count / courses.length) * 100).toFixed(1);
                return (
                  <div key={program}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{program}</span>
                      <span className="text-sm text-gray-500">{count} courses ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Course Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Published</p>
                    <p className="text-sm text-gray-500">Active courses</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-600">{publishedCourses}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Draft</p>
                    <p className="text-sm text-gray-500">In development</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-orange-600">{draftCourses}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Archived</p>
                    <p className="text-sm text-gray-500">No longer active</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-600">{archivedCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submission Analytics */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Assignment Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <p className="text-4xl font-bold text-blue-600 mb-2">{submissions.length}</p>
              <p className="text-sm text-gray-600">Total Submissions</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <p className="text-4xl font-bold text-green-600 mb-2">{gradedSubmissions.length}</p>
              <p className="text-sm text-gray-600">Graded</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <p className="text-4xl font-bold text-orange-600 mb-2">{pendingSubmissions.length}</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Growth */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Students</p>
                  <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {activeEnrollments.length} active enrollments
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lecturers</p>
                  <p className="text-3xl font-bold text-gray-900">{lecturers.length}</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {courses.length} courses managed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}