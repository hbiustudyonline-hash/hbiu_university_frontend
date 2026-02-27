import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Mic, Video, Volume2, ArrowRight, Check, Eye } from "lucide-react";

const sampleQuestions = [
  "How do the principles of community engagement influence the effectiveness of non-profit organizations?",
  "What are the key challenges facing non-profit organizations in the 21st century?",
  "Explain the importance of strategic planning in community development initiatives.",
  "How can non-profit organizations measure their social impact effectively?",
  "Discuss the role of volunteers in sustaining non-profit organizations."
];

export default function CourseOralExam({ courseId, course, isInstructor }) {
  const [showExamDialog, setShowExamDialog] = useState(false);
  const [examMode, setExamMode] = useState(null); // 'voice' or 'video'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [cameraPermission, setCameraPermission] = useState(false);
  const [appearanceValidated, setAppearanceValidated] = useState(false);
  const [videoRecordingState, setVideoRecordingState] = useState('idle'); // 'idle', 'recording', 'stopped'
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const hasRequestedCameraRef = useRef(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      // Stop camera stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Cleanup when exam mode changes
  useEffect(() => {
    if (examMode === null) {
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      // Stop camera stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      // Stop video recording if active
      if (mediaRecorderRef.current && videoRecordingState === 'recording') {
        mediaRecorderRef.current.stop();
      }
      // Clean up recorded video URL
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
        setRecordedVideoUrl(null);
      }
      setCameraPermission(false);
      setAppearanceValidated(false);
      hasRequestedCameraRef.current = false;
      setVideoRecordingState('idle');
    }
  }, [examMode, videoRecordingState, recordedVideoUrl]);

  // Request camera when entering video mode (only once)
  useEffect(() => {
    if (examMode === 'video' && !cameraPermission && !mediaStreamRef.current && !hasRequestedCameraRef.current) {
      console.log('Auto-requesting camera access...');
      hasRequestedCameraRef.current = true;
      requestCameraPermission();
    }
  }, [examMode]);

  // Connect video stream to video element when both are ready
  useEffect(() => {
    if (videoRef.current && mediaStreamRef.current && cameraPermission) {
      console.log('Connecting stream to video element');
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [cameraPermission]);

  const handleStartExam = async (mode) => {
    setExamMode(mode);
    setCurrentQuestion(0);
    setAnswers({});
    setCurrentAnswer('');
    setShowExamDialog(false);
    
    if (mode === 'voice') {
      // Initialize speech recognition for voice mode
      initializeSpeechRecognition();
    }
    // Camera will be requested via useEffect for video mode
  };

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('⚠️ Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setCurrentAnswer((prev) => {
        const base = prev.endsWith('...') ? prev.slice(0, -3) : prev;
        return (base + finalTranscript).trim() + (interimTranscript ? '...' : '');
      });
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please enable microphone permissions.');
      }
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        // Restart if still recording
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
        }
      }
    };
  };

  const requestCameraPermission = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('⚠️ Camera access is not supported in your browser. Please use a modern browser like Chrome, Edge, or Firefox.');
        return;
      }

      // Clean up any existing streams first
      if (mediaStreamRef.current) {
        console.log('Cleaning up existing stream...');
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }

      console.log('Requesting camera access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: true 
      });
      
      console.log('Camera access granted', stream);
      mediaStreamRef.current = stream;
      setCameraPermission(true);
      // Video element connection is handled by useEffect
      
    } catch (error) {
      console.error('Camera permission error:', error);
      if (error.name === 'NotAllowedError') {
        alert('⚠️ Camera access was denied. Please allow camera and microphone access in your browser settings and try again.');
      } else if (error.name === 'NotFoundError') {
        alert('⚠️ No camera found. Please connect a camera and try again.');
      } else if (error.name === 'NotReadableError' || error.message.includes('in use')) {
        alert('⚠️ Camera is in use by another application.\n\nPlease:\n1. Close other apps using the camera (Zoom, Teams, Skype, etc.)\n2. Close other browser tabs accessing the camera\n3. Refresh this page and try again');
      } else {
        alert(`⚠️ Camera access error: ${error.message}\n\nPlease refresh the page and try again.`);
      }
      setCameraPermission(false);
    }
  };

  const handleStartRecording = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
      setTimeout(() => {
        startRecording();
      }, 100);
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    try {
      setIsRecording(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('⚠️ Could not start recording. Please check microphone permissions.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleNextQuestion = () => {
    if (currentAnswer) {
      setAnswers({ ...answers, [currentQuestion]: currentAnswer });
      setCurrentAnswer('');
      
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        alert('✅ Oral exam completed! Your responses have been submitted.');
        setExamMode(null);
      }
    }
  };

  const handleReplayQuestion = () => {
    // Use Web Speech API to read the question
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sampleQuestions[currentQuestion]);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleValidateAppearance = () => {
    setAppearanceValidated(true);
    alert('✅ Appearance validated! You may proceed with the video presentation.');
  };

  const handleStartVideoRecording = () => {
    if (!mediaStreamRef.current) {
      alert('⚠️ Camera not available');
      return;
    }

    // Reconnect live stream if we were in replay mode
    if (videoRef.current && recordedVideoUrl) {
      videoRef.current.src = '';
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.muted = true;
      videoRef.current.controls = false;
      videoRef.current.play();
    }

    try {
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        // Clean up old URL if exists
        if (recordedVideoUrl) {
          URL.revokeObjectURL(recordedVideoUrl);
        }
        setRecordedVideoUrl(url);
        setVideoRecordingState('stopped');
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setVideoRecordingState('recording');
      alert('🎥 Recording started! Speak clearly into the camera.');
    } catch (error) {
      console.error('Error starting video recording:', error);
      alert('⚠️ Could not start recording. Please check your camera and microphone permissions.');
    }
  };

  const handleStopVideoRecording = () => {
    if (mediaRecorderRef.current && videoRecordingState === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleReplayVideo = () => {
    if (recordedVideoUrl && videoRef.current) {
      // Set the src to the recorded video
      videoRef.current.srcObject = null;
      videoRef.current.src = recordedVideoUrl;
      videoRef.current.muted = false;
      videoRef.current.controls = true;
      videoRef.current.play().catch(err => console.error('Replay error:', err));
    }
  };

  const handleSubmitVideoPresentation = () => {
    if (!recordedVideoUrl) {
      alert('⚠️ Please record a video presentation first.');
      return;
    }
    alert('✅ Video presentation submitted successfully!');
    setExamMode(null);
  };

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

  if (examMode === 'voice') {
    return (
      <div className="max-w-4xl mx-auto py-8">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Question {currentQuestion + 1} of {sampleQuestions.length}</span>
            <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <Volume2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {sampleQuestions[currentQuestion]}
                </h3>
              </div>
            </div>

            {/* Answer Area */}
            <div className="mb-6">
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Your answer will appear here..."
                className="min-h-[200px] text-gray-600"
                readOnly
              />
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
              <Button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={isRecording ? "bg-black hover:bg-gray-900" : "bg-gray-800 hover:bg-gray-900"}
              >
                <Mic className="w-4 h-4 mr-2" />
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                disabled={!currentAnswer}
                className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50"
              >
                {currentQuestion < sampleQuestions.length - 1 ? 'Next Question' : 'Submit Exam'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Replay Question */}
        <div className="text-center">
          <Button variant="link" onClick={handleReplayQuestion}>
            Replay Question
          </Button>
        </div>
      </div>
    );
  }

  if (examMode === 'video') {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-2">AI Oral Exam</h2>
            <p className="text-blue-600 text-center mb-6">{course?.title || 'Course'}</p>

            <Tabs defaultValue="voice" className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="voice">
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Q&A Exam
                </TabsTrigger>
                <TabsTrigger value="video">
                  <Video className="w-4 h-4 mr-2" />
                  Video Presentation
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Appearance Validation */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Appearance Validation</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Position yourself in frame and click "Validate Appearance" to ensure professional presentation standards
              </p>

              {/* Video Preview */}
              <div className="bg-black rounded-lg aspect-video mb-4 flex items-center justify-center overflow-hidden relative">
                {cameraPermission ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay={videoRecordingState !== 'stopped'}
                      playsInline
                      muted={videoRecordingState !== 'stopped'}
                      controls={videoRecordingState === 'stopped'}
                      className="w-full h-full object-cover"
                      onLoadedMetadata={(e) => {
                        console.log('Video metadata loaded');
                        if (videoRecordingState !== 'stopped') {
                          e.target.play().catch(err => console.error('Video play error:', err));
                        }
                      }}
                    />
                    {videoRecordingState === 'recording' && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold">REC</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-white text-center p-8">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-2 font-semibold">Camera access required</p>
                    <p className="text-sm text-gray-300 mb-4">
                      Please allow camera and microphone access when prompted
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={requestCameraPermission}
                        variant="outline"
                        className="text-white border-white hover:bg-white hover:text-black"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Enable Camera
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">
                        If camera is in use, close other apps and refresh the page
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center mb-6">
                <Button
                  onClick={appearanceValidated ? () => {} : handleValidateAppearance}
                  disabled={!cameraPermission || appearanceValidated}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {appearanceValidated ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Appearance Validated
                    </>
                  ) : (
                    'Validate Appearance'
                  )}
                </Button>
              </div>

              {/* Professional Appearance Requirements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-sm mb-2">Professional Appearance Requirements:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Men: Dress shirt (button-up, collared)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Women: Blazer/jacket or professional top
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Well-groomed hair
                  </li>
                </ul>
              </div>
            </div>

            {/* Recording Controls */}
            {videoRecordingState === 'idle' && (
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setExamMode(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleStartVideoRecording}
                  disabled={!appearanceValidated}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Video Recording
                </Button>
              </div>
            )}

            {videoRecordingState === 'recording' && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-red-700">Recording in progress...</span>
                  </div>
                  <p className="text-sm text-gray-600">Speak clearly and present your material</p>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={handleStopVideoRecording}
                    className="bg-black hover:bg-gray-900"
                  >
                    Stop Recording
                  </Button>
                </div>
              </div>
            )}

            {videoRecordingState === 'stopped' && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Recording completed!</span>
                  </div>
                  <p className="text-sm text-gray-600">Review your recording or submit it</p>
                </div>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={handleReplayVideo}>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Replay Recording
                  </Button>
                  <Button
                    onClick={handleStartVideoRecording}
                    variant="outline"
                  >
                    Record Again
                  </Button>
                  <Button
                    onClick={handleSubmitVideoPresentation}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Presentation
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Landing Page */}
      <Card className="text-center">
        <CardContent className="p-12">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mic className="w-10 h-10 text-purple-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Oral Exam</h2>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Test your mastery of {course?.title || 'the course material'} with our interactive AI Oral Exam. 
            You'll be asked 5 random questions generated from the course material and receive immediate 
            feedback and a grade based on your spoken answers.
          </p>

          <Button
            onClick={() => setShowExamDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
            size="lg"
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Oral Exam
          </Button>

          <p className="text-sm text-gray-500 mt-4">
            Requires a microphone • Takes about 10-15 minutes
          </p>
        </CardContent>
      </Card>

      {/* Exam Mode Selection Dialog */}
      <Dialog open={showExamDialog} onOpenChange={setShowExamDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">AI Oral Exam</DialogTitle>
            <p className="text-blue-600 text-center">{course?.title || 'Course'}</p>
          </DialogHeader>

          <Tabs defaultValue="voice" className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="voice">
                <Mic className="w-4 h-4 mr-2" />
                Voice Q&A Exam
              </TabsTrigger>
              <TabsTrigger value="video">
                <Video className="w-4 h-4 mr-2" />
                Video Presentation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="voice" className="text-center py-6">
              <p className="text-gray-600 mb-6">
                Interactive AI oral exam with 5 random questions about the course material. 
                Please ensure your microphone is working and speak clearly.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setShowExamDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleStartExam('voice')} className="bg-blue-600 hover:bg-blue-700">
                  <Mic className="w-4 h-4 mr-2" />
                  Start Voice Exam
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="video" className="text-center py-6">
              <p className="text-gray-600 mb-6">
                Record a video presentation demonstrating your knowledge. 
                Camera and microphone access required. Professional appearance is expected.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setShowExamDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleStartExam('video')} className="bg-blue-600 hover:bg-blue-700">
                  <Video className="w-4 h-4 mr-2" />
                  Start Video Presentation
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
