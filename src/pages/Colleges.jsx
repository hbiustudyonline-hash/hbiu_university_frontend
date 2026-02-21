import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { base44 } from "@/api/base44Client";
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
  Clock
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
          
          // Filter courses by college name (you can also use collegeId if available)
          const filtered = response.filter(course => 
            course.college && course.college.name === activeCollege.name
          );
          
          console.log('[Colleges] Filtered courses for', activeCollege.name, ':', filtered.length);
          if (filtered.length === 0 && response.length > 0) {
            console.log('[Colleges] Sample course college names:', response.slice(0, 5).map(c => c.college?.name));
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
            <div>
              <h3 className="text-2xl font-bold mb-6">Program Outline</h3>
              <p className="text-gray-700 leading-relaxed mb-8">{activeCollege.programOutline}</p>
              
              {/* Academic Levels Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {['Bachelor', 'Master', 'PhD', 'Doctorate'].map(level => {
                  const programCount = activeCollege.courses.filter(c => c.level === level).length;
                  if (programCount === 0) return null;
                  
                  return (
                    <Card key={level} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                      <CardContent className="p-6">
                        <GraduationCap className={`w-10 h-10 mb-3 ${
                          level === 'PhD' || level === 'Doctorate' ? 'text-green-600' :
                          level === 'Master' ? 'text-purple-600' :
                          'text-blue-600'
                        }`} />
                        <h4 className="font-bold text-lg mb-2">{level} Level</h4>
                        <p className="text-sm text-gray-600 mb-2">{programCount} Programs Available</p>
                        <div className="text-xs text-gray-500">
                          {level === 'Bachelor' && '4 Years • 120-135 Credits'}
                          {level === 'Master' && '2 Years • 60-79 Credits'}
                          {level === 'PhD' && '4 Years • 90-103 Credits'}
                          {level === 'Doctorate' && '3-4 Years • 96-105 Credits'}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Curriculum Structure */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-lg">Core Curriculum</h4>
                    </div>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span>Foundation courses in discipline fundamentals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span>Research methodology and academic writing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span>Critical thinking and analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span>Ethics and professional practice</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-bold text-lg">Specialization</h4>
                    </div>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                        <span>Advanced coursework in chosen field</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                        <span>Optional minor concentrations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                        <span>Elective courses for customization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                        <span>Interdisciplinary study options</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-bold text-lg">Practical Experience</h4>
                    </div>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                        <span>Internship and field placement opportunities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                        <span>Hands-on project work</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                        <span>Industry partnerships and collaboration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                        <span>Professional development workshops</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-orange-600" />
                      </div>
                      <h4 className="font-bold text-lg">Capstone & Thesis</h4>
                    </div>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                        <span>Original research projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                        <span>Comprehensive examinations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                        <span>Thesis or dissertation defense</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                        <span>Portfolio and presentation requirements</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Learning Approach */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                <CardContent className="p-6">
                  <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-600" />
                    Our Learning Approach
                  </h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h5 className="font-semibold mb-2 text-blue-900">Interdisciplinary</h5>
                      <p className="text-sm text-gray-700">Integration of multiple fields of study for comprehensive understanding and innovative problem-solving.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2 text-purple-900">Faith-Informed</h5>
                      <p className="text-sm text-gray-700">Ethical frameworks rooted in religious perspectives guide academic inquiry and professional practice.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2 text-indigo-900">Globally Focused</h5>
                      <p className="text-sm text-gray-700">International perspectives and cross-cultural competencies prepare students for global leadership.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                            course.level === 'Master' ? 'bg-purple-500' :
                            'bg-blue-500'
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
                        <Button 
                          className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50" 
                          size="sm"
                        >
                          View Details
                        </Button>
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
    </div>
  );
}
