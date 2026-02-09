import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bell, 
  Sparkles,
  Clock,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Video,
  FileText
} from "lucide-react";

export default function LecturerAnnouncements() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const announcementTypes = [
    {
      id: 'weekly',
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Weekly Module Summary',
      description: 'Summarize recent module content',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'deadline',
      icon: <AlertCircle className="w-6 h-6" />,
      title: 'Assignment Deadline Reminder',
      description: 'Remind about upcoming due dates',
      color: 'bg-pink-50 border-pink-200'
    },
    {
      id: 'liveclass',
      icon: <Video className="w-6 h-6" />,
      title: 'Live Class Reminder',
      description: 'Remind about scheduled live sessions',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      id: 'update',
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Course Update',
      description: 'Announce course changes or updates',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'support',
      icon: <Users className="w-6 h-6" />,
      title: 'Student Support Outreach',
      description: 'Reach out to struggling students',
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  const handleGenerateAnnouncement = async () => {
    if (!selectedCourse || !selectedType) {
      alert('Please select both a course and announcement type');
      return;
    }

    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      alert('Announcement generated successfully!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Announcement Generator</h2>
        <p className="text-gray-500 mt-1">Automatically generate engaging announcements for your students</p>
      </div>

      {/* Generate Announcement Card */}
      <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Sparkles className="w-5 h-5" />
            Generate Announcement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Select Course */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Course *</label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gen101">GEN 101 - English Composition I</SelectItem>
                <SelectItem value="gen104">GEN 104 - Introduction to Computers</SelectItem>
                <SelectItem value="gen106">GEN 106 - Public Speaking and Communication</SelectItem>
                <SelectItem value="hca207">HCA 207 - Healthcare Management</SelectItem>
                <SelectItem value="mat110">MAT 110 - College Algebra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Announcement Type */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Announcement Type *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {announcementTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedType === type.id
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : `${type.color} border-opacity-50 hover:border-opacity-100`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-purple-600 mt-1">
                      {type.icon}
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">{type.title}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateAnnouncement}
            disabled={isGenerating || !selectedCourse || !selectedType}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 rounded-lg font-semibold text-base"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </Button>
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Save Time */}
        <Card className="border-blue-100 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Save Time</h3>
                <p className="text-sm text-gray-700">
                  AI generates professional announcements in seconds, freeing you to focus on teaching.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Engagement */}
        <Card className="border-green-100 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Student Engagement</h3>
                <p className="text-sm text-gray-700">
                  Keep students informed and engaged with timely, personalized communication.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Select Your Course</h4>
                <p className="text-sm text-gray-600 mt-1">Choose the course you want to create an announcement for.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Choose Announcement Type</h4>
                <p className="text-sm text-gray-600 mt-1">Select the type of announcement you need from our pre-built templates.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Generate with AI</h4>
                <p className="text-sm text-gray-600 mt-1">Our AI will create a professional, personalized announcement instantly.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Review & Post</h4>
                <p className="text-sm text-gray-600 mt-1">Review the generated announcement and post it to your course.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <Sparkles className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
            <p className="text-sm text-gray-600">Advanced AI creates contextual, relevant announcements</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <FileText className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Customizable</h4>
            <p className="text-sm text-gray-600">Edit and personalize announcements before posting</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Bell className="w-10 h-10 text-pink-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Instant Delivery</h4>
            <p className="text-sm text-gray-600">Post announcements immediately to reach all students</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
