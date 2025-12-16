import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { format } from "date-fns";

export default function CollegeDegreesTab({ college, degrees }) {
  const approvedDegrees = degrees.filter(d => d.status === 'approved');
  const pendingDegrees = degrees.filter(d => d.status === 'pending');
  const revokedDegrees = degrees.filter(d => d.status === 'revoked');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Degrees from {college.name}</h2>
        <p className="text-gray-500 mt-1">Manage and view degrees issued by this college</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approvedDegrees.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Pending</p>
            <p className="text-3xl font-bold text-orange-600">{pendingDegrees.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Revoked</p>
            <p className="text-3xl font-bold text-red-600">{revokedDegrees.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Degrees List */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Degrees ({degrees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {degrees.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No degrees issued yet</h3>
              <p className="text-gray-500">Degrees will appear here once issued</p>
            </div>
          ) : (
            <div className="space-y-3">
              {degrees.map(degree => (
                <div key={degree.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{degree.student_name}</h3>
                        <Badge className={
                          degree.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                          degree.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        }>
                          {degree.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {degree.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {degree.status === 'revoked' && <XCircle className="w-3 h-3 mr-1" />}
                          {degree.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{degree.degree_title}</p>
                      {degree.minor && (
                        <p className="text-sm text-gray-500 mb-1">{degree.minor}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{degree.student_email}</span>
                        <span>Graduated: {format(new Date(degree.graduation_date), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}