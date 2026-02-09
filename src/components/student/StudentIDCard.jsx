import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Camera, Upload } from "lucide-react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const HBIU_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e9169732a67849215a4ffc/842f33fc9_IMG-20250913-WA0054.jpg";

export default function StudentIDCard({ user }) {
  const cardRef = useRef();
  const fileInputRef = useRef();
  const cameraInputRef = useRef();
  const queryClient = useQueryClient();

  const updatePhotoMutation = useMutation({
    mutationFn: async (file) => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ profile_photo: file_url });
      return file_url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      alert('Profile photo updated successfully!');
    },
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      await updatePhotoMutation.mutateAsync(file);
    }
  };

  const handleDownloadCard = async () => {
    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    const cardElement = cardRef.current;
    
    if (!cardElement || !printWindow) return;

    // Get computed styles
    const styles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f3f4f6;
        }
        .id-card-container {
          width: 800px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .card-front, .card-back {
          position: relative;
          width: 100%;
          padding: 40px;
        }
        .card-header {
          background: linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #1e40af 100%);
          padding: 30px 40px;
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          overflow: hidden;
        }
        .card-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 400px;
          height: 400px;
          background: rgba(14, 165, 233, 0.3);
          border-radius: 50%;
        }
        .card-header::after {
          content: '';
          position: absolute;
          bottom: -50%;
          right: 20%;
          width: 300px;
          height: 300px;
          background: rgba(6, 182, 212, 0.2);
          border-radius: 50%;
        }
        .logo-container {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          position: relative;
          z-index: 1;
        }
        .logo-container img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }
        .university-info {
          flex: 1;
          position: relative;
          z-index: 1;
        }
        .university-name {
          color: white;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .university-tagline {
          color: rgba(255,255,255,0.9);
          font-size: 14px;
        }
        .card-body {
          padding: 40px;
          display: flex;
          gap: 30px;
          background: linear-gradient(to bottom, white 0%, #f9fafb 100%);
        }
        .photo-container {
          width: 200px;
          height: 240px;
          border-radius: 15px;
          overflow: hidden;
          border: 4px solid #1e40af;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .photo-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .photo-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e40af;
          font-size: 18px;
          font-weight: 600;
        }
        .student-info {
          flex: 1;
        }
        .id-card-title {
          font-size: 36px;
          font-weight: bold;
          color: #0891b2;
          margin-bottom: 20px;
          letter-spacing: 2px;
        }
        .info-row {
          display: flex;
          margin-bottom: 16px;
          align-items: baseline;
        }
        .info-label {
          font-weight: 600;
          color: #374151;
          min-width: 140px;
          font-size: 15px;
        }
        .info-value {
          color: #1f2937;
          font-size: 16px;
          font-weight: 500;
        }
        .barcode-container {
          margin-top: 30px;
          text-align: center;
        }
        .barcode {
          height: 60px;
          background: linear-gradient(90deg, 
            black 2%, white 2%, white 4%,
            black 4%, black 6%, white 6%, white 8%,
            black 8%, black 10%, white 10%, white 12%,
            black 12%, black 14%, white 14%, white 16%,
            black 16%, black 18%, white 18%, white 20%,
            black 20%, black 22%, white 22%, white 24%,
            black 24%, black 26%, white 26%, white 28%,
            black 28%, black 30%, white 30%, white 32%,
            black 32%, black 34%, white 34%, white 36%,
            black 36%, black 38%, white 38%, white 40%,
            black 40%, black 42%, white 42%, white 44%,
            black 44%, black 46%, white 46%, white 48%,
            black 48%, black 50%, white 50%, white 52%,
            black 52%, black 54%, white 54%, white 56%,
            black 56%, black 58%, white 58%, white 60%,
            black 60%, black 62%, white 62%, white 64%,
            black 64%, black 66%, white 66%, white 68%,
            black 68%, black 70%, white 70%, white 72%,
            black 72%, black 74%, white 74%, white 76%,
            black 76%, black 78%, white 78%, white 80%,
            black 80%, black 82%, white 82%, white 84%,
            black 84%, black 86%, white 86%, white 88%,
            black 88%, black 90%, white 90%, white 92%,
            black 92%, black 94%, white 94%, white 96%,
            black 96%, black 98%, white 98%
          );
          border: 1px solid #d1d5db;
          border-radius: 4px;
        }
        .barcode-text {
          margin-top: 8px;
          font-size: 12px;
          color: #6b7280;
          letter-spacing: 2px;
        }
        .card-back {
          background: linear-gradient(to bottom, #f9fafb 0%, white 100%);
          padding: 40px;
        }
        .back-title {
          font-size: 18px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 20px;
        }
        .back-text {
          color: #4b5563;
          font-size: 13px;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .contact-info {
          display: flex;
          justify-content: space-around;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
        }
        .contact-item {
          text-align: center;
        }
        .contact-icon {
          font-size: 24px;
          color: #0891b2;
          margin-bottom: 8px;
        }
        .contact-text {
          font-size: 13px;
          color: #374151;
          font-weight: 500;
        }
        @media print {
          body {
            background: white;
          }
          .id-card-container {
            box-shadow: none;
            page-break-after: always;
          }
        }
      </style>
    `;

    const frontCardHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student ID Card - ${user.full_name}</title>
          ${styles}
        </head>
        <body>
          <div class="id-card-container">
            <!-- Front of Card -->
            <div class="card-front">
              <div class="card-header">
                <div class="logo-container">
                  <img src="${HBIU_LOGO}" alt="HBIU Logo" />
                </div>
                <div class="university-info">
                  <div class="university-name">HBI UNIVERSITY</div>
                  <div class="university-tagline">Heart Bible International University</div>
                </div>
              </div>
              <div class="card-body">
                <div class="photo-container">
                  ${user.profile_photo 
                    ? `<img src="${user.profile_photo}" alt="${user.full_name}" />` 
                    : `<div class="photo-placeholder">No Photo</div>`
                  }
                </div>
                <div class="student-info">
                  <div class="id-card-title">STUDENT ID CARD</div>
                  <div class="info-row">
                    <span class="info-label">Name</span>
                    <span class="info-value">: ${user.full_name}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Student ID</span>
                    <span class="info-value">: ${user.student_id || 'N/A'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Program</span>
                    <span class="info-value">: ${user.program || 'N/A'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Graduation Year</span>
                    <span class="info-value">: ${user.graduation_year || 'N/A'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Issued On</span>
                    <span class="info-value">: ${format(new Date(), 'MMM dd, yyyy')}</span>
                  </div>
                  <div class="barcode-container">
                    <div class="barcode"></div>
                    <div class="barcode-text">${user.student_id || '000000000'}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Back of Card -->
            <div class="card-back">
              <div class="back-title">TERMS AND CONDITIONS</div>
              <div class="back-text">
                This card certifies that ${user.full_name} is a registered student at HBI University. 
                It serves as proof of identity and affiliation with our institution.
              </div>
              <div class="back-text">
                This card is non-transferable and should be carried at all times while on school premises 
                or participating in school-related activities. It must be presented upon request by school 
                staff or authorized personnel.
              </div>
              <div class="back-text">
                Please report any loss or damage from this card to the school administration immediately. 
                Replacement cards may be issued subject to applicable fees and procedures.
              </div>
              <div class="back-text">
                By presenting this card, the student agrees to abide by the rules, regulations, and code 
                of conduct set forth by HBI University.
              </div>
              <div class="contact-info">
                <div class="contact-item">
                  <div class="contact-icon">📞</div>
                  <div class="contact-text">+860-830-9778</div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">🌐</div>
                  <div class="contact-text">www.hbiu.org</div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">📍</div>
                  <div class="contact-text">846 Wethersfield Ave<br>Hartford CT, 06114</div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(frontCardHTML);
    printWindow.document.close();
    
    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <Card className="border-none shadow-xl overflow-hidden">
      <CardContent className="p-0">
        {/* Card Preview */}
        <div ref={cardRef} className="relative">
          {/* Front of Card */}
          <div className="relative">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-800 via-cyan-700 to-blue-800 p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/20 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-600/20 rounded-full mr-16 -mb-24" />
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <img src={HBIU_LOGO} alt="HBIU Logo" className="w-14 h-14 object-contain" />
                </div>
                <div>
                  <h2 className="text-white text-2xl font-bold">HBI UNIVERSITY</h2>
                  <p className="text-blue-100 text-sm">Heart Bible International University</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 bg-gradient-to-b from-white to-gray-50">
              <div className="flex gap-6">
                {/* Photo */}
                <div className="relative">
                  <div className="w-40 h-48 rounded-xl overflow-hidden border-4 border-blue-800 shadow-lg">
                    {user.profile_photo ? (
                      <img 
                        src={user.profile_photo} 
                        alt={user.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-blue-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* Photo Upload Buttons */}
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={updatePhotoMutation.isPending}
                      className="flex-1"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={updatePhotoMutation.isPending}
                      className="flex-1"
                    >
                      <Camera className="w-3 h-3 mr-1" />
                      Camera
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-cyan-700 mb-4 tracking-wide">STUDENT ID CARD</h3>
                  
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-semibold text-gray-700 w-32">Name</span>
                      <span className="text-gray-900 font-medium">: {user.full_name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-gray-700 w-32">Student ID</span>
                      <span className="text-gray-900 font-medium">: {user.student_id || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-gray-700 w-32">Program</span>
                      <span className="text-gray-900 font-medium">: {user.program || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-gray-700 w-32">Grad Year</span>
                      <span className="text-gray-900 font-medium">: {user.graduation_year || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-gray-700 w-32">Issued On</span>
                      <span className="text-gray-900 font-medium">: {format(new Date(), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>

                  {/* Barcode */}
                  <div className="mt-6">
                    <div className="h-12 bg-gradient-to-r from-black via-black to-white bg-[length:4px_100%] border border-gray-300 rounded" 
                         style={{backgroundImage: 'repeating-linear-gradient(90deg, black 0px, black 2px, white 2px, white 4px)'}} />
                    <p className="text-center text-xs text-gray-500 mt-1 tracking-widest">{user.student_id || '000000000'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="p-6 bg-gray-50 border-t">
          <Button 
            onClick={handleDownloadCard}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Student ID Card
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}