import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import coursesData from "@/data/courses.json";
import { BookOpen, ArrowRight, Search } from "lucide-react";

export default function CourseListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");

  const courses = coursesData.courses;
  
  const colleges = ["all", ...new Set(courses.map(c => c.college))];
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollege = selectedCollege === "all" || course.college === selectedCollege;
    return matchesSearch && matchesCollege;
  });

  const featuredCourses = courses.filter(c => c.featured);

  return (
    <div className="space-y-16">
      {/* Featured Courses Section */}
      {featuredCourses.length > 0 && (
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-blue-100 text-blue-800">Featured Courses</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Start Learning Today
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our most popular courses taught by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                    {course.program}
                  </Badge>
                </div>

                {/* Course Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-blue-600 font-semibold">{course.code}</p>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm">
                    {course.description.substring(0, 100)}...
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.credits} Credits
                    </span>
                    <span>{course.semester}</span>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Instructor</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
                    </div>
                  </div>

                  <Link
                    to={`/course/${course.id}`}
                    className="w-full"
                  >
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      View Course <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Courses Section */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Browse All Courses
          </h2>
          <p className="text-gray-600">
            Find the perfect course for your learning journey
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* College Filter */}
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {colleges.map((college) => (
                <option key={college} value={college}>
                  {college === "all" ? "All Colleges" : college}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link key={course.id} to={`/course/${course.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 hover:border-blue-300 h-full flex flex-col group">
                  {/* Course Image */}
                  <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-white/90 text-blue-600 font-semibold">
                      {course.program}
                    </Badge>
                  </div>

                  {/* Course Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-blue-600">{course.code}</p>
                      <h3 className="text-base font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-1">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3 pt-2 border-t">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.credits} Credits
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {course.college}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-gray-700 truncate">{course.instructor}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}

        {/* Results Count */}
        <p className="text-center text-sm text-gray-600">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
      </section>
    </div>
  );
}
