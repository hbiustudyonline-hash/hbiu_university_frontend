
import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Bot,
  Plus,
  Edit,
  Trash2,
  Upload,
  Sparkles,
  BookOpen,
  Loader2, // Added Loader2 for loading spinner
  Video // Added Video icon for live session
} from "lucide-react";

import AIInstructorVideoChat from "./AIInstructorVideoChat";

export default function AIInstructorPanel({ courseId, isInstructor }) {
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false); // Added state for file upload loading
  const [uploadingAvatar, setUploadingAvatar] = useState(false); // Added state for avatar upload loading
  const [formData, setFormData] = useState({
    name: '',
    title: 'Associate Professor',
    specialization: '',
    tone: 'balanced_hybrid',
    textbook_content: '',
    syllabus: '',
    course_weeks: 10,
    personality_traits: [],
    avatar_url: '' // Added avatar_url to formData
  });
  
  const queryClient = useQueryClient();

  const { data: aiInstructor } = useQuery({
    queryKey: ['ai-instructor', courseId],
    queryFn: async () => {
      const instructors = await base44.entities.AIInstructor.filter({ course_id: courseId });
      return instructors[0] || null;
    },
    enabled: !!courseId,
  });

  const createInstructorMutation = useMutation({
    mutationFn: (data) => base44.entities.AIInstructor.create({
      ...data,
      course_id: courseId,
      active: true
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-instructor', courseId] });
      setShowCreateDialog(false);
      resetForm();
    },
  });

  const updateInstructorMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AIInstructor.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-instructor', courseId] });
      setShowCreateDialog(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      title: 'Associate Professor',
      specialization: '',
      tone: 'balanced_hybrid',
      textbook_content: '',
      syllabus: '',
      course_weeks: 10,
      personality_traits: [],
      avatar_url: '' // Reset avatar_url
    });
  };

  const handleEdit = () => {
    setFormData({
      name: aiInstructor.name,
      title: aiInstructor.title || 'Associate Professor',
      specialization: aiInstructor.specialization || '',
      tone: aiInstructor.tone || 'balanced_hybrid',
      textbook_content: aiInstructor.textbook_content || '',
      syllabus: aiInstructor.syllabus || '',
      course_weeks: aiInstructor.course_weeks || 10,
      personality_traits: aiInstructor.personality_traits || [],
      avatar_url: aiInstructor.avatar_url || '' // Populate avatar_url for editing
    });
    setShowCreateDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (aiInstructor) {
      updateInstructorMutation.mutate({ id: aiInstructor.id, data: formData });
    } else {
      createInstructorMutation.mutate(formData);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('⚠️ File size exceeds 10MB limit.\n\nPlease either:\n1. Use a smaller PDF file\n2. Copy and paste the textbook content directly into the text area below');
      e.target.value = ''; // Reset file input
      return;
    }

    setUploadingFile(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Extract text from PDF
      const extractResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            full_text: { type: "string" }
          }
        }
      });

      if (extractResult.status === 'success') {
        setFormData(prev => ({ 
          ...prev, 
          textbook_content: extractResult.output.full_text,
          textbook_file_url: file_url
        }));
        alert('✅ Textbook uploaded and extracted successfully!');
      } else {
        alert('⚠️ Failed to extract text from PDF. Please copy and paste the content manually.');
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('⚠️ Error uploading file.\n\nPlease copy and paste the textbook content directly into the text area below instead.');
    } finally {
      setUploadingFile(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('⚠️ Please upload an image file (JPG, PNG, etc.)');
      e.target.value = '';
      return;
    }

    // Check file size (5MB limit for images)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('⚠️ Image size exceeds 5MB limit. Please use a smaller image.');
      e.target.value = '';
      return;
    }

    setUploadingAvatar(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ 
        ...prev, 
        avatar_url: file_url
      }));
      alert('✅ Avatar uploaded successfully!');
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('⚠️ Error uploading avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  if (!aiInstructor && !isInstructor) {
    return (
      <Card className="border-l-4 border-l-gray-300">
        <CardContent className="p-6 text-center">
          <Bot className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No AI instructor available for this course yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-l-4 border-l-purple-500 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-600" />
            AI Instructor
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aiInstructor ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                  {aiInstructor.avatar_url ? (
                    <img src={aiInstructor.avatar_url} alt={aiInstructor.name} className="w-full h-full object-cover" />
                  ) : (
                    <Bot className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{aiInstructor.name}</h3>
                  {aiInstructor.title && (
                    <p className="text-sm text-gray-600">{aiInstructor.title}</p>
                  )}
                  {aiInstructor.specialization && (
                    <p className="text-sm text-gray-500 mt-1">Specialization: {aiInstructor.specialization}</p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">What I Can Help You With:</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• 🎥 Live interactive video lessons</li>
                  <li>• 🗣️ Voice-enabled Q&A sessions (8 languages supported)</li>
                  <li>• 📚 Chapter summaries and explanations</li>
                  <li>• 📝 Homework guidance (step-by-step)</li>
                  <li>• 📊 Exam preparation and study strategies</li>
                  <li>• 💬 Thoughtful academic discussions</li>
                  <li>• 🌍 Multilingual support: English, Spanish, French, Chinese, Swahili, Arabic, German, Portuguese</li>
                </ul>
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    <strong>Full animated video with lip-sync available</strong> when D-ID API key is configured. Voice-only mode works without it.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowChatDialog(true)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Live Video Session
                </Button>
                {isInstructor && (
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ) : isInstructor ? (
            <div className="text-center py-6">
              <Bot className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No AI Instructor Yet</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create an AI teaching assistant with live video capabilities
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create AI Instructor
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Video Chat Dialog */}
      <AIInstructorVideoChat
        courseId={courseId}
        open={showChatDialog}
        onClose={() => setShowChatDialog(false)}
      />

      {/* Create/Edit Dialog */}
      {isInstructor && (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {aiInstructor ? 'Edit AI Instructor' : 'Create AI Instructor'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              {/* Avatar Upload Section */}
              <div className="space-y-2">
                <Label>Instructor Avatar *</Label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {formData.avatar_url ? (
                    <div className="relative">
                      <img 
                        src={formData.avatar_url} 
                        alt="Avatar preview" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => setFormData({ ...formData, avatar_url: '' })}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Bot className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2 w-full sm:w-auto">
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Instructor Photo
                      </h4>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                        disabled={uploadingAvatar}
                      />
                      <label htmlFor="avatar-upload" className="block">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full cursor-pointer" 
                          disabled={uploadingAvatar}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('avatar-upload').click();
                          }}
                        >
                          {uploadingAvatar ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Choose Avatar Image
                            </>
                          )}
                        </Button>
                      </label>
                      <p className="text-xs text-blue-700 mt-2">
                        📸 Upload a clear, front-facing photo (max 5MB). This will be animated for video lessons.
                      </p>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p className="font-semibold mb-1">Or paste image URL:</p>
                      <Input
                        placeholder="https://example.com/avatar.jpg"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Instructor Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Associate Prof. Dr. Ann Brown"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Academic Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Associate Professor"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Theology, Psychology, Business"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Teaching Tone *</Label>
                  <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal_academic">🎓 Formal Academic (Graduate-level)</SelectItem>
                      <SelectItem value="balanced_hybrid">⚖️ Balanced Hybrid (Professional + Accessible)</SelectItem>
                      <SelectItem value="accessible_friendly">😊 Accessible & Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course_weeks">Course Duration (Weeks)</Label>
                  <Input
                    id="course_weeks"
                    type="number"
                    min="1"
                    max="52"
                    value={formData.course_weeks}
                    onChange={(e) => setFormData({ ...formData, course_weeks: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>10-Week Textbook Content *</Label>
                
                {/* Prominent Text Paste Option */}
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <BookOpen className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900">📝 Recommended: Copy & Paste Textbook</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        For best results, open your textbook PDF and copy all content, then paste it below.
                      </p>
                    </div>
                  </div>
                  <Textarea
                    id="textbook"
                    placeholder="Paste your 10-week textbook content here (all chapters, including chapter titles, content, examples)..."
                    value={formData.textbook_content}
                    onChange={(e) => setFormData({ ...formData, textbook_content: e.target.value })}
                    rows={12}
                    className="font-mono text-sm"
                    required // Made textbook content required
                  />
                  <p className="text-xs text-blue-600 mt-2">
                    💡 Tip: Include chapter numbers, titles, and all learning content for accurate AI responses.
                  </p>
                </div>

                {/* Optional PDF Upload */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Alternative: Upload PDF (Optional)
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="textbook-upload"
                      disabled={uploadingFile}
                    />
                    <label htmlFor="textbook-upload" className="block">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="cursor-pointer w-full" 
                        disabled={uploadingFile}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('textbook-upload').click();
                        }}
                      >
                        <span>
                          {uploadingFile ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading & Extracting...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload PDF Textbook
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                    {formData.textbook_file_url && (
                      <div className="text-sm text-green-600 flex items-center gap-2 justify-center mt-2">
                        <BookOpen className="w-4 h-4" />
                        PDF uploaded and text extracted successfully
                      </div>
                    )}
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                      <p className="text-xs text-yellow-800">
                        ⚠️ <strong>File Size Limit: 10MB</strong><br/>
                        If your PDF is larger than 10MB, please copy and paste the content instead.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="syllabus">Course Syllabus (Optional)</Label>
                <Textarea
                  id="syllabus"
                  placeholder="Paste course syllabus: learning objectives, grading policy, weekly schedule..."
                  value={formData.syllabus}
                  onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Instructor Capabilities
                </h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>✓ Live video-style teaching with engagement cues</li>
                  <li>✓ Chapter-aware summaries and explanations</li>
                  <li>✓ Interactive discussions and Socratic questioning</li>
                  <li>✓ Homework walkthroughs (guidance, not direct answers)</li>
                  <li>✓ Exam preparation and study strategies</li>
                  <li>✓ 24/7 availability for student support</li>
                </ul>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={!formData.name || !formData.textbook_content || !formData.avatar_url || createInstructorMutation.isPending || updateInstructorMutation.isPending}
                >
                  {aiInstructor ? 'Update Instructor' : 'Create Instructor'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
