import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Award, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Search,
  Upload,
  Plus,
  Edit2,
  Trash2,
  ChevronDown
} from "lucide-react";
import Layout from "@/Layout";
import { allPrograms } from "@/data/degreePrograms";

export default function ProgramsCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  const levels = ["All Levels", "Bachelor", "Master", "PhD", "Doctorate", "Associate", "Certificate"];

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
    const totalPrograms = allPrograms.length;
    const activePrograms = allPrograms.filter(p => p.status === "Active").length;
    const bachelorPrograms = allPrograms.filter(p => p.level === "Bachelor").length;
    const graduatePrograms = allPrograms.filter(p => 
      p.level === "Master" || p.level === "PhD" || p.level === "Doctorate"
    ).length;

    return { totalPrograms, activePrograms, bachelorPrograms, graduatePrograms };
  }, []);

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

        <div className="max-w-7xl mx-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Degree Program Management</h1>
            <p className="text-gray-600 mt-1">Manage all degree and certificate programs</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Programs</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPrograms}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Programs</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activePrograms}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bachelor Programs</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.bachelorPrograms}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Graduate Programs</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.graduatePrograms}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full md:w-auto flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search programs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowLevelDropdown(!showLevelDropdown)}
                      className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center gap-2 min-w-[150px] justify-between"
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
                <div className="flex gap-3 w-full md:w-auto">
                  <Button variant="outline" className="gap-2 flex-1 md:flex-none">
                    <Upload className="w-4 h-4" />
                    Bulk Upload
                  </Button>
                  <Button className="gap-2 bg-gray-900 hover:bg-gray-800 flex-1 md:flex-none">
                    <Plus className="w-4 h-4" />
                    Add Program
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Programs Table */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                All Programs ({filteredPrograms.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Program Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Level</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">College</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Credits</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrograms.map((program, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-900">{program.name}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            program.level === 'Master' ? 'bg-orange-100 text-orange-700' :
                            program.level === 'Bachelor' ? 'bg-purple-100 text-purple-700' :
                            program.level === 'Certificate' ? 'bg-blue-100 text-blue-700' :
                            program.level === 'PhD' ? 'bg-red-100 text-red-700' :
                            program.level === 'Doctorate' ? 'bg-pink-100 text-pink-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {program.level}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">{program.college}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{program.credits}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{program.duration}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            {program.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded text-blue-600" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded text-red-600" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredPrograms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No programs found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
