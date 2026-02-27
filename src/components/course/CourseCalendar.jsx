import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CourseCalendar({ courseId, isInstructor }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Course Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">Course calendar feature coming soon</p>
            <p className="text-sm text-gray-400">
              This will display important dates, deadlines, and events for this course.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
