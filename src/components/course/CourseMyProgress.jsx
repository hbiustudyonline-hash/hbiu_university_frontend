import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BookOpen, FileText, CheckCircle2, Clock, Target, Award, BarChart3 } from "lucide-react";

export default function CourseMyProgress({ courseId, isInstructor }) {
  // Sample progress data - in production, fetch from API
  const progressData = {
    overallCompletion: 65,
    currentGrade: 'B+',
    gradePercentage: 87,
    modules: {
      completed: 7,
      total: 10
    },
    assignments: {
      completed: 4,
      total: 6
    },
    quizzes: {
      completed: 3,
      total: 4
    },
    attendance: 92,
    timeSpent: '24 hours',
    lastActive: '2 days ago'
  };

  const moduleProgress = [
    { id: 1, name: 'Module 1: Introduction', status: 'completed', score: 95 },
    { id: 2, name: 'Module 2: Fundamentals', status: 'completed', score: 88 },
    { id: 3, name: 'Module 3: Core Concepts', status: 'completed', score: 92 },
    { id: 4, name: 'Module 4: Advanced Topics', status: 'completed', score: 85 },
    { id: 5, name: 'Module 5: Case Studies', status: 'completed', score: 90 },
    { id: 6, name: 'Module 6: Research Methods', status: 'completed', score: 87 },
    { id: 7, name: 'Module 7: Applications', status: 'completed', score: 84 },
    { id: 8, name: 'Module 8: Analysis', status: 'in-progress', score: null },
    { id: 9, name: 'Module 9: Synthesis', status: 'not-started', score: null },
    { id: 10, name: 'Module 10: Final Project', status: 'not-started', score: null }
  ];

  const recentActivity = [
    { id: 1, type: 'assignment', title: 'Assignment 4 Submitted', date: '2026-02-25', score: 92 },
    { id: 2, type: 'quiz', title: 'Quiz 3 Completed', date: '2026-02-23', score: 88 },
    { id: 3, type: 'module', title: 'Module 7 Completed', date: '2026-02-20', score: 84 },
    { id: 4, type: 'assignment', title: 'Assignment 3 Graded', date: '2026-02-18', score: 95 }
  ];

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-green-100 text-green-700 border-green-300';
    if (status === 'in-progress') return 'bg-blue-100 text-blue-700 border-blue-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle2 className="w-4 h-4" />;
    if (status === 'in-progress') return <Clock className="w-4 h-4" />;
    return <BookOpen className="w-4 h-4" />;
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <TrendingUp className="w-6 h-6" />
            Overall Course Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-900">Course Completion</span>
                <span className="text-2xl font-bold text-blue-600">{progressData.overallCompletion}%</span>
              </div>
              <Progress value={progressData.overallCompletion} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Current Grade</p>
                <p className={`text-2xl font-bold ${getGradeColor(progressData.gradePercentage)}`}>
                  {progressData.currentGrade}
                </p>
                <p className="text-xs text-gray-500">{progressData.gradePercentage}%</p>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Modules</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData.modules.completed}/{progressData.modules.total}
                </p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData.assignments.completed}/{progressData.assignments.total}
                </p>
                <p className="text-xs text-gray-500">Submitted</p>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{progressData.attendance}%</p>
                <p className="text-xs text-gray-500">Rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Module Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {moduleProgress.map((module) => (
              <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${getStatusColor(module.status)}`}>
                    {getStatusIcon(module.status)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{module.name}</h4>
                    <Badge variant="outline" className={`text-xs mt-1 ${getStatusColor(module.status)}`}>
                      {module.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                {module.score !== null && (
                  <div className="text-right">
                    <p className={`text-xl font-bold ${getGradeColor(module.score)}`}>
                      {module.score}%
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Assignments</p>
                <p className="text-xl font-bold text-gray-900">
                  {progressData.assignments.completed}/{progressData.assignments.total}
                </p>
                <Progress 
                  value={(progressData.assignments.completed / progressData.assignments.total) * 100} 
                  className="h-2 mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quizzes</p>
                <p className="text-xl font-bold text-gray-900">
                  {progressData.quizzes.completed}/{progressData.quizzes.total}
                </p>
                <Progress 
                  value={(progressData.quizzes.completed / progressData.quizzes.total) * 100} 
                  className="h-2 mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-xl font-bold text-gray-900">{progressData.attendance}%</p>
                <Progress value={progressData.attendance} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {activity.type === 'assignment' && <FileText className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'quiz' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'module' && <BookOpen className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
                {activity.score && (
                  <div className={`text-lg font-bold ${getGradeColor(activity.score)}`}>
                    {activity.score}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Card */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6 text-center">
          <Award className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
          <h3 className="text-xl font-bold text-yellow-900 mb-2">Keep Up the Great Work!</h3>
          <p className="text-yellow-800">
            You're making excellent progress. Complete 3 more modules to stay on track!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
