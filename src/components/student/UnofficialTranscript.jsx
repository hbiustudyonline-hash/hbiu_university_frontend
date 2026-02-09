import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Award } from "lucide-react";
import { format } from "date-fns";

const DEFAULT_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e9169732a67849215a4ffc/842f33fc9_IMG-20250913-WA0054.jpg";

export default function UnofficialTranscript({ transcript, user }) {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleDownload = () => {
    handlePrint();
  };

  if (!transcript) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Transcript Available
          </h3>
          <p className="text-gray-500">
            Complete your semester courses to generate a transcript
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Unofficial Transcript</h2>
        <Button onClick={handleDownload} className="bg-blue-600">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div ref={printRef} className="bg-white">
        <Card className="border-2 border-gray-300 shadow-xl relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="text-gray-200 text-[120px] font-bold transform rotate-[-45deg] opacity-10">
              UNOFFICIAL
            </div>
          </div>

          <CardHeader className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 relative z-10">
            <div className="flex items-start gap-6">
              <img src={DEFAULT_LOGO} alt="HBIU Logo" className="w-24 h-24 object-contain" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Heart Bible International University
                </h1>
                <p className="text-lg text-gray-700 mb-2">HBIU Virtual Campus</p>
                <h2 className="text-2xl font-bold text-red-600">UNOFFICIAL TRANSCRIPT</h2>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6 relative z-10">
            {/* Student Information */}
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b-2 border-gray-200">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">STUDENT INFORMATION</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Name:</span>
                    <p className="font-semibold text-gray-900">{transcript.student_name || user?.full_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Student ID:</span>
                    <p className="font-semibold text-gray-900">{transcript.student_id || user?.student_id || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="font-semibold text-gray-900">{transcript.student_email}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">ACADEMIC INFORMATION</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Program:</span>
                    <p className="font-semibold text-gray-900">{transcript.program || user?.program}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">College:</span>
                    <p className="font-semibold text-gray-900">{transcript.college_name || user?.college_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Semester:</span>
                    <p className="font-semibold text-gray-900">{transcript.semester}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Grades */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">SEMESTER COURSEWORK</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="text-left p-3 font-semibold text-gray-700">Course Code</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Course Title</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Credits</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Grade</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Grade Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcript.courses?.map((course, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-mono text-sm">{course.course_code}</td>
                        <td className="p-3">{course.course_title}</td>
                        <td className="p-3 text-center">{course.credits}</td>
                        <td className="p-3 text-center">
                          <span className="font-bold text-lg">{course.grade}</span>
                        </td>
                        <td className="p-3 text-center">{course.grade_points?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                    <tr>
                      <td colSpan="2" className="p-3 font-bold text-right">TOTAL:</td>
                      <td className="p-3 text-center font-bold">{transcript.total_credits}</td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* GPA Summary */}
            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t-2 border-gray-200">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Semester GPA</h3>
                </div>
                <p className="text-4xl font-bold text-blue-600">{transcript.gpa}</p>
                <p className="text-sm text-gray-600 mt-1">Based on {transcript.courses?.length || 0} courses</p>
              </div>
              {transcript.cumulative_gpa && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">Cumulative GPA</h3>
                  </div>
                  <p className="text-4xl font-bold text-purple-600">{transcript.cumulative_gpa}</p>
                  <p className="text-sm text-gray-600 mt-1">Overall academic performance</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2">
              <p>
                <strong>Date Generated:</strong> {format(new Date(transcript.generated_date || new Date()), 'MMMM d, yyyy')}
              </p>
              <p>
                <strong>Status:</strong> {transcript.status === 'completed' ? 'Semester Completed' : 'In Progress'}
              </p>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
                <p className="text-yellow-800 font-semibold">
                  ⚠️ IMPORTANT NOTICE
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  This is an UNOFFICIAL transcript for informational purposes only. Official transcripts must be requested 
                  through the Registrar's Office and will bear the university seal and authorized signature.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @media print {
          @page {
            size: letter;
            margin: 0.5in;
          }
          body * {
            visibility: hidden;
          }
          ${printRef.current} * {
            visibility: visible;
          }
          ${printRef.current} {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}