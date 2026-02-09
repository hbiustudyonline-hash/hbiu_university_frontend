import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import Layout from "@/Layout";
import { 
  BookOpen, 
  GraduationCap,
  Edit,
  Users,
  Award,
  Download,
  Upload,
  Camera,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      code: "GEN 106",
      name: "Public Speaking and Communication (BA)",
      level: "Bachelor",
      instructor: "Dervile Fourie",
      semester: "Semester 1 (New)",
      progress: 100,
      completed: 10,
      total: 10,
      description: "No description available"
    },
    {
      id: 2,
      code: "TS IGA 662",
      name: "Migration Policy & Global Governance",
      level: "PhD",
      instructor: "N/A",
      semester: "Spring 2026",
      progress: 0,
      completed: 0,
      total: 5,
      description: "Migration Policy & Global Governance"
    },
    {
      id: 3,
      code: "FBC-201",
      name: "Certificate in Chaplaincy",
      level: "Certificate",
      instructor: "Info",
      semester: "Spring 2025",
      progress: 100,
      completed: 11,
      total: 11,
      description: "Comprehensive chaplaincy training for ministry in diverse institutional settings."
    },
    {
      id: 4,
      code: "PMGT 602",
      name: "Planning, Scheduling, and Control",
      level: "Master",
      instructor: "N/A",
      semester: "N/A",
      progress: 0,
      completed: 0,
      total: 0,
      description: "Core Project Management Foundation course."
    },
    {
      id: 5,
      code: "PSY 701",
      name: "Advanced Theories in Psychology",
      level: "PhD",
      instructor: "N/A",
      semester: "N/A",
      progress: 0,
      completed: 0,
      total: 0,
      description: "Comprehensive exploration of advanced psychological theories and their applications in contemporary context."
    }
  ];

  const getLevelColor = (level) => {
    const colors = {
      "Bachelor": "bg-green-500",
      "Master": "bg-blue-500",
      "PhD": "bg-purple-500",
      "Certificate": "bg-orange-500"
    };
    return colors[level] || "bg-blue-500";
  };

  const getLevelShorthand = (level) => {
    const shorthand = {
      "Bachelor": "B.A",
      "Master": "M.A",
      "PhD": "PhD",
      "Certificate": "Cert"
    };
    return shorthand[level] || "Cert";
  };

  return (
    <Layout currentPageName="Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Welcome Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    Welcome back, {user?.full_name || user?.firstName || 'Student'}!
                  </h1>
                  <p className="text-blue-100 text-lg">Student Dashboard</p>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md p-1 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "overview"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("academic")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "academic"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Academic Records
              </button>
              <button
                onClick={() => setActiveTab("progress")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "progress"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                My Progress
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "achievements"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Achievements
              </button>
              <button
                onClick={() => setActiveTab("degrees")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "degrees"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                My Degrees
              </button>
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "portfolio"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Portfolio
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              
              {/* Level Progress Section */}
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-purple-600">1</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Level 1</h3>
                        <p className="text-gray-600">0 Points</p>
                      </div>
                    </div>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      0/0 Badges
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Progress to Level 2</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: "0%"}} />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">1000 points to next level</p>
                </CardContent>
              </Card>

              {/* New Student Community */}
              <Card className="shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">New Student Community</h3>
                      <p className="text-pink-100">Connect with fellow students, watch welcome videos, and get help getting started.</p>
                    </div>
                    <Button className="bg-white text-pink-600 hover:bg-gray-100">
                      Join Community Group
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Enrolled Courses</p>
                        <p className="text-3xl font-bold text-blue-600">5</p>
                      </div>
                      <BookOpen className="w-12 h-12 text-blue-100" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Assignments</p>
                        <p className="text-3xl font-bold text-purple-600">0</p>
                      </div>
                      <Award className="w-12 h-12 text-purple-100" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-600">0</p>
                      </div>
                      <GraduationCap className="w-12 h-12 text-green-100" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Pending</p>
                        <p className="text-3xl font-bold text-orange-600">0</p>
                      </div>
                      <BarChart3 className="w-12 h-12 text-orange-100" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* My Student ID Card Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">My Student ID Card</h3>
                <p className="text-gray-600 mb-6">Your official HBIU student identification</p>
                
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    {/* ID Card Display */}
                    <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 text-white mb-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="w-8 h-8" />
                          <div>
                            <p className="text-sm text-blue-100">HBI UNIVERSITY</p>
                            <p className="text-xs text-blue-100">Heart Blak International University</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-8">
                        {/* Photo Placeholder */}
                        <div className="w-32 h-40 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-12 h-12 text-white/40" />
                        </div>

                        {/* Student Info */}
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-blue-100 mb-4">STUDENT ID CARD</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-4">
                              <span className="text-blue-100 w-20">Name</span>
                              <span className="font-semibold">: {user?.full_name || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-blue-100 w-20">Student ID</span>
                              <span className="font-semibold">: HBIU-XXXX-XXXX-XXXX</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-blue-100 w-20">Program</span>
                              <span className="font-semibold">: Associate of Science in Business Administration</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-blue-100 w-20">Grad Year</span>
                              <span className="font-semibold">: 2025</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-blue-100 w-20">Issued On</span>
                              <span className="font-semibold">: Oct 10, 2025</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Barcode */}
                      <div className="mt-8 border-t border-white/20 pt-4">
                        <div className="bg-white h-12 flex items-center justify-center rounded text-gray-900 font-mono text-xs tracking-widest">
                          |||||||||||||||||||||||||||||||||||||||||||||||||||||
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2">
                        <Download className="w-4 h-4 mr-2" />
                        Download Student ID Card
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enrolled Courses Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Enrolled Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                      {/* Course Header */}
                      <div className={`${getLevelColor(course.level)} p-4 text-white`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold">{course.code}</h4>
                          <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-semibold">
                            {getLevelShorthand(course.level)}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h5 className="font-bold text-gray-900 mb-1">{course.name}</h5>
                          <p className="text-sm text-gray-600">{course.description}</p>
                        </div>

                        {/* Course Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Course Progress</span>
                            <span className="text-sm font-semibold text-gray-900">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                              style={{width: `${course.progress}%`}}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{course.completed} of {course.total} items completed</p>
                        </div>

                        {/* Course Info */}
                        <div className="pt-2 border-t border-gray-200 space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{course.instructor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">📅</span>
                            <span className="text-gray-600">{course.semester}</span>
                          </div>
                        </div>

                        {/* View Course Button */}
                        <Button className="w-full bg-gray-900 hover:bg-black text-white mt-4">
                          View Course →
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs - Placeholder */}
          {activeTab !== "overview" && (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {activeTab === "academic" && "Academic Records"}
                  {activeTab === "progress" && "My Progress"}
                  {activeTab === "achievements" && "Achievements"}
                  {activeTab === "degrees" && "My Degrees"}
                  {activeTab === "portfolio" && "Portfolio"}
                </h3>
                <p className="text-gray-600">Coming soon - This section is under development</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
