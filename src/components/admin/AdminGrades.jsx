import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  GraduationCap, 
  Search, 
  User,
  BookOpen,
  TrendingUp,
  Award
} from "lucide-react";

const getGradeColor = (percentage) => {
  if (!percentage) return 'bg-gray-100 text-gray-700';
  if (percentage >= 90) return 'bg-green-100 text-green-700';
  if (percentage >= 80) return 'bg-blue-100 text-blue-700';
  if (percentage >= 70) return 'bg-yellow-100 text-yellow-700';
  if (percentage >= 60) return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700';
};

export default function AdminGrades({ enrollments, courses, students }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const filteredEnrollments = enrollments.filter(enrollment => {
    const student = students.find(s => s.email === enrollment.student_email);
    const course = courses.find(c => c.id === enrollment.course_id);
    
    const matchesSearch = 
      student?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course?.code?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = selectedCourse === 'all' || enrollment.course_id === selectedCourse;
    
    return matchesSearch && matchesCourse && enrollment.status === 'active';
  });

  const averageGrade = filteredEnrollments.length > 0
    ? (filteredEnrollments.reduce((sum, e) => sum + (e.percentage || 0), 0) / filteredEnrollments.length).toFixed(1)
    : 0;

  const gradedCount = filteredEnrollments.filter(e => e.grade).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Student Grades</h2>
        <p className="text-gray-500 mt-1">View and analyze student performance</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Average Grade</p>
                <p className="text-2xl font-bold text-gray-900">{averageGrade}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Graded</p>
                <p className="text-2xl font-bold text-gray-900">{gradedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search students or courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Filter by course" />
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

      {/* Grades List */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Student Performance ({filteredEnrollments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No grades found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEnrollments.map(enrollment => {
                const student = students.find(s => s.email === enrollment.student_email);
                const course = courses.find(c => c.id === enrollment.course_id);
                
                return (
                  <div key={enrollment.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{student?.full_name}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{course?.code} - {course?.title}</span>
                          </div>
                          <p className="text-xs text-gray-500">{student?.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {enrollment.grade ? (
                          <>
                            <Badge className={`${getGradeColor(enrollment.percentage)} border text-lg px-4 py-1 mb-2`}>
                              {enrollment.grade}
                            </Badge>
                            <p className="text-sm font-semibold text-gray-700">{enrollment.percentage}%</p>
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