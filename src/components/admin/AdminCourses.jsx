
import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Users,
  Calendar,
  Eye,
  Settings,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CreateCourseDialog from "../courses/CreateCourseDialog";
import EditCourseDialog from "../lecturer/EditCourseDialog";

const programColors = {
  'Associate': 'bg-blue-100 text-blue-700 border-blue-200',
  'Bachelor': 'bg-green-100 text-green-700 border-green-200',
  'Master': 'bg-purple-100 text-purple-700 border-purple-200',
  'Doctorate': 'bg-orange-100 text-orange-700 border-orange-200',
  'PhD': 'bg-pink-100 text-pink-700 border-pink-200'
};

const statusColors = {
  'published': 'bg-green-100 text-green-700 border-green-200',
  'draft': 'bg-orange-100 text-orange-700 border-orange-200',
  'archived': 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function AdminCourses({ courses, lecturers }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const queryClient = useQueryClient();

  const { data: colleges } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => base44.entities.College.list('name'),
    initialData: [],
  });

  const createCourseMutation = useMutation({
    mutationFn: (courseData) => base44.entities.Course.create(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
      setShowCreateDialog(false);
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Course.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
      setEditingCourse(null);
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id) => base44.entities.Course.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
    },
  });

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCourse = async (courseData) => {
    await createCourseMutation.mutateAsync(courseData);
  };

  const handleUpdateCourse = async (courseData) => {
    await updateCourseMutation.mutateAsync({
      id: editingCourse.id,
      data: courseData
    });
  };

  const handleDeleteCourse = async (courseId) => {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      await deleteCourseMutation.mutateAsync(courseId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-gray-500 mt-1">Create, edit, and manage all courses</p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Total Courses</p>
            <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Published</p>
            <p className="text-3xl font-bold text-green-600">
              {courses.filter(c => c.status === 'published').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Draft</p>
            <p className="text-3xl font-bold text-orange-600">
              {courses.filter(c => c.status === 'draft').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses List */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            All Courses ({filteredCourses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-4">Create your first course to get started</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCourses.map(course => (
                <div key={course.id} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{course.code}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <Badge className={`${programColors[course.program]} border text-xs`}>
                              {course.program}
                            </Badge>
                            <Badge className={`${statusColors[course.status]} border text-xs`}>
                              {course.status}
                            </Badge>
                          </div>
                          {course.degree_program && (
                            <p className="text-sm text-indigo-600 font-medium mb-1">
                              {course.degree_program}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {course.instructor_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {course.semester}
                            </span>
                            {course.college_name && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {course.college_name}
                              </span>
                            )}
                            {course.credits && (
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {course.credits} Credits
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`${createPageUrl("course-detail")}?id=${course.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingCourse(course)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateCourseDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateCourse}
        isLoading={createCourseMutation.isPending}
        lecturers={lecturers}
        colleges={colleges}
        isAdmin={true}
      />

      {editingCourse && (
        <EditCourseDialog
          open={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          onSubmit={handleUpdateCourse}
          course={editingCourse}
          isLoading={updateCourseMutation.isPending}
          lecturers={lecturers}
          colleges={colleges}
          isAdmin={true}
        />
      )}
    </div>
  );
}
