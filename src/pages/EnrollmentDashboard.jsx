
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Search,
  CheckCircle,
  Clock,
  Award,
  UserCircle,
  Calendar,
  TrendingUp,
  Filter,
  AlertCircle,
  FileText,
  Users, // Added for instructor/enrollment counts
  Trash2, // Added for drop course
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { calculateGPA, percentageToGrade, gradeToPoints } from "../components/utils/gradeCalculations";
import UnofficialTranscript from "../components/student/UnofficialTranscript";
import { Link } from "react-router-dom"; // Added for routing

const DEFAULT_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e9169732a67849215a4ffc/842f33fc2_IMG-20250913-WA0054.jpg";
const MAX_COURSES_PER_SEMESTER = 4;

// Utility function for creating page URLs
const createPageUrl = (path) => `/${path}`;

const DEGREE_PROGRAMS = {
  Associate: [
    "Associate of Arts in Theology",
    "Associate of Arts in Biblical Studies",
    "Associate of Arts in Christian Ministry",
    "Associate of Arts in Clinical Mental Health Counseling",
    "Associate of Science in Business Administration",
    "Associate of Arts in Leadership & Cultural Management"
  ],
  Bachelor: [
    "Bachelor of Arts in Theology",
    "Bachelor of Arts in Biblical Studies",
    "Bachelor of Arts in Christian Ministry",
    "Bachelor of Science in Psychology",
    "Bachelor of Science in Business Administration",
    "Bachelor of Science in Nursing",
    "Bachelor of Arts in Education",
    "Bachelor of Science in Computer Science",
    "Bachelor of Arts in Communication",
    "Bachelor of Science in Psychology, Minor in Clinical Chaplaincy Psychotherapy",
    "Bachelor of Architecture, Minor in Religious Artifacts",
    "Bachelor of Arts in Human Resources, Minor in Non-Profit Human Resources and Management",
    "Bachelor of Humanitarianism and Conflict Response, Minor in Faith-Based Humanitarian Response",
    "Bachelor of Project Management, Minor in Non-Profit Project Management",
    "Bachelor of Public Administration, Minor in Faith-Based Public Policy and Administration",
    "Bachelor of Science Psychotherapy, Minor in Clinical Mental Health Faith-Based Counseling",
    "Bachelor of Science Christian Counseling & Psychology, Minor in Clinical Mental Health Counseling",
    "Bachelor of Science in Health Policy and Advocacy, Minor in Health Ministry",
    "Bachelor of Science in Healthcare Leadership and Management, Minor in Health Ministry",
    "Bachelor of Agribusiness, Minor in Non-Profit Sustainable and Community Development",
    "Bachelor of Theology, Minor in Education",
    "Bachelor of Human Resources, Minor in Faith-Based Resources and Management",
    "Bachelor of Divinity, Minor in Leadership & Cultural Management",
    "Bachelor of Emergency Management, Minor in Faith-Based Emergency Management",
    "Bachelor of English Literature, Minor in Non-Profit Arts and Culture Management",
    "Bachelor of Divinity, Major in Chaplaincy, Counseling & Psychology",
    "Bachelor of Divinity, Major in Clinical Mental Health Counseling",
    "Bachelor of Divinity, Minor in Counseling",
    "Bachelor of Ministry, Minor in Leadership",
    "Bachelor of Biblical Study, Major in Education and Ministry",
    "Bachelor of Education, Minor in Diverse Ministry Education",
    "Bachelor of Business Administration, Minor in Non-Profit Business Management",
    "Bachelor of Business Management, Minor in Faith-Based Policy",
    "Bachelor of Marketing and Advertising, Minor in Grant Writing for Non-Profit",
    "Bachelor of Public Health, Minor in Health Ministry",
    "Bachelor of Addiction Counseling, Minor in Faith-Based Recovery Services",
    "Bachelor of Life Coaching, Minor in Faith-Based Counseling and Mentoring",
    "Bachelor of Media Production, Minor in Faith-Based Media and Communication",
    "Bachelor of Legal Science, Minor in Laws that Govern Non-Profit Organization",
    "Bachelor of Public Policy, Minor in Public Policy in Non-Profit",
    "Bachelor of Religious Law, Minor in Law and Policy",
    "Bachelor of Law and Digital Technologies, Minor in Faith-Based Org. Laws",
    "Bachelor of International Law and Treaty Law, Minor in Faith-Based Org. Laws",
    "Bachelor of Juridical Science (SJD), Minor in Non-Profit Laws",
    "Bachelor of Law and Politics, Minor in Laws that govern church and state",
    "Bachelor of Christian Law, Minor in Law and Ethics",
    "Bachelor of Iconic Leadership, Minor in Faith-Based Leadership",
    "Bachelor of Music Production, Minor in Arts and Theater Ministry",
    "Bachelor of Science in IT Support, Minor in Technology Management for Faith-Based Organizations",
    "Bachelor of Data Analytics, Minor in Faith-Based Data-Driven Decision Making",
    "Bachelor of UX Design, Minor in Digital Ministry",
    "Bachelor of Science in Cyber Security, Minor in Data Protection for Faith-Based Organizations",
    "Bachelor of Science in Healthcare Administration, Minor in Health Ministry",
    "Bachelor of Science in Healthcare Management, Minor in Health Ministry",
    "Bachelor of Science in Healthcare Administration, Minor in Christian Healthcare Ethics",
    "Bachelor of Science in Public Health, Minor in Jewish Studies: Bioethics and Healthcare",
    "Bachelor of Science in Health Education, Minor in World Religion Healthcare and Spirituality",
    "Bachelor of Science in Public Health, Bioethics, Minor in Healthcare Ministry",
    "Bachelor of Science in Healthcare Policy, Minor in Health Ministry Bioethics",
    "Bachelor of Global Health, Minor in Faith-Based Healthcare and Development",
    "Bachelor of Health Informatics, Minor in Spirituality and Healthcare Technology",
    "Bachelor of Healthcare Management, Minor in Christian Business Ethics in Healthcare",
    "Bachelor of Epidemiology, Minor in Jewish Studies: Epidemiology and Public Health",
    "Bachelor of Biomedical Engineering, Minor in Catholic Bioethics and Medical Engineering",
    "Bachelor of Operational Management, Minor in Faith-Based Operational Leadership",
    "Bachelor of International Business, Minor in Non-Profit International Business and Development",
    "Bachelor of Business, Major in Tourism, Minor in Non-Profit Community Development",
    "Bachelor of Organizational Leadership, Minor in Christian Ethics",
    "Bachelor of Strategic Leadership, Minor in Jewish Studies: Leadership and Ethics",
    "Bachelor of Leadership Studies, Minor in Understanding Leadership in World Religions",
    "Bachelor of Educational Leadership, Minor in Catholic Educational Leadership",
    "Bachelor of Global Leadership, Minor in Hindu Leadership and Spirituality",
    "Bachelor of Nonprofit Leadership, Minor in Faith-Based Nonprofit Leadership",
    "Bachelor of Leadership, Minor in Understanding Leadership in World Religions",
    "Bachelor of Science in Clinical Chaplaincy Psychotherapy",
    "Bachelor of Arts in International Business, Minor in Faith-Based Management",
    "Bachelor of Science in Clinical Pastoral Education",
    "Bachelor of Arts in Public Administration",
    "Bachelor of Arts in English Literature",
    "Bachelor of Music in Performance - Minor in Music Ministry",
    "Bachelor of Music Education - Minor in Christian Education",
    "Bachelor of Arts in Music Therapy - Minor in Spiritual Care",
    "Bachelor of Music in Composition - Minor in Sacred Music",
    "Bachelor of Science in Music Technology - Minor in Worship Technology",
    "Bachelor of Music in Conducting - Minor in Choral Ministry",
    "Bachelor of Arts in Musicology - Minor in Christian Music History",
    "Bachelor of Fine Arts in Music Production - Minor in Faith-Based Music Production",
    "Bachelor of Music in Music Business - Minor in Music Ministry Management",
    "Bachelor of Music in Sound Design - Minor in Audio Technology for Worship",
    "Bachelor of Science in Project Management, Minor in Faith-Based Management",
    "Bachelor of Science in Management - Minor in Faith-Based Project Management",
    "Bachelor of Arts in Project Management - Minor in Christian Leadership and Management",
    "Bachelor of Business Administration in Project Management - Minor in Biblical Business Principles",
    "Bachelor of Engineering in Project Management - Minor in Ethics in Engineering and Technology",
    "Bachelor of Science in Project Management and Planning - Minor in Ministry Management",
    "Bachelor of Project Management - Minor in Faith-Based Organizational Leadership",
    "Bachelor of Arts in Project Management and Leadership - Minor in Spiritual Formation",
    "Bachelor of Business Administration in Project Management - Minor in Faith-Bus. Ethics",
    "Bachelor of Science in Project Management & Operations - Minor in Christian Management",
    "Bachelor of Project Management - Minor in Ministry-Based Project Management",
    "Bachelor of Arts in Journalism - Minor in Christian Media",
    "Bachelor of Journalism - Minor in Faith-Based Communication",
    "Bachelor of Science in Journalism - Minor in Religious Studies",
    "Bachelor of Arts in Broadcast Journalism - Minor in Christian Broadcasting",
    "Bachelor of Journalism - Minor in Jewish Studies and Media",
    "Bachelor of Arts in Digital Journalism - Minor in Faith-Based Digital Media",
    "Bachelor of Science in Journalism - Minor in Faith-Based Media Studies",
    "Bachelor of Arts in Investigative Journalism - Minor in Christian Investigative Reporting",
    "Bachelor in Journalism & Public Affairs - Minor in Faith-Based Public Policy & Media",
    "Bachelor of Fine Arts in Fashion Design",
    "Bachelor in International Relations (Minor in Faith-Based Global Development and Diplomacy)",
    "Bachelor in Public Relations (Minor in Faith-Based Advocacy and Media Outreach)",
    "Bachelor in Social Work (Minor in Faith-Based Social Services and Community Engagement)",
    "Bachelor in Environmental Studies (Minor in Faith-Based Environmental Sustainability and Policy)",
    "Bachelor in Nutrition (Minor in Faith-Based Public Health and Wellness)",
    "Bachelor in Political Science (Minor in Faith-Based Governance and Civic Engagement)",
    "Bachelor in Women's Studies (Minor in Faith-Based Gender Equality and Empowerment)",
    "Bachelor in African Studies (Minor in Faith-Based Cultural Preservation and Advocacy)",
    "Bachelor in Philosophy (Minor in Faith-Based Ethics and Social Justice)",
    "Bachelor in Anthropology (Minor in Faith-Based Community Development and Cultural Awareness)",
    "Bachelor in Sociology (Minor in Faith-Based Social Change and Policy Reform)",
    "Bachelor in History (Minor in Faith-Based Historical Preservation and Museum Studies)",
    "Bachelor in Film Production (Minor in Faith-Based Documentary Filmmaking and Media Activism)",
    "Bachelor in Theatre Arts (Minor in Faith-Based Performing Arts and Community Engagement)",
    "Bachelor in Graphic Design (Minor in Faith-Based Digital Advocacy and Branding)",
    "Bachelor in Hospitality Management (Minor in Faith-Based Event Planning and Fundraising)",
    "Bachelor in Sports Management (Minor in Faith-Based Youth Sports and Development)",
    "Bachelor in Recreation Management (Minor in Faith-Based Community Sports and Wellness)",
    "Bachelor in Disaster Management (Minor in Faith-Based Crisis Response and Humanitarian Aid)",
    "Bachelor in Entrepreneurial Studies (Minor in Faith-Based Social Entrepreneurship)",
    "Bachelor in Engineering (Minor in Faith-Based Infrastructure and Community Development)",
    "Bachelor in Applied Mathematics (Minor in Faith-Based Data Analysis and Research)",
    "Bachelor in Statistics (Minor in Faith-Based Research and Policy Analysis)",
    "Bachelor in Renewable Energy (Minor in Faith-Based Sustainability and Green Technology)",
    "Bachelor in Psychology (Minor in Faith-Based Mental Health Advocacy)",
    "Bachelor in Biochemistry (Minor in Faith-Based Scientific Research and Public Health)",
    "Bachelor in Pharmacology Theory (Minor in Faith-Based Global Health Initiatives)",
    "Bachelor in Meteorology (Minor in Faith-Based Climate Change and Disaster Relief)",
    "Bachelor in Public Safety (Minor in Faith-Based Emergency Preparedness)",
    "Bachelor in Criminal Justice (Minor in Faith-Based Restorative Justice and Advocacy)",
    "Bachelor in Intelligence Studies (Minor in Faith-Based Human Rights and Security)",
    "Bachelor in Cyber Forensics (Minor in Faith-Based Digital Safety and Awareness)",
    "Bachelor in Robotics (Minor in Faith-Based Technological Innovation for Development)",
    "Bachelor in Data Science (Minor in Faith-Based Analytics for Social Impact)",
    "Bachelor in Blockchain Technology (Minor in Faith-Based Digital Currency and Fundraising)",
    "Bachelor in Astronomy (Minor in Faith-Based Space Education and Public Outreach)",
    "Bachelor in Artificial Intelligence (Minor in Faith-Based Ethics and AI for Social Good)",
    "Bachelor in Music Composition (Minor in Faith-Based Music Therapy)",
    "Bachelor in Dance (Minor in Faith-Based Movement Therapy)",
    "Bachelor in Linguistics (Minor in Faith-Based Language Development and Accessibility)",
    "Bachelor in International Trade (Minor in Faith-Based Fair Trade Advocacy)",
    "Bachelor in Transportation Management (Minor in Faith-Based Urban Mobility and Access)",
    "Bachelor in Supply Chain Management (Minor in Faith-Based Logistics for Humanitarian Aid)",
    "Bachelor in Risk Management (Minor in Faith-Based Disaster Preparedness)",
    "Bachelor in Theoretical Physics (Minor in Faith-Based Science Education)",
    "Bachelor in Marine Biology (Minor in Faith-Based Ocean Conservation)",
    "Bachelor in Veterinary Medicine Theory (Minor in Faith-Based Animal Welfare)",
    "Bachelor in Speech Pathology (Minor in Faith-Based Disability Services)",
    "Bachelor in Occupational Therapy (Minor in Faith-Based Rehabilitation Services)",
    "Bachelor in Archaeology (Minor in Faith-Based Cultural Heritage Preservation)",
    "Bachelor in Aviation Management (Minor in Faith-Based Air Transport and Humanitarian Aid)",
    "Bachelor in Neuroscience (Minor in Faith-Based Brain Health and Education)",
    "Bachelor in Public Speaking (Minor in Faith-Based Advocacy Training)",
    "Bachelor in Theology and Ethics (Minor in Faith-Based Faith-Based Leadership)",
    "Bachelor in Alternative Medicine (Minor in Faith-Based Holistic Health)",
    "Bachelor of Fine Arts, Major in Painting, Minor - Art History African Religion Studies"
  ],
  Master: [
    "Master of Divinity",
    "Master of Arts in Theology",
    "Master of Arts in Christian Counseling",
    "Master of Arts in Ministry Leadership",
    "Master of Business Administration",
    "Master of Science in Nursing",
    "Master of Education",
    "Master of Public Health",
    "Master of Science in Clinical Mental Health Counseling"
  ],
  Doctorate: [
    "Doctor of Ministry",
    "Doctor of Theology",
    "Doctor of Education",
    "Doctor of Business Administration",
    "Doctor of Nursing Practice"
  ],
  PhD: [
    "PhD in Theology",
    "PhD in Biblical Studies",
    "PhD in Ministry",
    "PhD in Psychology",
    "PhD in Education",
    "PhD in Business Administration",
    "Ph.D. in Psychology, Minor in Clinical Chaplaincy Psychotherapy"
  ]
};

export default function EnrollmentDashboard() {
  const [user, setUser] = useState(null);
  const [showProgramDialog, setShowProgramDialog] = useState(false);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filters, setFilters] = useState({ // Consolidated search/filter state
    search: '',
    college: 'all',
    program: 'all'
  });
  const [activeTab, setActiveTab] = useState('courses'); // Changed default tab to 'courses' as per outline
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
  const [enrolling, setEnrolling] = useState(false); // New state for enrollment loading
  const [showDropConfirmDialog, setShowDropConfirmDialog] = useState(false); // New state for drop dialog
  const [enrollmentToDrop, setEnrollmentToDrop] = useState(null); // New state for enrollment to drop

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(user => {
      setUser(user);
      if (!user.program || !user.college_id) {
        setShowProgramDialog(true);
      }
    }).catch(() => {});
  }, []);

  const { data: colleges } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => base44.entities.College.list('name'),
    initialData: [],
  });

  const { data: courses } = useQuery({
    queryKey: ['all-courses'],
    queryFn: () => base44.entities.Course.filter({ status: 'published' }),
    initialData: [],
  });

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({ // myEnrollments in outline
    queryKey: ['my-enrollments', user?.email],
    queryFn: () => user ? base44.entities.Enrollment.filter({ student_email: user.email }) : [],
    enabled: !!user,
    initialData: [],
  });

  const { data: allEnrollments = [] } = useQuery({ // All enrollments for course capacity
    queryKey: ['all-active-enrollments'],
    queryFn: () => base44.entities.Enrollment.filter({ status: 'active' }),
    initialData: [],
  });

  const { data: transcripts } = useQuery({
    queryKey: ['my-transcripts', user?.email],
    queryFn: () => user ? base44.entities.Transcript.filter({ student_email: user.email }) : [],
    enabled: !!user,
    initialData: [],
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      base44.auth.me().then(setUser);
      setShowProgramDialog(false);
    },
  });

  const enrollMutation = useMutation({
    mutationFn: (courseData) => base44.entities.Enrollment.create(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['all-active-enrollments'] });
      setShowEnrollDialog(false);
      setSelectedCourse(null);
      setEnrolling(false);
    },
    onError: (error) => {
      alert(`Enrollment failed: ${error.message}`);
      setEnrolling(false);
    }
  });

  const dropEnrollmentMutation = useMutation({
    mutationFn: (enrollmentId) => base44.entities.Enrollment.delete(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['all-active-enrollments'] });
      setShowDropConfirmDialog(false);
      setEnrollmentToDrop(null);
      alert('Course dropped successfully.');
    },
    onError: (error) => {
      console.error('Error dropping course:', error);
      alert('Failed to drop course. Please try again.');
    }
  });

  const generateTranscriptMutation = useMutation({
    mutationFn: (transcriptData) => base44.entities.Transcript.create(transcriptData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-transcripts'] });
      alert('Transcript generated successfully!');
    },
    onError: (error) => {
      console.error('Error generating transcript:', error);
      alert('Failed to generate transcript. Please try again.');
    }
  });

  const handleProgramSelection = (data) => {
    const college = colleges.find(c => c.id === data.college_id);
    updateProfileMutation.mutate({
      program: data.program,
      degree_program: data.degree_program,
      college_id: data.college_id,
      college_name: college?.name,
      enrollment_date: new Date().toISOString().split('T')[0],
      student_id: `HBI-${Date.now()}`
    });
  };

  const handleEnroll = async (course) => {
    if (!user) {
      alert('Please log in to enroll in a course.');
      return;
    }
    setSelectedCourse(course);
    setShowEnrollDialog(true);
  };

  const confirmEnrollment = async () => {
    if (selectedCourse) {
      setEnrolling(true);
      const semesterEnrollments = enrollments.filter(e => {
        const course = courses.find(c => c.id === e.course_id);
        return course?.semester === selectedCourse.semester && e.status === 'active';
      });

      if (semesterEnrollments.length >= MAX_COURSES_PER_SEMESTER) {
        alert(`You can only enroll in ${MAX_COURSES_PER_SEMESTER} active courses per semester. You currently have ${semesterEnrollments.length} active enrollments for ${selectedCourse.semester}.`);
        setEnrolling(false);
        return;
      }

      // Check course capacity
      const currentCourseEnrollments = allEnrollments.filter(e => e.course_id === selectedCourse.id && e.status === 'active').length;
      if (selectedCourse.enrollment_limit && currentCourseEnrollments >= selectedCourse.enrollment_limit) {
          alert(`This course is full. It has reached its enrollment limit of ${selectedCourse.enrollment_limit}.`);
          setEnrolling(false);
          return;
      }

      enrollMutation.mutate({
        course_id: selectedCourse.id,
        student_email: user?.email,
        student_name: user?.full_name,
        status: 'active'
      });
    }
  };

  const handleDropCourse = (enrollmentId) => {
    setEnrollmentToDrop(enrollmentId);
    setShowDropConfirmDialog(true);
  };

  const confirmDropCourse = () => {
    if (enrollmentToDrop) {
      dropEnrollmentMutation.mutate(enrollmentToDrop);
    }
  };

  const handleGenerateTranscript = (semester) => {
    if (!user || !user.email) {
      alert('Please log in to generate a transcript.');
      return;
    }

    const semesterEnrollments = enrollments.filter(e => {
      const course = courses.find(c => c.id === e.course_id);
      return course?.semester === semester && e.grade;
    });

    if (semesterEnrollments.length === 0) {
      alert('No graded courses found for this semester to generate a transcript.');
      return;
    }

    const transcriptCourses = semesterEnrollments.map(e => {
      const course = courses.find(c => c.id === e.course_id);
      if (!course) return null;

      return {
        course_id: course.id,
        course_code: course.code,
        course_title: course.title,
        credits: course.credits || 3,
        grade: e.grade,
        percentage: e.percentage || 0, // Assuming percentage is available or default to 0
        grade_points: (course.credits || 3) * (gradeToPoints[e.grade] || 0)
      };
    }).filter(Boolean);

    if (transcriptCourses.length === 0) {
      alert('No valid graded courses found for this semester.');
      return;
    }

    const totalCreditsForSemester = transcriptCourses.reduce((sum, c) => sum + c.credits, 0);
    const semesterGPA = calculateGPA(transcriptCourses);
    const cumulativeGPA = semesterGPA; // For simplicity, this is just the current semester GPA

    const transcriptData = {
      student_email: user.email,
      student_name: user.full_name,
      student_id: user.student_id,
      semester: semester,
      program: user.program,
      college_name: user.college_name,
      courses: transcriptCourses,
      total_credits: totalCreditsForSemester,
      gpa: parseFloat(semesterGPA),
      cumulative_gpa: parseFloat(cumulativeGPA),
      status: 'completed',
      generated_date: new Date().toISOString()
    };

    generateTranscriptMutation.mutate(transcriptData);
  };

  // Pre-calculate enrollment counts for course capacity
  const enrollmentCounts = allEnrollments.reduce((acc, enrollment) => {
    acc[enrollment.course_id] = (acc[enrollment.course_id] || 0) + 1;
    return acc;
  }, {});
  
  const enrolledCourseIds = enrollments.map(e => e.course_id);
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         course.code.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCollege = filters.college === 'all' || course.college_id === filters.college;
    const matchesProgram = filters.program === 'all' || course.program === filters.program;
    return matchesSearch && matchesCollege && matchesProgram;
  });

  const currentSemesterCount = (semester) => {
    return enrollments.filter(e => {
      const course = courses.find(c => c.id === e.course_id);
      return course?.semester === semester && e.status === 'active';
    }).length;
  };

  const semesters = [...new Set(courses.map(c => c.semester))].filter(Boolean).sort((a, b) => {
    const parseSemester = (sem) => {
      const parts = sem.split(' ');
      if (parts.length === 2) {
        const year = parseInt(parts[1]);
        const season = parts[0];
        let seasonValue = 0;
        if (season === 'Spring') seasonValue = 1;
        if (season === 'Summer') seasonValue = 2;
        if (season === 'Fall') seasonValue = 3;
        return year * 10 + seasonValue;
      }
      return 0;
    };
    return parseSemester(a) - parseSemester(b);
  });
  
  useEffect(() => {
    if (semesters.length > 0 && !semesters.includes(selectedSemester)) {
      setSelectedSemester(semesters[0]);
    } else if (semesters.length === 0) {
      setSelectedSemester('Fall 2024');
    }
  }, [semesters]);

  const programColors = {
    'Associate': 'from-blue-500 to-blue-600',
    'Bachelor': 'from-green-500 to-green-600',
    'Master': 'from-purple-500 to-purple-600',
    'Doctorate': 'from-orange-500 to-orange-600',
    'PhD': 'from-pink-500 to-pink-600'
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Student Enrollment
                </h1>
                <p className="text-purple-100 text-lg">
                  Manage your program and course enrollments
                </p>
              </div>
            </div>

            {user?.program && user?.college_id && (
              <div className="grid md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-white" />
                    <p className="text-purple-100 text-sm">Your College</p>
                  </div>
                  <p className="text-lg font-bold text-white line-clamp-1">{user.college_name}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-white" />
                    <p className="text-purple-100 text-sm">Program</p>
                  </div>
                  <p className="text-lg font-bold text-white">{user.program}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <p className="text-purple-100 text-sm">Enrolled Courses</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{enrollments.length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCircle className="w-5 h-5 text-white" />
                    <p className="text-purple-100 text-sm">Student ID</p>
                  </div>
                  <p className="text-lg font-bold text-white">{user.student_id || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-md rounded-xl p-2">
            <TabsTrigger value="courses" className="flex items-center gap-2"> {/* Changed from "browse" */}
              <Search className="w-4 h-4" />
              Browse Courses
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2"> {/* Changed from "enrolled" */}
              <BookOpen className="w-4 h-4" />
              My Courses ({enrollments.length})
            </TabsTrigger>
            <TabsTrigger value="transcript" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Transcripts
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              My Program
            </TabsTrigger>
          </TabsList>

          {/* My Enrolled Courses Tab (formerly "enrolled", now "overview" as per outline) */}
          <TabsContent value="overview">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  My Enrolled Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No courses enrolled yet
                    </h3>
                    <p className="text-gray-500">
                      Start by enrolling in courses from the available courses below
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => { // Using 'enrollments' as 'myEnrollments'
                      const course = courses.find(c => c.id === enrollment.course_id);
                      if (!course) return null;

                      // For percentage, if not directly available, derive from grade
                      const percentage = enrollment.grade ? percentageToGrade(enrollment.grade) : null;

                      return (
                        <Card key={enrollment.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md group">
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
                                <Badge className={`${programColors[course.program]} border text-white`}> {/* Added text-white for visibility */}
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
                                {course.instructor_name || 'N/A'}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                {course.semester}
                              </div>
                              {enrollment.grade && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Award className="w-4 h-4 text-green-600" />
                                  <span className="font-semibold text-green-600">
                                    Grade: {enrollment.grade} {percentage ? `(${percentage}%)` : ''}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Link to={`${createPageUrl("course-detail")}?id=${course.id}`} className="flex-1">
                                <Button className="w-full group-hover:bg-blue-600 transition-colors">
                                  View Course
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDropCourse(enrollment.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Browse Courses Tab (formerly "browse", now "courses" as per outline) */}
          <TabsContent value="courses" className="mt-6 space-y-6">
            {/* Enrollment Limit Warning */}
            <Card className="border-l-4 border-l-orange-500 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-900 mb-1">Enrollment Limit</p>
                    <p className="text-sm text-orange-700">
                      You can enroll in a maximum of <strong>{MAX_COURSES_PER_SEMESTER} active courses per semester</strong>.
                      For the current selected semester '{selectedSemester}': <strong>{currentSemesterCount(selectedSemester)}/{MAX_COURSES_PER_SEMESTER}</strong> courses enrolled.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label>Search Courses</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Search by course name or code..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Filter by College</Label>
                    <Select value={filters.college} onValueChange={(value) => setFilters(prev => ({ ...prev, college: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Colleges</SelectItem>
                        {colleges.map(college => (
                          <SelectItem key={college.id} value={college.id}>
                            {college.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Filter by Program</Label>
                    <Select value={filters.program} onValueChange={(value) => setFilters(prev => ({ ...prev, program: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
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
              </CardContent>
            </Card>

            {/* Available Courses */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Available Courses ({filteredCourses.length})
              </h2>
              {filteredCourses.length === 0 ? (
                <Card className="border-none shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-500">
                      {filters.search || filters.program !== 'all' || filters.college !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'No courses are currently available for enrollment'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map(course => {
                    const isEnrolled = enrolledCourseIds.includes(course.id);
                    const courseActiveEnrollmentCount = enrollmentCounts[course.id] || 0;
                    const isFull = course.enrollment_limit && courseActiveEnrollmentCount >= course.enrollment_limit;
                    const semesterLimitReached = currentSemesterCount(course.semester) >= MAX_COURSES_PER_SEMESTER;

                    return (
                      <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md group">
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
                            <div className="absolute top-4 right-4 flex gap-2">
                              <Badge className={`${programColors[course.program]} border text-white`}> {/* Added text-white */}
                                {course.program}
                              </Badge>
                              {isEnrolled && (
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Enrolled
                                </Badge>
                              )}
                              {isFull && !isEnrolled && (
                                <Badge className="bg-red-100 text-red-700 border-red-200">
                                  Full
                                </Badge>
                              )}
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
                              {course.instructor_name || 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {course.semester}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <BookOpen className="w-4 h-4" />
                              {course.credits} Credits
                            </div>
                            {course.enrollment_limit && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                {courseActiveEnrollmentCount}/{course.enrollment_limit} enrolled
                              </div>
                            )}
                          </div>
                          {semesterLimitReached && !isEnrolled && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3">
                              <p className="text-xs text-orange-700 text-center">
                                Semester limit reached ({currentSemesterCount(course.semester)}/{MAX_COURSES_PER_SEMESTER})
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Link to={`${createPageUrl("course-detail")}?id=${course.id}`} className="flex-1">
                              <Button variant="outline" className="w-full">
                                View Details
                              </Button>
                            </Link>
                            {isEnrolled ? (
                              <Button
                                variant="outline"
                                className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                disabled
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Enrolled
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleEnroll(course)}
                                disabled={isFull || semesterLimitReached || enrollMutation.isPending}
                                className="flex-1"
                              >
                                {enrollMutation.isPending && selectedCourse?.id === course.id ? 'Enrolling...' : isFull ? 'Course Full' : 'Enroll'}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Transcripts Tab */}
          <TabsContent value="transcript" className="mt-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Academic Transcripts</h2>

              {/* Generate Transcript Section */}
              <Card className="border-none shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Generate Unofficial Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Generate an unofficial transcript for a completed semester.
                      Only graded courses from the selected semester will be included.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1 w-full">
                        <Label htmlFor="transcript-semester">Select Semester</Label>
                        <Select
                          value={selectedSemester}
                          onValueChange={setSelectedSemester}
                          disabled={semesters.length === 0}
                        >
                          <SelectTrigger className="mt-2" id="transcript-semester">
                            <SelectValue placeholder="Choose a semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {semesters.length > 0 ? (
                              semesters.map(semester => (
                                <SelectItem key={semester} value={semester}>
                                  {semester}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-semesters" disabled>No semesters available</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => handleGenerateTranscript(selectedSemester)}
                        disabled={generateTranscriptMutation.isPending || !selectedSemester || semesters.length === 0}
                        className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {generateTranscriptMutation.isPending ? 'Generating...' : 'Generate Transcript'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Transcripts */}
              {transcripts.length > 0 ? (
                <div className="space-y-6">
                  {transcripts.sort((a,b) => b.generated_date.localeCompare(a.generated_date)).map(transcript => (
                    <UnofficialTranscript
                      key={transcript.id}
                      transcript={transcript}
                      user={user}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Transcripts Available
                    </h3>
                    <p className="text-gray-500">
                      Complete your courses and generate your first transcript above
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* My Program Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="w-6 h-6" />
                  My Program Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {user?.program && user?.college_id ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-500">Full Name</Label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{user.full_name}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Email</Label>
                        <p className="text-lg text-gray-900 mt-1">{user.email}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Student ID</Label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{user.student_id || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Enrollment Date</Label>
                        <p className="text-lg text-gray-900 mt-1">
                          {user.enrollment_date ? format(new Date(user.enrollment_date), 'PPP') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-500">College</Label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{user.college_name}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Program Level</Label>
                        <Badge className={`bg-gradient-to-r ${programColors[user.program]} text-white border-0 text-lg px-4 py-2 mt-1`}>
                          {user.program}
                        </Badge>
                      </div>
                      {user.degree_program && (
                        <div>
                          <Label className="text-gray-500">Degree Program</Label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">{user.degree_program}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-gray-500">Account Status</Label>
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-lg px-4 py-2 mt-1">
                          {user.status || 'Active'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <GraduationCap className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Complete Your Profile
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Select your college and program to start enrolling in courses
                    </p>
                    <Button onClick={() => setShowProgramDialog(true)}>
                      Select Program
                    </Button>
                  </div>
                )}

                {user?.program && (
                  <div className="pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setShowProgramDialog(true)}
                      className="w-full md:w-auto"
                    >
                      Update Program Information
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Program Selection Dialog */}
        <Dialog open={showProgramDialog} onOpenChange={setShowProgramDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Select Your Program</DialogTitle>
              <DialogDescription>
                Choose your college and degree program to personalize your learning experience
              </DialogDescription>
            </DialogHeader>
            <ProgramSelectionForm
              colleges={colleges}
              onSubmit={handleProgramSelection}
              isLoading={updateProfileMutation.isPending}
              currentData={user}
            />
          </DialogContent>
        </Dialog>

        {/* Enrollment Confirmation Dialog */}
        <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Enrollment</DialogTitle>
              <DialogDescription>
                Are you sure you want to enroll in this course?
              </DialogDescription>
            </DialogHeader>
            {selectedCourse && (
              <div className="py-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-4">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{selectedCourse.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">Course Code: {selectedCourse.code}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Program:</span>
                      <p className="font-semibold">{selectedCourse.program}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Credits:</span>
                      <p className="font-semibold">{selectedCourse.credits}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Semester:</span>
                      <p className="font-semibold">{selectedCourse.semester}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Instructor:</span>
                      <p className="font-semibold">{selectedCourse.instructor_name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowEnrollDialog(false); setEnrolling(false); }}>
                Cancel
              </Button>
              <Button
                onClick={confirmEnrollment}
                disabled={enrollMutation.isPending || enrolling}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {enrollMutation.isPending || enrolling ? 'Enrolling...' : 'Confirm Enrollment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Drop Course Confirmation Dialog */}
        <Dialog open={showDropConfirmDialog} onOpenChange={setShowDropConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Course Drop</DialogTitle>
              <DialogDescription>
                Are you sure you want to drop this course? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDropConfirmDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmDropCourse}
                disabled={dropEnrollmentMutation.isPending}
                variant="destructive"
              >
                {dropEnrollmentMutation.isPending ? 'Dropping...' : 'Confirm Drop'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ProgramSelectionForm({ colleges, onSubmit, isLoading, currentData }) {
  const [formData, setFormData] = useState({
    college_id: currentData?.college_id || '',
    program: currentData?.program || '',
    degree_program: currentData?.degree_program || ''
  });

  // Effect to update form when currentData changes (e.g., after initial load)
  useEffect(() => {
    if (currentData) {
      setFormData(prev => ({
        ...prev,
        college_id: currentData.college_id || '',
        program: currentData.program || '',
        degree_program: currentData.degree_program || ''
      }));
    }
  }, [currentData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleProgramChange = (value) => {
    setFormData({
      ...formData,
      program: value,
      degree_program: '' // Reset degree program when program level changes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="college">Select College *</Label>
        <Select
          value={formData.college_id}
          onValueChange={(value) => setFormData({ ...formData, college_id: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose your college" />
          </SelectTrigger>
          <SelectContent>
            {colleges.map(college => (
              <SelectItem key={college.id} value={college.id}>
                {college.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="program">Select Program Level *</Label>
        <Select
          value={formData.program}
          onValueChange={handleProgramChange}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose your program level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Associate">Associate Degree</SelectItem>
            <SelectItem value="Bachelor">Bachelor's Degree</SelectItem>
            <SelectItem value="Master">Master's Degree</SelectItem>
            <SelectItem value="Doctorate">Doctorate</SelectItem>
            <SelectItem value="PhD">PhD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.program && DEGREE_PROGRAMS[formData.program] && ( // Check if DEGREE_PROGRAMS[formData.program] exists
        <div className="space-y-2">
          <Label htmlFor="degree_program">Select Degree Program *</Label>
          <Select
            value={formData.degree_program}
            onValueChange={(value) => setFormData({ ...formData, degree_program: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose your specific degree program" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {DEGREE_PROGRAMS[formData.program]?.map(program => (
                <SelectItem key={program} value={program}>
                  {program}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Your program selection will help us recommend relevant courses. You can update this information later from your profile.
        </p>
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={!formData.college_id || !formData.program || !formData.degree_program || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          {isLoading ? 'Saving...' : 'Save Program Selection'}
        </Button>
      </DialogFooter>
    </form>
  );
}
