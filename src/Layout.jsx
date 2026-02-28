import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Presentation,
  User,
  Users,
  Home,
  Shield,
  Building2,
  Info,
  Award,
  Megaphone,
  MessageSquare,
  UserPlus
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/hooks/useAuth";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  // TEMPORARY: Use auth from context instead of fetching separately
  const { user, isLoading: isLoadingAuth } = useAuth();

  // List of public pages that don't require authentication
  const publicPages = ['Home', 'About', 'Programs', 'Courses', 'course-detail', 'Colleges', 'ProgramsCatalog'];
  const isPublicPage = publicPages.includes(currentPageName);

  // Remove the separate auth check that was causing flashing
  // React.useEffect(() => {
  //   base44.auth.me()
  //     .then(setUser)
  //     .catch(() => setUser(null))
  //     .finally(() => setIsLoadingAuth(false));
  // }, []);

  // Apply RTL layout if user's language is RTL
  const isRTLLanguage = false; // Simplified - removed RTL detection

  React.useEffect(() => {
    if (isRTLLanguage) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [isRTLLanguage]);

  // For public pages, render without sidebar and without waiting for auth
  if (isPublicPage) {
    return (
      <>
        {children}
      </>
    );
  }

  // For private pages, show loading while checking auth
  // TEMPORARY: Skip redirect check during bypass mode
  // useEffect hook must be called at the top level, before any conditional returns
  // React.useEffect(() => {
  //   if (!user) {
  //     base44.auth.redirectToLogin(window.location.pathname);
  //   }
  // }, [user]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // TEMPORARY: Skip redirect for bypass mode - render content even without user
  // if (!user) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4" />
  //         <p className="text-gray-600 text-lg">Redirecting to login...</p>
  //       </div>
  //     </div>
  //   );
  // }

  const isInstructor = user?.role === 'admin' || user?.role === 'lecturer';

  const handleLogout = () => {
    base44.auth.logout(createPageUrl("Home"));
  };

  const navigationItems = [
    {
      title: "Home",
      url: createPageUrl("Home"),
      icon: Home,
      badge: "Public"
    },
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: LayoutDashboard,
    },
    {
      title: "Support Queries",
      url: createPageUrl(isInstructor ? "StaffSupport" : "StudentSupport"),
      icon: MessageSquare,
    },
    {
      title: "University Announcements",
      url: createPageUrl("UniversityAnnouncements"),
      icon: Megaphone,
    },
    {
      title: "Programs Catalog",
      url: createPageUrl("ProgramsCatalog"),
      icon: Award,
      badge: "Public"
    },
    {
      title: "Additional Program Outlines",
      url: createPageUrl("AdditionalProgramOutlines"),
      icon: BookOpen,
    },
    {
      title: "Courses",
      url: createPageUrl("Courses"),
      icon: BookOpen,
      badge: "Public"
    },
    {
      title: "Colleges",
      url: createPageUrl("Colleges"),
      icon: Building2,
      badge: "Public"
    },
    {
      title: "New Students Group",
      url: createPageUrl("CommunityGroup"),
      icon: Users,
      badge: "New"
    },
    {
      title: "High Performers",
      url: createPageUrl("HighPerformersBoard"),
      icon: Award,
      badge: "🏆"
    },
    ];

  // Add tutorial for students only
  if (!isInstructor) {
    navigationItems.push({
      title: "Tutorial",
      url: createPageUrl("StudentTutorial"),
      icon: GraduationCap,
    });
  }

  // Add Enrollment for students
  if (!isInstructor) {
    navigationItems.push({
      title: "Enrollment",
      url: createPageUrl("EnrollmentDashboard"),
      icon: GraduationCap,
    });
  }

  if (isInstructor) {
    navigationItems.push({
      title: "Lecturer Dashboard",
      url: createPageUrl("LecturerDashboard"),
      icon: Presentation,
    });
    navigationItems.push({
      title: "Lecturer Tutorial",
      url: createPageUrl("LecturerTutorial"),
      icon: GraduationCap,
    });
    navigationItems.push({
      title: "Admin Dashboard",
      url: createPageUrl("AdminDashboard"),
      icon: Shield,
    });
    navigationItems.push({
      title: "Admin Office",
      url: createPageUrl("VirtualAdminOffice"),
      icon: Building2,
    });
    navigationItems.push({
      title: "Test Transcript Tool",
      url: createPageUrl("TestTranscriptGenerator"),
      icon: GraduationCap,
      badge: "Test"
    });
    navigationItems.push({
      title: "Add Lecturer",
      url: createPageUrl("AdminAddLecturer"),
      icon: User,
    });
    navigationItems.push({
      title: "Bulk Enrollment",
      url: createPageUrl("BulkEnrollment"),
      icon: UserPlus,
    });
  }

  // Public lecturer registration
  navigationItems.push({
    title: "Become a Lecturer",
    url: createPageUrl("LecturerRegistrationPublic"),
    icon: GraduationCap,
    badge: "Apply"
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Sidebar className="border-r border-gray-200 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e9169732a67849215a4ffc/dea4daaa8_image.png" 
                alt="School Logo" 
                className="w-10 h-10 rounded-xl shadow-lg object-cover"
              />
              <div className="min-w-0">
                <h2 className="font-bold text-gray-900 text-lg truncate">HBI University</h2>
                <p className="text-xs text-gray-500 truncate">Learning Management System</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:text-white' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge variant="outline" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.role === 'admin' ? 'Lecturer' : 'Student'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">

                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block md:hidden">
                  HBI University
                </h1>
              </div>

              <div className="flex items-center gap-3">
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
