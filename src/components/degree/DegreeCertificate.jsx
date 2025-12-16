import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const HBIU_SEAL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e9169732a67849215a4ffc/820991d63_419382449_3974274392799651_5254769104070427671_n.png";

export default function DegreeCertificate({ degree, showDownload = true }) {
  const certificateRef = useRef();

  const handleDownload = () => {
    const printWindow = window.open('', '', 'width=1200,height=800');
    
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Degree Certificate - ${degree.student_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @page {
              size: letter landscape;
              margin: 0;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              background: white;
              margin: 0;
              padding: 0;
            }
            
            .certificate {
              width: 11in;
              height: 8.5in;
              background: white;
              padding: 0.6in 1in;
              position: relative;
              page-break-after: always;
            }
            
            .old-english {
              font-family: 'Engravers Old English BT', 'Old English Text MT', 'Blackletter', serif;
            }
            
            .university-name {
              font-size: 44px;
              text-align: center;
              color: #1a1a1a;
              margin-bottom: 12px;
              letter-spacing: 2px;
              font-weight: bold;
            }
            
            .college-name {
              font-family: 'Cinzel', serif;
              font-size: 20px;
              text-align: center;
              color: #2c2c2c;
              margin-bottom: 20px;
              font-weight: 600;
            }
            
            .conferral-text {
              font-family: 'Brush Script MT', cursive;
              font-size: 15px;
              text-align: center;
              color: #4a4a4a;
              margin-bottom: 25px;
              font-style: italic;
            }
            
            .degree-title {
              font-size: 40px;
              text-align: center;
              color: #1a1a1a;
              margin-bottom: 8px;
              letter-spacing: 2px;
              font-weight: bold;
            }
            
            .minor-title {
              font-family: 'Arial', sans-serif;
              font-size: 16px;
              text-align: center;
              color: #2c2c2c;
              margin-bottom: 25px;
              font-weight: 600;
            }
            
            .student-name {
              font-size: 52px;
              text-align: center;
              color: #1a1a1a;
              margin: 25px 0;
              letter-spacing: 2px;
              font-weight: bold;
            }
            
            .completion-text {
              font-family: 'Engravers Old English BT', 'Old English Text MT', 'Blackletter', serif;
              font-size: 14px;
              text-align: center;
              color: #2c2c2c;
              line-height: 1.5;
              margin: 20px auto;
              max-width: 90%;
            }
            
            .signatures {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 35px;
              padding: 0 50px;
            }
            
            .signature-block {
              text-align: center;
              flex: 1;
            }
            
            .signature-line {
              font-family: 'Brush Script MT', cursive;
              font-size: 24px;
              color: #1a1a1a;
              margin-bottom: 5px;
              min-height: 35px;
              border-bottom: 2px solid #2c2c2c;
              padding-bottom: 5px;
              display: inline-block;
              min-width: 200px;
            }
            
            .signature-title {
              font-family: 'Arial', sans-serif;
              font-size: 14px;
              color: #2c2c2c;
              font-weight: 600;
              margin-top: 5px;
            }
            
            .seal-container {
              flex: 0 0 180px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            
            .seal {
              width: 180px;
              height: 180px;
            }
            
            @media print {
              body {
                background: white;
                margin: 0;
                padding: 0;
              }
              .certificate {
                box-shadow: none;
                margin: 0;
                padding: 0.6in 1in;
              }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="university-name old-english">Heart Bible International University</div>
            <div class="college-name">${degree.college_name}</div>
            <div class="conferral-text">
              We the Senate of the College and Board of Trustees of HBIU do confer this degree
            </div>
            
            <div class="degree-title old-english">${degree.degree_title.split(',')[0]}</div>
            ${degree.minor ? `<div class="minor-title">${degree.minor}</div>` : ''}
            
            <div class="student-name old-english">${degree.student_name}</div>
            
            <div class="completion-text">
              Has successfully completed the required course of study approved by<br/>
              Heart Bible International University has awarded this degree<br/>
              on the ${new Date(degree.graduation_date).getDate()}${getOrdinalSuffix(new Date(degree.graduation_date).getDate())} day of ${new Date(degree.graduation_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. With all of the Rights and privileges, in witness whereof, the<br/>
              signatures of the Chancellor and President in the state of ${degree.state}, ${degree.country}
            </div>
            
            <div class="signatures">
              <div class="signature-block">
                <div class="signature-line">${degree.chancellor_name || 'Dr. Kenneth Van Horn'}</div>
                <div class="signature-title">Chancellor</div>
              </div>
              
              <div class="seal-container">
                <img src="${HBIU_SEAL}" alt="HBIU Seal" class="seal" />
              </div>
              
              <div class="signature-block">
                <div class="signature-line">${degree.president_name || 'Dr. Kenneth Van Horn'}</div>
                <div class="signature-title">President</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(certificateHTML);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="space-y-4">
      {showDownload && (
        <div className="flex justify-end">
          <Button onClick={handleDownload} className="bg-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Download Degree
          </Button>
        </div>
      )}
      
      <style>{`
        .old-english {
          font-family: 'Engravers Old English BT', 'Old English Text MT', 'Blackletter', serif;
        }
      `}</style>
      
      <div ref={certificateRef} className="bg-white shadow-lg mx-auto" style={{ width: '11in', height: '8.5in', padding: '0.6in 1in' }}>
        <div className="space-y-3">
          <h1 className="old-english text-[44px] text-center font-bold tracking-[2px] text-gray-900">
            Heart Bible International University
          </h1>
          
          <h2 className="text-xl text-center font-semibold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>
            {degree.college_name}
          </h2>
          
          <p className="text-center italic text-gray-600 text-[15px]" style={{ fontFamily: 'Brush Script MT, cursive' }}>
            We the Senate of the College and Board of Trustees of HBIU do confer this degree
          </p>
          
          <h2 className="old-english text-[40px] text-center font-bold tracking-[2px] text-gray-900 mt-5">
            {degree.degree_title.split(',')[0]}
          </h2>
          
          {degree.minor && (
            <p className="text-base text-center font-semibold text-gray-800">
              {degree.minor}
            </p>
          )}
          
          <h3 className="old-english text-[52px] text-center font-bold tracking-[2px] text-gray-900 my-6">
            {degree.student_name}
          </h3>
          
          <div className="old-english text-center text-[14px] leading-relaxed max-w-[90%] mx-auto text-gray-800">
            <p>Has successfully completed the required course of study approved by</p>
            <p>Heart Bible International University has awarded this degree</p>
            <p>
              on the {new Date(degree.graduation_date).getDate()}{getOrdinalSuffix(new Date(degree.graduation_date).getDate())} day of {new Date(degree.graduation_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. With all of the Rights and privileges, in witness whereof, the
            </p>
            <p>signatures of the Chancellor and President in the state of {degree.state}, {degree.country}</p>
          </div>
          
          <div className="flex justify-between items-end mt-9 px-12">
            <div className="text-center flex-1">
              <div className="text-2xl mb-1 border-b-2 border-black pb-1 inline-block min-w-[200px]" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                {degree.chancellor_name || 'Dr. Kenneth Van Horn'}
              </div>
              <div className="text-sm font-semibold mt-2">
                Chancellor
              </div>
            </div>
            
            <div className="flex-[0_0_180px] flex justify-center">
              <img src={HBIU_SEAL} alt="HBIU Seal" className="w-[180px] h-[180px]" />
            </div>
            
            <div className="text-center flex-1">
              <div className="text-2xl mb-1 border-b-2 border-black pb-1 inline-block min-w-[200px]" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                {degree.president_name || 'Dr. Kenneth Van Horn'}
              </div>
              <div className="text-sm font-semibold mt-2">
                President
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}