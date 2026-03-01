import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, FileText, X, BookOpen, Lightbulb, Briefcase, GraduationCap } from "lucide-react";
import Layout from "@/Layout";
import { allPrograms } from "@/data/degreePrograms";

export default function Programs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedCollege, setSelectedCollege] = useState("All Colleges");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (program) => {
    setSelectedProgram(program);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
  };

  // Get unique colleges from programs
  const colleges = useMemo(() => {
    const uniqueColleges = [...new Set(allPrograms.map(p => p.college))];
    return ["All Colleges", ...uniqueColleges.sort()];
  }, []);

  // Filter programs based on search, level, and college
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(program => {
      const matchesSearch = 
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.college.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === "All Levels" || program.level === selectedLevel;
      const matchesCollege = selectedCollege === "All Colleges" || program.college === selectedCollege;
      return matchesSearch && matchesLevel && matchesCollege && program.status === "Active";
    });
  }, [searchQuery, selectedLevel, selectedCollege]);

  // Calculate statistics by level
  const stats = useMemo(() => {
    const activePrograms = allPrograms.filter(p => p.status === "Active");
    return {
      certificate: activePrograms.filter(p => p.level === "Certificate").length,
      associate: activePrograms.filter(p => p.level === "Associate").length,
      bachelor: activePrograms.filter(p => p.level === "Bachelor").length,
      master: activePrograms.filter(p => p.level === "Master").length,
      doctorate: activePrograms.filter(p => p.level === "Doctorate").length,
      phd: activePrograms.filter(p => p.level === "PhD").length,
    };
  }, []);

  return (
    <Layout currentPageName="Programs">
      <div className="min-h-screen bg-white">
        {/* Hero Section with Blue Gradient */}
        <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-16 px-6">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6TTYgMTR2Mkgydi0yaDR6bTU2IDBoLTR2LTJINHY0aDJ2NGgtMnY0aDJ2NGgtMnY0aDJ2NGgtMnY0aDJ2NGgtMnY0aDJ2NGg0di00aDJ2NGg0di00aDJ2NGg0di00aDJ2NGg0di00aDJ2NGg0di00aDJ2NGg0di00aDJ2NGg0di00aDJ2LTRoMnYtNGgtMnYtNGgydi00aC0ydi00aDJ2LTRoLTJ2LTRoMnYtNGgtMnYtNGgydi00aC0ydi00aDJ2LTRoLTJ2LTRoMlY2aC0yVjRoLTJ2Mmgtdi0ySDV6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
          </div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
              HBIU PROGRAMS
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-300 mb-4">
              CATALOG
            </h2>
            <p className="text-xl text-blue-100">
              Explore Our Comprehensive Academic Programs
            </p>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-12 max-w-6xl mx-auto">
              {[
                { count: stats.certificate, label: "Certificate", level: "Certificate" },
                { count: stats.associate, label: "Associate", level: "Associate" },
                { count: stats.bachelor, label: "Bachelor", level: "Bachelor" },
                { count: stats.master, label: "Master", level: "Master" },
                { count: stats.doctorate, label: "Doctorate", level: "Doctorate" },
                { count: stats.phd, label: "PhD", level: "PhD" },
              ].map((stat) => (
                <button
                  key={stat.label}
                  onClick={() => setSelectedLevel(stat.level)}
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all cursor-pointer ${
                    selectedLevel === stat.level ? 'ring-2 ring-white bg-white/20' : ''
                  }`}
                >
                  <div className="text-4xl font-bold text-white mb-1">{stat.count}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-50 py-6 px-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full h-10"
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full h-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="All Levels">All Levels</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Associate">Associate</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                  <option value="Doctorate">Doctorate</option>
                </select>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full h-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Programs Table */}
        <div className="py-8 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 w-2/5">Program Name</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Level</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">College</th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700">Credits</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Duration</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Course Outline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPrograms.map((program, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="text-sm font-semibold text-gray-900 mb-1">
                            {program.name}
                          </div>
                          {program.description && (
                            <div className="text-xs text-purple-600">
                              {program.description}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                            program.level === 'Master' ? 'bg-orange-100 text-orange-700' :
                            program.level === 'Bachelor' ? 'bg-purple-100 text-purple-700' :
                            program.level === 'Certificate' ? 'bg-blue-100 text-blue-700' :
                            program.level === 'Associate' ? 'bg-cyan-100 text-cyan-700' :
                            program.level === 'PhD' ? 'bg-red-100 text-red-700' :
                            program.level === 'Doctorate' ? 'bg-pink-100 text-pink-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {program.level}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {program.college}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700 text-center">
                          {program.credits}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {program.duration}
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            onClick={() => handleViewDetails(program)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredPrograms.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No programs found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Outline Modal */}
      {showModal && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProgram.name}</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Program Overview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Program Overview</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {selectedProgram.description || `The ${selectedProgram.name} program provides comprehensive education and training in this field. Students will gain both theoretical knowledge and practical skills necessary for professional practice.`}
                </p>
              </div>

              {/* Total Credits and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Credits</div>
                  <div className="text-3xl font-bold text-blue-600">{selectedProgram.credits}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Duration</div>
                  <div className="text-3xl font-bold text-purple-600">{selectedProgram.duration}</div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Learning Outcomes</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Demonstrate comprehensive understanding of core principles and concepts in this field.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Apply theoretical knowledge to solve practical problems in professional contexts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Engage in ethical decision-making and critical thinking in diverse environments.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Develop effective communication and collaboration skills for professional settings.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Demonstrate cultural competency in addressing diverse needs and perspectives.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Evaluate and reflect on professional practice and its impact.</span>
                  </li>
                </ul>
              </div>

              {/* Career Opportunities */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Career Opportunities</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">→</span>
                    <span className="text-gray-700">Professional Practitioner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">→</span>
                    <span className="text-gray-700">Specialist Consultant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">→</span>
                    <span className="text-gray-700">Program Coordinator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">→</span>
                    <span className="text-gray-700">Community Advisor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">→</span>
                    <span className="text-gray-700">Education Coordinator</span>
                  </li>
                </ul>
              </div>

              {/* Courses */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Courses ({Math.ceil(selectedProgram.credits / 3)})</h3>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: Math.ceil(selectedProgram.credits / 3) }).map((_, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <div className="font-medium text-gray-900">
                          Course {index + 1}
                        </div>
                        <div className="text-sm text-gray-500">
                          COURSE {(index + 1) * 100 + 1}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        3 Credits
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
