import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function CourseMyProgress({ courseId, isInstructor }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            My Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">Progress tracking coming soon</p>
            <p className="text-sm text-gray-400">
              Track your completion status, grades, and overall progress in this course.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
