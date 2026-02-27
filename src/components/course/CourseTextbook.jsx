import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BookOpen, Plus, ExternalLink, Edit, Trash2, FileText } from "lucide-react";

export default function CourseTextbook({ courseId, isInstructor }) {
  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'Foundations of Non-Profit and Community Development',
      description: 'Main course textbook covering all chapters',
      url: 'https://example.com/textbook.pdf',
      type: 'pdf'
    }
  ]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: ''
  });

  const handleAddResource = () => {
    setFormData({ title: '', description: '', url: '' });
    setEditingResource(null);
    setShowAddDialog(true);
  };

  const handleEditResource = (resource) => {
    setFormData({
      title: resource.title,
      description: resource.description,
      url: resource.url
    });
    setEditingResource(resource);
    setShowAddDialog(true);
  };

  const handleSaveResource = () => {
    if (!formData.title || !formData.url) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingResource) {
      setResources(resources.map(r => 
        r.id === editingResource.id 
          ? { ...r, ...formData }
          : r
      ));
      alert('✅ Resource updated successfully!');
    } else {
      const newResource = {
        id: resources.length + 1,
        ...formData,
        type: 'pdf'
      };
      setResources([...resources, newResource]);
      alert('✅ Resource added successfully!');
    }
    setShowAddDialog(false);
  };

  const handleDeleteResource = (id) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(r => r.id !== id));
      alert('✅ Resource deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Textbook & Resources</h2>
        {isInstructor && (
          <Button onClick={handleAddResource} className="bg-black hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        )}
      </div>

      {resources.length > 0 ? (
        <div className="space-y-4">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {resource.title}
                      </h3>
                      {resource.description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {resource.description}
                        </p>
                      )}
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Resource
                      </a>
                    </div>
                  </div>
                  {isInstructor && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditResource(resource)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteResource(resource.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No textbooks available yet</h3>
            <p className="text-gray-500">
              {isInstructor 
                ? 'Add textbooks and reading materials for students'
                : 'Required textbooks and recommended reading materials will appear here.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Resource Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingResource ? 'Edit Textbook Resource' : 'Add Textbook Resource'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Resource Title *</label>
              <Input
                placeholder="e.g., Course Textbook - Chapter 1-10"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                placeholder="Brief description of the resource..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">PDF URL / Link *</label>
              <Input
                placeholder="https://example.com/textbook.pdf"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
              <p className="text-xs text-gray-500">Enter the direct link to the PDF or web resource</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveResource}>
              {editingResource ? 'Update Resource' : 'Add Resource'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
