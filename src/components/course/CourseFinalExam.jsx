import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Clock,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  Users,
  ListOrdered
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import QuestionBuilder from "./QuestionBuilder";

export default function CourseFinalExam({ courseId, isInstructor }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    title: 'Final Examination',
    description: '',
    total_points: 100,
    duration_minutes: 120,
    exam_date: '',
    passing_score: 60,
    allowed_attempts: 1,
    status: 'draft',
    questions: []
  });
  const queryClient = useQueryClient();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: finalExams, isLoading } = useQuery({
    queryKey: ['final-exams', courseId],
    queryFn: () => base44.entities.FinalExam.filter({ course_id: courseId }),
    initialData: [],
  });

  const { data: submissions } = useQuery({
    queryKey: ['final-exam-submissions', courseId],
    queryFn: async () => {
      if (finalExams.length === 0) return [];
      const examIds = finalExams.map(e => e.id);
      const allSubmissions = await base44.entities.FinalExamSubmission.list();
      return allSubmissions.filter(s => examIds.includes(s.exam_id));
    },
    enabled: finalExams.length > 0,
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FinalExam.create({
      ...data,
      course_id: courseId
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['final-exams', courseId] });
      setShowCreateDialog(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FinalExam.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['final-exams', courseId] });
      setEditingExam(null);
      resetForm();
      setShowCreateDialog(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FinalExam.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['final-exams', courseId] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: 'Final Examination',
      description: '',
      total_points: 100,
      duration_minutes: 120,
      exam_date: '',
      passing_score: 60,
      allowed_attempts: 1,
      status: 'draft',
      questions: []
    });
    setActiveTab('details');
  };

  const handleSubmit = () => {
    if (formData.questions.length === 0) {
      alert('Please add at least one question to the exam.');
      return;
    }

    const totalQuestionPoints = formData.questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
    if (totalQuestionPoints !== formData.total_points) {
      if (!confirm(`Question points (${totalQuestionPoints}) don't match total points (${formData.total_points}). Continue anyway?`)) {
        return;
      }
    }

    if (editingExam) {
      updateMutation.mutate({ id: editingExam.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description || '',
      total_points: exam.total_points,
      duration_minutes: exam.duration_minutes,
      exam_date: exam.exam_date || '',
      passing_score: exam.passing_score || 60,
      allowed_attempts: exam.allowed_attempts || 1,
      status: exam.status,
      questions: exam.questions || []
    });
    setShowCreateDialog(true);
  };

  const handleDelete = (examId) => {
    if (confirm('Are you sure you want to delete this final exam? This action cannot be undone.')) {
      deleteMutation.mutate(examId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const mySubmission = submissions.find(s => s.student_email === user?.email);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Final Exam</h2>
          <p className="text-gray-500 mt-1">Comprehensive course assessment</p>
        </div>
        {isInstructor && (
          <Button onClick={() => {
            resetForm();
            setEditingExam(null);
            setShowCreateDialog(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Final Exam
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : finalExams.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No final exam yet</h3>
            <p className="text-gray-500">
              {isInstructor ? 'Create a final exam to assess student learning' : 'The final exam hasn\'t been created yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {finalExams.map(exam => {
            const examSubmissions = submissions.filter(s => s.exam_id === exam.id);
            const gradedSubmissions = examSubmissions.filter(s => s.status === 'graded');
            const averageScore = gradedSubmissions.length > 0
              ? (gradedSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / gradedSubmissions.length).toFixed(1)
              : 0;

            return (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{exam.title}</h3>
                        <Badge className={getStatusColor(exam.status)}>
                          {exam.status}
                        </Badge>
                        {exam.questions && exam.questions.length > 0 && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <ListOrdered className="w-3 h-3" />
                            {exam.questions.length} questions
                          </Badge>
                        )}
                      </div>
                      {exam.description && (
                        <p className="text-gray-600 mb-3">{exam.description}</p>
                      )}
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          Duration: {exam.duration_minutes} minutes
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="w-4 h-4" />
                          Total Points: {exam.total_points}
                        </div>
                        {exam.exam_date && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(exam.exam_date), 'PPp')}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <AlertCircle className="w-4 h-4" />
                          Passing Score: {exam.passing_score}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isInstructor ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{examSubmissions.length}</p>
                          <p className="text-sm text-gray-500">Total Submissions</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{gradedSubmissions.length}</p>
                          <p className="text-sm text-gray-500">Graded</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{averageScore}%</p>
                          <p className="text-sm text-gray-500">Average Score</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(exam)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Exam
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4 mr-2" />
                          View Submissions ({examSubmissions.length})
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(exam.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mySubmission ? (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-blue-900">Your Submission</h4>
                            <Badge className="bg-blue-100 text-blue-700">
                              {mySubmission.status}
                            </Badge>
                          </div>
                          {mySubmission.status === 'graded' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Score:</span>
                                <span className="text-lg font-bold text-blue-600">
                                  {mySubmission.score}/{exam.total_points} ({mySubmission.percentage}%)
                                </span>
                              </div>
                              {mySubmission.feedback && (
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">Feedback:</p>
                                  <p className="text-sm text-gray-700">{mySubmission.feedback}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : exam.status === 'published' ? (
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                          <FileText className="w-4 h-4 mr-2" />
                          Start Final Exam
                        </Button>
                      ) : (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                          <AlertCircle className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
                          <p className="text-sm text-yellow-800">Final exam not yet available</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExam ? 'Edit Final Exam' : 'Create Final Exam'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Exam Details</TabsTrigger>
              <TabsTrigger value="questions">
                Questions {formData.questions.length > 0 && `(${formData.questions.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Exam Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Final Examination"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Exam instructions and details..."
                  rows={3}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Points</label>
                  <Input
                    type="number"
                    value={formData.total_points}
                    onChange={(e) => setFormData({ ...formData, total_points: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Passing Score (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Allowed Attempts</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.allowed_attempts}
                    onChange={(e) => setFormData({ ...formData, allowed_attempts: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exam Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.exam_date}
                    onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="py-4">
              <QuestionBuilder
                questions={formData.questions}
                onChange={(questions) => setFormData({ ...formData, questions })}
                totalPoints={formData.total_points}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.title || createMutation.isPending || updateMutation.isPending}
            >
              {editingExam ? 'Update' : 'Create'} Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}