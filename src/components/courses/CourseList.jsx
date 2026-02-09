import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, BookOpen, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const programColors = {
  'Associate': 'bg-blue-100 text-blue-700 border-blue-200',
  'Bachelor': 'bg-green-100 text-green-700 border-green-200',
  'Master': 'bg-purple-100 text-purple-700 border-purple-200',
  'Doctorate': 'bg-orange-100 text-orange-700 border-orange-200',
  'PhD': 'bg-pink-100 text-pink-700 border-pink-200'
};

export default function CourseList({ courses, enrollments, isInstructor }) {
  return (
    <div className="space-y-4">
      {courses.map(course => {
        const isEnrolled = enrollments.some(e => e.course_id === course.id);
        return (
          <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-2xl">{course.code}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-gray-600">{course.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${programColors[course.program]} border whitespace-nowrap`}>
                      {course.program}
                    </Badge>
                    {isEnrolled && (
                      <Badge className="bg-green-500 text-white border-0 whitespace-nowrap">
                        <Check className="w-3 h-3 mr-1" />
                        Enrolled
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mb-4">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {course.instructor_name}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {course.semester}
                  </span>
                  {course.credits && (
                    <span className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      {course.credits} Credits
                    </span>
                  )}
                </div>
                <Link to={`${createPageUrl("course-detail")}?id=${course.id}`}>
                  <Button>
                    {isInstructor ? 'Manage Course' : isEnrolled ? 'Continue Learning' : 'View Details'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}