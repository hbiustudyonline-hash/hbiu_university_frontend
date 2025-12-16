
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEGREE_PROGRAMS = {
  Associate: [
    "Associate of Arts in Theology",
    "Associate of Arts in Biblical Studies",
    "Associate of Arts in Christian Ministry",
    "Associate of Arts in Clinical Mental Health Counseling",
    "Associate of Science in Business Administration",
    "Associate of Arts in Leadership & Cultural Management"
  ],
  Bachelor: [
    "Bachelor of Arts in Theology",
    "Bachelor of Arts in Biblical Studies",
    "Bachelor of Arts in Christian Ministry",
    "Bachelor of Science in Psychology",
    "Bachelor of Science in Business Administration",
    "Bachelor of Science in Nursing",
    "Bachelor of Arts in Education",
    "Bachelor of Science in Computer Science",
    "Bachelor of Arts in Communication"
  ],
  Master: [
    "Master of Divinity",
    "Master of Arts in Theology",
    "Master of Arts in Christian Counseling",
    "Master of Arts in Ministry Leadership",
    "Master of Business Administration",
    "Master of Science in Nursing",
    "Master of Education",
    "Master of Public Health",
    "Master of Science in Clinical Mental Health Counseling"
  ],
  Doctorate: [
    "Doctor of Ministry",
    "Doctor of Theology",
    "Doctor of Education",
    "Doctor of Business Administration",
    "Doctor of Nursing Practice"
  ],
  PhD: [
    "PhD in Theology",
    "PhD in Biblical Studies",
    "PhD in Ministry",
    "PhD in Psychology",
    "PhD in Education",
    "PhD in Business Administration",
    "Ph.D. in Psychology, Minor in Clinical Chaplaincy Psychotherapy"
  ]
};

export default function CreateCourseDialog({ open, onClose, onSubmit, isLoading, lecturers, colleges, isAdmin }) {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    program: 'Bachelor',
    degree_program: '',
    semester: '',
    credits: 3,
    enrollment_limit: 30,
    instructor: '',
    instructor_name: '',
    college_id: '',
    college_name: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProgramChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      program: value,
      degree_program: '' // Reset degree program when level changes
    }));
  };

  const handleCollegeChange = (collegeId) => {
    const college = colleges?.find(c => c.id === collegeId);
    setFormData(prev => ({
      ...prev,
      college_id: collegeId,
      college_name: college?.name || ''
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                placeholder="e.g., CS101"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Program Level *</Label>
              <Select value={formData.program} onValueChange={handleProgramChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Associate">Associate</SelectItem>
                  <SelectItem value="Bachelor">Bachelor</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Doctorate">Doctorate</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="degree_program">Degree Program *</Label>
            <Select value={formData.degree_program} onValueChange={(value) => handleChange('degree_program', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a degree program" />
              </SelectTrigger>
              <SelectContent>
                {DEGREE_PROGRAMS[formData.program].map(program => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">College/Department *</Label>
            <Select value={formData.college_id} onValueChange={handleCollegeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a college" />
              </SelectTrigger>
              <SelectContent>
                {colleges?.map(college => (
                  <SelectItem key={college.id} value={college.id}>
                    {college.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAdmin && lecturers && (
            <div className="space-y-2">
              <Label htmlFor="instructor">Assign Lecturer *</Label>
              <Select
                value={formData.instructor}
                onValueChange={(value) => {
                  const lecturer = lecturers.find(l => l.email === value);
                  handleChange('instructor', value);
                  handleChange('instructor_name', lecturer?.full_name || '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a lecturer" />
                </SelectTrigger>
                <SelectContent>
                  {lecturers.map(lecturer => (
                    <SelectItem key={lecturer.email} value={lecturer.email}>
                      {lecturer.full_name} ({lecturer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Introduction to Computer Science"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Course description..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Input
                id="semester"
                placeholder="e.g., Fall 2024"
                value={formData.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="10"
                value={formData.credits}
                onChange={(e) => handleChange('credits', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollment_limit">Enrollment Limit</Label>
              <Input
                id="enrollment_limit"
                type="number"
                min="1"
                value={formData.enrollment_limit}
                onChange={(e) => handleChange('enrollment_limit', parseInt(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
