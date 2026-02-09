import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, User, TrendingUp, Award, BookMarked } from "lucide-react";
import { format } from "date-fns";

export default function LecturerGrades({ courses, enrollments }) {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [activeTab, setActiveTab] = useState('final-grades');

  const filteredEnrollments = selectedCourse === 'all' 
    ? enrollments 
    : enrollments.filter(e => e.course_id === selectedCourse);

  const getGradeColor = (percentage) => {
    if (!percentage) return 'bg-gray-100 text-gray-700';
    if (percentage >= 90) return 'bg-green-100 text-green-700';
    if (percentage >= 80) return 'bg-blue-100 text-blue-700';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-700';
    if (percentage >= 60) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const courseEnrollments = filteredEnrollments.filter(e => e.status === 'active');
  const averageGrade = courseEnrollments.length > 0
    ? (courseEnrollments.reduce((sum, e) => sum + (e.percentage || 0), 0) / courseEnrollments.length).toFixed(1)
    : 0;

  // Mock quiz data
  const quizResults = [
    {
      id: 1,
      studentName: 'philip Moiwo',
      studentEmail: 'philipmoiwo288@gmail.com',
      quizTitle: 'Week 6. CHRISTIANITY — JESUS, SCRIPTURE, TRADITION, AND GLOBAL MISSION',
      score: 5,
      maxScore: 10,
      date: '2/4/2026'
    },
    {
      id: 2,
      studentName: 'philip Moiwo',
      studentEmail: 'philipmoiwo288@gmail.com',
      quizTitle: 'Week 7. ISLAM — REVELATION, PROPHETHOOD, LAW, AND COMMUNITY',
      score: 5,
      maxScore: 10,
      date: '2/4/2026'
    },
    {
      id: 3,
      studentName: 'philip Moiwo',
      studentEmail: 'philipmoiwo288@gmail.com',
      quizTitle: 'Week 8. SIKHISM — DEVOTION, SERVICE, AND UNITY',
      score: 4,
      maxScore: 10,
      date: '2/4/2026'
    },
    {
      id: 4,
      studentName: 'Ademola Adebowale',
      studentEmail: 'ademola@example.com',
      quizTitle: 'Week 10 Quiz: Module 10: Crafting Persuasive Arguments in Academic Writing',
      score: 100,
      maxScore: 100,
      date: '2/4/2026'
    }
  ];

  // Mock final grades data
  const finalGrades = [
    {
      id: 1,
      studentName: 'segunolowolekomo',
      studentEmail: 'segunolowolekomo@gmail.com',
      courseName: 'GEN 502 - Graduate. Professionalism, Ethics and Research Literacy',
      status: 'Not Graded'
    },
    {
      id: 2,
      studentName: 'ofojebegraçeifsinachi',
      studentEmail: 'ofojebegraçeifsinachi@gmail.com',
      courseName: 'MADC 500 - Spiritual Formation',
      status: 'Not Graded'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grade Management</h2>
          <p className="text-gray-500 mt-1">View and manage student grades</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courseEnrollments.length}</p>
                <p className="text-sm text-gray-500">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">0.0%</p>
                <p className="text-sm text-gray-500">Average Grade</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">Graded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Tabs for Final Grades and Quiz Results */}
      <div className="bg-white rounded-lg shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="border-b border-gray-200 rounded-t-lg bg-transparent">
            <TabsTrigger 
              value="final-grades" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600"
            >
              Final Grades
            </TabsTrigger>
            <TabsTrigger 
              value="quiz-results"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600"
            >
              Quiz Results
            </TabsTrigger>
          </TabsList>

          {/* Final Grades Tab */}
          <TabsContent value="final-grades" className="p-0 m-0">
            <Card className="border-0 rounded-t-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Final Student Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {finalGrades.map(student => (
                    <div key={student.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{student.studentName}</h4>
                            <p className="text-sm text-gray-600 mb-2">{student.studentEmail}</p>
                            <p className="text-sm text-gray-600">{student.courseName}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-gray-600 flex-shrink-0">
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Results Tab */}
          <TabsContent value="quiz-results" className="p-0 m-0">
            <Card className="border-0 rounded-t-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="w-5 h-5" />
                  Quiz Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Student</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Quiz Title</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Score</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizResults.map((quiz) => (
                        <tr key={quiz.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{quiz.studentName}</p>
                              <p className="text-sm text-gray-600">{quiz.studentEmail}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-sm text-gray-700">{quiz.quizTitle}</p>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className="bg-blue-100 text-blue-700 font-semibold">
                              {quiz.score} / {quiz.maxScore}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-sm text-gray-600">{quiz.date}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}