import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, Filter, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// Mock student data
const mockStudents = [
  {
    id: 1,
    name: "agidisamon",
    fullName: "Agidi Samson",
    email: "agidisamon@yahoo.com",
    avatar: "A",
    enrolledCourses: 2,
    courses: ["MBA 202", "MBA 201"],
    totalEnrollments: 3784,
    program: "Bachelor Program",
    phone: "+254115574369",
    idNumber: "HBU-IHL-TT640A0294G1",
  },
  {
    id: 2,
    name: "Nyeboho Etuk",
    fullName: "Nyeboho Etuk",
    email: "nyectuk@gmail.com",
    avatar: "N",
    enrolledCourses: 1,
    courses: ["GEN 502"],
    totalEnrollments: 3784,
    program: "Bachelor Program",
    phone: "+254115574369",
    idNumber: "HBU-IHL-TT640A0294G1",
  },
  {
    id: 3,
    name: "David Cococbassey",
    fullName: "David Cococbassey",
    email: "dcocbassey@gmail.com",
    avatar: "D",
    enrolledCourses: 1,
    courses: ["GEN 502"],
    totalEnrollments: 3784,
    program: "Bachelor Program",
    phone: "+254115574369",
    idNumber: "HBU-IHL-TT640A0294G1",
  },
  {
    id: 4,
    name: "brutus2010",
    fullName: "Brutus Johnson",
    email: "brutus2010@gmail.com",
    avatar: "B",
    enrolledCourses: 3,
    courses: ["MADC 500", "GRAD 501", "GEN 502"],
    totalEnrollments: 3784,
    program: "Master Program",
    phone: "+254115574369",
    idNumber: "HBU-IHL-TT640A0294G1",
  },
  {
    id: 5,
    name: "Mustafa Kadara (Kemmy)",
    fullName: "Mustafa Kadara (Kemmy)",
    email: "mustafakadara20@gmail.com",
    avatar: "M",
    enrolledCourses: 4,
    courses: ["GEN 104", "GEN 105", "ENG 101", "GEN 306"],
    totalEnrollments: 3784,
    program: "Bachelor Program",
    phone: "+254115574369",
    idNumber: "HBU-IHL-TT640A0294G1",
  },
  {
    id: 6,
    name: "sanemiiy777",
    fullName: "Sanemi Shinazugawa",
    email: "sanemiiy777@gmail.com",
    avatar: "S",
    enrolledCourses: 5,
    courses: ["GEN 104", "ACCT 102BM", "ACC 210", "BUS 101", "GEN 305"],
    totalEnrollments: 3784,
    program: "Bachelor Program",
    phone: "+254115574369",
    idNumber: "HBU-IHL-TT640A0294G1",
  },
];

const courseDetails = {
  "GEN 104": {
    name: "GEN 104 - Introduction to Business (BA)",
    semester: "Semester 1 (New)",
    status: "In Progress",
    assignments: { submitted: 0, total: 10 },
    graded: 0,
    score: "0%",
    totalPoints: "0/100 pts",
    progress: 0,
  },
  "GEN 105": {
    name: "GEN 105 - Introduction to Economics (BA)",
    semester: "Semester 1 (New)",
    status: "In Progress",
    assignments: { submitted: 0, total: 10 },
    graded: 0,
    score: "0%",
    totalPoints: "0/100 pts",
    progress: 0,
  },
  "ENG 101": {
    name: "ENG 101 - English Composition I",
    semester: "Semester 1 (New)",
    status: "In Progress",
    assignments: { submitted: 0, total: 10 },
    graded: 0,
    score: "0%",
    totalPoints: "0/100 pts",
    progress: 0,
  },
  "MBA 202": {
    name: "MBA 202 - Business Management",
    semester: "Semester 2",
    status: "In Progress",
    assignments: { submitted: 5, total: 10 },
    graded: 3,
    score: "65%",
    totalPoints: "65/100 pts",
    progress: 65,
  },
  "MBA 201": {
    name: "MBA 201 - Finance Fundamentals",
    semester: "Semester 1",
    status: "In Progress",
    assignments: { submitted: 4, total: 8 },
    graded: 2,
    score: "72%",
    totalPoints: "72/100 pts",
    progress: 72,
  },
};

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-indigo-500",
];

export default function LecturerStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedCourse === "All Courses") {
      return matchesSearch;
    }
    return matchesSearch && student.courses.includes(selectedCourse);
  });

  const openStudentDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Content Gen</p>
        <h1 className="text-3xl font-bold mb-2">My Students</h1>
        <p className="text-gray-600">Manage and track your 1000 students</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option>All Courses</option>
          {Array.from(new Set(mockStudents.flatMap((s) => s.courses))).map(
            (course) => (
              <option key={course} value={course}>
                {course}
              </option>
            )
          )}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-blue-600">1000</div>
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-green-600">3784</div>
              <div>
                <p className="text-gray-600 text-sm">Total Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-purple-600">0</div>
              <div>
                <p className="text-gray-600 text-sm">Graded Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-orange-600">5000</div>
              <div>
                <p className="text-gray-600 text-sm">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`${colors[student.id % colors.length]} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}
                >
                  {student.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 font-semibold">
                  Enrolled Courses{" "}
                  <span className="float-right text-blue-600 font-bold">
                    {student.enrolledCourses}
                  </span>
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {student.courses.map((course) => (
                  <p key={course} className="text-sm text-gray-700">
                    {course}
                  </p>
                ))}
              </div>

              <Button
                onClick={() => openStudentDetails(student)}
                className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student Profile Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>Student Profile</DialogTitle>
            <DialogClose />
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Info Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div
                    className={`${colors[selectedStudent.id % colors.length]} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl`}
                  >
                    {selectedStudent.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedStudent.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedStudent.email}
                    </p>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">📞</span>{" "}
                        {selectedStudent.phone}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">🎓</span>{" "}
                        {selectedStudent.program}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">🆔</span>{" "}
                        {selectedStudent.idNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Progress */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Course Progress
                </h4>
                <div className="space-y-4">
                  {selectedStudent.courses.map((courseCode) => {
                    const course = courseDetails[courseCode];
                    return (
                      <div
                        key={courseCode}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              {course.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {course.semester}
                            </p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
                            {course.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center">
                            <p className="text-sm text-blue-600 font-semibold">
                              Assignments
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {course.assignments.submitted}/
                              {course.assignments.total}
                            </p>
                            <p className="text-xs text-gray-600">Submitted</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-green-600 font-semibold">
                              Graded
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {course.graded}
                            </p>
                            <p className="text-xs text-gray-600">Assignments</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-purple-600 font-semibold">
                              Score
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {course.score}
                            </p>
                            <p className="text-xs text-gray-600">
                              {course.totalPoints}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">
                              Overall Progress
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
