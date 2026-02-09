import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, Clock, Target } from "lucide-react";

export default function CourseHome({ course, isInstructor }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Course Code</p>
                <p className="font-semibold">{course.code}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-semibold">{course.program}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Instructor</p>
                <p className="font-semibold">{course.instructor_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Semester</p>
                <p className="font-semibold">{course.semester}</p>
              </div>
            </div>
          </div>
          
          {course.description && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">About This Course</h3>
              <p className="text-gray-600">{course.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <h4 className="font-semibold text-blue-900 mb-1">View Modules</h4>
              <p className="text-sm text-blue-600">Access course content</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <h4 className="font-semibold text-purple-900 mb-1">Assignments</h4>
              <p className="text-sm text-purple-600">Submit your work</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <h4 className="font-semibold text-green-900 mb-1">Grades</h4>
              <p className="text-sm text-green-600">Check your progress</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}