import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Award, Lock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import DegreeCertificate from "../degree/DegreeCertificate";

export default function DegreeViewer({ user }) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [unlockedDegree, setUnlockedDegree] = useState(null);
  const [error, setError] = useState('');

  const { data: degrees } = useQuery({
    queryKey: ['my-degrees', user?.email],
    queryFn: () => user ? base44.entities.Degree.filter({ student_email: user.email }) : [],
    enabled: !!user,
    initialData: [],
  });

  const handlePasswordVerification = (degree) => {
    if (passwordInput === degree.access_password) {
      setUnlockedDegree(degree);
      setShowPasswordDialog(false);
      setPasswordInput('');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const approvedDegrees = degrees.filter(d => d.status === 'approved');
  const pendingDegrees = degrees.filter(d => d.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Degrees</h2>
        <p className="text-gray-500 mt-1">View and download your academic credentials</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Approved Degrees</p>
                <p className="text-3xl font-bold text-gray-900">{approvedDegrees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Approval</p>
                <p className="text-3xl font-bold text-gray-900">{pendingDegrees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Degrees</p>
                <p className="text-3xl font-bold text-gray-900">{degrees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {approvedDegrees.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Approved Degrees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {approvedDegrees.map(degree => (
                <Card key={degree.id} className="overflow-hidden border-2 border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {degree.degree_title}
                        </h3>
                        {degree.minor && (
                          <p className="text-sm text-gray-600 mb-2">{degree.minor}</p>
                        )}
                        <p className="text-sm text-gray-500">{degree.college_name}</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Graduated:</strong> {new Date(degree.graduation_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Student ID:</strong> {degree.student_id || 'N/A'}
                      </p>
                    </div>
                    <Button 
                      onClick={() => {
                        setShowPasswordDialog(true);
                        setError('');
                      }}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Unlock & View Degree
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pendingDegrees.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {pendingDegrees.map(degree => (
                <Card key={degree.id} className="overflow-hidden border-2 border-orange-200">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {degree.degree_title}
                        </h3>
                        {degree.minor && (
                          <p className="text-sm text-gray-600 mb-2">{degree.minor}</p>
                        )}
                        <p className="text-sm text-gray-500">{degree.college_name}</p>
                      </div>
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Expected Date:</strong> {new Date(degree.graduation_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-800">
                        Your degree is pending approval. You'll be notified once it's ready for download.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {degrees.length === 0 && (
        <Card className="border-none shadow-lg">
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Degrees Available
            </h3>
            <p className="text-gray-500">
              Complete your program requirements to receive your degree
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Enter Access Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              Please enter the unique password provided to you to access your degree certificate.
            </p>
            <div className="space-y-2">
              <Label htmlFor="degree-password">Password</Label>
              <Input
                id="degree-password"
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                onKeyPress={(e) => e.key === 'Enter' && approvedDegrees[0] && handlePasswordVerification(approvedDegrees[0])}
              />
              {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPasswordDialog(false);
              setPasswordInput('');
              setError('');
            }}>
              Cancel
            </Button>
            <Button onClick={() => approvedDegrees[0] && handlePasswordVerification(approvedDegrees[0])}>
              Unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {unlockedDegree && (
        <Dialog open={!!unlockedDegree} onOpenChange={() => setUnlockedDegree(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Your Degree Certificate</DialogTitle>
            </DialogHeader>
            <DegreeCertificate degree={unlockedDegree} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}