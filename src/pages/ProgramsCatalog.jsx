import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search,
  Eye,
} from "lucide-react";
import Layout from "@/Layout";
import { allPrograms } from "@/data/degreePrograms";

export default function ProgramsCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedCollege, setSelectedCollege] = useState("All Colleges");

  // Get unique colleges
  const colleges = useMemo(() => {
    const uniqueColleges = [...new Set(allPrograms.map(p => p.college))];
    return uniqueColleges.sort();
  }, []);

  // Filter programs based on search, level, and college
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           program.college.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === "All Levels" || program.level === selectedLevel; 
      const matchesCollege = selectedCollege === "All Colleges" || program.college === selectedCollege;
      return matchesSearch && matchesLevel && matchesCollege;
    });
  }, [searchQuery, selectedLevel, selectedCollege]);

  // Calculate statistics
  const stats = useMemo(() => {
    const certificatePrograms = allPrograms.filter(p => p.level === "Certificate").length;
    const associatePrograms = allPrograms.filter(p => p.level === "Associate").length;
    const bachelorPrograms = allPrograms.filter(p => p.level === "Bachelor").length;
    const masterPrograms = allPrograms.filter(p => p.level === "Master").length;
    const doctoratePrograms = allPrograms.filter(p => p.level === "Doctorate").length;
    const phdPrograms = allPrograms.filter(p => p.level === "PhD").length;

    return { certificatePrograms, associatePrograms, bachelorPrograms, masterPrograms, doctoratePrograms, phdPrograms };
  }, []);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Bachelor':
        return 'bg-purple-100 text-purple-700';
      case 'Master':
        return 'bg-orange-100 text-orange-700';
      case 'PhD':
        return 'bg-blue-100 text-blue-700';
      case 'Associate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Certificate':
        return 'bg-green-100 text-green-700';
      case 'Doctorate':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout currentPageName="ProgramsCatalog">
      <div className="min-h-screen bg-white">
        {/* Blue Header with Statistics */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">HBIU PROGRAMS</h1>
              <h2 className="text-3xl md:text-4xl font-light mb-4">CATALOG</h2>
              <p className="text-blue-100 text-lg">Explore Our Comprehensive Academic Programs</p>
            </div>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
                <div className="text-4xl font-bold mb-2">{stats.certificatePrograms}</div>
                <div className="text-blue-100 text-sm font-medium">Certificate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
                <div className="text-4xl font-bold mb-2">{stats.associatePrograms}</div>
                <div className="text-blue-100 text-sm font-medium">Associate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
                <div className="text-4xl font-bold mb-2">{stats.bachelorPrograms}</div>
                <div className="text-blue-100 text-sm font-medium">Bachelor</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
                <div className="text-4xl font-bold mb-2">{stats.masterPrograms}</div>
                <div className="text-blue-100 text-sm font-medium">Master</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
                <div className="text-4xl font-bold mb-2">{stats.doctoratePrograms}</div>
                <div className="text-blue-100 text-sm font-medium">Doctorate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
                <div className="text-4xl font-bold mb-2">{stats.phdPrograms}</div>
                <div className="text-blue-100 text-sm font-medium">PhD</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 mt-8">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Levels">All Levels</SelectItem>
                <SelectItem value="Certificate">Certificate</SelectItem>
                <SelectItem value="Associate">Associate</SelectItem>
                <SelectItem value="Bachelor">Bachelor</SelectItem>
                <SelectItem value="Master">Master</SelectItem>
                <SelectItem value="Doctorate">Doctorate</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCollege} onValueChange={setSelectedCollege}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Colleges">All Colleges</SelectItem>
                {colleges.map((college) => (
                  <SelectItem key={college} value={college}>
                    {college}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Programs Table */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Program Name</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Level</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">College</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Credits</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Duration</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Course Outline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPrograms.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-gray-500">
                          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-lg font-medium">No programs found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </td>
                      </tr>
                    ) : (
                      filteredPrograms.map((program, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-medium text-gray-900">{program.name}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getLevelColor(program.level)}`}>
                              {program.level}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {program.college}
                          </td>
                          <td className="py-4 px-6 text-center text-sm text-gray-900 font-medium">
                            {program.credits}
                          </td>
                          <td className="py-4 px-6 text-center text-sm text-gray-900 font-medium">
                            {program.duration}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <Button
                              onClick={() => alert(`View details for: ${program.name}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                              size="sm"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
