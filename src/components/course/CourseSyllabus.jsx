
import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FileText, Edit, Save, Upload, Download, File, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CourseSyllabus({ course, isInstructor }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(course.syllabus || '');
  const [syllabusFile, setSyllabusFile] = useState(course.syllabus_file || null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Course.update(course.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', course.id] });
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ 
      syllabus: content,
      syllabus_file: syllabusFile 
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('⚠️ File size exceeds 10MB limit.\n\nPlease use a smaller file or add syllabus content in the text editor below.');
      event.target.value = ''; // Clear the input field
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setSyllabusFile({
        name: file.name,
        url: file_url,
        size: file.size,
        type: file.type
      });
    } catch (error) {
      alert('Error uploading file. Please try again or add content in the text editor.');
    } finally {
      setUploading(false);
      event.target.value = ''; // Clear the input field regardless of success/failure
    }
  };

  const handleRemoveFile = () => {
    setSyllabusFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Syllabus</h2>
        {isInstructor && (
          <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        )}
      </div>

      {/* Syllabus File Upload Section */}
      {isEditing && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Upload Syllabus Document
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a PDF or Word document of your syllabus (optional, max 10MB)
            </p>
            
            {syllabusFile ? (
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <File className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{syllabusFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(syllabusFile.size)}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleRemoveFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="syllabus-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="syllabus-upload">
                    <Button type="button" variant="outline" disabled={uploading} asChild>
                      <span>
                        {uploading ? 'Uploading...' : 'Choose File'}
                      </span>
                    </Button>
                  </label>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-xs text-yellow-800">
                    ⚠️ <strong>File Size Limit: 10MB</strong><br/>
                    Files larger than 10MB cannot be uploaded. Use the text editor below instead.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Display Uploaded Syllabus File */}
      {!isEditing && course.syllabus_file && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Syllabus Document</h3>
                  <p className="text-sm text-gray-600">{course.syllabus_file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(course.syllabus_file.size)}</p>
                </div>
              </div>
              <a href={course.syllabus_file.url} target="_blank" rel="noopener noreferrer">
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Content Section */}
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isEditing ? (
            <ReactQuill
              value={content}
              onChange={setContent}
              theme="snow"
              className="min-h-[400px]"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link'],
                  ['clean']
                ],
              }}
            />
          ) : content ? (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No syllabus content yet</h3>
              <p className="text-gray-500">
                {isInstructor ? 'Click Edit to add the course syllabus information' : 'The instructor hasn\'t added syllabus content yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
