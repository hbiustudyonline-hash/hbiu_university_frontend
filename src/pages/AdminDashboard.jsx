import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Layout from "@/Layout";
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Settings,
  BarChart3,
  Shield,
  Activity,
  Building2,
  CheckCircle,
  Clock,
  Lock,
  UserCog,
  FileText,
  Award,
  Layers,
  Zap,
  UserCheck,
  ClipboardCheck,
  FileSearch
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminColleges from "@/components/admin/AdminColleges";
import AdminUsers from "@/components/admin/AdminUsers";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch real data from the backend
  const { data: colleges = [] } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => base44.entities.College.list(),
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => base44.entities.Course.list(),
  });

  // Fetch all users for user management
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => base44.entities.User.list(),
  });

  // Transform backend user data to match AdminUsers component expectations
  const allUsers = (usersData || []).map(user => ({
    ...user,
    full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    // Map backend roles to component roles
    role: user.role === 'student' ? 'user' : user.role === 'lecturer' ? 'admin' : user.role
  }));

  // Mock data for demonstration
  const mockStats = {
    totalStudents: 3118,
    totalLecturers: 121,
    totalCourses: courses.length || 5000,
    totalColleges: colleges.length || 35,
    activeEnrollments: 4988,
    pendingApplications: 23
  };

  const recentActivity = [
    { id: 1, type: 'enrollment', message: '15 new student enrollments today', time: '2 hours ago' },
    { id: 2, type: 'course', message: 'New course "Advanced Chemistry" created', time: '4 hours ago' },
    { id: 3, type: 'college', message: 'Pine Valley College staff updated', time: '6 hours ago' },
    { id: 4, type: 'user', message: '5 new lecturer accounts activated', time: '1 day ago' },
  ];

  return (
    <Layout currentPageName="AdminDashboard">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -ml-24 -mb-24" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Administration Dashboard
                </h1>
                <p className="text-blue-100 text-lg">
                  System Management & Control
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Total Students</p>
                <p className="text-3xl font-bold text-white">{mockStats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Lecturers</p>
                <p className="text-3xl font-bold text-white">{mockStats.totalLecturers.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Courses</p>
                <p className="text-3xl font-bold text-white">{mockStats.totalCourses.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Enrollments</p>
                <p className="text-3xl font-bold text-white">{mockStats.activeEnrollments.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="bg-white shadow-md rounded-xl p-3 mb-6">
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
              {/* Row 1 */}
              <button onClick={() => setActiveTab('overview')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <Activity className="w-4 h-4" />
                <span>Overview</span>
              </button>
              <button onClick={() => setActiveTab('colleges')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'colleges' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <Building2 className="w-4 h-4" />
                <span>Colleges</span>
              </button>
              <button onClick={() => setActiveTab('passwords')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'passwords' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <Lock className="w-4 h-4" />
                <span>Passwords</span>
              </button>
              <button onClick={() => setActiveTab('staff')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'staff' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <UserCog className="w-4 h-4" />
                <span>Staff</span>
              </button>
              <button onClick={() => setActiveTab('users')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <Users className="w-4 h-4" />
                <span>Users</span>
              </button>
              <button onClick={() => setActiveTab('courses')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'courses' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <BookOpen className="w-4 h-4" />
                <span>Courses</span>
              </button>
              <button onClick={() => setActiveTab('grades')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'grades' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <FileText className="w-4 h-4" />
                <span>Grades</span>
              </button>
              
              {/* Row 2 */}
              <button onClick={() => setActiveTab('analytics')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
              <button onClick={() => setActiveTab('degrees')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'degrees' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <GraduationCap className="w-4 h-4" />
                <span>Degrees</span>
              </button>
              <button onClick={() => setActiveTab('programs')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'programs' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <Layers className="w-4 h-4" />
                <span>Programs</span>
              </button>
              <button onClick={() => setActiveTab('bulkgen')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'bulkgen' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <Zap className="w-4 h-4" />
                <span>Bulk Gen</span>
              </button>
              <button onClick={() => setActiveTab('roles')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'roles' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <UserCheck className="w-4 h-4" />
                <span>Roles</span>
              </button>
              <button onClick={() => setActiveTab('assign')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'assign' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <ClipboardCheck className="w-4 h-4" />
                <span>Assign</span>
              </button>
              <button onClick={() => setActiveTab('audit')} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${activeTab === 'audit' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <FileSearch className="w-4 h-4" />
                <span>Audit</span>
              </button>
            </div>
          </div>

          <TabsContent value="overview" className="mt-6">
            {/* Main Stats Grid - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold">{mockStats.totalStudents.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+12% from last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Lecturers</p>
                      <p className="text-2xl font-bold">{mockStats.totalLecturers}</p>
                      <p className="text-xs text-green-600">+3 new this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Published Courses</p>
                      <p className="text-2xl font-bold">{mockStats.totalCourses.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">5000 total courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Enrollments</p>
                      <p className="text-2xl font-bold">{mockStats.activeEnrollments.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">0 completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <Clock className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending Grading</p>
                      <p className="text-2xl font-bold">2953</p>
                      <p className="text-xs text-red-600">Needs attention</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold">0%</p>
                      <p className="text-xs text-gray-500">Overall performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Users className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="text-sm font-medium">Manage Users</div>
                    <div className="text-xs text-gray-600">View and edit users</div>
                  </button>
                  
                  <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <BookOpen className="w-5 h-5 text-green-600 mb-2" />
                    <div className="text-sm font-medium">Course Management</div>
                    <div className="text-xs text-gray-600">Manage courses</div>
                  </button>

                  <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Building2 className="w-5 h-5 text-purple-600 mb-2" />
                    <div className="text-sm font-medium">Colleges</div>
                    <div className="text-xs text-gray-600">College administration</div>
                  </button>

                  <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <BarChart3 className="w-5 h-5 text-orange-600 mb-2" />
                    <div className="text-sm font-medium">Analytics</div>
                    <div className="text-xs text-gray-600">View reports</div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">Database</div>
                      <div className="text-xs text-gray-600">Operational</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">API Services</div>
                      <div className="text-xs text-gray-600">Operational</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="text-sm font-medium">Scheduled Maintenance</div>
                      <div className="text-xs text-gray-600">Sunday 2:00 AM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colleges" className="mt-6">
            <AdminColleges colleges={colleges} courses={courses} />
          </TabsContent>

          <TabsContent value="passwords" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Reset and manage user passwords.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Manage {mockStats.totalLecturers} lecturers and staff members.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            {usersLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-4 text-gray-500">Loading users...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <AdminUsers users={allUsers} />
            )}
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Manage {mockStats.totalCourses.toLocaleString()} courses across all programs.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Grades Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">View and manage student grades and transcripts.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Analytics and reporting functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="degrees" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Degree Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Manage degree programs and requirements.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Program Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Manage academic programs and curricula.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulkgen" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Bulk generate users, courses, and other resources.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Manage user roles and permissions.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assign" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Assign courses, lectures, and resources.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Track all administrative actions and system changes.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </Layout>
  );
}