import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Wand2,
  Copy,
  Share2,
  Edit,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import CreateCourseDialog from "../courses/CreateCourseDialog";
import EditCourseDialog from "./EditCourseDialog";

export default function LecturerCourses({ courses = [], user, isAdmin }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [collegeFilter, setCollegeFilter] = useState("All Colleges");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const coursesPerPage = 12;

  // Fetch all colleges
  const { data: collegesData, isLoading: collegesLoading, error: collegesError } = useQuery({
    queryKey: ['colleges'],
    queryFn: async () => {
      console.log('🔵 LecturerCourses - Fetching colleges...');
      const result = await base44.entities.College.list('name');
      console.log('🔵 LecturerCourses - Colleges fetched:', result);
      return result;
    },
  });

  // Extract colleges array from response
  const colleges = Array.isArray(collegesData) ? collegesData : (collegesData?.data?.colleges || collegesData?.colleges || []);

  // Debug: Log colleges data
  React.useEffect(() => {
    console.log('LecturerCourses - Colleges data:', colleges);
    console.log('LecturerCourses - Colleges count:', colleges?.length || 0);
    console.log('LecturerCourses - Colleges loading:', collegesLoading);
    console.log('LecturerCourses - Colleges error:', collegesError);
  }, [colleges, collegesLoading, collegesError]);

  // Fetch all lecturers (for admin)
  const { data: lecturersData } = useQuery({
    queryKey: ['lecturers'],
    queryFn: async () => {
      const users = await base44.entities.User.list();
      return users;
    },
    enabled: isAdmin,
  });

  // Extract lecturers array from response
  const allUsers = Array.isArray(lecturersData) ? lecturersData : (lecturersData?.data?.users || lecturersData?.users || []);
  const lecturers = allUsers.filter(u => u.role === 'lecturer' || u.role === 'admin');

  // Fetch enrollments to get student counts
  const { data: enrollmentsData } = useQuery({
    queryKey: ['all-enrollments'],
    queryFn: () => base44.entities.Enrollment.list(),
  });

  // Extract enrollments array from response
  const allEnrollments = Array.isArray(enrollmentsData) ? enrollmentsData : (enrollmentsData?.data?.enrollments || enrollmentsData?.enrollments || []);

  // Add student count to courses
  const coursesWithStudents = courses.map(course => ({
    ...course,
    students: allEnrollments.filter(e => (e.courseId || e.course_id) === course.id && e.status === 'active').length
  }));

  // Create mutations
  const createCourseMutation = useMutation({
    mutationFn: async (courseData) => {
      console.log('🚀 Creating course with data:', courseData);
      console.log('👤 Current user:', user);
      console.log('🔑 User role:', user?.role);
      console.log('🎫 Auth token:', localStorage.getItem('token')?.substring(0, 50) + '...');
      
      // Set instructor to current user if not admin
      if (!isAdmin) {
        courseData.instructor = user?.email;
        courseData.instructor_name = user?.full_name;
      }
      
      // Check if college_id is a string (college name) - if so, try to find the college ID
      if (courseData.college_id && typeof courseData.college_id === 'string' && isNaN(courseData.college_id)) {
        console.log('🏛️ College is a name, not an ID. Looking for college:', courseData.college_id);
        
        // Store the college name
        const collegeName = courseData.college_id;
        
        // Try to find the college by name
        const college = colleges.find(c => c.name === collegeName);
        
        if (college) {
          // College exists in DB, use its ID
          courseData.college_id = college.id;
          console.log('✅ Found college in DB with ID:', college.id);
        } else {
          // College doesn't exist in DB yet - set college_id to null and keep college_name
          console.log('⚠️ College not in DB yet, will create course with college_name only');
          courseData.college_id = null;
          courseData.college_name = collegeName;
        }
      }
      
      return base44.entities.Course.create(courseData);
    },
    onSuccess: (newCourse) => {
      console.log('✅ Course created successfully:', newCourse);
      queryClient.invalidateQueries({ queryKey: ['all-courses-for-dashboard'] });
      setShowCreateDialog(false);
    },
    onError: (error) => {
      console.error('❌ Failed to create course:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert(`Failed to create course: ${error.response?.data?.message || error.message}`);
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Course.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-courses-for-dashboard'] });
      setEditingCourse(null);
    },
  });

  // Get unique college names from colleges (not courses)
  const uniqueCollegeNames = Array.isArray(colleges) ? colleges.map(c => c.name).sort() : [];

  // Get unique semesters from courses, with defaults if empty
  const uniqueSemesters = coursesWithStudents.length > 0 
    ? [...new Set(coursesWithStudents.map(c => c.semester).filter(Boolean))].sort()
    : ['Fall 2025', 'Spring 2026', 'Summer 2026', 'Fall 2026'];

  const filteredCourses = coursesWithStudents.filter((course) => {
    const matchesSearch =
      course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || course.status === statusFilter;
    
    // Match by college name - use collegeId (camelCase) or college object
    const courseCampus = colleges.find(c => String(c.id) === String(course.collegeId || course.college_id));
    const collegeName = courseCampus?.name || course.college?.name;
    const matchesCollege =
      collegeFilter === "All Colleges" || collegeName === collegeFilter;
    
    const matchesSemester =
      semesterFilter === "All Semesters" || course.semester === semesterFilter;

    return matchesSearch && matchesStatus && matchesCollege && matchesSemester;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIdx = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIdx,
    startIdx + coursesPerPage
  );

  const statusBadgeColor = (status) => {
    return status === "published"
      ? "bg-green-500"
      : "bg-orange-500";
  };

  const handleCreateCourse = async (courseData) => {
    await createCourseMutation.mutateAsync(courseData);
  };

  const handleUpdateCourse = async (courseData) => {
    await updateCourseMutation.mutateAsync({
      id: editingCourse.id,
      data: courseData
    });
  };

  return (
    <div className="space-y-6">
      {/* Browse & Claim Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Browse & Claim Courses to Teach
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Explore available courses and select the ones you'd like to teach
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Search className="w-4 h-4 mr-2" />
            Course Selection Portal
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="flex gap-4 items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Course Creator
            </Button>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Course
            </Button>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Status</option>
            <option>draft</option>
            <option>published</option>
            <option>archived</option>
          </select>

          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Colleges ({colleges?.length || 0} available)</option>
            {uniqueCollegeNames.sort().map((collegeName) => (
              <option key={collegeName} value={collegeName}>
                {collegeName}
              </option>
            ))}
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Semesters</option>
            {uniqueSemesters.sort().map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {paginatedCourses.length > 0 ? startIdx + 1 : 0}-{Math.min(startIdx + coursesPerPage, filteredCourses.length)} of{" "}
          {filteredCourses.length} courses
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Grid or Empty State */}
      {paginatedCourses.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-md border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {coursesWithStudents.length === 0 ? 'No Courses Yet' : 'No Courses Found'}
          </h3>
          <p className="text-gray-500 mb-6">
            {coursesWithStudents.length === 0 
              ? 'Get started by creating your first course using the "Create Course" button above.'
              : 'Try adjusting your search or filters to find courses.'}
          </p>
          {coursesWithStudents.length === 0 && (
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Course
            </Button>
          )}
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCourses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Color Bar */}
            <div
              className={`h-1 ${statusBadgeColor(course.status)}`}
            ></div>

            <CardContent className="p-6">
              {/* Course Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-blue-600 text-sm mb-1">
                    {course.code}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      course.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
                <Eye className="w-4 h-4 text-gray-400" />
              </div>

              {/* Course Title */}
              <h2 className="font-bold text-gray-900 mb-3 text-sm line-clamp-2">
                {course.title}
              </h2>

              {/* Program & Details */}
              <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                {colleges.find(c => String(c.id) === String(course.collegeId || course.college_id))?.name || course.college?.name || 'Unknown College'}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                <span className="font-semibold text-gray-600">
                  {course.degree_program?.substring(0, 50)}{course.degree_program?.length > 50 ? '...' : ''}
                </span>
              </p>

              {/* Stats */}
              <div className="flex gap-4 mb-4 text-xs text-gray-600">
                <span>👥 {course.students} students</span>
                <span>📅 {course.semester}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate(`${createPageUrl('course-detail')}?id=${course.id}`)}
                  className="w-full text-xs" 
                  variant="outline"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    className="text-xs"
                    variant="outline"
                    title="AI Generator"
                  >
                    <Wand2 className="w-3 h-3" />
                  </Button>
                  <Button
                    className="text-xs"
                    variant="outline"
                    title="Clone Course"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    className="text-xs"
                    variant="outline"
                    title="Release to Pool"
                  >
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    setEditingCourse(course);
                    setIsEditModalOpen(true);
                  }}
                  className="w-full text-xs"
                  variant="outline"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* Create Course Dialog */}
      <CreateCourseDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={async (courseData) => {
          try {
            console.log('📤 Submitting course data:', courseData);
            await createCourseMutation.mutateAsync(courseData);
            console.log('🎉 Course created and dialog will close');
          } catch (error) {
            console.error('💥 Error in onSubmit:', error);
          }
        }}
        isLoading={createCourseMutation.isPending}
        lecturers={lecturers}
        colleges={colleges}
        isAdmin={isAdmin}
      />

      {/* Edit Course Dialog */}
      <EditCourseDialog
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCourse(null);
        }}
        onSubmit={async (courseData) => {
          await updateCourseMutation.mutateAsync({
            id: editingCourse.id,
            data: courseData
          });
        }}
        course={editingCourse}
        isLoading={updateCourseMutation.isPending}
        lecturers={lecturers}
        colleges={colleges}
        isAdmin={isAdmin}
      />
    </div>
  );
}
