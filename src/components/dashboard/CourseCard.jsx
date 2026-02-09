import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const programColors = {
  'Associate': 'bg-blue-100 text-blue-700 border-blue-200',
  'Bachelor': 'bg-green-100 text-green-700 border-green-200',
  'Master': 'bg-purple-100 text-purple-700 border-purple-200',
  'Doctorate': 'bg-orange-100 text-orange-700 border-orange-200',
  'PhD': 'bg-pink-100 text-pink-700 border-pink-200'
};

export default function CourseCard({ course }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md group">
      <CardHeader className="p-0">
        <div className="h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-4 right-4">
            <Badge className={`${programColors[course.program]} border`}>
              {course.program}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white font-bold text-lg">{course.code}</h3>
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
        </div>
        <Link to={`${createPageUrl("course-detail")}?id=${course.id}`}>
          <Button className="w-full group-hover:bg-blue-600 transition-colors">
            View Course
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}