import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Award, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Eye,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import DegreeCertificate from "./DegreeCertificate";

const ADMIN_PASSWORD = "1774";

export default function DegreeManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingDegree, setEditingDegree] = useState(null);
  const [viewingDegree, setViewingDegree] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [formData, setFormData] = useState({
    student_email: '',
    student_name: '',
    student_id: '',
    degree_title: '',
    minor: '',
    college_name: '',
    graduation_date: '',
    status: 'pending',
    access_password: '',
    chancellor_name: 'Dr. Kenneth Van Horn',
    president_name: 'Dr. Kenneth Van Horn',
    state: 'Florida',
    country: 'USA'
  });
  
  const queryClient = useQueryClient();

  const { data: degrees } = useQuery({
    queryKey: ['degrees'],
    queryFn: () => base44.entities.Degree.list('-graduation_date'),
    initialData: [],
  });

  const { data: users } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  const { data: colleges } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => base44.entities.College.list(),
    initialData: [],
  });

  const createDegreeMutation = useMutation({
    mutationFn: (data) => base44.entities.Degree.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['degrees'] });
      setShowCreateDialog(false);
      resetForm();
    },
  });

  const updateDegreeMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Degree.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['degrees'] });
      setEditingDegree(null);
      resetForm();
    },
  });

  const deleteDegreeMutation = useMutation({
    mutationFn: (id) => base44.entities.Degree.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['degrees'] });
    },
  });

  const resetForm = () => {
    setFormData({
      student_email: '',
      student_name: '',
      student_id: '',
      degree_title: '',
      minor: '',
      college_name: '',
      graduation_date: '',
      status: 'pending',
      access_password: '',
      chancellor_name: 'Dr. Kenneth Van Horn',
      president_name: 'Dr. Kenneth Van Horn',
      state: 'Florida',
      country: 'USA'
    });
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handlePasswordVerification = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      if (pendingAction.type === 'create') {
        setShowPasswordDialog(false);
        setPasswordInput('');
        setShowCreateDialog(true);
      } else if (pendingAction.type === 'edit') {
        setShowPasswordDialog(false);
        setPasswordInput('');
        handleEdit(pendingAction.degree);
      } else if (pendingAction.type === 'delete') {
        setShowPasswordDialog(false);
        setPasswordInput('');
        handleDelete(pendingAction.degreeId);
      } else if (pendingAction.type === 'view') {
        setShowPasswordDialog(false);
        setPasswordInput('');
        setViewingDegree(pendingAction.degree);
      }
      setPendingAction(null);
    } else {
      alert('Incorrect password. Access denied.');
      setPasswordInput('');
    }
  };

  const requestPassword = (action) => {
    setPendingAction(action);
    setShowPasswordDialog(true);
  };

  const handleEdit = (degree) => {
    setEditingDegree(degree);
    setFormData({
      student_email: degree.student_email || '',
      student_name: degree.student_name || '',
      student_id: degree.student_id || '',
      degree_title: degree.degree_title || '',
      minor: degree.minor || '',
      college_name: degree.college_name || '',
      graduation_date: degree.graduation_date || '',
      status: degree.status || 'pending',
      access_password: degree.access_password || '',
      chancellor_name: degree.chancellor_name || 'Dr. Kenneth Van Horn',
      president_name: degree.president_name || 'Dr. Kenneth Van Horn',
      state: degree.state || 'Florida',
      country: degree.country || 'USA'
    });
  };

  const handleDelete = async (degreeId) => {
    if (confirm('Are you sure you want to delete this degree? This action cannot be undone.')) {
      await deleteDegreeMutation.mutateAsync(degreeId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSubmit = { ...formData };
    if (!editingDegree && !dataToSubmit.access_password) {
      dataToSubmit.access_password = generatePassword();
    }
    
    if (editingDegree) {
      updateDegreeMutation.mutate({ id: editingDegree.id, data: dataToSubmit });
    } else {
      createDegreeMutation.mutate(dataToSubmit);
    }
  };

  const handleStudentChange = (email) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setFormData(prev => ({
        ...prev,
        student_email: email,
        student_name: user.full_name || '',
        student_id: user.student_id || '',
        degree_title: user.degree_program || '',
        college_name: user.college_name || ''
      }));
    }
  };

  const filteredDegrees = degrees.filter(degree =>
    degree.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    degree.student_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    degree.degree_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const students = users.filter(u => u.role === 'user');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Degree Management</h2>
          <p className="text-gray-500 mt-1">Create and manage student degrees</p>
        </div>
        <Button 
          onClick={() => requestPassword({ type: 'create' })}
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Degree
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Total Degrees</p>
            <p className="text-3xl font-bold text-gray-900">{degrees.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">
              {degrees.filter(d => d.status === 'approved').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Pending</p>
            <p className="text-3xl font-bold text-orange-600">
              {degrees.filter(d => d.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Revoked</p>
            <p className="text-3xl font-bold text-red-600">
              {degrees.filter(d => d.status === 'revoked').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by student name, email, or degree..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Degrees ({filteredDegrees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDegrees.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No degrees found</h3>
              <p className="text-gray-500">Create your first degree to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDegrees.map(degree => (
                <div key={degree.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{degree.student_name}</h3>
                        <Badge className={
                          degree.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                          degree.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        }>
                          {degree.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {degree.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {degree.status === 'revoked' && <XCircle className="w-3 h-3 mr-1" />}
                          {degree.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{degree.degree_title}</p>
                      {degree.minor && (
                        <p className="text-sm text-gray-500 mb-1">{degree.minor}</p>
                      )}
                      <p className="text-sm text-gray-500">{degree.college_name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{degree.student_email}</span>
                        <span>Graduated: {new Date(degree.graduation_date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Password: {degree.access_password}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => requestPassword({ type: 'view', degree })}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => requestPassword({ type: 'edit', degree })}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => requestPassword({ type: 'delete', degreeId: degree.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Authentication Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label htmlFor="admin-password">Enter Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordVerification()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPasswordDialog(false);
              setPasswordInput('');
              setPendingAction(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handlePasswordVerification}>
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateDialog || !!editingDegree} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setEditingDegree(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingDegree ? 'Edit Degree' : 'Create New Degree'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student *</Label>
              <Select 
                value={formData.student_email} 
                onValueChange={handleStudentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.email} value={student.email}>
                      {student.full_name} ({student.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student_name">Student Name *</Label>
                <Input
                  id="student_name"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_id">Student ID</Label>
                <Input
                  id="student_id"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree_title">Degree Title *</Label>
              <Input
                id="degree_title"
                value={formData.degree_title}
                onChange={(e) => setFormData({ ...formData, degree_title: e.target.value })}
                required
                placeholder="e.g., Bachelor of Science in Psychology"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minor">Minor</Label>
              <Input
                id="minor"
                value={formData.minor}
                onChange={(e) => setFormData({ ...formData, minor: e.target.value })}
                placeholder="e.g., Minor in Clinical Mental Health with faith-based Counseling"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">College *</Label>
              <Select 
                value={formData.college_name} 
                onValueChange={(value) => setFormData({ ...formData, college_name: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map(college => (
                    <SelectItem key={college.id} value={college.name}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graduation_date">Graduation Date *</Label>
                <Input
                  id="graduation_date"
                  type="date"
                  value={formData.graduation_date}
                  onChange={(e) => setFormData({ ...formData, graduation_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chancellor_name">Chancellor Name</Label>
                <Input
                  id="chancellor_name"
                  value={formData.chancellor_name}
                  onChange={(e) => setFormData({ ...formData, chancellor_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="president_name">President Name</Label>
                <Input
                  id="president_name"
                  value={formData.president_name}
                  onChange={(e) => setFormData({ ...formData, president_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="access_password">
                  Student Access Password 
                  {!editingDegree && !formData.access_password && (
                    <span className="text-xs text-gray-500 ml-2">(Auto-generated if left empty)</span>
                  )}
                </Label>
                <Input
                  id="access_password"
                  value={formData.access_password}
                  onChange={(e) => setFormData({ ...formData, access_password: e.target.value })}
                  placeholder="Leave empty to auto-generate"
                />
              </div>
              {!editingDegree && (
                <div className="flex items-end">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, access_password: generatePassword() })}
                    className="w-full"
                  >
                    Generate
                  </Button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingDegree(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createDegreeMutation.isPending || updateDegreeMutation.isPending}
              >
                {editingDegree ? 'Update Degree' : 'Create Degree'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {viewingDegree && (
        <Dialog open={!!viewingDegree} onOpenChange={() => setViewingDegree(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Degree Certificate - {viewingDegree.student_name}</DialogTitle>
            </DialogHeader>
            <DegreeCertificate degree={viewingDegree} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}