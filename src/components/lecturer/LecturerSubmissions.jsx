import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
  User,
  ExternalLink,
  Zap,
  Edit2
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function LecturerSubmissions({ submissions, assignments, courses }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ score: '', feedback: '' });
  const queryClient = useQueryClient();

  const gradeMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Submission.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-submissions'] });
      setSelectedSubmission(null);
      setGradeData({ score: '', feedback: '' });
    },
  });

  const handleGradeSubmission = () => {
    gradeMutation.mutate({
      id: selectedSubmission.id,
      data: {
        score: parseFloat(gradeData.score),
        feedback: gradeData.feedback,
        status: 'graded',
        graded_at: new Date().toISOString()
      }
    });
  };

  const pendingSubmissions = submissions.filter(s => !s.grade && s.status === 'submitted');
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');
  const quizzesToReview = submissions.filter(s => s.status === 'submitted' && s.type === 'quiz').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Student Submissions</h2>
        <p className="text-gray-500 mt-1">Review and grade student work</p>
      </div>

      {/* Stat Cards - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Pending Assignments */}
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{pendingSubmissions.length}</p>
                <p className="text-sm text-gray-600 mt-1">Pending Assignments</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Quizzes to Review */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{quizzesToReview}</p>
                <p className="text-sm text-gray-600 mt-1">Quizzes to Review</p>
              </div>
              <AlertCircle className="w-8 h-8 text-purple-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Graded */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{gradedSubmissions.length}</p>
                <p className="text-sm text-gray-600 mt-1">Graded</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Total Submissions */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{submissions.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total Submissions</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Assignment Grading */}
      {pendingSubmissions.length > 0 && (
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <CardTitle>Pending Assignment Grading</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {pendingSubmissions.map((submission, idx) => {
                const assignment = assignments.find(a => a.id === submission.assignment_id);
                const course = courses.find(c => c.id === assignment?.course_id);
                
                return (
                  <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">
                              {submission.student_email?.split('@')[0].toUpperCase() || 'Student'}
                            </h4>
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                              Pending
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge variant="outline" className="font-semibold">
                          {submission.grade || 0} pts
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(submission.submitted_at), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>

                    {/* Assignment details */}
                    <div className="mb-4">
                      <p className="font-medium text-gray-900 mb-1">{assignment?.title}</p>
                      <p className="text-sm text-gray-600">
                        {course?.code} • {course?.name}
                      </p>
                    </div>

                    {/* Submission content */}
                    {submission.content && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700">{submission.content}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {submission.file_url && (
                        <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download File
                          </Button>
                        </a>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="gap-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                      >
                        <Zap className="w-4 h-4" />
                        AI Grade
                      </Button>
                      <Button 
                        size="sm"
                        className="gap-2 bg-black text-white hover:bg-gray-900"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setGradeData({ score: '', feedback: '' });
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                        Grade Manually
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Graded Submissions - Hidden for now, can be shown in a separate tab */}
      {/* Kept for future implementation if needed */}

      {/* No submissions */}
      {submissions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-500">Student submissions will appear here</p>
          </CardContent>
        </Card>
      )}

      {/* Grade Dialog */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Grade Submission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Student</p>
                <p className="font-semibold">{selectedSubmission.student_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Assignment</p>
                <p className="font-semibold">
                  {assignments.find(a => a.id === selectedSubmission.assignment_id)?.title}
                </p>
              </div>
              {selectedSubmission.submission_text && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Submission</p>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm">{selectedSubmission.submission_text}</p>
                  </div>
                </div>
              )}
              {selectedSubmission.file_url && (
                <div>
                  <a href={selectedSubmission.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Attached File
                    </Button>
                  </a>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Score (out of {assignments.find(a => a.id === selectedSubmission.assignment_id)?.points})
                </label>
                <Input
                  type="number"
                  min="0"
                  max={assignments.find(a => a.id === selectedSubmission.assignment_id)?.points}
                  value={gradeData.score}
                  onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                  placeholder="Enter score"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Feedback</label>
                <Textarea
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                  placeholder="Provide feedback to the student..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGradeSubmission}
                disabled={!gradeData.score || gradeMutation.isPending}
              >
                {gradeMutation.isPending ? 'Submitting...' : 'Submit Grade'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}