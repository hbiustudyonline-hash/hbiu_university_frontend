import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File, Upload, Download, Trash2, FileText, FileImage, FileVideo, Folder } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function CourseFiles({ courseId, isInstructor }) {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'Syllabus.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'Dr. John Smith',
      uploadedAt: '2024-01-15',
      url: '#'
    },
    {
      id: 2,
      name: 'Week 1 Lecture Slides.pptx',
      type: 'presentation',
      size: '5.1 MB',
      uploadedBy: 'Dr. John Smith',
      uploadedAt: '2024-01-16',
      url: '#'
    }
  ]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        const newFile = {
          id: files.length + 1,
          name: selectedFile.name,
          type: getFileType(selectedFile.name),
          size: formatFileSize(selectedFile.size),
          uploadedBy: 'You',
          uploadedAt: new Date().toISOString().split('T')[0],
          url: '#'
        };
        setFiles([...files, newFile]);
        setShowUploadDialog(false);
        setSelectedFile(null);
        setUploadProgress(0);
        alert('✅ File uploaded successfully!');
      }
    }, 200);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setFiles(files.filter(f => f.id !== id));
      alert('✅ File deleted successfully!');
    }
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'document';
    if (['ppt', 'pptx'].includes(ext)) return 'presentation';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (['mp4', 'avi', 'mov'].includes(ext)) return 'video';
    return 'file';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-600" />;
      case 'document': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'presentation': return <FileText className="w-5 h-5 text-orange-600" />;
      case 'image': return <FileImage className="w-5 h-5 text-green-600" />;
      case 'video': return <FileVideo className="w-5 h-5 text-purple-600" />;
      default: return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Files</h2>
        {isInstructor && (
          <Button onClick={() => setShowUploadDialog(true)} className="bg-black hover:bg-gray-800">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        )}
      </div>

      {files.length > 0 ? (
        <div className="space-y-3">
          {files.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-gray-100 rounded">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{file.name}</h3>
                      <p className="text-sm text-gray-500">
                        {file.size} • Uploaded by {file.uploadedBy} on {file.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={file.url} download>
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                    {isInstructor && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Folder className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No files yet</h3>
            <p className="text-gray-500">
              {isInstructor ? 'Upload course materials and resources' : 'Course files will appear here'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              {selectedFile ? (
                <div>
                  <File className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  {uploadProgress > 0 && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{uploadProgress}% uploaded</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-4">Select a file to upload</p>
                  <Input
                    type="file"
                    onChange={handleFileSelect}
                    className="mx-auto max-w-xs"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowUploadDialog(false);
              setSelectedFile(null);
              setUploadProgress(0);
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || uploadProgress > 0}>
              {uploadProgress > 0 ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}