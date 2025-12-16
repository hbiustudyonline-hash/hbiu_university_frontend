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
  ExternalLink
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

  const pendingSubmissions = submissions.filter(s => !s.score && s.status === 'submitted');
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Student Submissions</h2>
        <p className="text-gray-500 mt-1">Review and grade student work</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingSubmissions.length}</p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{gradedSubmissions.length}</p>
                <p className="text-sm text-gray-500">Graded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{submissions.length}</p>
                <p className="text-sm text-gray-500">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Submissions */}
      {pendingSubmissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Pending Grading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingSubmissions.map(submission => {
                const assignment = assignments.find(a => a.id === submission.assignment_id);
                const course = courses.find(c => c.id === assignment?.course_id);
                
                return (
                  <div key={submission.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-500" />
                          <h4 className="font-semibold">{submission.student_name}</h4>
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                            Pending
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{assignment?.title}</p>
                        <p className="text-xs text-gray-500">{course?.code} • {course?.title}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          <Award className="w-3 h-3 mr-1" />
                          {assignment?.points} pts
                        </Badge>
                        <p className="text-xs text-gray-500">
                          {format(new Date(submission.submitted_at), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    {submission.submission_text && (
                      <div className="mb-3 p-3 bg-white rounded border border-orange-100">
                        <p className="text-sm text-gray-700">{submission.submission_text}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {submission.file_url && (
                        <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download File
                          </Button>
                        </a>
                      )}
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setGradeData({ score: '', feedback: '' });
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Grade Submission
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Graded Submissions */}
      {gradedSubmissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Recently Graded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gradedSubmissions.slice(0, 10).map(submission => {
                const assignment = assignments.find(a => a.id === submission.assignment_id);
                const course = courses.find(c => c.id === assignment?.course_id);
                const percentage = ((submission.score / assignment?.points) * 100).toFixed(1);
                
                return (
                  <div key={submission.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-500" />
                          <h4 className="font-semibold">{submission.student_name}</h4>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Graded
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{assignment?.title}</p>
                        <p className="text-xs text-gray-500">{course?.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {submission.score}/{assignment?.points}
                        </p>
                        <p className="text-sm text-gray-500">{percentage}%</p>
                      </div>
                    </div>
                    {submission.feedback && (
                      <div className="mt-3 p-3 bg-white rounded border border-green-100">
                        <p className="text-xs text-gray-500 mb-1">Feedback:</p>
                        <p className="text-sm text-gray-700">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

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