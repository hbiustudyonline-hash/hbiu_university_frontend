import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from "lucide-react";

export default function CourseOralExam({ courseId, isInstructor }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Oral Exam
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Mic className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No oral exam scheduled</p>
            <p className="text-sm text-gray-400">
              Oral examination schedules and recording submissions will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
