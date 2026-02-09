import { useState } from "react";
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

// Mock course data
const mockCourses = [
  {
    id: 1,
    code: "AGB 304",
    title: "Agricultural Biotechnology and Ethics",
    status: "draft",
    program: "Bachelor of Agribusiness, Minor in Non-Profit Sustainable and Community Development",
    college: "College of Agriculture and Natural Resources",
    students: 0,
    semester: "Fall 2025",
    description: "Introduces biotechnological innovations in agriculture while addressing related ethical considerations.",
  },
  {
    id: 2,
    code: "HCA 207",
    title: "Healthcare Information Systems",
    status: "published",
    program: "Bachelor of Science in Healthcare Administration, Minor in Health Ministry",
    college: "College of Health Science",
    students: 1,
    semester: "Fall 2025",
    description: "Comprehensive study of healthcare information systems and their applications.",
  },
  {
    id: 3,
    code: "GEN 108",
    title: "Ethics and Moral Reasoning",
    status: "published",
    program: "Bachelor of Science in Healthcare Administration, Minor in Health Ministry",
    college: "College of Health Science",
    students: 2,
    semester: "Fall 2025",
    description: "Explores ethical frameworks and moral reasoning in various contexts.",
  },
  {
    id: 4,
    code: "HCA 205",
    title: "Healthcare Management",
    status: "published",
    program: "Bachelor of Health Administration",
    college: "College of Health Science",
    students: 3,
    semester: "Fall 2025",
    description: "Study of healthcare management principles and practices.",
  },
  {
    id: 5,
    code: "AGB 209",
    title: "Agriculture and Sustainable Development",
    status: "published",
    program: "Bachelor of Agriculture",
    college: "College of Agriculture and Natural Resources",
    students: 4,
    semester: "Spring 2026",
    description: "Sustainable approaches to agricultural development.",
  },
  {
    id: 6,
    code: "CCP 208",
    title: "Counseling and Psychology",
    status: "published",
    program: "Bachelor of Science in Counseling & Psychology",
    college: "College of Psychology",
    students: 5,
    semester: "Spring 2026",
    description: "Foundation concepts in counseling and psychology practice.",
  },
];

export default function LecturerCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [collegeFilter, setCollegeFilter] = useState("All Colleges");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const coursesPerPage = 12;

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || course.status === statusFilter;
    const matchesCollege =
      collegeFilter === "All Colleges" || course.college === collegeFilter;
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

  const openEditModal = (course) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };

  const statusBadgeColor = (status) => {
    return status === "published"
      ? "bg-green-500"
      : "bg-orange-500";
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
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
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
            <option>All Colleges</option>
            <option>College of Agriculture and Natural Resources</option>
            <option>College of Health Science</option>
            <option>College of Psychology</option>
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Semesters</option>
            <option>Fall 2025</option>
            <option>Spring 2026</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {startIdx + 1}-{Math.min(startIdx + coursesPerPage, filteredCourses.length)} of{" "}
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
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
                {course.college.split(" ").slice(0, 3).join(" ")}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                <span className="font-semibold text-gray-600">
                  {course.program.split(",")[0].substring(0, 50)}...
                </span>
              </p>

              {/* Stats */}
              <div className="flex gap-4 mb-4 text-xs text-gray-600">
                <span>👥 {course.students} students</span>
                <span>📅 {course.semester}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button className="w-full text-xs" variant="outline">
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
                  onClick={() => openEditModal(course)}
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

      {/* Edit Course Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogClose />
          </DialogHeader>

          {editingCourse && (
            <div className="space-y-6">
              {/* Course Code & Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    defaultValue={editingCourse.code}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Program Level *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Bachelor</option>
                    <option>Master</option>
                    <option>Certificate</option>
                  </select>
                </div>
              </div>

              {/* Degree Program & College */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Degree Program *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>{editingCourse.program.split(",")[0]}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    College/Department *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>{editingCourse.college}</option>
                  </select>
                </div>
              </div>

              {/* Course Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  defaultValue={editingCourse.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Short Description
                </label>
                <textarea
                  rows="3"
                  defaultValue={editingCourse.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* AI Course Assistant */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Course Assistant
                </h4>
                <div className="flex gap-2 mb-4">
                  <Button
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" />
                    Generate Description
                  </Button>
                  <Button
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                  >
                    Suggest Keywords
                  </Button>
                  <Button
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                  >
                    Recommend Prerequisites
                  </Button>
                </div>
                <p className="text-xs text-purple-700">
                  ✓ All will generate comprehensive descriptions, relevant keywords, and recommend appropriate prerequisites
                </p>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Description (300 words)
                </label>
                <textarea
                  rows="8"
                  placeholder="Detailed course description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={editingCourse.description}
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
