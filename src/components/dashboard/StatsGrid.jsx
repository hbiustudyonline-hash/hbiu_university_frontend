import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ClipboardList, CheckCircle, Clock } from "lucide-react";

export default function StatsGrid({ courses, assignments, isInstructor }) {
  const stats = [
    {
      title: isInstructor ? 'Total Courses' : 'Enrolled Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Assignments',
      value: assignments.length,
      icon: ClipboardList,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Completed',
      value: 0,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending',
      value: assignments.length,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}