import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function CourseGrades({ courseId, isInstructor }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Grades</h2>
      <Card>
        <CardContent className="p-12 text-center">
          <GraduationCap className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Gradebook</h3>
          <p className="text-gray-500">
            {isInstructor ? 'Grade student submissions' : 'View your grades and progress'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}