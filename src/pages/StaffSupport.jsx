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
import { MessageSquare, Clock, AlertCircle, CheckCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/Layout";

export default function StaffSupport() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock support tickets data
  const tickets = [
    {
      id: 1,
      studentName: 'John Doe',
      subject: 'Issue with course enrollment',
      status: 'open',
      priority: 'urgent',
      date: '2 hours ago',
      message: 'I am unable to enroll in GEN 101 course'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      subject: 'Grade inquiry',
      status: 'in-progress',
      priority: 'normal',
      date: '5 hours ago',
      message: 'Could you review my quiz score'
    }
  ];

  const filteredTickets = selectedFilter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === selectedFilter);

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const urgentCount = tickets.filter(t => t.priority === 'urgent').length;

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Layout currentPageName="StaffSupport">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Support Ticket Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage and respond to student queries</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-gray-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{openCount}</p>
                    <p className="text-sm text-gray-600 mt-1">Open Tickets</p>
                  </div>
                  <Clock className="w-8 h-8 text-gray-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{inProgressCount}</p>
                    <p className="text-sm text-gray-600 mt-1">In Progress</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{resolvedCount}</p>
                    <p className="text-sm text-gray-600 mt-1">Resolved</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{urgentCount}</p>
                    <p className="text-sm text-gray-600 mt-1">Urgent</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Tickets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Support Tickets</CardTitle>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tickets</h3>
                  <p className="text-gray-500">No support tickets match your filter</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{ticket.studentName}</h4>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{ticket.subject}</h3>
                          <p className="text-gray-600 mb-2">{ticket.message}</p>
                          <p className="text-sm text-gray-500">{ticket.date}</p>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
