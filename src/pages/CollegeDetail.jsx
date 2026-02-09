
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2,
  Mail,
  Phone,
  ExternalLink,
  BookOpen,
  Users,
  GraduationCap,
  Search,
  Calendar,
  ArrowRight,
  Award,
  Star,
  CheckCircle,
  TrendingUp,
  Target,
  Heart,
  Sparkles,
  ChevronDown,
  Play,
  FileText,
  Video,
  Trophy,
  Globe,
  Shield // Added Shield icon
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

// Removed: import CourseCard from "../components/courses/CourseCard";
import CollegeAdministration from "../components/college/CollegeAdministration";

const DEFAULT_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e9169732a67849215a4ffc/842f33fc9_IMG-20250913-WA0054.jpg";

// College-specific configurations
const COLLEGE_THEMES = {
  default: {
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    accentColor: "blue",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    tagline: "Excellence in Education",
    icon: GraduationCap
  },
  business: {
    gradient: "from-slate-800 via-slate-700 to-slate-900",
    accentColor: "slate",
    heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    tagline: "Leading the Future of Business",
    icon: TrendingUp
  },
  theology: {
    gradient: "from-purple-800 via-purple-700 to-indigo-800",
    accentColor: "purple",
    heroImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    tagline: "Faith, Wisdom, and Service",
    icon: Heart
  },
  nursing: {
    gradient: "from-teal-700 via-cyan-700 to-blue-700",
    accentColor: "teal",
    heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    tagline: "Caring for Tomorrow's Health",
    icon: Heart
  },
  education: {
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
    accentColor: "orange",
    heroImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
    tagline: "Shaping Future Educators",
    icon: BookOpen
  },
  psychology: {
    gradient: "from-pink-600 via-rose-600 to-red-600",
    accentColor: "pink",
    heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
    tagline: "Understanding the Human Mind",
    icon: Target
  }
};

const programColors = {
  Associate: "bg-green-100 text-green-700",
  Bachelor: "bg-blue-100 text-blue-700",
  Master: "bg-purple-100 text-purple-700",
  Doctorate: "bg-red-100 text-red-700",
  PhD: "bg-indigo-100 text-indigo-700",
  default: "bg-gray-100 text-gray-700"
};

function getCollegeTheme(collegeName) {
  const name = collegeName.toLowerCase();
  if (name.includes('business') || name.includes('mba')) return COLLEGE_THEMES.business;
  if (name.includes('theology') || name.includes('divinity') || name.includes('seminary')) return COLLEGE_THEMES.theology;
  if (name.includes('nursing') || name.includes('health')) return COLLEGE_THEMES.nursing;
  if (name.includes('education') || name.includes('teaching')) return COLLEGE_THEMES.education;
  if (name.includes('psychology') || name.includes('counseling')) return COLLEGE_THEMES.psychology;
  return COLLEGE_THEMES.default;
}

export default function CollegeDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const collegeId = urlParams.get('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [filterProgram, setFilterProgram] = useState('all'); // New state for program filtering

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: college, isLoading: collegeLoading } = useQuery({
    queryKey: ['college', collegeId],
    queryFn: async () => {
      const colleges = await base44.entities.College.list();
      return colleges.find(c => c.id === collegeId);
    },
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['college-courses', collegeId],
    queryFn: () => base44.entities.Course.filter({ college_id: collegeId }),
    initialData: [],
    enabled: !!collegeId,
  });

  const { data: enrollments } = useQuery({
    queryKey: ['enrollments', user?.email],
    queryFn: () => user ? base44.entities.Enrollment.filter({ student_email: user.email }) : [],
    enabled: !!user,
    initialData: [],
  });

  const { data: announcements } = useQuery({
    queryKey: ['college-announcements', collegeId],
    queryFn: () => base44.entities.Announcement.list('-created_date', 3),
    initialData: [],
  });

  const isInstructor = user?.role === 'admin';

  const filteredCourses = courses.filter(course =>
    (course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterProgram === 'all' || course.program === filterProgram) // Apply program filter
  );

  const programCounts = courses.reduce((acc, course) => {
    acc[course.program] = (acc[course.program] || 0) + 1;
    return acc;
  }, {});

  if (collegeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">College not found</h3>
              <Link to={createPageUrl("Colleges")}>
                <Button>Back to Colleges</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const logoUrl = college.logo || DEFAULT_LOGO;
  const theme = getCollegeTheme(college.name);
  const ThemeIcon = theme.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("Colleges")}>
                <Button variant="ghost" size="sm">
                  ← All Colleges
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-6 ml-8">
                <a href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">About</a>
                <a href="#programs" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Programs</a>
                <a href="#courses" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Courses</a>
                <a href="#staff" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Staff</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to={createPageUrl("EnrollmentDashboard")}>
                <Button className={`bg-gradient-to-r ${theme.gradient} text-white`}>
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={theme.heroImage}
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-90`} />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 shadow-2xl">
                <img src={logoUrl} alt={college.name} className="w-full h-full object-contain" />
              </div>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm">
                <ThemeIcon className="w-4 h-4 mr-2" />
                {theme.tagline}
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              {college.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/90 mb-8 leading-relaxed"
            >
              {college.description || `Join a community of scholars dedicated to excellence, innovation, and transformative learning. Discover your path to success at ${college.name}.`}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to={createPageUrl("EnrollmentDashboard")}>
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-2xl px-8 py-6 text-lg">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Enroll Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Programs
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg">
                <Video className="w-5 h-5 mr-2" />
                Watch Video
              </Button>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-8 mt-12"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{courses.length}+</p>
                  <p className="text-sm text-white/80">Courses</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">1000+</p>
                  <p className="text-sm text-white/80">Students</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">95%</p>
                  <p className="text-sm text-white/80">Success Rate</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white/70" />
          </motion.div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Admin Access Button */}
        {user?.role === 'admin' && (
          <div className="flex justify-end">
            <Link to={`${createPageUrl("CollegeAdminDashboard")}?id=${college.id}`}>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
                <Shield className="w-4 h-4 mr-2" />
                College Admin Dashboard
              </Button>
            </Link>
          </div>
        )}

        {/* Welcome Message Section */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge className={`bg-${theme.accentColor}-100 text-${theme.accentColor}-700 border-${theme.accentColor}-200 px-4 py-2 mb-6`}>
            <Sparkles className="w-4 h-4 mr-2" />
            Welcome to {college.name}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transforming Lives Through Excellence
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            At {college.name}, we are committed to providing world-class education that prepares students for meaningful careers and impactful lives. Our programs combine rigorous academics with practical experience, guided by dedicated faculty who are leaders in their fields.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${theme.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Our Mission</h3>
                <p className="text-sm text-gray-600">
                  To empower students with knowledge, skills, and values that transform communities and advance society.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${theme.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Our Values</h3>
                <p className="text-sm text-gray-600">
                  Excellence, integrity, innovation, and service guide everything we do in our educational mission.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${theme.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Our Impact</h3>
                <p className="text-sm text-gray-600">
                  Thousands of graduates making a difference in their communities and professions worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Featured Content Section */}
        {announcements.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Latest News & Events</h2>
                <p className="text-gray-600 mt-2">Stay updated with what's happening at {college.name}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {announcements.slice(0, 3).map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-none shadow-lg group cursor-pointer">
                    <CardHeader>
                      <Badge className={`bg-${theme.accentColor}-100 text-${theme.accentColor}-700 w-fit mb-3`}>
                        News
                      </Badge>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {announcement.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {announcement.content}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-gray-400">
                          {new Date(announcement.created_date).toLocaleDateString()}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Programs Section */}
        {Object.keys(programCounts).length > 0 && (
          <motion.section
            id="programs"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Badge className={`bg-${theme.accentColor}-100 text-${theme.accentColor}-700 border-${theme.accentColor}-200 px-4 py-2 mb-6`}>
                <Award className="w-4 h-4 mr-2" />
                Academic Programs
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Programs That Shape Your Future
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose from our diverse range of degree programs designed to meet your career goals
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {Object.entries(programCounts).map(([program, count], index) => (
                <motion.div
                  key={program}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:shadow-2xl transition-all duration-300 border-none shadow-lg group cursor-pointer hover:-translate-y-2">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${theme.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-2">{count}</h3>
                      <p className="text-sm text-gray-600 font-medium">{program} Programs</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`bg-gradient-to-br ${theme.gradient} rounded-3xl p-8 md:p-12 shadow-2xl`}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-white/90 mb-6 text-lg">
                Have questions about our programs? Our admissions team is here to help you every step of the way.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Email</p>
                    <a href={`mailto:${college.email}`} className="text-lg font-semibold hover:underline">
                      {college.email}
                    </a>
                  </div>
                </div>
                {college.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Phone</p>
                      <a href={`tel:${college.phone}`} className="text-lg font-semibold hover:underline">
                        {college.phone}
                      </a>
                    </div>
                  </div>
                )}
                {college.dean && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Dean</p>
                      <p className="text-lg font-semibold">{college.dean}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#courses" className="flex items-center justify-between text-white/90 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/10">
                  <span>Browse Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#staff" className="flex items-center justify-between text-white/90 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/10">
                  <span>Meet Our Staff</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link to={createPageUrl("EnrollmentDashboard")} className="flex items-center justify-between text-white/90 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/10">
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Administration Section */}
        <motion.section
          id="staff"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <Badge className={`bg-${theme.accentColor}-100 text-${theme.accentColor}-700 border-${theme.accentColor}-200 px-4 py-2 mb-6`}>
              <Users className="w-4 h-4 mr-2" />
              Our Team
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Administrative Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated professionals committed to your academic success and personal growth
            </p>
          </div>
          <CollegeAdministration collegeId={collegeId} collegeName={college.name} />
        </motion.section>

        {/* Courses Section */}
        <motion.section
          id="courses"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <Badge className={`bg-${theme.accentColor}-100 text-${theme.accentColor}-700 border-${theme.accentColor}-200 px-4 py-2 mb-4`}>
                <BookOpen className="w-4 h-4 mr-2" />
                Course Catalog
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Explore Our Courses
              </h2>
              <p className="text-gray-600 text-lg">{courses.length} courses available for enrollment</p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-2"
                />
              </div>
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger className="w-40 h-12 rounded-xl border-2">
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="Associate">Associate</SelectItem>
                  <SelectItem value="Bachelor">Bachelor</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Doctorate">Doctorate</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {coursesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-32 bg-gray-200" />
                  <CardContent className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <Card className="border-none shadow-lg">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500">
                  {filterProgram !== 'all'
                    ? 'No courses found for the selected program level'
                    : 'No courses available yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md group">
                    <CardHeader className="p-0">
                      <div className={`h-32 bg-gradient-to-br ${
                        course.cover_image ? '' : 'from-blue-500 via-indigo-500 to-purple-500'
                      } relative overflow-hidden`}>
                        {course.cover_image ? (
                          <img
                            src={course.cover_image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-black/10" />
                        )}
                        <div className="absolute top-4 right-4">
                          <Badge className={`${programColors[course.program] || programColors.default} border`}>
                            {course.program}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <h3 className="text-white font-bold text-lg">{course.code}</h3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {course.description || 'No description available'}
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {course.instructor_name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {course.semester}
                        </div>
                      </div>
                      <Link to={`${createPageUrl("course-detail")}?id=${course.id}`}>
                        <Button className="w-full group-hover:bg-blue-600 transition-colors">
                          View Course
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center py-16"
        >
          <div className={`bg-gradient-to-r ${theme.gradient} rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48" />
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Begin Your Journey?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of students who have transformed their lives through education at {college.name}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to={createPageUrl("EnrollmentDashboard")}>
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-2xl px-8 py-6 text-lg">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Start Your Application
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg">
                    <FileText className="w-5 h-5 mr-2" />
                    Download Brochure
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-8 mt-12 text-white/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">Accredited Programs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    <span className="text-sm">Online Learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    <span className="text-sm">95% Success Rate</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
