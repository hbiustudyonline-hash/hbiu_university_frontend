import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Upload, Camera, Download, Edit2 } from "lucide-react";

export default function LecturerIDCard() {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadIDCard = () => {
    // Create a printable version
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lecturer ID Card</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
          .card-container { max-width: 900px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #003d99 0%, #0052cc 100%); color: white; padding: 20px; display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
          .header img { width: 60px; height: 60px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 0; font-size: 12px; opacity: 0.9; }
          .content { display: grid; grid-template-columns: 300px 1fr; gap: 30px; margin-bottom: 30px; }
          .photo { text-align: center; }
          .photo img { width: 220px; height: 280px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 15px; }
          .actions { display: flex; gap: 10px; justify-content: center; }
          .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
          .btn-primary { background: #003d99; color: white; }
          .details h2 { color: #003d99; font-size: 18px; margin-top: 0; margin-bottom: 15px; }
          .detail-row { margin-bottom: 12px; display: grid; grid-template-columns: 150px 1fr; }
          .detail-label { font-weight: bold; color: #003d99; }
          .detail-value { color: #333; }
          .barcode { margin: 20px 0; font-family: 'Code 128'; letter-spacing: 4px; text-align: center; font-size: 24px; }
          .certification { background: #f5f5f5; padding: 20px; margin-top: 20px; border-radius: 4px; }
          .certification h3 { color: #003d99; margin-top: 0; }
          .certification p { margin: 8px 0; font-size: 12px; line-height: 1.5; color: #555; }
          .footer { background: linear-gradient(135deg, #003d99 0%, #0052cc 100%); color: white; padding: 15px; display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; gap: 20px; margin-top: 20px; }
          .footer-item { font-size: 12px; }
          .footer-item strong { display: block; margin-bottom: 5px; }
          .print-buttons { display: none; }
          @media print {
            .print-buttons { display: none; }
            body { margin: 0; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="card-container">
          <div class="header">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e9169732a67849215a4ffc/dea4daaa8_image.png" alt="HBI Logo" />
            <div>
              <h1>HBI UNIVERSITY</h1>
              <p>Heart Bible International University</p>
            </div>
          </div>

          <div class="content">
            <div class="photo">
              ${photoUrl ? `<img src="${photoUrl}" alt="Lecturer Photo" />` : '<div style="width: 220px; height: 280px; background: #e0e0e0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">No Photo</div>'}
            </div>
            <div class="details">
              <h2>LECTURER ID CARD</h2>
              <div class="detail-row">
                <span class="detail-label">Name</span>
                <span class="detail-value">: ${user?.full_name || "N/A"}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">License No.</span>
                <span class="detail-value">: LUK-2026-10FWA</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Position</span>
                <span class="detail-value">: N/A</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Issued On</span>
                <span class="detail-value">: Feb 04, 2026</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Valid Until</span>
                <span class="detail-value">: Feb 04, 2027</span>
              </div>
              <div class="barcode">|||||||||||||||||||||||||||||||||||||||||||</div>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #003d99 0%, #0052cc 100%); height: 20px; margin: 20px 0;"></div>

          <div class="certification">
            <h3>FACULTY IDENTIFICATION</h3>
            <p>This card certifies that ${user?.full_name || "Faculty Member"} is an authorized faculty member at HBI University. It serves as official identification and proof of employment with our institution.</p>
            <p>This card is non-transferable and must be displayed while on campus or representing the university at official events. It must be presented upon request by university administrators or authorized personnel.</p>
            <p>Please report any loss, theft, or damage of this card to Human Resources immediately. Replacement cards may be issued subject to applicable fees.</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ccc;">
              <strong>Authorized Signature</strong>
            </div>
          </div>

          <div class="footer">
            <div class="footer-item">
              <strong>📞</strong>
              +860-830-9778
            </div>
            <div class="footer-item">
              <strong>🌐</strong>
              www.hbius.org
            </div>
            <div class="footer-item">
              <strong>📍</strong>
              846 Wethersfield Ave<br/>Hartford CT, 06114
            </div>
          </div>
        </div>
        <script>
          window.print();
          setTimeout(() => window.close(), 500);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Main ID Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 flex items-center gap-4">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e9169732a67849215a4ffc/dea4daaa8_image.png"
            alt="HBI Logo"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">HBI UNIVERSITY</h2>
            <p className="text-sm opacity-90">Heart Bible International University</p>
          </div>
        </div>

        {/* ID Card Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Photo Section */}
            <div className="flex flex-col items-center">
              <div className="w-52 h-64 bg-gray-300 rounded-lg overflow-hidden mb-4 shadow-md">
                {photoUrl ? (
                  <img src={photoUrl} alt="Lecturer" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600">
                    <span className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <p>Photo</p>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 w-full">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  size="sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  size="sm"
                >
                  <Camera className="w-4 h-4" />
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
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
            </div>

            {/* ID Information */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-blue-900">LECTURER ID CARD</h3>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  280 Courses
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2">
                  <span className="text-gray-600 font-semibold">Name</span>
                  <span className="text-blue-900">: Prof. Dr. {user?.full_name || "N/A"}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600 font-semibold">License No.</span>
                  <span className="text-blue-900">: LUK-2026-10FWA</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600 font-semibold">Position</span>
                  <span className="text-blue-900">: N/A</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600 font-semibold">Issued On</span>
                  <span className="text-blue-900">: Feb 04, 2026</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600 font-semibold">Valid Until</span>
                  <span className="text-blue-900">: Feb 04, 2027</span>
                </div>
              </div>

              {/* Barcode */}
              <div className="bg-gray-100 p-4 rounded mb-6 text-center tracking-wider font-mono text-sm text-gray-800">
                ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-2 rounded"></div>
            <Button className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Faculty Information
            </Button>
            <Button
              onClick={handleDownloadIDCard}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Faculty ID Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
