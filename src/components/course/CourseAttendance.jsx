import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function CourseAttendance({ courseId, isInstructor }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Attendance</h2>
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Attendance Tracking</h3>
          <p className="text-gray-500">
            {isInstructor ? 'Track student attendance' : 'View your attendance record'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}