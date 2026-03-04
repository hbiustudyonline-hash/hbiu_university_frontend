import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { base44 } from "@/api/base44Client";
import { allPrograms } from "@/data/degreePrograms";
import { 
  Building2, 
  Search, 
  Mail, 
  Users, 
  BookOpen,
  GraduationCap,
  Award,
  Globe,
  Calendar,
  Clock,
  CreditCard,
  ChevronDown,
  Eye,
  Download,
  Edit2,
  Trash2,
  Plus,
  CheckCircle,
  FileText
} from "lucide-react";

const colorThemes = [
  "from-blue-600 to-purple-600",
  "from-green-600 to-emerald-600",
  "from-red-600 to-pink-600",
  "from-indigo-600 to-blue-500",
  "from-orange-500 to-red-500",
  "from-teal-500 to-cyan-600",
  "from-fuchsia-600 to-purple-700",
  "from-cyan-600 to-blue-600",
  "from-rose-500 to-red-600",
  "from-violet-600 to-purple-600"
];

// College images mapping
const collegeImages = {
  "College of International Studies": "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80",
  "College of Aviation": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  "College of Chaplaincy": "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
  "College of Naturopathic Medicine": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
  "College of Addiction Counseling": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
  "College of Agriculture and Natural Resources": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
  "College of Architecture, Arts and Design": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
  "College of Arts and Humanities": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
  "College of Behavioral Social Science": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
  "College of Business Economics": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  "College of Business and Project Management": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
  "College of Communication and Media": "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&q=80",
  "College of Computer Science": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "College of Earth Science and Industrial Technologies": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
  "College of Education and Human Development": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  "College of Health Science": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  "College of Law and Public Policy": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
  "College of Leadership": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "College of Performing Arts": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  "College of Science and Engineering": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
  "College of Science and Psychology": "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&q=80",
  "College of Science and Social Science": "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&q=80",
  "College of Social Science and Humanitarianism": "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
  "College of Tourism, Hospitality, Management": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "College of Virtual and Performing Arts": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
  "Culinary Institution College": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
  "HBIU College of Coaching": "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
  "HBIU College of Fashion Design": "https://images.unsplash.com/photo-1558769132-cb1aea25f9eb?w=800&q=80",
  "HBIU College for Prior Learning": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
  "HBIU Medical Training Institute": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80",
  "HBIU Seminary": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  "HBIU Training Institute": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  "Certificate Courses": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
  "HBI Heart Royalty International Academy": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
  "College Preparatory High School": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
  "College of Cosmetology": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
  "College of Nature": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80"
};

// Detailed programs for College of International Studies
const internationalStudiesPrograms = [
  // Master's Programs
  { level: "Master", title: "Master of Science in Sustainable International Development with a Minor in Faith-Based Development & Social Ethics", credits: 48, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Arts in Global Communication & Public Diplomacy with a Minor in Religion, Ethics & Public Discourse", credits: 48, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Science in Global Public Health Policy with a Minor in Comparative Theology", credits: 48, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Science in Intelligence, Security & Cyber Diplomacy with a Minor in Jewish Ethics", credits: 48, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Science in Global Economics & Strategic Trade with a Minor in Ethics, Faith & Global Markets", credits: 48, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Arts in Cross-Cultural Leadership & Global Engagement with a Minor in World Faith Traditions", credits: 48, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Arts in International Peace & Conflict Resolution with a Minor in Christian Ministry Studies", credits: 48, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Arts in Humanitarian Aid & Disaster Response with a Minor in Biblical Studies", credits: 48, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Arts in International Affairs & Global Policy with a Minor in Interfaith Dialogue", credits: 48, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Arts in Global Communication & Public Diplomacy with a Minor in Buddhist Studies", credits: 79, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Science in Sustainable International Development with a Minor in Indigenous Religious Studies", credits: 79, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Science in International Environmental Governance with a Minor in Comparative Religious Ethics", credits: 79, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Science in Intelligence, Security & Cyber Diplomacy with a Minor in Jewish Ethics", credits: 79, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Science in Global Public Health Policy with a Minor in Comparative Theology", credits: 79, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master of Science in Global Economics & Strategic Trade with a Minor in Islamic Thought", credits: 79, duration: "2 Years", courses: 45 },
  { level: "Master", title: "Master in International Relations (Minor in Faith-Based Global Development and Diplomacy)", credits: 69, duration: "2 Years", courses: 45 },
  
  // PhD Programs
  { level: "PhD", title: "PhD in Global Security & Peace with Minor in Religion, Conflict & Peacebuilding", credits: 103, duration: "4 Years", courses: 45 },
  { level: "PhD", title: "PhD in Global Ethics & Policy with Minor in Religion & Global Ethics", credits: 103, duration: "4 Years", courses: 45 },
  { level: "PhD", title: "PhD in Global Development & Policy with Minor in Religion & Development", credits: 103, duration: "4 Years", courses: 45 },
  { level: "PhD", title: "PhD in MENA Studies with a Minor in Religion & Politics in the MENA", credits: 103, duration: "4 Years", courses: 45 },
  { level: "PhD", title: "PhD in International Political Economy with Minor in Religion & Global Markets", credits: 103, duration: "4 Years", courses: 45 },
  { level: "PhD", title: "PhD in Migration & Diaspora Studies with Minor in Religion & Migration", credits: 103, duration: "4 Years", courses: 45 },
  { level: "PhD", title: "PhD in African Studies with Minor in Religion & African International Affairs", credits: 103, duration: "4 Years", courses: 45 },
  { level: "PhD", title: "PhD in Global Media & Communication with Minor in Religion & Media", credits: 103, duration: "4 Years", courses: 45 },
  { level: "PhD", title: "PhD in International Human Rights with Minor in Religion & Human Rights", credits: 103, duration: "4 Years", courses: 45 },
  { level: "PhD", title: "PhD in International Studies with Minor in Global Religion & World Affairs", credits: 103, duration: "4 Years", courses: 45 },
  
  // Bachelor's Programs
  { level: "Bachelor", title: "Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions", credits: 135, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Science in Global Health & Humanitarian Studies with a Minor in World Religions", credits: 135, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Science in International Environmental Sustainability with a Minor in Indigenous Spiritual Traditions", credits: 135, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Arts in Global Tourism & International Hospitality with a Minor in Comparative Scripture Studies", credits: 135, duration: "4 Years", courses: 47 },
  { level: "Bachelor", title: "Bachelor of Arts in International Development & Policy with a Minor in Interfaith Studies", credits: 135, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Arts in Global Communication & Media with a Minor in Interfaith Studies", credits: 135, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Science in Global Health & Humanitarian Studies with a Minor in World Religions", credits: 135, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Arts in International Relations & Diplomacy with a Minor in Christian Theology", credits: 135, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Science in International Security & Intelligence with a Minor in Jewish Studies", credits: 135, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Arts in Global Tourism & International Hospitality with a Minor in Comparative Scripture Studies", credits: 134, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Science in Global Trade & Economics with a Minor in Interfaith Studies", credits: 120, duration: "0 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Arts in International Development & Policy with a Minor in Interfaith Studies", credits: 135, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Arts in Global Communication & Media with a Minor in Interfaith Studies", credits: 134, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions", credits: 135, duration: "4 Years", courses: 47 },
  { level: "Bachelor", title: "Bachelor of Science in Human Rights, Peace & Conflict Studies with a Minor in Biblical Studies", credits: 135, duration: "4 Years", courses: 45 },
  { level: "Bachelor", title: "Bachelor in International Relations (Minor in Faith-Based Global Development and Diplomacy)", credits: 135, duration: "4 Years", courses: 45 },
  
  // Doctorate Programs
  { level: "Doctorate", title: "Doctor of International Trade (Minor in Faith-Based Fair Trade Advocacy)", credits: 105, duration: "3 Years", courses: 45 },
  { level: "Doctorate", title: "Doctor of Philosophy in International Relations & Global Governance with a Minor in World Religions", credits: 96, duration: "4 Years", courses: 45 }
];

const collegesData = [
  {
    id: 1,
    name: "College of International Studies",
    dean: "TBA",
    email: "info1@hbiu.edu",
    theme: colorThemes[0],
    image: collegeImages["College of International Studies"],
    about: "The College of International Studies is dedicated to preparing global leaders who understand the complex interplay of international relations, cultural dynamics, and faith-based perspectives. Our programs integrate rigorous academic study with practical experience in diplomacy, development, security, and cross-cultural engagement.",
    programOutline: "Our comprehensive curriculum spans Bachelor's, Master's, and Doctoral programs, each designed to equip students with the knowledge, skills, and ethical framework needed for impactful careers in international affairs. Programs emphasize interdisciplinary learning, combining political science, economics, cultural studies, and religious perspectives.",
    detailedPrograms: internationalStudiesPrograms,
    courses: internationalStudiesPrograms,
    staff: ["Dean of International Studies", "Associate Dean for Academic Affairs", "Director of Global Programs", "Faculty Members (20+)", "Administrative Staff"],
    announcements: [
      "Welcome to the new academic year!",
      "International Student Exchange Program applications now open.",
      "Global Leadership Summit - Register now for our annual conference.",
      "New partnerships with universities in 15 countries announced."
    ],
    community: "Our college maintains active partnerships with international organizations, embassies, NGOs, and academic institutions worldwide. Students engage in study abroad programs, international internships, and collaborative research projects that address global challenges through culturally-sensitive and faith-informed approaches.",
    adminInfo: "The College of International Studies maintains accreditation through relevant international education bodies and adheres to the highest standards of academic excellence. Our programs are regularly reviewed and updated to reflect current global dynamics and emerging international issues.",
    statistics: {
      students: 450,
      faculty: 35,
      programs: internationalStudiesPrograms.length
    }
  },
  ...["College of Aviation",
  "College of Chaplaincy",
  "College of Naturopathic Medicine",
  "College of Addiction Counseling",
  "College of Agriculture and Natural Resources",
  "College of Architecture, Arts and Design",
  "College of Arts and Humanities",
  "College of Behavioral Social Science",
  "College of Business Economics",
  "College of Business and Project Management",
  "College of Communication and Media",
  "College of Computer Science",
  "College of Earth Science and Industrial Technologies",
  "College of Education and Human Development",
  "College of Health Science",
  "College of Law and Public Policy",
  "College of Leadership",
  "College of Performing Arts",
  "College of Science and Engineering",
  "College of Science and Psychology",
  "College of Science and Social Science",
  "College of Social Science and Humanitarianism",
  "College of Tourism, Hospitality, Management",
  "College of Virtual and Performing Arts",
  "Culinary Institution College",
  "HBIU College of Coaching",
  "HBIU College of Fashion Design",
  "HBIU College for Prior Learning",
  "HBIU Medical Training Institute",
  "HBIU Seminary",
  "HBIU Training Institute",
  "Certificate Courses",
  "HBI Heart Royalty International Academy",
  "College Preparatory High School",
  "College of Cosmetology",
  "College of Nature"
].map((name, index) => ({
  id: index + 2,
  name,
  dean: "TBA",
  email: `info${index + 2}@hbiu.edu`,
  theme: colorThemes[(index + 1) % colorThemes.length],
  image: collegeImages[name],
  about: "This college is committed to academic excellence, leadership development, and professional preparation within its discipline. We provide world-class education that prepares students for successful careers and meaningful contributions to society.",
  programOutline: "Program outlines will be structured by academic level, specialization, credit requirements, practicum components, and capstone expectations. Each program is designed to meet industry standards and accreditation requirements.",
  courses: [
    { level: "Bachelor", title: "Undergraduate Programs", credits: 120, duration: "4 Years", courses: 40 },
    { level: "Master", title: "Graduate Programs", credits: 48, duration: "2 Years", courses: 16 },
    { level: "PhD", title: "Doctoral Programs", credits: 90, duration: "4 Years", courses: 30 },
    { level: "Certificate", title: "Certificate Programs", credits: 30, duration: "1 Year", courses: 10 }
  ],
  staff: ["Dean", "Associate Dean", "Program Director", "Faculty Members", "Administrative Staff"],
  announcements: [
    "Welcome to the new academic year.",
    "Registration for the upcoming semester is now open.",
    "Check your student portal for important updates."
  ],
  community: "Community engagement initiatives and outreach programs connect our students with real-world experiences. We partner with local organizations and industry leaders to provide meaningful opportunities for service learning and professional development.",
  adminInfo: "Administrative policies, accreditation alignment, compliance documentation, and institutional effectiveness measures ensure our programs maintain the highest standards of quality and integrity.",
  statistics: {
    students: Math.floor(Math.random() * 500) + 100,
    faculty: Math.floor(Math.random() * 50) + 10,
    programs: Math.floor(Math.random() * 15) + 5
  }
}))
];

export default function Colleges() {
  const [activeCollege, setActiveCollege] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const [collegeCourses, setCollegeCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const { user, isAdmin, isLecturer, isStudent } = useAuth();
  
  // Program Outlines page states
  const [programSearchQuery, setProgramSearchQuery] = useState("");
  const [selectedProgramLevel, setSelectedProgramLevel] = useState("All Levels");
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showAddProgramDialog, setShowAddProgramDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewingProgram, setViewingProgram] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [programFormData, setProgramFormData] = useState({
    title: "",
    level: "",
    department: "",
    credits: "",
    duration: "",
    description: ""
  });

  // Generate appropriate course cover image based on course category/title
  const getCourseCoverImage = (course) => {
    if (course.thumbnail) return course.thumbnail;
    
    const title = course.title?.toLowerCase() || '';
    const category = course.category?.toLowerCase() || '';
    const searchText = `${title} ${category}`;
    
    // Map course topics to appropriate stock images
    if (searchText.includes('intelligence') || searchText.includes('security')) {
      return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80';
    } else if (searchText.includes('trade') || searchText.includes('econom')) {
      return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80';
    } else if (searchText.includes('financial') || searchText.includes('crisis')) {
      return 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80';
    } else if (searchText.includes('supply chain') || searchText.includes('management')) {
      return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80';
    } else if (searchText.includes('algebra') || searchText.includes('math')) {
      return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80';
    } else if (searchText.includes('media') || searchText.includes('communication')) {
      return 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&q=80';
    } else if (searchText.includes('ethnographic') || searchText.includes('anthropology')) {
      return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80';
    } else if (searchText.includes('environmental') || searchText.includes('climate')) {
      return 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80';
    } else if (searchText.includes('tourism') || searchText.includes('hospitality')) {
      return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
    } else if (searchText.includes('event') || searchText.includes('convention')) {
      return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80';
    } else if (searchText.includes('research') || searchText.includes('methods')) {
      return 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800&q=80';
    } else if (searchText.includes('migration') || searchText.includes('policy')) {
      return 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80';
    } else if (searchText.includes('theology') || searchText.includes('christian')) {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80';
    } else if (searchText.includes('political') || searchText.includes('inquiry')) {
      return 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80';
    } else if (searchText.includes('cruise') || searchText.includes('resort')) {
      return 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80';
    }
    
    // Default image for general education
    return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80';
  };

  // Helper function to normalize college names for comparison
  const normalizeCollegeName = (name) => {
    if (!name) return '';
    return name
      .replace(/[&,]/g, '') // Remove & and commas
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim()
      .toLowerCase();
  };

  // Utility function for creating page URLs
  const createPageUrl = (path) => `/${path}`;

  // Get college-specific programs from allPrograms
  const collegePrograms = useMemo(() => {
    if (!activeCollege) return [];
    const normalized = normalizeCollegeName(activeCollege.name);
    return allPrograms.filter(program => {
      const programCollege = normalizeCollegeName(program.college);
      return programCollege === normalized;
    });
  }, [activeCollege]);

  // Filter programs based on search and level for the Program Outlines section
  const filteredProgramOutlines = useMemo(() => {
    return collegePrograms.filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(programSearchQuery.toLowerCase()) ||
                           program.college.toLowerCase().includes(programSearchQuery.toLowerCase());
      const matchesLevel = selectedProgramLevel === "All Levels" || program.level === selectedProgramLevel;
      return matchesSearch && matchesLevel;
    });
  }, [collegePrograms, programSearchQuery, selectedProgramLevel]);

  // Calculate overall statistics from all programs
  const overallStats = useMemo(() => {
    const bachelorPrograms = allPrograms.filter(p => p.level === "Bachelor").length;
    const phdPrograms = allPrograms.filter(p => p.level === "PhD").length;
    const masterPrograms = allPrograms.filter(p => p.level === "Master").length;
    const associatePrograms = allPrograms.filter(p => p.level === "Associate").length;

    return { bachelorPrograms, phdPrograms, masterPrograms, associatePrograms };
  }, []);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Bachelor':
        return 'bg-green-100 text-green-700';
      case 'Master':
        return 'bg-orange-100 text-orange-700';
      case 'PhD':
        return 'bg-blue-100 text-blue-700';
      case 'Associate':
        return 'bg-purple-100 text-purple-700';
      case 'Doctorate':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewProgram = (program) => {
    console.log("Viewing program:", program);
    setViewingProgram(program);
    setShowViewDialog(true);
  };

  const handleEditProgram = (program) => {
    console.log("Editing program:", program);
    setIsEditMode(true);
    setEditingProgram(program);
    setProgramFormData({
      title: program.name || "",
      level: program.level || "",
      department: program.college || "",
      credits: program.credits?.toString() || "",
      duration: program.duration || "",
      description: program.description || ""
    });
    setShowAddProgramDialog(true);
  };

  const handleAddNewProgram = () => {
    setIsEditMode(false);
    setEditingProgram(null);
    setProgramFormData({
      title: "",
      level: "",
      department: "",
      credits: "",
      duration: "",
      description: ""
    });
    setShowAddProgramDialog(true);
  };

  const handleDeleteProgram = (program) => {
    console.log("Deleting program:", program);
    if (confirm(`Are you sure you want to delete "${program.name}"?`)) {
      alert("Program would be deleted (demo mode)");
    }
  };

  const handleDownloadProgram = (program) => {
    console.log("Downloading program:", program);
    alert(`Downloading outline for: ${program.name}`);
  };

  // Fetch courses when a college is selected
  useEffect(() => {
    const fetchCollegeCourses = async () => {
      if (activeCollege && activeTab === "courses") {
        setLoadingCourses(true);
        try {
          // Fetch courses for this college from API
          const response = await base44.Course.list();
          console.log('[Colleges] Fetched courses:', response.length);
          console.log('[Colleges] Looking for college:', activeCollege.name);
          
          // Normalize both college names for comparison to handle variations like:
          // "College of Business & Economics" vs "College of Business Economics"
          const normalizedActiveCollege = normalizeCollegeName(activeCollege.name);
          console.log('[Colleges] Normalized college name:', normalizedActiveCollege);
          
          const filtered = response.filter(course => {
            if (!course.college || !course.college.name) return false;
            const normalizedCourseName = normalizeCollegeName(course.college.name);
            return normalizedCourseName === normalizedActiveCollege;
          });
          
          console.log('[Colleges] Filtered courses for', activeCollege.name, ':', filtered.length);
          if (filtered.length === 0 && response.length > 0) {
            console.log('[Colleges] Sample course college names:', response.slice(0, 5).map(c => ({
              original: c.college?.name,
              normalized: normalizeCollegeName(c.college?.name)
            })));
          }
          
          setCollegeCourses(filtered);
        } catch (error) {
          console.error('Error fetching courses:', error);
          setCollegeCourses([]);
        } finally {
          setLoadingCourses(false);
        }
      }
    };

    fetchCollegeCourses();
  }, [activeCollege, activeTab]);

  const filteredColleges = collegesData.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleName = () => {
    if (isAdmin()) return "Admin";
    if (isLecturer()) return "Lecturer";
    if (isStudent()) return "Student";
    return "Guest";
  };

  const CollegesGrid = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Colleges</h2>
          <p className="text-gray-600 mt-1">Explore our {collegesData.length} colleges</p>
        </div>
        <Badge variant="outline" className="text-sm px-4 py-2">
          Viewing as: {getRoleName()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map((college, index) => (
          <motion.div
            key={college.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={college.image} 
                  alt={college.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${college.theme} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Badge className="bg-white/90 text-gray-900 mb-2">
                    <Building2 className="w-3 h-3 mr-1" />
                    College #{college.id}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 h-14">
                  {college.name}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{college.statistics.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{college.statistics.faculty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{college.statistics.programs}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs">{college.email}</span>
                  </div>
                  <Button 
                    className={`w-full bg-gradient-to-r ${college.theme} hover:opacity-90 transition-opacity`}
                    onClick={() => { 
                      setActiveCollege(college); 
                      setActiveTab("about"); 
                    }}
                  >
                    Explore College
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        activeTab === id 
          ? "bg-white text-gray-900 shadow-md" 
          : "bg-white/20 text-white hover:bg-white/30"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );

  const CollegeDetail = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r ${activeCollege.theme} text-white rounded-2xl overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <img 
            src={activeCollege.image} 
            alt={activeCollege.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-10">
          <Badge className="bg-white/90 text-gray-900 mb-4">
            <Building2 className="w-3 h-3 mr-1" />
            College #{activeCollege.id}
          </Badge>
          <h1 className="text-4xl font-bold mb-4">{activeCollege.name}</h1>
          <p className="max-w-3xl text-lg opacity-95">{activeCollege.about}</p>
          
          {/* Statistics */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <Users className="w-4 h-4" />
                Students
              </div>
              <div className="text-2xl font-bold">{activeCollege.statistics.students}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <GraduationCap className="w-4 h-4" />
                Faculty
              </div>
              <div className="text-2xl font-bold">{activeCollege.statistics.faculty}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <BookOpen className="w-4 h-4" />
                Programs
              </div>
              <div className="text-2xl font-bold">{activeCollege.statistics.programs}</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <TabButton id="about" label="About Us" icon={Building2} />
            <TabButton id="program" label="Program Outline" icon={BookOpen} />
            <TabButton id="programs" label="Degree Programs" icon={GraduationCap} />
            <TabButton id="courses" label="Courses Catalog" icon={BookOpen} />
            <TabButton id="staff" label="Staff" icon={Users} />
            <TabButton id="announcements" label="Announcements" icon={Globe} />
            <TabButton id="community" label="Community" icon={Users} />
            <TabButton id="admin" label="Admin" icon={Award} />
            {isAdmin() && (
              <TabButton id="dashboard" label="College Dashboard" icon={Building2} />
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <Card className="rounded-2xl shadow-xl">
        <CardContent className="p-8 space-y-6">
          {activeTab === "about" && (
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold mb-4">About {activeCollege.name}</h3>
              <p className="text-gray-700 leading-relaxed">{activeCollege.about}</p>
              <div className="mt-6 p-6 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-lg mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span>{activeCollege.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Dean: {activeCollege.dean}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "program" && (
            <div className="space-y-8">
              {/* Section 1: Available Degree Programs */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium mb-2">
                      🎓 Our Degrees
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Available Degree Programs</h2>
                  </div>
                </div>

                {collegePrograms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {collegePrograms.map((program, index) => (
                      <Card key={index} className="border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {program.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getLevelColor(program.level)}`}>
                                  {program.level}
                                </span>
                                <span className="flex items-center gap-1">
                                  <CreditCard className="w-4 h-4" />
                                  {program.credits} Credits
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {program.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No degree programs available</h3>
                      <p className="text-gray-600">This college does not have any programs in our database yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Section 2: Programs That Shape Your Future */}
              <div>
                <div className="text-center mb-6">
                  <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium mb-3">
                    📚 Academic Programs Overview
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Programs That Shape Your Future</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Choose from our diverse range of degree programs designed to meet your career goals
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-gray-900 mb-2">{overallStats.bachelorPrograms}</div>
                      <div className="text-gray-600 font-medium">Bachelor Programs</div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-gray-900 mb-2">{overallStats.phdPrograms}</div>
                      <div className="text-gray-600 font-medium">PhD Programs</div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-gray-900 mb-2">{overallStats.masterPrograms}</div>
                      <div className="text-gray-600 font-medium">Master Programs</div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-gray-900 mb-2">{overallStats.associatePrograms}</div>
                      <div className="text-gray-600 font-medium">Associate Programs</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Section 3: Degree Program Outlines */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Degree Program Outlines</h2>
                    <p className="text-gray-600 mt-1">Complete course outlines for all degree programs</p>
                  </div>
                </div>

                {/* Search and Filter Bar */}
                <Card className="border-0 shadow-sm mb-6">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Search Degree Programs
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            type="text"
                            placeholder="Search by degree title, department, or description..."
                            value={programSearchQuery}
                            onChange={(e) => setProgramSearchQuery(e.target.value)}
                            className="pl-10 w-full"
                          />
                        </div>
                      </div>
                      <div className="w-full md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Degree Level
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setShowLevelDropdown(!showLevelDropdown)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span className="text-sm font-medium text-gray-700">{selectedProgramLevel}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          </button>
                          {showLevelDropdown && (
                            <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              {["All Levels", "Bachelor", "Master", "PhD", "Associate", "Doctorate"].map((level) => (
                                <button
                                  key={level}
                                  onClick={() => {
                                    setSelectedProgramLevel(level);
                                    setShowLevelDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button 
                        className="bg-black hover:bg-gray-800 gap-2"
                        onClick={handleAddNewProgram}
                      >
                        <Plus className="w-4 h-4" />
                        Add Program Outline
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Program Outlines Grid */}
                {filteredProgramOutlines.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProgramOutlines.map((program, index) => (
                      <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-2 bg-gradient-to-r from-green-400 to-green-600" />
                        <CardContent className="p-6">
                          <div className="mb-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${getLevelColor(program.level)}`}>
                              {program.level}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                            {program.name}
                          </h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <BookOpen className="w-4 h-4" />
                              <span>{program.college}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <CreditCard className="w-4 h-4" />
                                <span>{program.credits} credits</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{program.duration}</span>
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-gray-100 pt-4 mt-4">
                            <button className="text-sm text-blue-600 hover:underline font-medium mb-3 block">
                              📚 45 courses in outline
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewProgram(program)}
                                className="flex-1 px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm font-medium flex items-center justify-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              <button
                                onClick={() => handleDownloadProgram(program)}
                                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditProgram(program)}
                                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProgram(program)}
                                className="px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 text-sm"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No programs found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "programs" && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Degree Programs</h3>
              
              {/* Program Statistics Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {['Bachelor', 'Master', 'PhD', 'Doctorate'].map(level => {
                  const count = activeCollege.courses.filter(c => c.level === level).length;
                  if (count === 0) return null;
                  return (
                    <Card key={level} className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                      <CardContent className="p-4 text-center">
                        <GraduationCap className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-3xl font-bold">{count}</div>
                        <div className="text-sm opacity-90">{level} Programs</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Programs List */}
              <div className="space-y-6">
                {['Master', 'PhD', 'Bachelor', 'Doctorate', 'Associate', 'Certificate'].map(level => {
                  const programs = activeCollege.courses.filter(c => c.level === level);
                  if (programs.length === 0) return null;
                  
                  return (
                    <div key={level}>
                      <h4 className="text-xl font-bold mb-3 text-gray-800">{level} Programs ({programs.length})</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {programs.map((program, i) => (
                          <Card key={i} className="hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className={`${
                                      level === 'PhD' || level === 'Doctorate' ? 'bg-green-500' :
                                      level === 'Master' ? 'bg-purple-500' :
                                      'bg-blue-500'
                                    } text-white`}>
                                      {program.level}
                                    </Badge>
                                  </div>
                                  <h5 className="font-semibold text-gray-900 mb-1">
                                    {typeof program === 'string' ? program : program.title}
                                  </h5>
                                  {program.credits && (
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                                      <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{program.credits} Credits</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <GraduationCap className="w-4 h-4" />
                                        <span>{program.duration}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Award className="w-4 h-4" />
                                        <span>{program.courses} Courses</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div>
              {/* Header Section */}
              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-2">Explore Our Courses</h3>
                <p className="text-gray-600">
                  {collegeCourses.length} courses available for enrollment
                </p>
              </div>

              {/* Filters and Search Section */}
              <div className="mb-8 flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    value={courseSearchTerm}
                    onChange={(e) => setCourseSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>

                {/* Program Filter Dropdown */}
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white h-11 min-w-[160px]"
                >
                  <option value="all">All Programs</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>

                {/* Semester Filter Dropdown */}
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white h-11 min-w-[160px]"
                >
                  <option value="all">All Semesters</option>
                  <option value="Fall 2025">Fall 2025</option>
                  <option value="Spring 2026">Spring 2026</option>
                  <option value="Fall 2026">Fall 2026</option>
                </select>
              </div>

              {/* Course Cards Grid */}
              {loadingCourses ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600" />
                </div>
              ) : collegeCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collegeCourses
                    .filter(course => {
                      // Filter by search term
                      const matchesSearch = courseSearchTerm === "" || 
                        course.title.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
                        course.code.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
                        (course.category && course.category.toLowerCase().includes(courseSearchTerm.toLowerCase()));
                      
                      // Filter by program level
                      const matchesProgram = selectedProgram === "all" || course.level === selectedProgram;
                      
                      // Filter by semester
                      const courseSemester = course.startDate ? 
                        new Date(course.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "";
                      const matchesSemester = selectedSemester === "all" || courseSemester.includes(selectedSemester);
                      
                      return matchesSearch && matchesProgram && matchesSemester;
                    })
                    .map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                      {/* Course Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={getCourseCoverImage(course)} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Set a gradient background fallback if image fails (royal blue)
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = 'data:image/svg+xml,%3Csvg width="800" height="300" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(29,78,216);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(30,64,175);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="300" fill="url(%23grad)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="48" font-weight="bold" opacity="0.9"%3E' + encodeURIComponent(course.code) + '%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        {/* Course Code Badge - Top Left */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/95 text-gray-900 font-bold text-sm px-3 py-1 hover:bg-white">
                            {course.code}
                          </Badge>
                        </div>
                        {/* Level Badge - Top Right */}
                        <div className="absolute top-3 right-3">
                          <Badge className={`${
                            course.level === 'PhD' ? 'bg-pink-500' :
                            course.level === 'Master' ? 'bg-blue-700' :
                            'bg-blue-700'
                          } text-white font-semibold text-sm px-3 py-1`}>
                            {course.level || 'Bachelor'}
                          </Badge>
                        </div>
                      </div>

                      {/* Course Info */}
                      <CardContent className="p-5">
                        {/* Course Title */}
                        <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 min-h-[56px]">
                          {course.title}
                        </h4>
                        
                        {/* Course Category/Subtitle */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-1">
                          {course.category || course.description}
                        </p>

                        {/* Date Info with Icon */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <Users className="w-4 h-4" />
                          {course.startDate && (
                            <span>
                              {new Date(course.startDate).toLocaleDateString('en-US', { 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </span>
                          )}
                        </div>

                        {/* View Details Button */}
                        <Link to={`${createPageUrl("course-detail")}?id=${course.id}`} className="block">
                          <Button 
                            className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50" 
                            size="sm"
                          >
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h4 className="font-semibold text-lg mb-2">No Courses Available</h4>
                    <p className="text-gray-600">
                      There are currently no courses listed for this college.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "staff" && (
            <div>
              <h3 className="text-2xl font-bold mb-4">College Staff</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCollege.staff.map((member, i) => (
                  <Card key={i} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${activeCollege.theme} rounded-full flex items-center justify-center`}>
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-semibold">{member}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "announcements" && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Announcements</h3>
              <div className="space-y-3">
                {activeCollege.announcements.map((note, i) => (
                  <Card key={i} className="bg-yellow-50 border-l-4 border-yellow-400">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-yellow-600 mt-1" />
                        <span className="text-gray-700">{note}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "community" && (
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold mb-4">Community Engagement</h3>
              <p className="text-gray-700 leading-relaxed">{activeCollege.community}</p>
            </div>
          )}

          {activeTab === "admin" && (
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold mb-4">Administrative Information</h3>
              <p className="text-gray-700 leading-relaxed">{activeCollege.adminInfo}</p>
            </div>
          )}

          {activeTab === "dashboard" && isAdmin() && (
            <div>
              <h3 className="text-2xl font-bold mb-4">College Administration Dashboard</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Total Students</p>
                        <p className="text-3xl font-bold mt-1">{activeCollege.statistics.students}</p>
                      </div>
                      <Users className="w-12 h-12 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Faculty Members</p>
                        <p className="text-3xl font-bold mt-1">{activeCollege.statistics.faculty}</p>
                      </div>
                      <GraduationCap className="w-12 h-12 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Active Programs</p>
                        <p className="text-3xl font-bold mt-1">{activeCollege.statistics.programs}</p>
                      </div>
                      <BookOpen className="w-12 h-12 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <p className="text-gray-700">
                Manage programs, faculty assignments, accreditation reports, announcements, 
                and student analytics here. This dashboard provides comprehensive tools for 
                college administration and oversight.
              </p>
            </div>
          )}

          <div className="pt-6 border-t">
            <Button 
              onClick={() => setActiveCollege(null)}
              variant="outline"
              className="w-full md:w-auto"
            >
              ← Back to All Colleges
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#fef8f0] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {!activeCollege && (
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#012759] to-[#fca31c] bg-clip-text text-transparent mb-2">
              HBI University Colleges
            </h1>
            <p className="text-gray-600 text-lg">
              Explore our diverse range of academic colleges and programs
            </p>
          </div>
        )}

        {/* Search Bar */}
        {!activeCollege && (
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search colleges by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg rounded-xl border-2 focus:border-[#012759]"
              />
            </div>
            {searchTerm && (
              <p className="mt-3 text-sm text-gray-600">
                Found {filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {/* Main Content */}
        {activeCollege ? <CollegeDetail /> : <CollegesGrid />}
      </div>

      {/* Add Program Outline Dialog */}
      <Dialog open={showAddProgramDialog} onOpenChange={setShowAddProgramDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit' : 'Add'} Degree Program Outline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Degree Title *</Label>
                <Input
                  id="title"
                  value={programFormData.title}
                  onChange={(e) => setProgramFormData({...programFormData, title: e.target.value})}
                  placeholder="e.g., Bachelor of Science in Global Trade & Economics..."
                />
              </div>
              <div>
                <Label htmlFor="level">Degree Level *</Label>
                <Select 
                  value={programFormData.level} 
                  onValueChange={(value) => setProgramFormData({...programFormData, level: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Doctorate">Doctorate</SelectItem>
                    <SelectItem value="Associate">Associate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={programFormData.department}
                  onChange={(e) => setProgramFormData({...programFormData, department: e.target.value})}
                  placeholder="e.g., Trade & Economics"
                />
              </div>
              <div>
                <Label htmlFor="credits">Total Credits *</Label>
                <Input
                  id="credits"
                  type="number"
                  value={programFormData.credits}
                  onChange={(e) => setProgramFormData({...programFormData, credits: e.target.value})}
                  placeholder="120"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (Years)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={programFormData.duration}
                  onChange={(e) => setProgramFormData({...programFormData, duration: e.target.value})}
                  placeholder="4"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Program Description</Label>
              <Textarea
                id="description"
                value={programFormData.description}
                onChange={(e) => setProgramFormData({...programFormData, description: e.target.value})}
                placeholder="Provide a comprehensive description of the degree program..."
                rows={6}
              />
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">AI Program Builder</h4>
                  <p className="text-sm text-purple-700 mb-2">
                    Generate comprehensive program details and auto-select all linked courses.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-300 text-purple-700 hover:bg-purple-100"
                    onClick={() => {
                      alert('AI Program Builder feature coming soon! This will automatically generate program details and course selections.');
                    }}
                  >
                    🤖 Generate Complete Program
                  </Button>
                </div>
              </div>
            </div>

            {/* Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Select Courses for This Program (45 selected)
                </h3>
                <Button variant="outline" size="sm" className="text-xs">
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Show Manual Ordering
                </Button>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {[
                    { code: "IRD 358", name: "Intelligence & Foreign Policy", level: "Bachelor" },
                    { code: "IRD 356", name: "International Trade Policy", level: "Bachelor" },
                    { code: "GTE 359", name: "Global Financial Crises", level: "Bachelor" },
                    { code: "SCM 310", name: "Global Supply Chain Management", level: "Bachelor" },
                    { code: "GTE 320", name: "Global Markets & Competition", level: "Bachelor" },
                  ].map((course, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition-colors">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{course.code}</span>
                          <span className="text-sm text-gray-600">- {course.name}</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {course.level}
                      </span>
                    </div>
                  ))}
                  <div className="text-center py-3 text-sm text-gray-500">
                    ... and 40 more courses
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProgramDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                if (isEditMode) {
                  alert(`Updated program: ${programFormData.title}\n\nSave functionality will be implemented to update the program in the database.`);
                  console.log('Updating program:', editingProgram, 'with data:', programFormData);
                } else {
                  alert(`Created new program: ${programFormData.title}\n\nSave functionality will be implemented to store the program in the database.`);
                  console.log('Creating program data:', programFormData);
                }
                setShowAddProgramDialog(false);
              }}
            >
              {isEditMode ? 'Update Program' : 'Save Program'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Program Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Degree Program Outline</DialogTitle>
          </DialogHeader>
          {viewingProgram && (
            <div className="space-y-6">
              {/* Program Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {viewingProgram.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-md ${getLevelColor(viewingProgram.level)}`}>
                        {viewingProgram.level}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        {viewingProgram.college}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Total Credits</div>
                    <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      {viewingProgram.credits}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Duration</div>
                    <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      {viewingProgram.duration}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <div className="text-xl font-bold text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Active
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Program Builder Section */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900 mb-1">🤖 AI Program Builder</h4>
                    <p className="text-sm text-purple-700 mb-3">
                      Generate comprehensive program details and auto-select all linked courses.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                      <p className="text-sm text-green-800 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <strong>45 courses found</strong> with the degree program "{viewingProgram.name}". These will be auto-selected.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-purple-300 text-purple-700 hover:bg-purple-100"
                      onClick={() => {
                        alert('Generating complete program with all linked courses...');
                      }}
                    >
                      🪄 Generate Complete Program
                    </Button>
                  </div>
                </div>
              </div>

              {/* Program Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Program Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {viewingProgram.description || "This program equips students with comprehensive knowledge and skills in their chosen field. The curriculum combines theoretical foundations with practical applications, preparing graduates for successful careers and further academic pursuits."}
                </p>
              </div>

              {/* Courses Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Select Courses for This Program (45 selected)
                  </h3>
                  <Button variant="outline" size="sm" className="text-xs">
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Show Manual Ordering
                  </Button>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid gap-2 max-h-64 overflow-y-auto">
                    {[
                      { code: "IRD 358", name: "Intelligence & Foreign Policy", level: "Bachelor" },
                      { code: "IRD 356", name: "International Trade Policy", level: "Bachelor" },
                      { code: "GTE 359", name: "Global Financial Crises", level: "Bachelor" },
                      { code: "SCM 310", name: "Global Supply Chain Management", level: "Bachelor" },
                      { code: "GTE 320", name: "Global Markets & Competition", level: "Bachelor" },
                    ].map((course, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{course.code}</span>
                            <span className="text-sm text-gray-600">- {course.name}</span>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {course.level}
                        </span>
                      </div>
                    ))}
                    <div className="text-center py-3 text-sm text-gray-500">
                      ... and 40 more courses
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setShowViewDialog(false);
                  handleEditProgram(viewingProgram);
                }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Program
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
