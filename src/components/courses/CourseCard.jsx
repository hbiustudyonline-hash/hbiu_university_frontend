import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const programColors = {
  'Associate': 'bg-blue-100 text-blue-700 border-blue-200',
  'Bachelor': 'bg-green-100 text-green-700 border-green-200',
  'Master': 'bg-purple-100 text-purple-700 border-purple-200',
  'Doctorate': 'bg-orange-100 text-orange-700 border-orange-200',
  'PhD': 'bg-pink-100 text-pink-700 border-pink-200'
};

const statusColors = {
  'published': 'bg-green-100 text-green-700 border-green-200',
  'draft': 'bg-orange-100 text-orange-700 border-orange-200',
  'archived': 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function CourseCard({ course, isEnrolled, isInstructor }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md group">
      <CardHeader className="p-0 relative">
        <div className={`h-36 bg-gradient-to-br ${
          course.cover_image ? '' : 'from-blue-500 via-indigo-500 to-purple-500'
        } relative overflow-hidden`}>
          {course.cover_image ? (
            <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-black/10" />
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge className={`${programColors[course.program]} border`}>
              {course.program}
            </Badge>
            {isInstructor && (
              <Badge className={`${statusColors[course.status]} border`}>
                {course.status}
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="text-white font-bold text-lg bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              {course.code}
            </span>
            {isEnrolled && (
              <Badge className="bg-green-500 text-white border-0">
                <Check className="w-3 h-3 mr-1" />
                Enrolled
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {course.description || 'No description available'}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {course.instructor_name}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {course.semester}
          </div>
          {course.credits && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              {course.credits} Credits
            </div>
          )}
        </div>
        <Link to={`${createPageUrl("course-detail")}?id=${course.id}`}>
          <Button className="w-full group-hover:bg-blue-600 transition-colors">
            {isInstructor ? 'Manage Course' : isEnrolled ? 'Continue Learning' : 'View Details'}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}