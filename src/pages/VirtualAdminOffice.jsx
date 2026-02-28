import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  LayoutDashboard, 
  AlertCircle, 
  Bell, 
  BarChart3, 
  Users,
  BookOpen,
  GraduationCap,
  Globe,
  Video,
  FileText,
  Calendar,
  UserCheck,
  Lock,
  CreditCard,
  IdCard,
  Plus,
  UserPlus,
  Settings,
  Shield,
  Briefcase,
  ClipboardCheck,
  Plane,
  TrendingUp,
  FolderOpen,
  BadgeCheck,
  Activity,
  Clock,
  BookMarked,
  DollarSign,
  HelpCircle,
  Headphones,
  FileArchive,
  MessageSquare,
  CheckCircle,
  Zap,
  ArrowRight
} from "lucide-react";
import Layout from "@/Layout";

export default function VirtualAdminOffice() {
  const adminSections = [
    {
      title: "Overview",
      icon: LayoutDashboard,
      color: "from-blue-500 to-blue-600",
      items: [
        { 
          icon: LayoutDashboard, 
          title: "Reception Dashboard", 
          description: "Central overview of all office activities and statistics",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-blue-500"
        },
        { 
          icon: AlertCircle, 
          title: "Students Needing Help", 
          description: "Students registered but not enrolled in courses",
          link: "/dashboard",
          badge: "Hot",
          iconColor: "bg-orange-500"
        },
        { 
          icon: Bell, 
          title: "Notification Center", 
          description: "View all system notifications and alerts",
          link: "/dashboard",
          badge: "New",
          iconColor: "bg-purple-500"
        },
        { 
          icon: BarChart3, 
          title: "Reporting Dashboard", 
          description: "Analytics and downloadable reports for all systems",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-violet-500"
        },
        { 
          icon: Users, 
          title: "Employee Directory", 
          description: "Search and connect with faculty and staff",
          link: "/dashboard",
          badge: null,
          iconColor: "bg-cyan-500"
        },
        { 
          icon: BookOpen, 
          title: "Admin Office Tutorial", 
          description: "Complete guide to using the Virtual Administrative Office",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-indigo-500"
        }
      ]
    },
    {
      title: "Academic",
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      items: [
        { 
          icon: Users, 
          title: "Student Management", 
          description: "Manage student records, enrollments, and academic standing",
          link: "/dashboard",
          badge: null,
          iconColor: "bg-blue-500"
        },
        { 
          icon: GraduationCap, 
          title: "Degree Program Management", 
          description: "View and manage degree programs and outlines",
          link: "/ProgramsCatalog",
          badge: null,
          iconColor: "bg-purple-500"
        },
        { 
          icon: Calendar, 
          title: "Course Scheduling System", 
          description: "Manage course schedules and semester dates",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-blue-500"
        },
        { 
          icon: Globe, 
          title: "Global Submission Viewer", 
          description: "View all student submissions across all courses",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-teal-500"
        },
        { 
          icon: Video, 
          title: "Oral Exam Submission", 
          description: "Review and grade oral examination recordings",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-red-500"
        },
        { 
          icon: FileText, 
          title: "Final Exam Submission", 
          description: "Access and grade final examination submissions",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-pink-500"
        },
        { 
          icon: LayoutDashboard, 
          title: "Lecturer Dashboard Update", 
          description: "Manage lecturer dashboards and permissions",
          link: "/lecturer-dashboard",
          badge: null,
          iconColor: "bg-indigo-500"
        },
        { 
          icon: BadgeCheck, 
          title: "Semester Labels", 
          description: "Update semester labels for all courses",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-amber-500"
        },
        { 
          icon: BookOpen, 
          title: "Courses Without Images", 
          description: "Find and update courses missing images",
          link: "/colleges",
          badge: null,
          iconColor: "bg-orange-500"
        },
        { 
          icon: Lock, 
          title: "College Password Manager", 
          description: "Manage college access credentials securely",
          link: "/colleges",
          badge: null,
          iconColor: "bg-red-600"
        },
        { 
          icon: IdCard, 
          title: "Student ID Cards", 
          description: "View all student identification cards in grid or table view",
          link: "/dashboard",
          badge: "New",
          iconColor: "bg-blue-600"
        },
        { 
          icon: Plus, 
          title: "Bulk Course Creator", 
          description: "Create multiple courses at once with shared metadata",
          link: "/admin-dashboard",
          badge: "New",
          iconColor: "bg-purple-600"
        },
        { 
          icon: UserCheck, 
          title: "Bulk Enrollment", 
          description: "Enroll multiple students into courses at once",
          link: "/enrollment",
          badge: null,
          iconColor: "bg-green-600"
        }
      ]
    },
    {
      title: "HR",
      icon: Briefcase,
      color: "from-orange-500 to-orange-600",
      items: [
        { 
          icon: UserPlus, 
          title: "Staff Onboarding", 
          description: "Welcome portal for new staff members",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-purple-500"
        },
        { 
          icon: ClipboardCheck, 
          title: "Onboarding Management", 
          description: "Track and manage new staff onboarding progress",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-blue-500"
        },
        { 
          icon: Plane, 
          title: "Leave Management", 
          description: "Request time off and manage leave approvals",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-cyan-500"
        },
        { 
          icon: TrendingUp, 
          title: "Performance Reviews", 
          description: "Conduct and view annual performance evaluations",
          link: "/lecturer-dashboard",
          badge: "New",
          iconColor: "bg-orange-500"
        },
        { 
          icon: FolderOpen, 
          title: "HR & Employee Records", 
          description: "Manage employee information and directory",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-purple-600"
        },
        { 
          icon: IdCard, 
          title: "Lecturer IDs", 
          description: "Manage lecturer licenses and view ID cards",
          link: "/lecturer-dashboard",
          badge: null,
          iconColor: "bg-blue-600"
        },
        { 
          icon: Activity, 
          title: "Lecturer Performance", 
          description: "Monitor lecturer activities, metrics, and performance",
          link: "/lecturer-dashboard",
          badge: "New",
          iconColor: "bg-purple-500"
        }
      ]
    },
    {
      title: "Planning",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      items: [
        { 
          icon: Calendar, 
          title: "Calendar & Scheduling", 
          description: "Manage events, meetings, and room bookings",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-purple-500"
        },
        { 
          icon: BookMarked, 
          title: "Active Course Management", 
          description: "Manage and label active courses with content and enrollments",
          link: "/admin-dashboard",
          badge: "New",
          iconColor: "bg-red-500"
        }
      ]
    },
    {
      title: "Finance",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      items: [
        { 
          icon: DollarSign, 
          title: "Payroll Management", 
          description: "View pay stubs, earnings, and tax information",
          link: "/admin-dashboard",
          badge: "New",
          iconColor: "bg-green-500"
        }
      ]
    },
    {
      title: "Hiring",
      icon: UserPlus,
      color: "from-blue-500 to-blue-600",
      items: [
        { 
          icon: Users, 
          title: "Staff Applications", 
          description: "Review and process job applications",
          link: "/admin-dashboard",
          badge: "42",
          iconColor: "bg-blue-500"
        }
      ]
    },
    {
      title: "Support",
      icon: HelpCircle,
      color: "from-green-500 to-green-600",
      items: [
        { 
          icon: Headphones, 
          title: "Help Desk", 
          description: "Submit and track IT support tickets",
          link: "/dashboard",
          badge: "1",
          iconColor: "bg-green-500"
        }
      ]
    },
    {
      title: "Resources",
      icon: FileArchive,
      color: "from-purple-500 to-purple-600",
      items: [
        { 
          icon: FileArchive, 
          title: "Document Center", 
          description: "Access policies, forms, handbooks, and resources",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-purple-500"
        }
      ]
    },
    {
      title: "Communication",
      icon: MessageSquare,
      color: "from-pink-500 to-pink-600",
      items: [
        { 
          icon: MessageSquare, 
          title: "Internal Messages", 
          description: "Communicate with faculty and staff members",
          link: "/dashboard",
          badge: "2",
          iconColor: "bg-pink-500"
        }
      ]
    },
    {
      title: "System",
      icon: Settings,
      color: "from-gray-500 to-gray-600",
      items: [
        { 
          icon: Activity, 
          title: "Admin Dashboard", 
          description: "System reports and management tools",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-purple-500"
        },
        { 
          icon: Settings, 
          title: "System Settings", 
          description: "Manage navigation links and system configuration",
          link: "/admin-dashboard",
          badge: null,
          iconColor: "bg-gray-600"
        },
        { 
          icon: Shield, 
          title: "Bulk Student College Fix", 
          description: "Fix students assigned to wrong colleges based on degree programs",
          link: "/admin-dashboard",
          badge: "Pro",
          iconColor: "bg-orange-500"
        }
      ]
    }
  ];

  return (
    <Layout currentPageName="VirtualAdminOffice">
      <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              
              <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 mb-2">
                <span className="text-blue-200 text-sm font-medium">VIRTUAL UNIVERSITY</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                VIRTUAL ADMINISTRATIVE
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  OFFICE
                </span>
              </h1>
              
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Centralized Office for Faculty and Staff
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">18 Integrated Systems</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white">AI-Powered</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white">Role-Based Access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Platform Population Statistics */}
          <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Live Platform Population</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Platform Users */}
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 hover:border-blue-400/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">3,234</div>
                <div className="text-blue-200 font-medium mb-1">Total Platform Users</div>
                <div className="text-slate-400 text-sm">Active Accounts</div>
              </div>

              {/* Student Body */}
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 hover:border-green-400/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">3,113</div>
                <div className="text-green-200 font-medium mb-1">Student Body</div>
                <div className="text-slate-400 text-sm">Enrolled Students</div>
              </div>

              {/* Faculty & Admin */}
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 hover:border-purple-400/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">121</div>
                <div className="text-purple-200 font-medium mb-1">Faculty & Admin</div>
                <div className="text-slate-400 text-sm">Admin Access</div>
              </div>

              {/* Official Staff Records */}
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 hover:border-yellow-400/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">28</div>
                <div className="text-yellow-200 font-medium mb-1">Official Staff Records</div>
                <div className="text-slate-400 text-sm">HR Directory</div>
              </div>

              {/* Pending Applications */}
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 hover:border-blue-400/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">68</div>
                <div className="text-blue-200 font-medium mb-1">Pending Applications</div>
                <div className="text-slate-400 text-sm"></div>
              </div>

              {/* Open Support Tickets */}
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 hover:border-green-400/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">1</div>
                <div className="text-green-200 font-medium mb-1">Open Support Tickets</div>
                <div className="text-slate-400 text-sm"></div>
              </div>

              {/* Unread Messages */}
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 hover:border-purple-400/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">2</div>
                <div className="text-purple-200 font-medium mb-1">Unread Messages</div>
                <div className="text-slate-400 text-sm"></div>
              </div>

              {/* Leave Requests */}
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 hover:border-yellow-400/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Plane className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">0</div>
                <div className="text-yellow-200 font-medium mb-1">Leave Requests</div>
                <div className="text-slate-400 text-sm"></div>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* Welcome Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-800">Welcome, info</h2>
              <p className="text-slate-600 text-lg">
                Your centralized hub for all administrative tasks, HR management, and staff communications
              </p>
            </div>

            {/* Leave Request Notifications */}
            <div className="space-y-3">
              {/* Leave Request 1 */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 shadow-md flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-lg">New Leave Request</span>
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">high</Badge>
                    </div>
                    <p className="text-blue-50 text-sm">
                      Prof. Jennifer Williams has requested vacation from 2/10/2025
                    </p>
                  </div>
                </div>
                <button className="text-white hover:text-blue-100 transition-colors relative z-10">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Leave Request 2 */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 shadow-md flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-lg">New Leave Request</span>
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">high</Badge>
                    </div>
                    <p className="text-blue-50 text-sm">
                      Prof. Jennifer Williams has requested vacation from 2/10/2025
                    </p>
                  </div>
                </div>
                <button className="text-white hover:text-blue-100 transition-colors relative z-10">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Leave Request 3 */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 shadow-md flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-lg">New Leave Request</span>
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">high</Badge>
                    </div>
                    <p className="text-blue-50 text-sm">
                      Prof. Jennifer Williams has requested vacation from 2/10/2025
                    </p>
                  </div>
                </div>
                <button className="text-white hover:text-blue-100 transition-colors relative z-10">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dashboard Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Button 
                className="h-16 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg"
                onClick={() => window.location.href = "/admin-dashboard"}
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Systems Dashboard
              </Button>
              <Button 
                className="h-16 bg-slate-700 hover:bg-slate-800 text-white text-lg font-semibold shadow-lg"
                onClick={() => window.location.href = "/dashboard"}
              >
                <Users className="w-5 h-5 mr-2" />
                Student Management
              </Button>
            </div>
          </div>

          {/* Admin Sections */}
          {adminSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <section.icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
              </div>

              {/* Section Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, itemIndex) => (
                  <Card 
                    key={itemIndex}
                    className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer overflow-hidden"
                    onClick={() => window.location.href = item.link}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${item.iconColor} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        {item.badge && (
                          <Badge 
                            variant={item.badge === "New" ? "default" : item.badge === "Pro" ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm text-slate-600 mb-4">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                        <span>Access System</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Join Our Team Section */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    Join Our Team at HBI University
                  </h3>
                  <p className="text-slate-600">
                    Interested in working with us? Explore open positions and submit your application today.
                  </p>
                </div>
                
                <Button 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg px-8 py-6 text-lg"
                  onClick={() => window.location.href = "/admin-dashboard"}
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Apply for Position
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
            <Card className="bg-white border-2 hover:border-blue-300 hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Secure & Reliable</h3>
                <p className="text-slate-600 text-sm">
                  Enterprise-grade security with role-based access control protecting sensitive data
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 hover:border-purple-300 hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">24/7 Access</h3>
                <p className="text-slate-600 text-sm">
                  Access all administrative tools anytime, anywhere from any device
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 hover:border-green-300 hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Streamlined Workflow</h3>
                <p className="text-slate-600 text-sm">
                  All administrative tasks in one integrated platform for maximum efficiency
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
