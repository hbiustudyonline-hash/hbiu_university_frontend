import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import LoginModal from "@/components/LoginModal";
import CourseListings from "@/components/public/CourseListings";
import HeroCarousel from "@/components/HeroCarousel";
import { 
  GraduationCap, 
  BookOpen,
  Users,
  Video,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Clock,
  Globe,
  TrendingUp,
  Zap,
  Shield,
  MessageSquare,
  LogOut,
  User,
  Info,
  CreditCard,
  Menu,
  X
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { data: courses } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: () => base44.entities.Course.filter({ status: 'published' }, '-created_date', 6),
    initialData: [],
  });

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    logout();
  };

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      const redirectPath = getRoleBasedRedirect(user.role);
      window.location.href = redirectPath;
    } else {
      handleLogin();
    }
  };

  const getRoleBasedRedirect = (role) => {
    switch (role) {
      case 'admin':
        return '/admin-dashboard';
      case 'lecturer':
        return '/lecturer-dashboard';
      case 'college_admin':
        return '/college-admin-dashboard';
      case 'student':
      default:
        return '/student-dashboard';
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Diverse Programs",
      description: "From Associate to PhD programs across multiple disciplines",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Video,
      title: "Live Classes",
      description: "Interactive video lectures with real-time collaboration",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Award,
      title: "Expert Instructors",
      description: "Learn from industry professionals and academic leaders",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Globe,
      title: "Learn Anywhere",
      description: "Access courses from any device, anywhere in the world",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Engage with peers through discussions and group projects",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your achievements with detailed analytics",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const stats = [
    { label: "Active Students", value: "10,000+", icon: Users },
    { label: "Expert Instructors", value: "500+", icon: GraduationCap },
    { label: "Available Courses", value: "1,200+", icon: BookOpen },
    { label: "Success Rate", value: "95%", icon: TrendingUp }
  ];

  const programColors = {
    'Associate': 'bg-blue-100 text-blue-700',
    'Bachelor': 'bg-green-100 text-green-700',
    'Master': 'bg-purple-100 text-purple-700',
    'Doctorate': 'bg-orange-100 text-orange-700',
    'PhD': 'bg-pink-100 text-pink-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#fef8f0]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#012759] to-[#fca31c] rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">HBI University</h1>
                <p className="text-xs text-gray-500">Learn. Grow. Succeed.</p>
              </div>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                <Info className="w-5 h-5" />
                More about us
              </a>
              <a href="#payment" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                <CreditCard className="w-5 h-5" />
                HBIU Pay Smart
              </a>
              <Link to={createPageUrl("Courses")} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                <BookOpen className="w-5 h-5" />
                Courses
              </Link>
              {isAuthenticated && user?.role === 'student' && (
                <Link to={createPageUrl("EnrollmentDashboard")} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  <GraduationCap className="w-5 h-5" />
                  Enrollment
                </Link>
              )}
              <Link to={createPageUrl("ProgramsCatalog")} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                <Award className="w-5 h-5" />
                Programs Catalog
              </Link>
            </div>

            {/* Right Side - Auth Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Welcome, {user.firstName || user.full_name || 'User'}</span>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={handleGetStarted}
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleLogin}
                    className="bg-[#012759] hover:bg-[#010a1f] text-white"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={handleLogin}
                    className="bg-[#fca31c] hover:bg-[#e89a0f] text-black font-semibold"
                  >
                    Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Carousel Section */}
      <HeroCarousel 
        isAuthenticated={isAuthenticated}
        user={user}
        onGetStarted={handleGetStarted}
        onExploreCourses={() => window.location.href = createPageUrl("Courses")}
      />

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#012759]/10 to-[#fca31c]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#fca31c]/20 text-[#012759] border-[#fca31c]/50 px-4 py-1 font-semibold">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive learning platform with cutting-edge tools and expert support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-xl transition-all duration-300 border-none shadow-lg group">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Courses Listings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseListings />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#012759] via-[#1a3a6e] to-[#fca31c]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of students achieving their academic and professional goals
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#012759] hover:bg-gray-100 text-lg px-8 py-6 shadow-xl font-semibold"
                onClick={handleGetStarted}
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              {!user && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-white border-white hover:bg-white/10 text-lg px-8 py-6"
                  onClick={handleLogin}
                >
                  Login to Your Account
                </Button>
              )}
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-blue-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Accredited Programs</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#012759] to-[#fca31c] rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">HBI University</h3>
                  <p className="text-xs">Excellence in Education</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Empowering learners worldwide with quality education and innovative learning solutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Programs</a></li>
                <li><Link to={createPageUrl("Courses")} className="hover:text-white transition-colors">Courses</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Admissions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Student Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 HBI University. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}