import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Plus, 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  Upload, 
  File, 
  Download, 
  Edit, 
  Trash2, 
  X,
  Video,
  FileText,
  FolderOpen
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function CourseModules({ courseId, isInstructor }) {
  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    content_type: 'text',
    text_content: '',
    video_url: '',
    files: [] 
  });
  const [openModules, setOpenModules] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const queryClient = useQueryClient();

  const { data: modules, isLoading } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      const result = await base44.entities.Module.filter({ course_id: courseId });
      return result.sort((a, b) => a.order - b.order);
    },
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Module.create({
      ...data,
      course_id: courseId,
      order: modules.length + 1
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
      setFormData({ 
        title: '', 
        description: '', 
        content_type: 'text',
        text_content: '',
        video_url: '',
        files: [] 
      });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Module.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
      setEditingModule(null);
      setFormData({ 
        title: '', 
        description: '', 
        content_type: 'text',
        text_content: '',
        video_url: '',
        files: [] 
      });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Module.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
    },
  });

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploadingFiles(true);
    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const { file_url } = await base44.integrations.Core.UploadFile({ file });
          return {
            name: file.name,
            url: file_url,
            type: file.type,
            size: file.size
          };
        })
      );

      setFormData(prev => ({
        ...prev,
        files: [...(prev.files || []), ...uploadedFiles]
      }));
    } catch (error) {
      alert('Error uploading files. Please try again.');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (editingModule) {
      updateMutation.mutate({
        id: editingModule.id,
        data: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (module) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description || '',
      content_type: module.content_type || 'text',
      text_content: module.text_content || '',
      video_url: module.video_url || '',
      files: module.files || []
    });
    setShowForm(true);
  };

  const handleDelete = (moduleId) => {
    if (confirm('Are you sure you want to delete this module?')) {
      deleteMutation.mutate(moduleId);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    
    return url;
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'text': return FileText;
      case 'files': return FolderOpen;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Modules</h2>
        {isInstructor && (
          <Button onClick={() => {
            setEditingModule(null);
            setFormData({ 
              title: '', 
              description: '', 
              content_type: 'text',
              text_content: '',
              video_url: '',
              files: [] 
            });
            setShowForm(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            New Module
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : modules.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No modules yet</h3>
            <p className="text-gray-500">
              {isInstructor ? 'Create your first module to organize course content' : 'The instructor hasn\'t added any modules yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {modules.map((module, index) => {
            const ContentIcon = getContentIcon(module.content_type);
            
            return (
              <Collapsible
                key={module.id}
                open={openModules[module.id]}
                onOpenChange={(open) => setOpenModules({ ...openModules, [module.id]: open })}
              >
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardContent className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        {openModules[module.id] ? (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold">
                              Module {index + 1}: {module.title}
                            </h3>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <ContentIcon className="w-3 h-3" />
                              {module.content_type === 'text' && 'Text'}
                              {module.content_type === 'video' && 'Video'}
                              {module.content_type === 'files' && 'Files'}
                            </Badge>
                          </div>
                          {module.description && (
                            <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                          )}
                          {module.content_type === 'files' && module.files && module.files.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <File className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-blue-600">{module.files.length} file(s)</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {isInstructor && (
                        <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(module);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(module.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-6 pb-6 pl-16 border-t">
                      <div className="mt-4">
                        {/* Text Content */}
                        {module.content_type === 'text' && module.text_content && (
                          <div 
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: module.text_content }}
                          />
                        )}

                        {/* Video Content */}
                        {module.content_type === 'video' && module.video_url && (
                          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                            <iframe
                              src={getVideoEmbedUrl(module.video_url)}
                              className="w-full h-full"
                              allowFullScreen
                              title={module.title}
                            />
                          </div>
                        )}

                        {/* Files Content */}
                        {module.content_type === 'files' && module.files && module.files.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700 mb-3">Module Resources:</h4>
                            {module.files.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <File className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                  </div>
                                </div>
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </Button>
                                </a>
                              </div>
                            ))}
                          </div>
                        )}

                        {!module.text_content && !module.video_url && (!module.files || module.files.length === 0) && (
                          <p className="text-gray-600">No content available for this module yet.</p>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingModule ? 'Edit Module' : 'Create New Module'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Module Title</label>
              <Input
                placeholder="e.g., Introduction to Programming"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                placeholder="Module overview and learning objectives..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            {/* Content Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <Select
                value={formData.content_type}
                onValueChange={(value) => setFormData({ ...formData, content_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Text/Article
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video
                    </div>
                  </SelectItem>
                  <SelectItem value="files">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      File Resources
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Text Content Editor */}
            {formData.content_type === 'text' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Module Content</label>
                <ReactQuill
                  value={formData.text_content}
                  onChange={(value) => setFormData({ ...formData, text_content: value })}
                  theme="snow"
                  className="min-h-[300px] bg-white"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                />
              </div>
            )}

            {/* Video URL Input */}
            {formData.content_type === 'video' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Video URL</label>
                <Input
                  placeholder="YouTube or Vimeo URL (e.g., https://www.youtube.com/watch?v=...)"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Supported: YouTube, Vimeo. Paste the full video URL.
                </p>
                {formData.video_url && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <iframe
                        src={getVideoEmbedUrl(formData.video_url)}
                        className="w-full h-full"
                        allowFullScreen
                        title="Video preview"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* File Upload Section */}
            {formData.content_type === 'files' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Module Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload lecture notes, PDFs, presentations, or other resources
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="module-file-upload"
                    disabled={uploadingFiles}
                  />
                  <label htmlFor="module-file-upload">
                    <Button type="button" variant="outline" disabled={uploadingFiles} asChild>
                      <span>
                        {uploadingFiles ? 'Uploading...' : 'Choose Files'}
                      </span>
                    </Button>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {formData.files && formData.files.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium">Uploaded Files:</p>
                    {formData.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.title || createMutation.isPending || updateMutation.isPending}
            >
              {editingModule ? 'Update Module' : 'Create Module'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}