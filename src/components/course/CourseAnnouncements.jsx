import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Pin, Bell } from "lucide-react";
import { format } from "date-fns";

export default function CourseAnnouncements({ courseId, isInstructor }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', pinned: false });
  const queryClient = useQueryClient();

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements', courseId],
    queryFn: () => base44.entities.Announcement.filter({ course_id: courseId }),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Announcement.create({
      ...data,
      course_id: courseId,
      posted_at: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', courseId] });
      setFormData({ title: '', content: '', pinned: false });
      setShowForm(false);
    },
  });

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_date) - new Date(a.created_date);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Announcements</h2>
        {isInstructor && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        )}
      </div>

      {showForm && isInstructor && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Input
              placeholder="Announcement title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Textarea
              placeholder="Announcement content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
            />
            <div className="flex justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.pinned}
                  onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Pin this announcement</span>
              </label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => createMutation.mutate(formData)}
                  disabled={!formData.title || !formData.content}
                >
                  Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedAnnouncements.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No announcements yet</h3>
            <p className="text-gray-500">
              {isInstructor ? 'Create your first announcement' : 'Check back later for updates'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedAnnouncements.map(announcement => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {announcement.pinned && (
                      <Pin className="w-4 h-4 text-orange-500" />
                    )}
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                  </div>
                  {announcement.pinned && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Pinned
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(announcement.created_date), 'PPpp')}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}