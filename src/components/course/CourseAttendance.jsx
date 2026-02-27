import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar, Check, X, Clock, Users, TrendingUp } from "lucide-react";

export default function CourseAttendance({ courseId, isInstructor }) {
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('');
  const [studentAttendance, setStudentAttendance] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', status: null },
    { id: 2, name: 'Mary Johnson', email: 'mary@example.com', status: null },
    { id: 3, name: 'Robert Brown', email: 'robert@example.com', status: null },
    { id: 4, name: 'Patricia Davis', email: 'patricia@example.com', status: null },
    { id: 5, name: 'Michael Wilson', email: 'michael@example.com', status: null },
  ]);
  
  const [attendanceRecords] = useState([
    { id: 1, date: '2024-02-20', topic: 'Introduction to Course', status: 'present', duration: '90 min' },
    { id: 2, date: '2024-02-22', topic: 'Chapter 1: Basics', status: 'present', duration: '90 min' },
    { id: 3, date: '2024-02-24', topic: 'Chapter 2: Advanced Concepts', status: 'absent', duration: '90 min' },
    { id: 4, date: '2024-02-26', topic: 'Lab Session 1', status: 'present', duration: '120 min' },
    { id: 5, date: '2024-02-27', topic: 'Midterm Review', status: 'late', duration: '90 min' },
  ]);

  const handleOpenAttendanceDialog = () => {
    setSessionTopic('');
    setStudentAttendance(studentAttendance.map(s => ({ ...s, status: null })));
    setShowAttendanceDialog(true);
  };

  const handleMarkAttendance = (studentId, status) => {
    setStudentAttendance(studentAttendance.map(s => 
      s.id === studentId ? { ...s, status } : s
    ));
  };

  const handleMarkAllPresent = () => {
    setStudentAttendance(studentAttendance.map(s => ({ ...s, status: 'present' })));
  };

  const handleSaveAttendance = () => {
    if (!sessionTopic) {
      alert('Please enter a session topic');
      return;
    }

    const unmarked = studentAttendance.filter(s => !s.status);
    if (unmarked.length > 0) {
      const confirm = window.confirm(
        `${unmarked.length} student(s) are not marked. They will be marked as absent. Continue?`
      );
      if (!confirm) return;
    }

    alert('✅ Attendance saved successfully!');
    setShowAttendanceDialog(false);
  };

  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
  };

  const attendanceRate = ((stats.present + stats.late * 0.5) / stats.total * 100).toFixed(1);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return (
          <Badge className="bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Present
          </Badge>
        );
      case 'absent':
        return (
          <Badge className="bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        );
      case 'late':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Late
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isInstructor) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Attendance Tracking</h2>
          <Button onClick={handleOpenAttendanceDialog} className="bg-black hover:bg-gray-800">
            <Users className="w-4 h-4 mr-2" />
            Take Attendance
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                </div>
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                </div>
                <X className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{attendanceRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Student attendance records will appear here</p>
              <Button className="mt-4" variant="outline">
                View All Students
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Take Attendance Dialog */}
        <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Take Attendance - {new Date().toLocaleDateString()}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Topic *</label>
                <Input
                  placeholder="e.g., Chapter 3: Advanced Topics"
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm font-medium">Mark Student Attendance</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllPresent}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark All Present
                </Button>
              </div>

              <div className="space-y-2">
                {studentAttendance.map((student) => (
                  <Card key={student.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={student.status === 'present' ? 'default' : 'outline'}
                            onClick={() => handleMarkAttendance(student.id, 'present')}
                            className={student.status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === 'late' ? 'default' : 'outline'}
                            onClick={() => handleMarkAttendance(student.id, 'late')}
                            className={student.status === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Late
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === 'absent' ? 'default' : 'outline'}
                            onClick={() => handleMarkAttendance(student.id, 'absent')}
                            className={student.status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Absent
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {studentAttendance.filter(s => s.status === 'present').length}
                    </p>
                    <p className="text-sm text-gray-600">Present</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {studentAttendance.filter(s => s.status === 'late').length}
                    </p>
                    <p className="text-sm text-gray-600">Late</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {studentAttendance.filter(s => s.status === 'absent').length}
                    </p>
                    <p className="text-sm text-gray-600">Absent</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAttendanceDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAttendance} className="bg-black hover:bg-gray-800">
                Save Attendance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Student view
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Attendance</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
              <X className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rate</p>
                <p className="text-2xl font-bold text-blue-600">{attendanceRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">{record.topic}</p>
                    <p className="text-sm text-gray-500">
                      {record.date} • {record.duration}
                    </p>
                  </div>
                </div>
                {getStatusBadge(record.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}