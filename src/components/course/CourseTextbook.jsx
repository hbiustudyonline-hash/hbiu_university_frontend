import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function CourseTextbook({ courseId, isInstructor }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Textbook & Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No textbooks available yet</p>
            <p className="text-sm text-gray-400">
              Required textbooks and recommended reading materials will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
