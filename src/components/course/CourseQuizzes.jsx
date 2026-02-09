import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  HelpCircle, 
  Clock,
  Calendar,
  Edit,
  Trash2,
  ListOrdered,
  Award
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

export default function CourseQuizzes({ courseId, isInstructor }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: 10,
    time_limit: 30,
    due_date: '',
    published: true,
    questions: []
  });
  const queryClient = useQueryClient();

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes', courseId],
    queryFn: () => base44.entities.Quiz.filter({ course_id: courseId }),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Quiz.create({
      ...data,
      course_id: courseId
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', courseId] });
      setShowCreateDialog(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Quiz.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', courseId] });
      setEditingQuiz(null);
      setShowCreateDialog(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Quiz.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', courseId] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      points: 10,
      time_limit: 30,
      due_date: '',
      published: true,
      questions: []
    });
    setActiveTab('details');
  };

  const handleSubmit = () => {
    if (formData.questions.length === 0) {
      alert('Please add at least one question to the quiz.');
      return;
    }

    const totalQuestionPoints = formData.questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
    if (totalQuestionPoints !== formData.points) {
      if (!confirm(`Question points (${totalQuestionPoints}) don't match total points (${formData.points}). Continue anyway?`)) {
        return;
      }
    }

    if (editingQuiz) {
      updateMutation.mutate({ id: editingQuiz.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description || '',
      points: quiz.points,
      time_limit: quiz.time_limit,
      due_date: quiz.due_date || '',
      published: quiz.published,
      questions: quiz.questions || []
    });
    setShowCreateDialog(true);
  };

  const handleDelete = (quizId) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      deleteMutation.mutate(quizId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quizzes</h2>
        {isInstructor && (
          <Button onClick={() => {
            resetForm();
            setEditingQuiz(null);
            setShowCreateDialog(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <HelpCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h3>
            <p className="text-gray-500">
              {isInstructor ? 'Create quizzes to assess student knowledge' : 'No quizzes have been posted yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {quizzes.map(quiz => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{quiz.title}</h3>
                      {quiz.published ? (
                        <Badge className="bg-green-100 text-green-700">Published</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700">Draft</Badge>
                      )}
                      {quiz.questions && quiz.questions.length > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <ListOrdered className="w-3 h-3" />
                          {quiz.questions.length} questions
                        </Badge>
                      )}
                    </div>
                    {quiz.description && (
                      <p className="text-gray-600 text-sm mb-2">{quiz.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {quiz.points} points
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {quiz.time_limit} minutes
                      </div>
                      {quiz.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due {format(new Date(quiz.due_date), 'PPp')}
                        </div>
                      )}
                    </div>
                  </div>
                  {isInstructor && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(quiz)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(quiz.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              {!isInstructor && quiz.published && (
                <CardContent>
                  <Button className="w-full">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Take Quiz
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuiz ? 'Edit Quiz' : 'Create Quiz'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Quiz Details</TabsTrigger>
              <TabsTrigger value="questions">
                Questions {formData.questions.length > 0 && `(${formData.questions.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quiz Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Chapter 1 Quiz"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Quiz instructions..."
                  rows={3}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Points</label>
                  <Input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Limit (minutes)</label>
                  <Input
                    type="number"
                    value={formData.time_limit}
                    onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="datetime-local"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.published ? 'published' : 'draft'}
                    onValueChange={(value) => setFormData({ ...formData, published: value === 'published' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="py-4">
              <QuestionBuilder
                questions={formData.questions}
                onChange={(questions) => setFormData({ ...formData, questions })}
                totalPoints={formData.points}
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
              {editingQuiz ? 'Update' : 'Create'} Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}