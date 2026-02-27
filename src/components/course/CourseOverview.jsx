import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function CourseOverview({ course, isInstructor }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            About This Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {course.description || "No description available."}
          </p>
        </CardContent>
      </Card>

      {course.learning_outcomes && (
        <Card>
          <CardHeader>
            <CardTitle>What You'll Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {course.learning_outcomes}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Course Code</p>
              <p className="font-medium">{course.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Credits</p>
              <p className="font-medium">{course.credits} Credits</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Semester</p>
              <p className="font-medium">{course.semester}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium">{course.program || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Instructor</p>
              <p className="font-medium">{course.instructor_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">{course.status || "Active"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
