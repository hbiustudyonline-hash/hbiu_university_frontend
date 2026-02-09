
import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Building2, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Mail,
  Phone,
  Users,
  BookOpen,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const DEFAULT_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e9169732a67849215a4ffc/842f33fc9_IMG-20250913-WA0054.jpg";

export default function AdminColleges({ colleges, courses }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    dean: '',
    description: '',
    phone: '',
    website: '',
    logo: DEFAULT_LOGO,
    cover_image: ''
  });
  
  const queryClient = useQueryClient();

  const createCollegeMutation = useMutation({
    mutationFn: (data) => base44.entities.College.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      setShowCreateDialog(false);
      resetForm();
    },
  });

  const updateCollegeMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.College.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      setEditingCollege(null);
      resetForm();
    },
  });

  const deleteCollegeMutation = useMutation({
    mutationFn: (id) => base44.entities.College.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      email: '',
      dean: '',
      description: '',
      phone: '',
      website: '',
      logo: DEFAULT_LOGO,
      cover_image: ''
    });
  };

  const handleEdit = (college) => {
    setEditingCollege(college);
    setFormData({
      name: college.name || '',
      slug: college.slug || '',
      email: college.email || '',
      dean: college.dean || '',
      description: college.description || '',
      phone: college.phone || '',
      website: college.website || '',
      logo: college.logo || DEFAULT_LOGO,
      cover_image: college.cover_image || ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCollege) {
      updateCollegeMutation.mutate({ id: editingCollege.id, data: formData });
    } else {
      createCollegeMutation.mutate(formData);
    }
  };

  const handleDelete = (collegeId) => {
    if (confirm('Are you sure you want to delete this college? This action cannot be undone.')) {
      deleteCollegeMutation.mutate(collegeId);
    }
  };

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCollegeCourseCount = (collegeId) => {
    return courses.filter(c => c.college_id === collegeId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">College Management</h2>
          <p className="text-gray-500 mt-1">Manage colleges, departments, and academic units</p>
        </div>
        <Button 
          onClick={() => {
            resetForm();
            setShowCreateDialog(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create College
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Colleges</p>
                <p className="text-3xl font-bold text-gray-900">{colleges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Courses/College</p>
                <p className="text-3xl font-bold text-gray-900">
                  {colleges.length > 0 ? Math.round(courses.length / colleges.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search colleges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Colleges Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map(college => {
          const courseCount = getCollegeCourseCount(college.id);
          const logoUrl = college.logo || DEFAULT_LOGO;
          
          return (
            <Card key={college.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md">
              <CardHeader className="bg-gradient-to-br from-gray-50 to-blue-50 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg p-1">
                    <img src={logoUrl} alt={college.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">
                      {college.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{college.email}</span>
                </div>
                {college.dean && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span>Dean: {college.dean}</span>
                  </div>
                )}
                {college.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{college.phone}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-100">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {courseCount} {courseCount === 1 ? 'Course' : 'Courses'}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link to={`${createPageUrl("CollegeDetail")}?id=${college.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(college)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(college.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || !!editingCollege} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setEditingCollege(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingCollege ? 'Edit College' : 'Create New College'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">College Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., HBIU Seminary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  required
                  placeholder="e.g., hbiu-seminary"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="college@hbi.edu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dean">Dean's Name</Label>
              <Input
                id="dean"
                value={formData.dean}
                onChange={(e) => setFormData({ ...formData, dean: e.target.value })}
                placeholder="Dr. John Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="College description..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://example.com/logo.jpg"
              />
              {formData.logo && (
                <div className="mt-2 p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Logo Preview:</p>
                  <img src={formData.logo} alt="Logo preview" className="w-20 h-20 object-contain" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input
                id="cover_image"
                type="url"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="https://example.com/cover-image.jpg"
              />
              <p className="text-xs text-gray-500">
                This image will be displayed as the background on the college card and detail page. Recommended size: 1200x800px
              </p>
              {formData.cover_image && (
                <div className="mt-2 p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Cover Image Preview:</p>
                  <img src={formData.cover_image} alt="Cover preview" className="w-full h-48 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingCollege(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createCollegeMutation.isPending || updateCollegeMutation.isPending}
              >
                {editingCollege ? 'Update College' : 'Create College'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
