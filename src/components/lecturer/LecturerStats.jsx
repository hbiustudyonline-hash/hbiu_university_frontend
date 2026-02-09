import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock,
  AlertCircle,
  BookOpen
} from "lucide-react";
import { format } from "date-fns";

export default function LecturerStats({ courses, submissions, enrollments, assignments }) {
  const pendingSubmissions = submissions.filter(s => !s.score && s.status === 'submitted');
  const gradedSubmissions = submissions.filter(s => s.score !== null && s.status === 'graded');
  const lateSubmissions = submissions.filter(s => s.status === 'late');
  const activeStudents = enrollments.filter(e => e.status === 'active').length;

  const averageGrade = gradedSubmissions.length > 0
    ? (gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <Badge variant="outline" className="text-orange-600">
                {pendingSubmissions.length}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {pendingSubmissions.length}
            </h3>
            <p className="text-sm text-gray-500">Pending Grading</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <Badge variant="outline" className="text-green-600">
                {gradedSubmissions.length}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {gradedSubmissions.length}
            </h3>
            <p className="text-sm text-gray-500">Graded</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {activeStudents}
            </h3>
            <p className="text-sm text-gray-500">Active Students</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {averageGrade}%
            </h3>
            <p className="text-sm text-gray-500">Average Grade</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingSubmissions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No pending submissions
              </p>
            ) : (
              <div className="space-y-3">
                {pendingSubmissions.slice(0, 5).map(submission => {
                  const assignment = assignments.find(a => a.id === submission.assignment_id);
                  return (
                    <div key={submission.id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{submission.student_name}</h4>
                          <p className="text-xs text-gray-600">{assignment?.title}</p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Submitted {format(new Date(submission.submitted_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              My Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No courses yet
              </p>
            ) : (
              <div className="space-y-3">
                {courses.slice(0, 5).map(course => {
                  const courseEnrollments = enrollments.filter(e => e.course_id === course.id && e.status === 'active');
                  const courseAssignments = assignments.filter(a => a.course_id === course.id);
                  
                  return (
                    <div key={course.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{course.code}</h4>
                          <p className="text-xs text-gray-600">{course.title}</p>
                        </div>
                        <Badge className={`${
                          course.status === 'published' ? 'bg-green-100 text-green-700 border-green-200' :
                          course.status === 'draft' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                          'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                          {course.status}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>{courseEnrollments.length} students</span>
                        <span>{courseAssignments.length} assignments</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Late Submissions Alert */}
      {lateSubmissions.length > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  {lateSubmissions.length} Late Submissions
                </h3>
                <p className="text-sm text-red-700">
                  Some students have submitted their work after the deadline. Review and grade when possible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}