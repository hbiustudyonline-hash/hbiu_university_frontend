import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, BookOpen, FileText, Clock, CheckCircle2 } from "lucide-react";

export default function CourseCalendar({ course, courseId, isInstructor }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample events - in production, fetch from API
  const events = useMemo(() => {
    const today = new Date();
    return [
      {
        id: 1,
        title: "Course Begins",
        date: new Date(today.getFullYear(), today.getMonth(), 1),
        type: "milestone",
        description: "First day of class"
      },
      {
        id: 2,
        title: "Assignment 1 Due",
        date: new Date(today.getFullYear(), today.getMonth(), 15),
        type: "assignment",
        description: "Introduction to General Education essay"
      },
      {
        id: 3,
        title: "Chapter 3 Quiz",
        date: new Date(today.getFullYear(), today.getMonth(), 18),
        type: "quiz",
        description: "Multiple choice quiz on Chapter 3"
      },
      {
        id: 4,
        title: "Midterm Exam",
        date: new Date(today.getFullYear(), today.getMonth(), 25),
        type: "exam",
        description: "Covers chapters 1-5"
      },
      {
        id: 5,
        title: "Assignment 2 Due",
        date: new Date(today.getFullYear(), today.getMonth() + 1, 5),
        type: "assignment",
        description: "Group project presentation"
      },
      {
        id: 6,
        title: "Final Exam",
        date: new Date(today.getFullYear(), today.getMonth() + 1, 20),
        type: "exam",
        description: "Comprehensive final examination"
      },
      {
        id: 7,
        title: "Course Ends",
        date: new Date(today.getFullYear(), today.getMonth() + 1, 30),
        type: "milestone",
        description: "Last day of class"
      }
    ];
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isSameDay = (date1, date2) => {
    return date1?.getDate() === date2?.getDate() &&
           date1?.getMonth() === date2?.getMonth() &&
           date1?.getFullYear() === date2?.getFullYear();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const isToday = (date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const getEventTypeColor = (type) => {
    const colors = {
      milestone: "bg-blue-100 text-blue-700 border-blue-300",
      assignment: "bg-green-100 text-green-700 border-green-300",
      quiz: "bg-yellow-100 text-yellow-700 border-yellow-300",
      exam: "bg-red-100 text-red-700 border-red-300"
    };
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getEventIcon = (type) => {
    const icons = {
      milestone: CalendarIcon,
      assignment: FileText,
      quiz: BookOpen,
      exam: CheckCircle2
    };
    const Icon = icons[type] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const today = isToday(date);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 border border-gray-200 p-2 cursor-pointer hover:bg-blue-50 transition-colors ${
            today ? 'bg-blue-50 border-blue-400' : 'bg-white'
          } ${isSameDay(selectedDate, date) ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className={`text-sm font-semibold mb-1 ${today ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
            {today && <span className="ml-1 text-xs">(Today)</span>}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`text-xs px-1.5 py-0.5 rounded border ${getEventTypeColor(event.type)} truncate`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            Course Calendar
          </CardTitle>
          {isInstructor && (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="bg-gray-100 text-center py-2 text-sm font-semibold text-gray-700 border-b border-gray-200">
                {day}
              </div>
            ))}
            {/* Calendar days */}
            {renderCalendar()}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
              <span>Milestone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
              <span>Assignment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
              <span>Quiz</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
              <span>Exam</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <div key={event.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {event.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No upcoming events</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">
              Events on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map(event => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-white border border-blue-200 rounded-lg">
                    <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <Badge variant="outline" className="text-xs mt-2">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No events scheduled for this date</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
