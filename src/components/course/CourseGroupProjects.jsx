import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CourseGroupProjects({ courseId, isInstructor }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Group Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No group projects available</p>
            <p className="text-sm text-gray-400">
              Collaborative group projects and team assignments will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
