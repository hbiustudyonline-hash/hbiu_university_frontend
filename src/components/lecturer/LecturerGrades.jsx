import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, User, TrendingUp, Award } from "lucide-react";

export default function LecturerGrades({ courses, enrollments }) {
  const [selectedCourse, setSelectedCourse] = useState('all');

  const filteredEnrollments = selectedCourse === 'all' 
    ? enrollments 
    : enrollments.filter(e => e.course_id === selectedCourse);

  const getGradeColor = (percentage) => {
    if (!percentage) return 'bg-gray-100 text-gray-700';
    if (percentage >= 90) return 'bg-green-100 text-green-700';
    if (percentage >= 80) return 'bg-blue-100 text-blue-700';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-700';
    if (percentage >= 60) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const courseEnrollments = filteredEnrollments.filter(e => e.status === 'active');
  const averageGrade = courseEnrollments.length > 0
    ? (courseEnrollments.reduce((sum, e) => sum + (e.percentage || 0), 0) / courseEnrollments.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grade Management</h2>
          <p className="text-gray-500 mt-1">View and manage student grades</p>
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id}>
                {course.code} - {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courseEnrollments.length}</p>
                <p className="text-sm text-gray-500">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageGrade}%</p>
                <p className="text-sm text-gray-500">Average Grade</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {courseEnrollments.filter(e => e.grade).length}
                </p>
                <p className="text-sm text-gray-500">Graded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Student Grades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courseEnrollments.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No students enrolled in selected course(s)</p>
            </div>
          ) : (
            <div className="space-y-3">
              {courseEnrollments.map(enrollment => {
                const course = courses.find(c => c.id === enrollment.course_id);
                return (
                  <div key={enrollment.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{enrollment.student_name}</h4>
                            <p className="text-sm text-gray-500">{enrollment.student_email}</p>
                          </div>
                        </div>
                        {selectedCourse === 'all' && (
                          <p className="text-sm text-gray-600 ml-13">
                            {course?.code} - {course?.title}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex items-center gap-4">
                        {enrollment.grade ? (
                          <>
                            <div>
                              <Badge className={`${getGradeColor(enrollment.percentage)} border text-lg px-3 py-1`}>
                                {enrollment.grade}
                              </Badge>
                              <p className="text-sm text-gray-500 mt-1">{enrollment.percentage}%</p>
                            </div>
                          </>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            Not Graded
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}