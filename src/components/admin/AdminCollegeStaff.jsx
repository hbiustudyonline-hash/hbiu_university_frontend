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
  Users, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Mail,
  Phone,
  Upload
} from "lucide-react";

const POSITIONS = [
  "Dean of College",
  "Department Chair",
  "Program Director",
  "Academic Advisor",
  "Counselor",
  "Administrator",
  "Student Counsel",
  "Student Support",
  "Administrative Support Professional",
  "Research & Lab Staff",
  "Media Staff"
];

export default function AdminCollegeStaff({ staff, colleges }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    college_id: '',
    college_name: '',
    name: '',
    position: '',
    email: '',
    phone: '',
    photo: '',
    job_description: '',
    office_hours: '',
    office_location: '',
    available_for_appointments: true
  });
  
  const queryClient = useQueryClient();

  const createStaffMutation = useMutation({
    mutationFn: (data) => base44.entities.CollegeStaff.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['college-staff'] });
      setShowCreateDialog(false);
      resetForm();
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CollegeStaff.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['college-staff'] });
      setEditingStaff(null);
      resetForm();
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (id) => base44.entities.CollegeStaff.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['college-staff'] });
    },
  });

  const resetForm = () => {
    setFormData({
      college_id: '',
      college_name: '',
      name: '',
      position: '',
      email: '',
      phone: '',
      photo: '',
      job_description: '',
      office_hours: '',
      office_location: '',
      available_for_appointments: true
    });
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      college_id: staffMember.college_id || '',
      college_name: staffMember.college_name || '',
      name: staffMember.name || '',
      position: staffMember.position || '',
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      photo: staffMember.photo || '',
      job_description: staffMember.job_description || '',
      office_hours: staffMember.office_hours || '',
      office_location: staffMember.office_location || '',
      available_for_appointments: staffMember.available_for_appointments !== false
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaffMutation.mutate({ id: editingStaff.id, data: formData });
    } else {
      createStaffMutation.mutate(formData);
    }
  };

  const handleDelete = (staffId) => {
    if (confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      deleteStaffMutation.mutate(staffId);
    }
  };

  const handleCollegeChange = (collegeId) => {
    const college = colleges.find(c => c.id === collegeId);
    setFormData(prev => ({
      ...prev,
      college_id: collegeId,
      college_name: college?.name || ''
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, photo: file_url }));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.college_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">College Staff Management</h2>
          <p className="text-gray-500 mt-1">Manage administrative and support staff for all colleges</p>
        </div>
        <Button 
          onClick={() => {
            resetForm();
            setShowCreateDialog(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900">{staff.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available for Appointments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {staff.filter(s => s.available_for_appointments).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Unique Positions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(staff.map(s => s.position)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Colleges Staffed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(staff.map(s => s.college_id)).size}
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
          placeholder="Search staff members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Staff Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map(member => (
          <Card key={member.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md">
            <CardHeader className="p-0">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {member.photo ? (
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500">
                    <Users className="w-16 h-16 text-white/50" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.college_name}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {member.position}
              </Badge>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(member)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(member.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || !!editingStaff} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setEditingStaff(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="college">College *</Label>
              <Select value={formData.college_id} onValueChange={handleCollegeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map(college => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Dr. John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Select 
                  value={formData.position} 
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map(position => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  placeholder="john.smith@hbi.edu"
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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="office_location">Office Location</Label>
                <Input
                  id="office_location"
                  value={formData.office_location}
                  onChange={(e) => setFormData({ ...formData, office_location: e.target.value })}
                  placeholder="Building A, Room 101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="office_hours">Office Hours</Label>
                <Input
                  id="office_hours"
                  value={formData.office_hours}
                  onChange={(e) => setFormData({ ...formData, office_hours: e.target.value })}
                  placeholder="Mon-Fri 9:00 AM - 5:00 PM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="photo"
                  type="url"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload').click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              {formData.photo && (
                <div className="mt-2">
                  <img src={formData.photo} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_description">Job Description</Label>
              <Textarea
                id="job_description"
                value={formData.job_description}
                onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                rows={4}
                placeholder="Describe responsibilities and duties..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available_for_appointments}
                onChange={(e) => setFormData({ ...formData, available_for_appointments: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="available" className="cursor-pointer">
                Available for appointment requests
              </Label>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingStaff(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createStaffMutation.isPending || updateStaffMutation.isPending}
              >
                {editingStaff ? 'Update Staff Member' : 'Add Staff Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}