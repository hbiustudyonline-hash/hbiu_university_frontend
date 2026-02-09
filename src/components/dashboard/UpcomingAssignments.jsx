import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function UpcomingAssignments({ assignments, courses }) {
  return (
    <Card className="shadow-md border-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Upcoming Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No upcoming assignments
          </p>
        ) : (
          <div className="space-y-3">
            {assignments.map(assignment => {
              const course = courses.find(c => c.id === assignment.course_id);
              return (
                <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                      {assignment.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {assignment.points} pts
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{course?.code}</p>
                  {assignment.due_date && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <Calendar className="w-3 h-3" />
                      Due {formatDistanceToNow(new Date(assignment.due_date), { addSuffix: true })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}