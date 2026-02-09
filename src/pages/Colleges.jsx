
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Search, 
  Mail,
  Phone,
  Users,
  BookOpen,
  ExternalLink,
  GraduationCap,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const DEFAULT_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e9169732a67849215a4ffc/842f33fc3_IMG-20250913-WA0054.jpg";

// College theme configurations with background images
const getCollegeTheme = (collegeName) => {
  const name = collegeName.toLowerCase();
  
  if (name.includes('business') || name.includes('mba')) {
    return {
      gradient: 'from-slate-800 via-slate-700 to-slate-900',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
    };
  }
  if (name.includes('theology') || name.includes('divinity') || name.includes('seminary')) {
    return {
      gradient: 'from-purple-800 via-purple-700 to-indigo-800',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
    };
  }
  if (name.includes('nursing') || name.includes('health')) {
    return {
      gradient: 'from-teal-700 via-cyan-700 to-blue-700',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'
    };
  }
  if (name.includes('education') || name.includes('teaching')) {
    return {
      gradient: 'from-orange-600 via-amber-600 to-yellow-600',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'
    };
  }
  if (name.includes('psychology') || name.includes('counseling')) {
    return {
      gradient: 'from-pink-600 via-rose-600 to-red-600',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'
    };
  }
  if (name.includes('agriculture') || name.includes('farming')) {
    return {
      gradient: 'from-green-700 via-emerald-700 to-teal-700',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80'
    };
  }
  if (name.includes('computer') || name.includes('technology') || name.includes('engineering')) {
    return {
      gradient: 'from-blue-700 via-indigo-700 to-purple-700',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'
    };
  }
  if (name.includes('arts') || name.includes('design') || name.includes('music')) {
    return {
      gradient: 'from-violet-700 via-purple-700 to-fuchsia-700',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80'
    };
  }
  if (name.includes('science') || name.includes('research')) {
    return {
      gradient: 'from-cyan-700 via-blue-700 to-indigo-700',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80'
    };
  }
  if (name.includes('law') || name.includes('legal')) {
    return {
      gradient: 'from-gray-800 via-slate-800 to-zinc-800',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80'
    };
  }
  if (name.includes('architecture')) {
    return {
      gradient: 'from-purple-800 via-purple-700 to-indigo-800',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80'
    };
  }
  if (name.includes('humanities')) {
    return {
      gradient: 'from-purple-700 via-purple-600 to-purple-800',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80'
    };
  }
  if (name.includes('social science')) {
    return {
      gradient: 'from-blue-700 via-indigo-700 to-blue-800',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80'
    };
  }
  
  // Default theme
  return {
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'
  };
};

export default function Colleges() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: colleges, isLoading } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => base44.entities.College.list('name'),
    initialData: [],
  });

  const { data: courses } = useQuery({
    queryKey: ['all-courses'],
    queryFn: () => base44.entities.Course.list(),
    initialData: [],
  });

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCollegeCourseCount = (collegeId) => {
    return courses.filter(c => c.college_id === collegeId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -ml-40 -mb-40" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center p-3 shadow-2xl"
              >
                <img src={DEFAULT_LOGO} alt="HBIU Logo" className="w-full h-full object-contain" />
              </motion.div>
              <div className="text-center md:text-left">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                >
                  HBI University Colleges
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl text-blue-100"
                >
                  Excellence in Faith-Based Education
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-lg text-blue-200 mt-1"
                >
                  HBIU Virtual Campus
                </motion.p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-blue-100 text-sm font-medium">Total Colleges</p>
                </div>
                <p className="text-4xl font-bold text-white">{colleges.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-blue-100 text-sm font-medium">Total Courses</p>
                </div>
                <p className="text-4xl font-bold text-white">{courses.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 col-span-2 md:col-span-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-blue-100 text-sm font-medium">Campus Type</p>
                </div>
                <p className="text-2xl font-bold text-white">Virtual Learning</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search colleges by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Colleges Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse border-none shadow-lg">
                <CardHeader className="h-48 bg-gray-200 rounded-t-xl" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredColleges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No colleges found</h3>
                <p className="text-gray-500 text-lg">Try adjusting your search query</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college, index) => {
              const courseCount = getCollegeCourseCount(college.id);
              const logoUrl = college.logo || DEFAULT_LOGO;
              const theme = getCollegeTheme(college.name);
              // Use custom cover image if available, otherwise use theme image
              const coverImage = college.cover_image || theme.image;
              
              return (
                <motion.div
                  key={college.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-none shadow-lg hover:-translate-y-2">
                    {/* Card Header with Background Image */}
                    <CardHeader className="relative h-56 p-0 overflow-hidden">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img 
                          src={coverImage} 
                          alt={college.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            // Fallback to theme image if custom image fails to load
                            e.target.src = theme.image;
                          }}
                        />
                        {/* Light overlay for text readability only */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>

                      {/* Decorative Pattern Overlay */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-4 right-4 w-20 h-20 border-4 border-white rounded-full" />
                        <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-white rounded-full" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-white rounded-full" />
                      </div>

                      {/* Content Overlay */}
                      <div className="relative z-10 h-full flex flex-col justify-between p-6">
                        {/* Top Section - Logo and Course Count */}
                        <div className="flex items-start justify-between">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl p-2 group-hover:scale-110 transition-transform duration-300">
                            <img src={logoUrl} alt={college.name} className="w-full h-full object-contain" />
                          </div>
                          <Badge className="bg-white/95 text-gray-900 border-0 shadow-lg px-3 py-1 font-semibold backdrop-blur-sm">
                            {courseCount} {courseCount === 1 ? 'Course' : 'Courses'}
                          </Badge>
                        </div>

                        {/* Bottom Section - College Name */}
                        <div>
                          <h3 className="text-white font-bold text-2xl line-clamp-2 drop-shadow-2xl leading-tight">
                            {college.name}
                          </h3>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Card Body */}
                    <CardContent className="p-6 space-y-4 bg-white">
                      {/* Contact Information */}
                      <div className="space-y-3">
                        {college.dean && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 font-medium">Dean</p>
                              <p className="text-sm font-semibold text-gray-900 truncate">{college.dean}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Mail className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">Email</p>
                            <a 
                              href={`mailto:${college.email}`} 
                              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors truncate block"
                            >
                              {college.email}
                            </a>
                          </div>
                        </div>

                        {college.phone && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Phone className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 font-medium">Phone</p>
                              <p className="text-sm font-semibold text-gray-900">{college.phone}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-4 border-t border-gray-100">
                        <Link to={`${createPageUrl("CollegeDetail")}?id=${college.id}`}>
                          <Button className={`w-full group-hover:bg-gradient-to-r ${theme.gradient} transition-all duration-300 shadow-md hover:shadow-xl`}>
                            <span>Explore College</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center py-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Explore our diverse range of colleges and find the perfect program for your academic goals
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to={createPageUrl("EnrollmentDashboard")}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl px-8 py-6 text-lg">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Enroll Now
                </Button>
              </Link>
              <Link to={createPageUrl("Courses")}>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
