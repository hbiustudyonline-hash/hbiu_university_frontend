import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";

export default function CoursePages({ courseId, isInstructor }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pages</h2>
      <Card>
        <CardContent className="p-12 text-center">
          <LayoutGrid className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Pages</h3>
          <p className="text-gray-500">
            {isInstructor ? 'Create custom pages for course content' : 'View course pages and resources'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}