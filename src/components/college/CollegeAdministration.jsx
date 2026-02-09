import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Send,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

const positionColors = {
  "Dean of College": "bg-purple-100 text-purple-700 border-purple-200",
  "Department Chair": "bg-blue-100 text-blue-700 border-blue-200",
  "Program Director": "bg-green-100 text-green-700 border-green-200",
  "Academic Advisor": "bg-orange-100 text-orange-700 border-orange-200",
  "Counselor": "bg-pink-100 text-pink-700 border-pink-200",
  "Administrator": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Student Counsel": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Student Support": "bg-teal-100 text-teal-700 border-teal-200",
  "Administrative Support Professional": "bg-amber-100 text-amber-700 border-amber-200",
  "Research & Lab Staff": "bg-violet-100 text-violet-700 border-violet-200",
  "Media Staff": "bg-rose-100 text-rose-700 border-rose-200"
};

const positionIcons = {
  "Dean of College": "👔",
  "Department Chair": "📋",
  "Program Director": "🎯",
  "Academic Advisor": "📚",
  "Counselor": "💬",
  "Administrator": "⚙️",
  "Student Counsel": "🤝",
  "Student Support": "💙",
  "Administrative Support Professional": "📝",
  "Research & Lab Staff": "🔬",
  "Media Staff": "🎬"
};

export default function CollegeAdministration({ collegeId, collegeName }) {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: '',
    student_name: '',
    student_email: ''
  });
  const [emailSent, setEmailSent] = useState(false);

  const { data: staff, isLoading } = useQuery({
    queryKey: ['college-staff', collegeId],
    queryFn: () => base44.entities.CollegeStaff.filter({ college_id: collegeId }),
    initialData: [],
    enabled: !!collegeId,
  });

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const sendEmailMutation = useMutation({
    mutationFn: async (data) => {
      return base44.integrations.Core.SendEmail({
        from_name: data.student_name,
        to: data.to_email,
        subject: data.subject,
        body: `
          <h2>Appointment Request from ${data.student_name}</h2>
          <p><strong>From:</strong> ${data.student_email}</p>
          <p><strong>To:</strong> ${data.staff_name} (${data.staff_position})</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><em>This is an automated message from the HBI University Student Portal.</em></p>
        `
      });
    },
    onSuccess: () => {
      setEmailSent(true);
      setTimeout(() => {
        setShowEmailDialog(false);
        setEmailSent(false);
        setEmailForm({ subject: '', message: '', student_name: '', student_email: '' });
      }, 2000);
    },
  });

  const handleContactStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setEmailForm({
      ...emailForm,
      subject: `Appointment Request - ${staffMember.position}`,
      student_name: user?.full_name || '',
      student_email: user?.email || ''
    });
    setShowEmailDialog(true);
  };

  const handleSendEmail = () => {
    sendEmailMutation.mutate({
      to_email: selectedStaff.email,
      staff_name: selectedStaff.name,
      staff_position: selectedStaff.position,
      ...emailForm
    });
  };

  // Group staff by position priority
  const groupedStaff = staff.reduce((acc, member) => {
    const position = member.position;
    if (!acc[position]) acc[position] = [];
    acc[position].push(member);
    return acc;
  }, {});

  const positionOrder = [
    "Dean of College",
    "Department Chair",
    "Program Director",
    "Academic Advisor",
    "Counselor",
    "Administrator",
    "Student Counsel",
    "Student Support",
    "Administrative Support Professional",
    "Research & Lab Staff",
    "Media Staff"
  ];

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-48 bg-gray-200" />
            <CardContent className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Staff Members Listed
          </h3>
          <p className="text-gray-500">
            Administrative staff information will be available soon.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {positionOrder.map(position => {
        const members = groupedStaff[position];
        if (!members || members.length === 0) return null;

        return (
          <div key={position} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{positionIcons[position]}</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{position}</h3>
                <p className="text-gray-500">{members.length} {members.length === 1 ? 'member' : 'members'}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-lg group">
                    <CardHeader className="p-0">
                      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {member.photo ? (
                          <img 
                            src={member.photo} 
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500">
                            <Users className="w-24 h-24 text-white/50" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Badge className={`${positionColors[member.position]} border shadow-lg`}>
                            {member.position}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                        <p className="text-sm text-gray-500">{collegeName}</p>
                      </div>

                      {member.job_description && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {member.job_description}
                        </p>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <a href={`mailto:${member.email}`} className="hover:text-blue-600 truncate">
                            {member.email}
                          </a>
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <a href={`tel:${member.phone}`} className="hover:text-blue-600">
                              {member.phone}
                            </a>
                          </div>
                        )}
                        {member.office_location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{member.office_location}</span>
                          </div>
                        )}
                        {member.office_hours && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{member.office_hours}</span>
                          </div>
                        )}
                      </div>

                      {member.available_for_appointments && (
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleContactStaff(member)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Request Appointment
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Request Appointment with {selectedStaff?.name}
            </DialogTitle>
            <DialogDescription>
              Send an email to request a meeting or appointment
            </DialogDescription>
          </DialogHeader>

          {emailSent ? (
            <div className="py-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Email Sent Successfully!
              </h3>
              <p className="text-gray-600">
                {selectedStaff?.name} will receive your request and contact you soon.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your Name</Label>
                  <Input
                    value={emailForm.student_name}
                    onChange={(e) => setEmailForm({ ...emailForm, student_name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Your Email</Label>
                  <Input
                    type="email"
                    value={emailForm.student_email}
                    onChange={(e) => setEmailForm({ ...emailForm, student_email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  placeholder="Meeting subject"
                />
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  placeholder="Please describe the reason for your appointment request..."
                  rows={6}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      This email will be sent to:
                    </p>
                    <p className="text-sm text-blue-700">
                      {selectedStaff?.name} ({selectedStaff?.email})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!emailSent && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendEmail}
                disabled={!emailForm.student_name || !emailForm.student_email || !emailForm.subject || !emailForm.message || sendEmailMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {sendEmailMutation.isPending ? 'Sending...' : 'Send Email'}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}