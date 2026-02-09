import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import coursesData from "@/data/courses.json";
import { BookOpen, Users, Clock, User, ArrowLeft, LogIn } from "lucide-react";

export default function PublicCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = coursesData.courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Course Not Found</h1>
          <p className="text-gray-300">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")} className="mt-6">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-blue-100 text-lg font-semibold mb-2">{course.code}</p>
                <h1 className="text-4xl font-bold">{course.title}</h1>
              </div>
              <Badge className="bg-white text-blue-600 text-base px-3 py-1">
                {course.program}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{course.college}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{course.credits} Credits</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{course.semester}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Overview */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Course Overview</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 leading-relaxed">{course.overview}</p>
              </CardContent>
            </Card>

            {/* Learning Outcomes */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Course Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-orange-600">📋</span>
                    Prerequisites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{course.prerequisites}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-purple-600">👥</span>
                    Who This Course Is For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{course.whoIsFor}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-blue-600">📚</span>
                    Course Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{course.format}</p>
                </CardContent>
              </Card>
            </div>

            {/* Course Details */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Course Code</p>
                    <p className="text-gray-900 font-medium">{course.code}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Program Level</p>
                    <Badge variant="outline">{course.program}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Credits</p>
                    <p className="text-gray-900 font-medium">{course.credits} Credits</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Semester</p>
                    <p className="text-gray-900 font-medium">{course.semester}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 text-sm font-semibold mb-1">College</p>
                    <p className="text-gray-900 font-medium">{course.college}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-base">Your Instructor</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructor}
                    className="w-24 h-24 rounded-full mx-auto"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{course.instructor}</p>
                    <p className="text-sm text-gray-600">Course Instructor</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrollment CTA */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-gray-700 font-semibold text-center">
                    Ready to get started?
                  </p>
                  <p className="text-gray-600 text-sm text-center">
                    Sign in or create an account to enroll in this course and start your learning journey.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In to Enroll
                  </Button>
                  <Button variant="outline" className="w-full">
                    Browse More Courses
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Course Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">1 Semester</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Workload</span>
                  <span className="font-semibold">3 hrs/week</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-semibold">Introductory</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
