import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function CourseExtraAssignments({ courseId, isInstructor }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Extra Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ClipboardList className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No extra assignments available</p>
            <p className="text-sm text-gray-400">
              Optional bonus assignments and extra credit opportunities will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
