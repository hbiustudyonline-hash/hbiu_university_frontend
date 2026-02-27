import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, Plus, FileText, Upload, Link as LinkIcon, Video, File } from "lucide-react";

export default function CoursePages({ courseId, isInstructor }) {
  const [pages, setPages] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [resourceType, setResourceType] = useState('file');
  const [pageData, setPageData] = useState({
    title: '',
    order: 0,
    content: '',
    resources: []
  });
  const [resourceData, setResourceData] = useState({
    type: 'file',
    name: '',
    url: ''
  });

  const handleCreatePage = () => {
    setPageData({ title: '', order: pages.length, content: '', resources: [] });
    setShowCreateDialog(true);
  };

  const handleAddResource = () => {
    setResourceData({ type: 'file', name: '', url: '' });
    setResourceType('file');
    setShowResourceDialog(true);
  };

  const handleSaveResource = () => {
    const newResource = {
      id: Date.now(),
      ...resourceData,
      type: resourceType
    };
    setPageData({
      ...pageData,
      resources: [...pageData.resources, newResource]
    });
    setShowResourceDialog(false);
    alert('✅ Resource added to page!');
  };

  const handleSavePage = () => {
    if (!pageData.title || !pageData.content) {
      alert('Please fill in the page title and content');
      return;
    }

    const newPage = {
      id: pages.length + 1,
      ...pageData,
      createdAt: new Date().toISOString()
    };
    setPages([...pages, newPage]);
    setShowCreateDialog(false);
    alert('✅ Page created successfully!');
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'file': return <Upload className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'link': return <LinkIcon className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Pages</h2>
        {isInstructor && (
          <Button onClick={handleCreatePage} className="bg-black hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            Create Page
          </Button>
        )}
      </div>

      {pages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <FileText className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {page.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {page.content}
                </p>
                {page.resources.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      {page.resources.length} resource(s)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <LayoutGrid className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pages yet</h3>
            <p className="text-gray-500">
              {isInstructor 
                ? 'Create custom pages for course content'
                : 'Course pages will appear here when they are published'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Page Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title *</label>
              <Input
                placeholder="Enter page title"
                value={pageData.title}
                onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Display Order</label>
              <Input
                type="number"
                value={pageData.order}
                onChange={(e) => setPageData({ ...pageData, order: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Page Content</label>
              <div className="border rounded-lg">
                <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
                  <Button variant="outline" size="sm" type="button">
                    <strong>B</strong>
                  </Button>
                  <Button variant="outline" size="sm" type="button">
                    <em>I</em>
                  </Button>
                  <Button variant="outline" size="sm" type="button">
                    <u>U</u>
                  </Button>
                  <Button variant="outline" size="sm" type="button">
                    <s>S</s>
                  </Button>
                  <div className="border-l h-6 mx-2"></div>
                  <Button variant="outline" size="sm" type="button">
                    List
                  </Button>
                  <Button variant="outline" size="sm" type="button">
                    Link
                  </Button>
                </div>
                <Textarea
                  className="min-h-[200px] border-0 focus-visible:ring-0"
                  placeholder="Enter page content..."
                  value={pageData.content}
                  onChange={(e) => setPageData({ ...pageData, content: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Page Resources</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddResource}
                  type="button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
              </div>
              {pageData.resources.length > 0 ? (
                <div className="space-y-2 border rounded-lg p-4">
                  {pageData.resources.map((resource, index) => (
                    <div key={resource.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <span className="text-sm">{resource.name || resource.url}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newResources = pageData.resources.filter((_, i) => i !== index);
                          setPageData({ ...pageData, resources: newResources });
                        }}
                        type="button"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <LayoutGrid className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No resources added yet</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePage}>
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Resource Dialog */}
      <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Resource Type *</label>
              <Select value={resourceType} onValueChange={setResourceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      File Upload
                    </div>
                  </SelectItem>
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
                  <SelectItem value="link">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      External Link
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {resourceType === 'file' && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
                <p className="text-xs text-gray-500 mt-2">or drag and drop</p>
              </div>
            )}

            {(resourceType === 'text' || resourceType === 'video' || resourceType === 'link') && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resource Name</label>
                  <Input
                    placeholder="Name of the resource"
                    value={resourceData.name}
                    onChange={(e) => setResourceData({ ...resourceData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    placeholder="https://example.com/resource"
                    value={resourceData.url}
                    onChange={(e) => setResourceData({ ...resourceData, url: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResourceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveResource}>
              Add Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}