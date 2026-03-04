import React, { useState, useEffect, useMemo } from 'react';
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
import { allPrograms } from "@/data/degreePrograms";

export default function EditCourseDialog({ open, onClose, onSubmit, course, isLoading, lecturers, colleges, isAdmin }) {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    program: 'Bachelor',
    degree_program: '',
    semester: '',
    credits: 3,
    enrollment_limit: 30,
    status: 'draft',
    instructor: '',
    instructor_name: '',
    college_id: '',
    college_name: ''
  });

  // Filter degree programs based on selected level from the Program Catalog data
  const availableDegreePrograms = useMemo(() => {
    console.log('🔍 Filtering programs for level:', formData.program);
    const filtered = allPrograms
      .filter(program => program.level === formData.program)
      .map(program => program.name)
      .sort();
    console.log(`✅ Found ${filtered.length} programs for ${formData.program} level`);
    return filtered;
  }, [formData.program]);

  // Get all unique colleges from the Program Catalog data
  const allCollegesFromPrograms = useMemo(() => {
    const uniqueColleges = [...new Set(allPrograms.map(p => p.college))];
    return uniqueColleges.sort().map((name, index) => ({
      id: name, // Use name as ID for now since we're not storing in DB
      name: name
    }));
  }, []);

  // ALWAYS show all colleges from Program Catalog (37+ colleges)
  const combinedColleges = useMemo(() => {
    console.log('📊 Combined colleges count:', allCollegesFromPrograms.length);
    return allCollegesFromPrograms;
  }, [allCollegesFromPrograms]);

  useEffect(() => {
    if (course) {
      setFormData({
        code: course.code || '',
        title: course.title || '',
        description: course.description || '',
        program: course.program || 'Bachelor',
        degree_program: course.degree_program || '',
        semester: course.semester || '',
        credits: course.credits || 3,
        enrollment_limit: course.enrollment_limit || 30,
        status: course.status || 'draft',
        instructor: course.instructor || '',
        instructor_name: course.instructor_name || '',
        college_id: course.college_id || '',
        college_name: course.college_name || ''
      });
    }
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProgramLevelChange = (value) => {
    console.log('📚 Program level changed to:', value);
    setFormData(prev => ({ 
      ...prev, 
      program: value,
      degree_program: '' // Reset degree program when level changes
    }));
  };

  const handleCollegeChange = (collegeId) => {
    const college = combinedColleges?.find(c => String(c.id) === String(collegeId));
    console.log('🏫 Selected college:', college);
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
          <DialogTitle className="text-2xl">Edit Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Program Level *</Label>
              <Select value={formData.program} onValueChange={handleProgramLevelChange}>
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
              <SelectContent className="max-h-[300px]">
                {availableDegreePrograms.map(program => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">College/Department * ({combinedColleges.length} colleges available)</Label>
            <Select value={formData.college_id} onValueChange={handleCollegeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a college" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {combinedColleges?.map(college => (
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
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
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

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}