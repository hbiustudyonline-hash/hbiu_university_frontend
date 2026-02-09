import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Search, Download } from "lucide-react";

export default function LecturerOralExams() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Mock oral exam submissions data
  const oralExams = [
    {
      id: 1,
      studentName: 'Gbenga Adeboye',
      studentEmail: 'gbenjoworld@gmail.com',
      courseCode: 'GEN 101',
      courseName: 'English Composition I',
      date: 'Jan 6, 2026',
      score: 65,
      avatar: 'G'
    },
    {
      id: 2,
      studentName: 'Musa Kefas',
      studentEmail: 'musafask19@gmail.com',
      courseCode: 'GEN 104',
      courseName: 'Introduction to Computers',
      date: 'Jan 5, 2026',
      score: 55,
      avatar: 'M'
    },
    {
      id: 3,
      studentName: 'Musa Kefas',
      studentEmail: 'musafask19@gmail.com',
      courseCode: 'CS101',
      courseName: 'Introduction to Computer...',
      date: 'Jan 5, 2026',
      score: 55,
      avatar: 'M'
    },
    {
      id: 4,
      studentName: 'Musa Kefas',
      studentEmail: 'musafask19@gmail.com',
      courseCode: 'GEN 101',
      courseName: 'English Composition I',
      date: 'Jan 5, 2026',
      score: 55,
      avatar: 'M'
    },
    {
      id: 5,
      studentName: 'Musa Kefas',
      studentEmail: 'musafask19@gmail.com',
      courseCode: 'GEN 106',
      courseName: 'GEN 106 Public Speaking...',
      date: 'Jan 5, 2026',
      score: 65,
      avatar: 'M'
    },
    {
      id: 6,
      studentName: 'oyebefunpeace1',
      studentEmail: 'oyebefunpeace1@gmail.com',
      courseCode: 'GEN 106',
      courseName: 'GEN 106 Public Speaking...',
      date: 'Jan 2, 2026',
      score: 25,
      avatar: 'O'
    },
    {
      id: 7,
      studentName: 'obiohachukwudi86',
      studentEmail: 'obiohachukwudi86@gmail.com',
      courseCode: 'INTRO101',
      courseName: 'Introduction to Agricultura...',
      date: 'Dec 31, 2025',
      score: 10,
      avatar: 'O'
    },
    {
      id: 8,
      studentName: 'Osife Victoria',
      studentEmail: 'osifevictoria.com',
      courseCode: 'MAT 110',
      courseName: 'Collage Algebra',
      date: 'Dec 27, 2025',
      score: 68,
      avatar: 'O'
    },
    {
      id: 9,
      studentName: 'robertakena567',
      studentEmail: 'robertakena567@gmail.com',
      courseCode: 'MADC500',
      courseName: 'Principles of Spiritual For...',
      date: 'Dec 26, 2025',
      score: 65,
      avatar: 'R'
    }
  ];

  // Filter exams based on search
  const filteredExams = oralExams.filter(exam =>
    (exam.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     exam.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
     exam.courseCode.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCourse === 'all' || exam.courseCode === selectedCourse)
  );

  // Calculate stats
  const totalExams = oralExams.length;
  const averageScore = (oralExams.reduce((sum, exam) => sum + exam.score, 0) / totalExams).toFixed(1);
  const uniqueStudents = new Set(oralExams.map(exam => exam.studentEmail)).size;

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Get avatar color
  const getAvatarColor = (initial) => {
    const colors = {
      'G': 'bg-blue-500',
      'M': 'bg-purple-500',
      'O': 'bg-orange-500',
      'R': 'bg-pink-500'
    };
    return colors[initial] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Oral Exam Submissions</h2>
          <p className="text-gray-500 mt-1">Review AI-graded oral exams across your courses</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search student or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="GEN 101">GEN 101</SelectItem>
              <SelectItem value="GEN 104">GEN 104</SelectItem>
              <SelectItem value="CS101">CS101</SelectItem>
              <SelectItem value="GEN 106">GEN 106</SelectItem>
              <SelectItem value="INTRO101">INTRO101</SelectItem>
              <SelectItem value="MAT 110">MAT 110</SelectItem>
              <SelectItem value="MADC500">MADC500</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{totalExams}</p>
                <p className="text-sm text-gray-600 mt-1">Total Exams Completed</p>
              </div>
              <Mic className="w-8 h-8 text-blue-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{averageScore}%</p>
                <p className="text-sm text-gray-600 mt-1">Average Score</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{uniqueStudents}</p>
                <p className="text-sm text-gray-600 mt-1">Unique Students</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">👤</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredExams.length === 0 ? (
            <div className="text-center py-12">
              <Mic className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No exams found</h3>
              <p className="text-gray-500">No oral exam submissions match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Student</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Course</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Score</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((exam) => (
                    <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(exam.avatar)}`}>
                            {exam.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{exam.studentName}</p>
                            <p className="text-xs text-gray-600">{exam.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{exam.courseCode}</p>
                          <p className="text-sm text-gray-600">{exam.courseName}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-700">{exam.date}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${getScoreColor(exam.score)} font-semibold`}>
                          {exam.score}%
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download className="w-4 h-4" />
                          Transcript
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
