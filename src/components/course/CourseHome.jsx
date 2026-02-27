import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Users, Calendar, Target, Sparkles, Upload, Lock, Key, FileText, MessageSquare, ClipboardList, HelpCircle, GraduationCap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function CourseHome({ course, isInstructor }) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedSections, setSelectedSections] = useState({
    syllabus: false,
    modules: false,
    discussions: false,
    assignments: false,
    quizzes: false,
    finalExam: false,
  });

  const handlePasswordSubmit = () => {
    // Simple password check - you can enhance this
    if (password === 'admin123' || isInstructor) {
      setIsUnlocked(true);
      setShowPasswordDialog(false);
    } else {
      alert('Incorrect password');
    }
    setPassword('');
  };

  const handleSectionToggle = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleGenerateSections = () => {
    const selected = Object.keys(selectedSections).filter(key => selectedSections[key]);
    if (selected.length === 0) {
      alert('Please select at least one section to generate');
      return;
    }
    alert(`Generating: ${selected.join(', ')}`);
    // Add your generation logic here
  };

  return (
    <div className="space-y-6">
      {/* Selective AI Content Generator - Only for Instructors */}
      {isInstructor && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Selective AI Content Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Upload Textbook */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-gray-600" />
                <h3 className="font-semibold">Step 1: Upload Course Textbook (Optional)</h3>
              </div>
              <p className="text-sm text-gray-600">
                Upload your textbook to generate modules based on its content
              </p>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF Textbook
              </Button>
            </div>

            {/* Step 2: Select Sections */}
            <div className="space-y-3">
              <h3 className="font-semibold">Step 2: Select Sections to Generate</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Checkbox 
                    id="syllabus" 
                    checked={selectedSections.syllabus}
                    onCheckedChange={() => handleSectionToggle('syllabus')}
                  />
                  <label htmlFor="syllabus" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Course Syllabus</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Checkbox 
                    id="modules" 
                    checked={selectedSections.modules}
                    onCheckedChange={() => handleSectionToggle('modules')}
                  />
                  <label htmlFor="modules" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Course Modules/Chapters</span>
                    <span className="ml-auto text-sm text-blue-600">10 modules</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Checkbox 
                    id="discussions" 
                    checked={selectedSections.discussions}
                    onCheckedChange={() => handleSectionToggle('discussions')}
                  />
                  <label htmlFor="discussions" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Discussion Questions</span>
                    <span className="ml-auto text-sm text-blue-600">5 topics</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Checkbox 
                    id="assignments" 
                    checked={selectedSections.assignments}
                    onCheckedChange={() => handleSectionToggle('assignments')}
                  />
                  <label htmlFor="assignments" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <ClipboardList className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Assignments</span>
                    <span className="ml-auto text-sm text-blue-600">10 assignments</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Checkbox 
                    id="quizzes" 
                    checked={selectedSections.quizzes}
                    onCheckedChange={() => handleSectionToggle('quizzes')}
                  />
                  <label htmlFor="quizzes" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Quizzes</span>
                    <span className="ml-auto text-sm text-blue-600">10 quizzes</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Checkbox 
                    id="finalExam" 
                    checked={selectedSections.finalExam}
                    onCheckedChange={() => handleSectionToggle('finalExam')}
                  />
                  <label htmlFor="finalExam" className="flex items-center gap-2 flex-1 cursor-pointer">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Final Exam</span>
                    <span className="ml-auto text-sm text-blue-600">50 questions</span>
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleGenerateSections} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Selected Sections
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Content Enhancement Tools - Password Protected */}
      {isInstructor && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Content Enhancement Tools
              <Lock className="w-4 h-4 text-gray-400 ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isUnlocked ? (
              <div className="space-y-4">
                <p className="text-sm text-green-600 font-medium">✓ Tools Unlocked</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto py-3">
                    <div className="text-left">
                      <div className="font-semibold text-sm">Content Enhancer</div>
                      <div className="text-xs text-gray-500">Improve course materials</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-3">
                    <div className="text-left">
                      <div className="font-semibold text-sm">Quiz Generator</div>
                      <div className="text-xs text-gray-500">Create assessments</div>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Lock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Password Protected</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This tool requires a password to access. Please enter the password to continue.
                </p>
                <Button onClick={() => setShowPasswordDialog(true)}>
                  <Key className="w-4 h-4 mr-2" />
                  Enter Password
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Course Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Course Code</p>
                <p className="font-semibold">{course.code}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Program</p>
                <p className="font-semibold">{course.program || 'Bachelor'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Instructor</p>
                <p className="font-semibold">{course.instructor_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Semester</p>
                <p className="font-semibold">{course.semester}</p>
              </div>
            </div>
          </div>
          
          {course.description && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">About This Course</h3>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <h4 className="font-semibold text-blue-900 mb-1">View Modules</h4>
              <p className="text-sm text-blue-700">Access course content</p>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <h4 className="font-semibold text-blue-900 mb-1">Assignments</h4>
              <p className="text-sm text-blue-700">Submit your work</p>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <h4 className="font-semibold text-blue-900 mb-1">Grades</h4>
              <p className="text-sm text-blue-700">Check your progress</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              Please enter the password to access the AI Content Enhancement Tools.
            </p>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>
              <Key className="w-4 h-4 mr-2" />
              Unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}