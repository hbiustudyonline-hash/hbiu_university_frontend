
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus,
  Search,
  Filter,
  Grid3x3,
  List
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CourseCard from "../components/courses/CourseCard";
import CourseList from "../components/courses/CourseList";
import CreateCourseDialog from "../components/courses/CreateCourseDialog";
import CourseFilters from "../components/courses/CourseFilters";

export default function Courses() {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState({
    program: 'all',
    status: 'all',
    semester: 'all',
    college: 'all' // Added college filter
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => base44.entities.Course.list('-created_date'),
    initialData: [],
  });

  const { data: enrollments } = useQuery({
    queryKey: ['enrollments', user?.email],
    queryFn: () => user ? base44.entities.Enrollment.filter({ student_email: user.email }) : [],
    enabled: !!user,
    initialData: [],
  });

  const { data: colleges } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => base44.entities.College.list('name'),
    initialData: [],
  });

  const createCourseMutation = useMutation({
    mutationFn: (courseData) => base44.entities.Course.create(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setShowCreateDialog(false);
    },
  });

  const isInstructor = user?.role === 'admin';

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = filters.program === 'all' || course.program === filters.program;
    const matchesStatus = filters.status === 'all' || course.status === filters.status;
    const matchesSemester = filters.semester === 'all' || course.semester === filters.semester;
    const matchesCollege = filters.college === 'all' || course.college_id === filters.college; // Added college filter logic
    
    return matchesSearch && matchesProgram && matchesStatus && matchesSemester && matchesCollege;
  });

  const handleCreateCourse = async (courseData) => {
    await createCourseMutation.mutateAsync({
      ...courseData,
      instructor: user?.email,
      instructor_name: user?.full_name,
      status: 'draft'
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-500 mt-1">
              {isInstructor ? 'Manage and create your courses' : 'Browse available courses'}
            </p>
          </div>
          {isInstructor && (
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          )}
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
          {/* Passed colleges prop to CourseFilters */}
          <CourseFilters filters={filters} setFilters={setFilters} colleges={colleges} />
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{courses.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Published</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {courses.filter(c => c.status === 'published').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Draft</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {courses.filter(c => c.status === 'draft').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Enrolled</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {enrollments.length}
            </p>
          </div>
        </div>

        {/* Courses Grid/List */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search' : 'Create your first course to get started'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course}
                isEnrolled={enrollments.some(e => e.course_id === course.id)}
                isInstructor={isInstructor}
              />
            ))}
          </div>
        ) : (
          <CourseList 
            courses={filteredCourses}
            enrollments={enrollments}
            isInstructor={isInstructor}
          />
        )}

        {/* Create Course Dialog */}
        <CreateCourseDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSubmit={handleCreateCourse}
          isLoading={createCourseMutation.isPending}
        />
      </div>
    </div>
  );
}
