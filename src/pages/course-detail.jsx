
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  Home,
  Bell,
  FileText,
  BookOpen,
  GraduationCap,
  ClipboardList,
  MessageSquare,
  HelpCircle,
  Users,
  LayoutGrid,
  File,
  Calendar,
  Target,
  ArrowLeft
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CourseHome from "../components/course/CourseHome";
import CourseAnnouncements from "../components/course/CourseAnnouncements";
import CourseSyllabus from "../components/course/CourseSyllabus";
import CourseModules from "../components/course/CourseModules";
import CourseGrades from "../components/course/CourseGrades";
import CourseAssignments from "../components/course/CourseAssignments";
import CourseDiscussions from "../components/course/CourseDiscussions";
import CourseQuizzes from "../components/course/CourseQuizzes";
import CoursePeople from "../components/course/CoursePeople";
import CoursePages from "../components/course/CoursePages";
import CourseFiles from "../components/course/CourseFiles";
import CourseAttendance from "../components/course/CourseAttendance";
import CourseFinalExam from "../components/course/CourseFinalExam";
import AIInstructorPanel from "../components/course/AIInstructorPanel";

const courseTabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'syllabus', label: 'Syllabus', icon: FileText },
  { id: 'modules', label: 'Modules', icon: BookOpen },
  { id: 'grades', label: 'Grades', icon: GraduationCap },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'discussions', label: 'Discussions', icon: MessageSquare },
  { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
  { id: 'final-exam', label: 'Final Exam', icon: Target },
  { id: 'people', label: 'People', icon: Users },
  { id: 'pages', label: 'Pages', icon: LayoutGrid },
  { id: 'files', label: 'Files', icon: File },
  { id: 'attendance', label: 'Attendance', icon: Calendar },
];

export default function CourseDetail() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('id');
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const courses = await base44.entities.Course.list();
      return courses.find(c => c.id === courseId);
    },
    enabled: !!courseId,
  });

  const { data: enrollment } = useQuery({
    queryKey: ['enrollment', courseId, user?.email],
    queryFn: async () => {
      if (!user) return null;
      const enrollments = await base44.entities.Enrollment.filter({
        course_id: courseId,
        student_email: user.email
      });
      return enrollments[0] || null;
    },
    enabled: !!courseId && !!user,
  });

  const isInstructor = user?.email === course?.instructor || user?.role === 'admin';
  const isEnrolled = !!enrollment || isInstructor;

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <p className="text-gray-500 mb-4">The course you&apos;re looking for doesn&apos;t exist.</p>
          <Link to={createPageUrl("Courses")}>
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Not Enrolled Message Component
  const NotEnrolledMessage = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-orange-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Enrollment Required</h3>
        <p className="text-gray-600 mb-6">
          You need to be enrolled in this course to access this content. Please enroll to continue.
        </p>
        <Link to={createPageUrl("Courses")}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <Link to={createPageUrl("Courses")}>
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  {course.code}
                </span>
              </div>
              <p className="text-blue-100 text-lg mb-3">{course.description}</p>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  {course.instructor_name}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  {course.semester}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4" />
                  {course.program}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Navigation */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start h-auto bg-transparent border-b-0 p-0 overflow-x-auto flex-nowrap">
              {courseTabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 whitespace-nowrap"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Tabs value={activeTab}>
          <TabsContent value="home">
            <div className="space-y-6">
              <CourseHome course={course} isInstructor={isInstructor} />
              
              {/* AI Instructor Panel */}
              <AIInstructorPanel 
                courseId={courseId} 
                isInstructor={isInstructor}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="announcements">
            {isEnrolled ? (
              <CourseAnnouncements courseId={courseId} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
          
          <TabsContent value="syllabus">
            {isEnrolled ? (
              <CourseSyllabus course={course} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
          
          <TabsContent value="modules">
            {isEnrolled ? (
              <CourseModules courseId={courseId} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
          
          <TabsContent value="grades">
            {isEnrolled ? (
              <CourseGrades courseId={courseId} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
          
          <TabsContent value="assignments">
            {isEnrolled ? (
              <CourseAssignments courseId={courseId} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
          
          <TabsContent value="discussions">
            {isEnrolled ? (
              <CourseDiscussions courseId={courseId} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
          
          <TabsContent value="quizzes">
            {isEnrolled ? (
              <CourseQuizzes courseId={courseId} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
          
          <TabsContent value="final-exam">
            {isEnrolled ? (
              <CourseFinalExam courseId={courseId} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
          
          <TabsContent value="people">
            {isEnrolled ? (
              <CoursePeople courseId={courseId} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
          
          <TabsContent value="pages">
            {isEnrolled ? (
              <CoursePages courseId={courseId} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
          
          <TabsContent value="files">
            {isEnrolled ? (
              <CourseFiles courseId={courseId} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
          
          <TabsContent value="attendance">
            {isEnrolled ? (
              <CourseAttendance courseId={courseId} isInstructor={isInstructor} />
            ) : (
              <NotEnrolledMessage />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
