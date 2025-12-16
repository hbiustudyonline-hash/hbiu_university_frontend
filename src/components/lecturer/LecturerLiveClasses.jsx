import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import { 
  Video, 
  Plus, 
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Copy,
  CheckCircle,
  Info
} from "lucide-react";
import { format } from "date-fns";

export default function LecturerLiveClasses({ courses, user }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    scheduled_time: '',
    duration: 60
  });
  const queryClient = useQueryClient();

  const { data: liveClasses } = useQuery({
    queryKey: ['live-classes'],
    queryFn: async () => {
      // Get all announcements tagged as live classes
      const announcements = await base44.entities.Announcement.list('-created_date');
      return announcements.filter(a => a.title.includes('[LIVE CLASS]'));
    },
    initialData: [],
  });

  const createLiveClassMutation = useMutation({
    mutationFn: async (data) => {
      // Generate a unique Jitsi meeting room
      const roomId = `HBI-${data.course_id.substring(0, 8)}-${Date.now()}`;
      const meetingLink = `https://meet.jit.si/${roomId}`;
      
      // Store as announcement with meeting link
      const course = courses.find(c => c.id === data.course_id);
      return await base44.entities.Announcement.create({
        course_id: data.course_id,
        title: `[LIVE CLASS] ${data.title}`,
        content: `Join the live class session.

**Schedule:** ${format(new Date(data.scheduled_time), 'PPpp')}
**Duration:** ${data.duration} minutes
**Meeting Link:** ${meetingLink}

Click "Join Meeting" to participate in the live session.`,
        pinned: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-classes'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setShowCreateDialog(false);
      setFormData({ course_id: '', title: '', scheduled_time: '', duration: 60 });
    },
  });

  const handleCreateLiveClass = () => {
    createLiveClassMutation.mutate(formData);
  };

  const copyMeetingLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const generateInstantMeeting = () => {
    const roomId = `HBI-Instant-${Date.now()}`;
    return `https://meet.jit.si/${roomId}`;
  };

  const [instantMeetingLink] = useState(generateInstantMeeting());

  const extractMeetingLink = (content) => {
    const match = content.match(/\*\*Meeting Link:\*\* (https?:\/\/[^\s]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Classes</h2>
          <p className="text-gray-500 mt-1">Conduct live video lectures with your students</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Live Class
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Powered by Jitsi Meet</p>
              <p>Free, secure video conferencing with no registration required. Features include screen sharing, chat, and recording.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instant Meeting Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Video className="w-5 h-5" />
            Start Instant Meeting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Start an instant video lecture without scheduling. Share the link with your students.
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 p-3 bg-white rounded-lg border border-purple-200 font-mono text-sm break-all">
              {instantMeetingLink}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => copyMeetingLink(instantMeetingLink)}
                className="border-purple-300"
              >
                {copiedLink === instantMeetingLink ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <a href={instantMeetingLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Video className="w-4 h-4 mr-2" />
                  Start Now
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Scheduled Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {liveClasses.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No scheduled classes</h3>
              <p className="text-gray-500 mb-6">
                Schedule live video lectures to conduct online classes
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Schedule First Class
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {liveClasses.map((liveClass) => {
                const course = courses.find(c => c.id === liveClass.course_id);
                const meetingLink = extractMeetingLink(liveClass.content);
                const title = liveClass.title.replace('[LIVE CLASS] ', '');
                
                return (
                  <div key={liveClass.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{title}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {course?.code} - {course?.title}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(liveClass.created_date), 'PPP')}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        Scheduled
                      </Badge>
                    </div>
                    {meetingLink && (
                      <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-1 p-2 bg-white rounded border border-blue-200 font-mono text-xs break-all">
                          {meetingLink}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyMeetingLink(meetingLink)}
                          >
                            {copiedLink === meetingLink ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </>
                            )}
                          </Button>
                          <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Join Meeting
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2">HD Video & Audio</h4>
            <p className="text-sm text-gray-600">
              Crystal clear video and audio quality for effective teaching
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-2">Large Class Support</h4>
            <p className="text-sm text-gray-600">
              Host lectures with unlimited students simultaneously
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ExternalLink className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold mb-2">Screen Sharing</h4>
            <p className="text-sm text-gray-600">
              Share your screen to present slides and course materials
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Live Class Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Live Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Select 
                value={formData.course_id} 
                onValueChange={(value) => setFormData({ ...formData, course_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Class Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Week 3: Introduction to Algorithms"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_time">Date & Time *</Label>
              <Input
                id="scheduled_time"
                type="datetime-local"
                value={formData.scheduled_time}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900">
                <strong>Note:</strong> A unique meeting link will be generated and shared with students through course announcements.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateLiveClass}
              disabled={!formData.course_id || !formData.title || !formData.scheduled_time || createLiveClassMutation.isPending}
            >
              {createLiveClassMutation.isPending ? 'Creating...' : 'Schedule Class'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}