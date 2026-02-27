import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { GraduationCap, Search, Filter, Download, FileText, Clock, CheckCircle2, XCircle, Edit } from "lucide-react";

export default function CourseGrades({ courseId, isInstructor }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showGradeDialog, setShowGradeDialog] = useState(false);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample student submissions data - in production, fetch from API
  const submissions = [
    {
      id: 1,
      studentName: 'Alice Wilson',
      studentId: 'STU001',
      studentEmail: 'alice.wilson@student.hbiu.edu',
      assignment: 'Assignment 1: Introduction Essay',
      submittedDate: '2026-02-15',
      status: 'graded',
      grade: 'A',
      score: 95,
      maxScore: 100,
      feedback: 'Excellent work! Well-structured and thoroughly researched.'
    },
    {
      id: 2,
      studentName: 'Bob Martinez',
      studentId: 'STU002',
      studentEmail: 'bob.martinez@student.hbiu.edu',
      assignment: 'Assignment 1: Introduction Essay',
      submittedDate: '2026-02-16',
      status: 'pending',
      grade: null,
      score: null,
      maxScore: 100,
      feedback: null
    },
    {
      id: 3,
      studentName: 'Charlie Davis',
      studentId: 'STU003',
      studentEmail: 'charlie.davis@student.hbiu.edu',
      assignment: 'Quiz 1: Chapter 1-3',
      submittedDate: '2026-02-18',
      status: 'graded',
      grade: 'B+',
      score: 87,
      maxScore: 100,
      feedback: 'Good understanding of the material.'
    },
    {
      id: 4,
      studentName: 'Diana Smith',
      studentId: 'STU004',
      studentEmail: 'diana.smith@student.hbiu.edu',
      assignment: 'Assignment 1: Introduction Essay',
      submittedDate: '2026-02-14',
      status: 'graded',
      grade: 'A-',
      score: 92,
      maxScore: 100,
      feedback: 'Very good work with minor improvements needed.'
    },
    {
      id: 5,
      studentName: 'Eva Johnson',
      studentId: 'STU005',
      studentEmail: 'eva.johnson@student.hbiu.edu',
      assignment: 'Quiz 1: Chapter 1-3',
      submittedDate: '2026-02-20',
      status: 'pending',
      grade: null,
      score: null,
      maxScore: 100,
      feedback: null
    }
  ];

  const handleGradeSubmission = (submission) => {
    setSelectedStudent(submission);
    setGradeData({
      grade: submission.grade || '',
      feedback: submission.feedback || ''
    });
    setShowGradeDialog(true);
  };

  const handleSaveGrade = () => {
    console.log('Saving grade for:', selectedStudent.studentName, gradeData);
    alert(`✅ Grade saved for ${selectedStudent.studentName}`);
    setShowGradeDialog(false);
    setSelectedStudent(null);
  };

  const getStatusColor = (status) => {
    return status === 'graded' 
      ? 'bg-green-100 text-green-700 border-green-300' 
      : 'bg-yellow-100 text-yellow-700 border-yellow-300';
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-500';
    if (grade.startsWith('A')) return 'text-green-600 font-bold';
    if (grade.startsWith('B')) return 'text-blue-600 font-bold';
    if (grade.startsWith('C')) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.assignment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: submissions.length,
    graded: submissions.filter(s => s.status === 'graded').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    avgScore: Math.round(submissions.filter(s => s.score).reduce((sum, s) => sum + s.score, 0) / 
              submissions.filter(s => s.score).length)
  };

  if (isInstructor) {
    return (
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Graded</p>
                  <p className="text-2xl font-bold text-green-600">{stats.graded}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.avgScore}%</p>
                </div>
                <GraduationCap className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Student Submissions
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Grades
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by student name, ID, or assignment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === 'graded' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('graded')}
                >
                  Graded
                </Button>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Student</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Assignment</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Submitted</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Grade</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{submission.studentName}</p>
                          <p className="text-sm text-gray-500">{submission.studentId}</p>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-700">{submission.assignment}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(submission.submittedDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={getStatusColor(submission.status)}>
                          {submission.status === 'graded' ? (
                            <><CheckCircle2 className="w-3 h-3 mr-1" /> Graded</>
                          ) : (
                            <><Clock className="w-3 h-3 mr-1" /> Pending</>
                          )}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {submission.grade ? (
                          <div>
                            <span className={`text-lg ${getGradeColor(submission.grade)}`}>
                              {submission.grade}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({submission.score}/{submission.maxScore})
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not graded</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGradeSubmission(submission)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {submission.status === 'graded' ? 'Edit Grade' : 'Grade'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No submissions found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grade Dialog */}
        <Dialog open={showGradeDialog} onOpenChange={setShowGradeDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Grade Submission</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Student</p>
                  <p className="font-semibold">{selectedStudent.studentName} ({selectedStudent.studentId})</p>
                  <p className="text-sm text-gray-600 mt-2">Assignment</p>
                  <p className="font-medium">{selectedStudent.assignment}</p>
                  <p className="text-sm text-gray-600 mt-2">Submitted</p>
                  <p className="text-sm">{new Date(selectedStudent.submittedDate).toLocaleDateString()}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Grade</label>
                  <Input
                    placeholder="e.g., A, B+, 95"
                    value={gradeData.grade}
                    onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Feedback</label>
                  <Textarea
                    placeholder="Provide detailed feedback for the student..."
                    value={gradeData.feedback}
                    onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                    rows={6}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowGradeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveGrade} disabled={!gradeData.grade}>
                Save Grade
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Student view - show their own grades
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            My Grades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.slice(0, 3).map((submission) => (
              <div key={submission.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{submission.assignment}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
                    </p>
                    {submission.feedback && (
                      <p className="text-sm text-gray-700 mt-2 italic">"{submission.feedback}"</p>
                    )}
                  </div>
                  <div className="text-right">
                    {submission.grade ? (
                      <>
                        <div className={`text-2xl ${getGradeColor(submission.grade)}`}>
                          {submission.grade}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.score}/{submission.maxScore}
                        </div>
                      </>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}