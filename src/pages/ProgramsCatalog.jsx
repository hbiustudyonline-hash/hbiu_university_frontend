import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, 
  Search,
  Download,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  Eye,
  BookOpen,
  Clock,
  CreditCard
} from "lucide-react";
import Layout from "@/Layout";
import { allPrograms } from "@/data/degreePrograms";

export default function ProgramsCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  const levels = ["All Levels", "Bachelor", "Master", "PhD", "Associate"];

  // Sample college degree programs (you can replace with actual college data)
  const collegeDegreePrograms = allPrograms.slice(0, 6);

  // Filter programs based on search and level
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           program.college.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === "All Levels" || program.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, selectedLevel]);

  // Calculate statistics
  const stats = useMemo(() => {
    const bachelorPrograms = allPrograms.filter(p => p.level === "Bachelor").length;
    const phdPrograms = allPrograms.filter(p => p.level === "PhD").length;
    const masterPrograms = allPrograms.filter(p => p.level === "Master").length;
    const associatePrograms = allPrograms.filter(p => p.level === "Associate").length;

    return { bachelorPrograms, phdPrograms, masterPrograms, associatePrograms };
  }, []);

  const handleView = (program) => {
    console.log("Viewing program:", program);
    alert(`Viewing details for: ${program.name}`);
  };

  const handleEdit = (program) => {
    console.log("Editing program:", program);
    alert(`Editing: ${program.name}`);
  };

  const handleDelete = (program) => {
    console.log("Deleting program:", program);
    if (confirm(`Are you sure you want to delete "${program.name}"?`)) {
      alert("Program would be deleted (demo mode)");
    }
  };

  const handleDownload = (program) => {
    console.log("Downloading program:", program);
    alert(`Downloading outline for: ${program.name}`);
  };

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
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout currentPageName="ProgramsCatalog">
      <div className="min-h-screen bg-gray-50">
        {/* Header with important notice */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="font-semibold">IMPORTANT</span>
                <span className="mx-2">|</span>
                <span className="font-medium">College of Leadership and Addiction Counseling</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="text-white hover:underline text-sm font-medium">View Details</button>
              <button className="text-white hover:underline text-sm">×</button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-1 ml-12">
            <p className="text-sm text-white/90">Hello students, I trust you are all doing well. ALL New Graduate / Master's Students! Please be advised...</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Section 1: Available Degree Programs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium mb-2">
                  🎓 Our Degrees
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Available Degree Programs</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collegeDegreePrograms.map((program, index) => (
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
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stats.bachelorPrograms}</div>
                  <div className="text-gray-600 font-medium">Bachelor Programs</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stats.phdPrograms}</div>
                  <div className="text-gray-600 font-medium">PhD Programs</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stats.masterPrograms}</div>
                  <div className="text-gray-600 font-medium">Master Programs</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stats.associatePrograms}</div>
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                        <span className="text-sm font-medium text-gray-700">{selectedLevel}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </button>
                      {showLevelDropdown && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          {levels.map((level) => (
                            <button
                              key={level}
                              onClick={() => {
                                setSelectedLevel(level);
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
                  <Button className="bg-black hover:bg-gray-800 gap-2">
                    <Plus className="w-4 h-4" />
                    Add Program Outline
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Program Outlines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program, index) => (
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
                          onClick={() => handleView(program)}
                          className="flex-1 px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(program)}
                          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(program)}
                          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(program)}
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

            {filteredPrograms.length === 0 && (
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
      </div>
    </Layout>
  );
}
