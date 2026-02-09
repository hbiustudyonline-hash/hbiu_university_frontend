import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Pin } from "lucide-react";
import { format } from "date-fns";

export default function RecentAnnouncements({ announcements, courses }) {
  return (
    <Card className="shadow-md border-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Recent Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {announcements.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No announcements yet
          </p>
        ) : (
          <div className="space-y-3">
            {announcements.map(announcement => {
              const course = courses.find(c => c.id === announcement.course_id);
              return (
                <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-900 flex items-center gap-2">
                      {announcement.pinned && <Pin className="w-3 h-3 text-orange-500" />}
                      {announcement.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{course?.code}</span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(announcement.created_date), 'MMM d')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}