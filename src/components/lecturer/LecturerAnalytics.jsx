import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Users, MessageSquare, BookOpen, AlertCircle } from "lucide-react";

export default function LecturerAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Mock analytics data
  const analyticsData = {
    studentEngagement: 1022,
    activeStudents: 0,
    participationRate: 0,
    discussionPosts: 4203,
    totalSubmissions: 0,
    submissionRate: 0
  };

  // Mock submission activity data (Last 7 Days)
  const submissionActivity = [
    { date: 'Jan 29', submissions: 0 },
    { date: 'Jan 30', submissions: 0 },
    { date: 'Jan 31', submissions: 0 },
    { date: 'Feb 1', submissions: 0 },
    { date: 'Feb 2', submissions: 0 },
    { date: 'Feb 3', submissions: 2 },
    { date: 'Feb 4', submissions: 1 }
  ];

  // Mock activity distribution data
  const activityDistribution = [
    { name: 'Discussions', value: 93, color: '#8B5CF6' },
    { name: 'Submissions', value: 0, color: '#EC4899' },
    { name: 'Replies', value: 7, color: '#3B82F6' }
  ];

  // Mock top discussion participants
  const topParticipants = [
    { name: 'info', posts: 1600 },
    { name: 'TBA', posts: 1000 },
    { name: 'system', posts: 200 },
    { name: 'aloysken987', posts: 100 },
    { name: 'student1', posts: 50 }
  ];

  // Mock engagement by course
  const engagementByCourse = [
    { courseCode: 'AGB 304', discussions: 5, submissions: 1 },
    { courseCode: 'HCA 207', discussions: 2, submissions: 2 },
    { courseCode: 'GEN 108', discussions: 5, submissions: 3 },
    { courseCode: 'HCA 205', discussions: 2, submissions: 1 },
    { courseCode: 'AGB 209', discussions: 1, submissions: 1 }
  ];

  // Chart dimensions
  const chartWidth = 600;
  const chartHeight = 300;

  // Calculate line chart points
  const maxSubmissions = Math.max(...submissionActivity.map(d => d.submissions), 4);
  const linePoints = submissionActivity.map((d, i) => ({
    x: (i / (submissionActivity.length - 1)) * (chartWidth - 60),
    y: chartHeight - 40 - ((d.submissions / maxSubmissions) * (chartHeight - 80)),
    label: d.date,
    value: d.submissions
  }));

  // Calculate pie chart
  const total = activityDistribution.reduce((sum, d) => sum + d.value, 100);
  let currentAngle = 0;
  const pieSlices = activityDistribution.map(d => {
    const sliceAngle = (d.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;
    return { ...d, startAngle, endAngle };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-500 mt-1">Comprehensive insights into student engagement, course effectiveness, and teaching performance</p>
        </div>
      </div>

      {/* Filter by Course */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <label className="text-sm font-semibold text-gray-700 block mb-3">Filter by Course</label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="agg304">AGB 304</SelectItem>
              <SelectItem value="hca207">HCA 207</SelectItem>
              <SelectItem value="gen108">GEN 108</SelectItem>
              <SelectItem value="hca205">HCA 205</SelectItem>
              <SelectItem value="agb209">AGB 209</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Student Engagement */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.studentEngagement}</p>
                <p className="text-sm text-gray-600 mt-1">Total Students</p>
              </div>
              <Users className="w-8 h-8 text-blue-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Active Students */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Active Students</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.activeStudents}</p>
                <p className="text-sm text-green-600 mt-1">{analyticsData.participationRate}% participation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Effectiveness */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.discussionPosts}</p>
                <p className="text-sm text-gray-600 mt-1">Discussion Posts</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        {/* Instructor Performance */}
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.totalSubmissions}</p>
                <p className="text-sm text-gray-600 mt-1">Total Submissions</p>
              </div>
              <BookOpen className="w-8 h-8 text-orange-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submission Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <svg width="100%" height="300" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="bg-white">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={`grid-h-${i}`}
                  x1="50"
                  y1={chartHeight - 40 - (i * (chartHeight - 80) / 4)}
                  x2={chartWidth - 10}
                  y2={chartHeight - 40 - (i * (chartHeight - 80) / 4)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              {/* Axes */}
              <line x1="50" y1="40" x2="50" y2={chartHeight - 40} stroke="#333" strokeWidth="2" />
              <line x1="50" y1={chartHeight - 40} x2={chartWidth - 10} y2={chartHeight - 40} stroke="#333" strokeWidth="2" />

              {/* Y-axis labels */}
              {[0, 1, 2, 3, 4].map((i) => (
                <text
                  key={`label-y-${i}`}
                  x="40"
                  y={chartHeight - 40 - (i * (chartHeight - 80) / 4) + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#666"
                >
                  {i}
                </text>
              ))}

              {/* Line chart */}
              <polyline
                points={linePoints.map(p => `${p.x + 50},${p.y}`).join(' ')}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
              />

              {/* Data points */}
              {linePoints.map((p, i) => (
                <circle key={`point-${i}`} cx={p.x + 50} cy={p.y} r="4" fill="#3B82F6" />
              ))}

              {/* X-axis labels */}
              {linePoints.map((p, i) => (
                <text
                  key={`label-x-${i}`}
                  x={p.x + 50}
                  y={chartHeight - 15}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  {p.label}
                </text>
              ))}

              {/* Legend */}
              <line x1="60" y1="20" x2="90" y2="20" stroke="#3B82F6" strokeWidth="2" />
              <text x="100" y="25" fontSize="12" fill="#333">Submissions</text>
            </svg>
          </CardContent>
        </Card>

        {/* Activity Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <svg width="280" height="280" viewBox="0 0 280 280" className="mx-auto">
              {/* Pie slices */}
              {pieSlices.map((slice, i) => {
                const startRad = (slice.startAngle * Math.PI) / 180;
                const endRad = (slice.endAngle * Math.PI) / 180;
                const x1 = 140 + 80 * Math.cos(startRad);
                const y1 = 140 + 80 * Math.sin(startRad);
                const x2 = 140 + 80 * Math.cos(endRad);
                const y2 = 140 + 80 * Math.sin(endRad);
                const largeArc = slice.endAngle - slice.startAngle > 180 ? 1 : 0;

                return (
                  <g key={`slice-${i}`}>
                    <path
                      d={`M 140 140 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={slice.color}
                      opacity="0.8"
                    />
                  </g>
                );
              })}

              {/* Center circle for donut effect */}
              <circle cx="140" cy="140" r="50" fill="white" />
            </svg>

            {/* Legend */}
            <div className="ml-6 space-y-2">
              {activityDistribution.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Discussion Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Discussion Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <svg width="100%" height="280" viewBox="0 0 500 280" className="bg-white">
              {/* Grid lines */}
              {[0, 400, 800, 1200, 1600].map((val, i) => (
                <line
                  key={`grid-${i}`}
                  x1="80"
                  y1={250 - (val / 1600) * 200}
                  x2="480"
                  y2={250 - (val / 1600) * 200}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              {/* Axes */}
              <line x1="80" y1="50" x2="80" y2="250" stroke="#333" strokeWidth="2" />
              <line x1="80" y1="250" x2="480" y2="250" stroke="#333" strokeWidth="2" />

              {/* Y-axis labels */}
              {[0, 400, 800, 1200, 1600].map((val, i) => (
                <text key={`label-${i}`} x="70" y={255 - (val / 1600) * 200} textAnchor="end" fontSize="12" fill="#666">
                  {val}
                </text>
              ))}

              {/* Bars */}
              {topParticipants.map((participant, i) => {
                const barWidth = 60;
                const spacing = 80;
                const x = 100 + i * spacing;
                const barHeight = (participant.posts / 1600) * 200;
                const y = 250 - barHeight;

                return (
                  <g key={`bar-${i}`}>
                    <rect x={x} y={y} width={barWidth} height={barHeight} fill="#8B5CF6" opacity="0.8" rx="2" />
                    <text x={x + barWidth / 2} y="270" textAnchor="middle" fontSize="12" fill="#333">
                      {participant.name}
                    </text>
                  </g>
                );
              })}

              {/* Legend */}
              <text x="120" y="30" fontSize="12" fill="#666">Posts</text>
            </svg>
          </CardContent>
        </Card>

        {/* Engagement by Course */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Engagement by Course</CardTitle>
          </CardHeader>
          <CardContent>
            <svg width="100%" height="280" viewBox="0 0 500 280" className="bg-white">
              {/* Grid lines */}
              {[0, 2, 4, 6, 8].map((val, i) => (
                <line
                  key={`grid-${i}`}
                  x1="80"
                  y1={250 - (val / 8) * 200}
                  x2="480"
                  y2={250 - (val / 8) * 200}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              {/* Axes */}
              <line x1="80" y1="50" x2="80" y2="250" stroke="#333" strokeWidth="2" />
              <line x1="80" y1="250" x2="480" y2="250" stroke="#333" strokeWidth="2" />

              {/* Y-axis labels */}
              {[0, 2, 4, 6, 8].map((val, i) => (
                <text key={`label-${i}`} x="70" y={255 - (val / 8) * 200} textAnchor="end" fontSize="12" fill="#666">
                  {val}
                </text>
              ))}

              {/* Grouped bars */}
              {engagementByCourse.map((course, i) => {
                const groupSpacing = 70;
                const barWidth = 25;
                const groupX = 100 + i * groupSpacing;

                return (
                  <g key={`course-${i}`}>
                    {/* Discussions bar */}
                    <rect
                      x={groupX - 15}
                      y={250 - (course.discussions / 8) * 200}
                      width={barWidth}
                      height={(course.discussions / 8) * 200}
                      fill="#3B82F6"
                      opacity="0.8"
                      rx="2"
                    />
                    {/* Submissions bar */}
                    <rect
                      x={groupX + 15}
                      y={250 - (course.submissions / 8) * 200}
                      width={barWidth}
                      height={(course.submissions / 8) * 200}
                      fill="#10B981"
                      opacity="0.8"
                      rx="2"
                    />
                    {/* Course label */}
                    <text x={groupX} y="270" textAnchor="middle" fontSize="12" fill="#333">
                      {course.courseCode}
                    </text>
                  </g>
                );
              })}

              {/* Legend */}
              <rect x="120" y="15" width="12" height="12" fill="#3B82F6" opacity="0.8" rx="2" />
              <text x="140" y="24" fontSize="12" fill="#333">Discussions</text>

              <rect x="270" y="15" width="12" height="12" fill="#10B981" opacity="0.8" rx="2" />
              <text x="290" y="24" fontSize="12" fill="#333">Submissions</text>
            </svg>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Insights */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <TrendingUp className="w-5 h-5" />
            Engagement Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">0% of students have been active in the last 30 days</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">Average of 3.8 discussion posts per student</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">0 assignments submitted across all courses</p>
            </div>

            {/* Alert Banner */}
            <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Alert:</strong> Less than 50% of students are currently active. Consider engagement strategies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
