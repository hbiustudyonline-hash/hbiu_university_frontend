
import React, { useState, useMemo } from 'react';
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

  const [programSearchQuery, setProgramSearchQuery] = useState('');
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const dropdownRef = React.useRef(null);

  // Filter degree programs based on selected level from the Program Catalog data
  const availableDegreePrograms = useMemo(() => {
    return allPrograms
      .filter(program => program.level === formData.program)
      .map(program => program.name)
      .sort();
  }, [formData.program]);

  // Get all unique colleges from the Program Catalog data
  const allCollegesFromPrograms = useMemo(() => {
    const uniqueColleges = [...new Set(allPrograms.map(p => p.college))];
    return uniqueColleges.sort().map((name, index) => ({
      id: name, // Use name as ID for now since we're not storing in DB
      name: name
    }));
  }, []);

  // Combine colleges from database and programs catalog (use programs as primary source)
  const combinedColleges = useMemo(() => {
    // If colleges from DB exist, merge them, otherwise use allCollegesFromPrograms
    if (colleges && colleges.length > 0) {
      // Get college names from DB
      const dbCollegeNames = new Set(Array.isArray(colleges) ? colleges.map(c => c.name) : []);
      // Get colleges only in programs but not in DB
      const additionalColleges = allCollegesFromPrograms.filter(c => !dbCollegeNames.has(c.name));
      // Combine and sort
      const merged = [...(Array.isArray(colleges) ? colleges : []), ...additionalColleges];
      return merged.sort((a, b) => a.name.localeCompare(b.name));
    }
    return allCollegesFromPrograms;
  }, [colleges, allCollegesFromPrograms]);

  // Filter programs based on search query
  const filteredPrograms = useMemo(() => {
    if (!programSearchQuery.trim()) {
      return availableDegreePrograms;
    }
    const query = programSearchQuery.toLowerCase();
    return availableDegreePrograms.filter(program =>
      program.toLowerCase().includes(query)
    );
  }, [availableDegreePrograms, programSearchQuery]);

  // Debug: Log colleges when dialog opens
  React.useEffect(() => {
    if (open) {
      console.log('CreateCourseDialog opened - DB Colleges:', colleges);
      console.log('CreateCourseDialog - Combined Colleges:', combinedColleges);
      console.log('Colleges count:', combinedColleges?.length || 0);
    }
  }, [open, colleges, combinedColleges]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProgramDropdown(false);
      }
    };

    if (showProgramDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProgramDropdown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('🎯 Form submission started');
    console.log('📋 Form data:', formData);
    
    // Validate degree program is selected
    if (!formData.degree_program) {
      alert('Please select a degree program');
      return;
    }
    
    // Validate college is selected
    if (!formData.college_id) {
      alert('Please select a college');
      return;
    }
    
    console.log('✅ Validation passed, calling onSubmit');
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
    setProgramSearchQuery(''); // Reset search when level changes
  };

  const handleCollegeChange = (collegeId) => {
    const college = combinedColleges?.find(c => String(c.id) === String(collegeId));
    setFormData(prev => ({
      ...prev,
      college_id: collegeId,
      college_name: college?.name || ''
    }));
  };

  const handleProgramSelect = (program) => {
    handleChange('degree_program', program);
    setProgramSearchQuery('');
    setShowProgramDropdown(false);
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
                  <SelectItem value="Certificate">Certificate</SelectItem>
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
            <Label htmlFor="degree_program">Degree Program * ({availableDegreePrograms.length} programs available)</Label>
            <div className="relative" ref={dropdownRef}>
              {/* Search Input */}
              <Input
                id="degree_program"
                placeholder={formData.degree_program || "Type to search degree programs..."}
                value={programSearchQuery}
                onChange={(e) => {
                  setProgramSearchQuery(e.target.value);
                  setShowProgramDropdown(true);
                }}
                onFocus={() => setShowProgramDropdown(true)}
                autoComplete="off"
              />
              
              {/* Selected Program Display */}
              {formData.degree_program && !showProgramDropdown && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-sm">
                  <span className="font-medium text-blue-900">Selected: </span>
                  <span className="text-blue-700">{formData.degree_program}</span>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('degree_program', '');
                      setProgramSearchQuery('');
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Dropdown List */}
              {showProgramDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
                  {filteredPrograms.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      {availableDegreePrograms.length === 0 
                        ? `No programs available for ${formData.program} level`
                        : 'No programs match your search'}
                    </div>
                  ) : (
                    <>
                      <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b sticky top-0">
                        {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} found
                      </div>
                      {filteredPrograms.map((program) => (
                        <button
                          key={program}
                          type="button"
                          onClick={() => handleProgramSelect(program)}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="text-sm text-gray-900">{program}</div>
                        </button>
                      ))}
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowProgramDropdown(false)}
                    className="w-full px-4 py-2 text-xs text-center text-gray-500 hover:bg-gray-50 border-t sticky bottom-0 bg-white"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">College/Department * ({combinedColleges?.length || 0} colleges available)</Label>
            <Select value={formData.college_id} onValueChange={handleCollegeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a college" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {!combinedColleges || combinedColleges.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500">No colleges available</div>
                ) : (
                  combinedColleges.map(college => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))
                )}
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
