
import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  BookOpen,
  Users,
  Calendar,
  Edit,
  Plus,
  Search
} from "lucide-react";

import CreateCourseDialog from "../courses/CreateCourseDialog";
import EditCourseDialog from "../lecturer/EditCourseDialog";

const statusColors = {
  'published': 'bg-green-100 text-green-700 border-green-200',
  'draft': 'bg-orange-100 text-orange-700 border-orange-200',
  'archived': 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function LecturerCourses({ courses, user, isAdmin }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const queryClient = useQueryClient();

  const createCourseMutation = useMutation({
    mutationFn: (courseData) => base44.entities.Course.create(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lecturer-courses'] });
      setShowCreateDialog(false);
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Course.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lecturer-courses'] });
      setEditingCourse(null);
    },
  });

  const handleCreateCourse = async (courseData) => {
    await createCourseMutation.mutateAsync({
      ...courseData,
      instructor: isAdmin && courseData.instructor ? courseData.instructor : user?.email, // Allow admin to assign any instructor, otherwise use current user's email
      instructor_name: isAdmin && courseData.instructor_name ? courseData.instructor_name : user?.full_name, // Allow admin to assign any instructor name, otherwise use current user's full name
      status: 'draft'
    });
  };

  const handleUpdateCourse = async (courseData) => {
    await updateCourseMutation.mutateAsync({
      id: editingCourse.id,
      data: courseData
    });
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Dummy enrolledCounts for demonstration, replace with actual data fetching if available
  const enrolledCounts = courses.reduce((acc, course) => {
    acc[course.id] = Math.floor(Math.random() * 50) + 10; // Random students for example
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isAdmin ? 'All Courses' : 'My Courses'}</h2>
          <p className="text-gray-500 mt-1">
            {isAdmin ? 'Manage all courses in the system' : 'Manage and organize your courses'}
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first course to get started'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md group">
              <CardHeader className="p-0">
                <div className={`h-32 bg-gradient-to-br ${
                  course.cover_image ? '' : 'from-blue-500 via-indigo-500 to-purple-500'
                } relative overflow-hidden`}>
                  {course.cover_image ? (
                    <img
                      src={course.cover_image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-black/10" />
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${statusColors[course.status]} border`}>
                      {course.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold text-lg">{course.code}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {course.description || 'No description available'}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {enrolledCounts[course.id] || 0} students
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {course.semester}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`${createPageUrl("course-detail")}?id=${course.id}`} className="flex-1">
                    <Button className="w-full" variant="outline">
                      View Course
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(course)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateCourseDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateCourse}
        isLoading={createCourseMutation.isPending}
        isAdmin={isAdmin}
      />

      {editingCourse && (
        <EditCourseDialog
          open={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          onSubmit={handleUpdateCourse}
          course={editingCourse}
          isLoading={updateCourseMutation.isPending}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
