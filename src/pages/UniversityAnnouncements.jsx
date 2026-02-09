import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Megaphone, Pin, Calendar, User } from "lucide-react";
import Layout from "@/Layout";

export default function UniversityAnnouncements() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock announcements data
  const announcements = [
    {
      id: 1,
      title: 'First Week Focus',
      content: `Welcome, Students!
New Semester:
This week, our primary focus is to ensure that you are fully enrolled in your four courses and have all the necessary materials to begin your studies successfully.

If you have any questions or concerns, please visit the Support Queries section located on the left-hand side of your dashboard and leave us a message. Our team will respond promptly.

Please note: A system update is currently in progress, and you may experience temporary interruptions or blockouts. There is no need to worry—this is a normal part of the update process.

If any of your courses are missing or appear empty, please send a message in your WhatsApp group so we can assist you as quickly as possible.

Additionally, important updates and announcements will be posted on the Announcements page within each course.

We appreciate your patience and wish you a successful start to the week!`,
      author: 'Admin',
      date: 'February 3rd, 2026',
      isPinned: true,
      badges: ['Pinned', 'Important', 'Academic'],
      borderColor: 'border-l-orange-500',
      category: 'academic'
    },
    {
      id: 2,
      title: 'Students access',
      content: 'Students now have access to all course materials and assignments. Please check your dashboard regularly for updates.',
      author: 'Admin',
      date: 'February 2nd, 2026',
      isPinned: true,
      badges: ['Pinned', 'Important', 'Administrative'],
      borderColor: 'border-l-blue-500',
      category: 'administrative'
    },
    {
      id: 3,
      title: 'Spring 2026 Admissions Open',
      content: 'Apply now for our Spring 2026 admission cycle! We are accepting applications for all degree levels. Visit our admissions portal to begin your application.',
      author: 'Admissions Office',
      date: 'February 1st, 2026',
      isPinned: false,
      badges: ['Admissions', 'Important'],
      borderColor: 'border-l-green-500',
      category: 'admissions'
    },
    {
      id: 4,
      title: 'Financial Aid Application Deadline Extended',
      content: 'The financial aid application deadline has been extended to February 15th. Submit your FAFSA and institutional aid forms by the new deadline to be considered for all funding opportunities.',
      author: 'Financial Aid',
      date: 'January 31st, 2026',
      isPinned: false,
      badges: ['Financial Aid', 'Urgent'],
      borderColor: 'border-l-red-500',
      category: 'financial-aid'
    },
    {
      id: 5,
      title: 'Career Services Workshop Series',
      content: 'Join our career services team for weekly workshops on resume building, interview preparation, and professional networking. All students welcome!',
      author: 'Career Services',
      date: 'January 28th, 2026',
      isPinned: false,
      badges: ['Student Services', 'Development'],
      borderColor: 'border-l-purple-500',
      category: 'student-services'
    },
    {
      id: 6,
      title: 'Annual Founder\'s Day Celebration',
      content: 'You are invited to our Annual Founder\'s Day celebration on February 20th. Join us for a day of academic excellence, cultural performances, and community celebration.',
      author: 'Student Life',
      date: 'January 25th, 2026',
      isPinned: false,
      badges: ['Campus Events', 'Community'],
      borderColor: 'border-l-indigo-500',
      category: 'campus-events'
    },
    {
      id: 7,
      title: 'System Maintenance Notice',
      content: 'The platform will undergo scheduled maintenance on February 10th from 2:00 AM to 4:00 AM UTC. During this time, the system will be temporarily unavailable.',
      author: 'System',
      date: 'January 20th, 2026',
      isPinned: false,
      badges: ['System', 'Maintenance'],
      borderColor: 'border-l-gray-500',
      category: 'system'
    }
  ];

  const pinnedAnnouncements = announcements.filter(a => a.isPinned && (selectedCategory === 'all' || a.category === selectedCategory));
  const regularAnnouncements = announcements.filter(a => !a.isPinned && (selectedCategory === 'all' || a.category === selectedCategory));

  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'Pinned': return 'bg-blue-100 text-blue-800';
      case 'Important': return 'bg-red-100 text-red-800';
      case 'Academic': return 'bg-green-100 text-green-800';
      case 'Administrative': return 'bg-purple-100 text-purple-800';
      case 'Admissions': return 'bg-indigo-100 text-indigo-800';
      case 'Financial Aid': return 'bg-amber-100 text-amber-800';
      case 'Student Services': return 'bg-pink-100 text-pink-800';
      case 'Campus Events': return 'bg-fuchsia-100 text-fuchsia-800';
      case 'Urgent': return 'bg-orange-100 text-orange-800';
      case 'System': return 'bg-slate-100 text-slate-800';
      case 'Maintenance': return 'bg-gray-100 text-gray-800';
      case 'Development': return 'bg-cyan-100 text-cyan-800';
      case 'Community': return 'bg-lime-100 text-lime-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout currentPageName="UniversityAnnouncements">
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Megaphone className="w-10 h-10" />
                <div>
                  <h1 className="text-3xl font-bold">University Announcements</h1>
                  <p className="text-blue-100 mt-1">Stay updated with the latest news and updates</p>
                </div>
              </div>
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                + New Announcement
              </Button>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4">
            <Megaphone className="w-5 h-5 text-gray-500" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="admissions">Admissions</SelectItem>
                <SelectItem value="financial-aid">Financial Aid</SelectItem>
                <SelectItem value="student-services">Student Services</SelectItem>
                <SelectItem value="campus-events">Campus Events</SelectItem>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="system">System Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pinned Announcements */}
          {pinnedAnnouncements.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Pin className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-bold text-gray-900">Pinned Announcements</h2>
              </div>

              {pinnedAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`border-l-4 ${announcement.borderColor} bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-wrap gap-2">
                      {announcement.badges.map((badge) => (
                        <Badge key={badge} className={getBadgeColor(badge)}>
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      ⋮
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                  <p className="text-gray-700 whitespace-pre-line mb-4 leading-relaxed">{announcement.content}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {announcement.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {announcement.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Announcements */}
          {regularAnnouncements.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Announcements</h2>

              {regularAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`border-l-4 ${announcement.borderColor} bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-wrap gap-2">
                      {announcement.badges.map((badge) => (
                        <Badge key={badge} className={getBadgeColor(badge)}>
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      ⋮
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                  <p className="text-gray-700 mb-4">{announcement.content}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {announcement.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {announcement.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
