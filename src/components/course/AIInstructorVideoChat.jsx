
import React, { useState, useEffect, useRef } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  Send,
  Loader2,
  BookOpen,
  Video,
  HelpCircle,
  FileText,
  GraduationCap,
  MessageSquare,
  Sparkles,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  VideoOff,
  Globe,
  Play,
  Pause
} from "lucide-react";


const QUICK_ACTIONS = [
  { id: 'syllabus', label: 'Explain Syllabus', icon: FileText },
  { id: 'chapter_summary', label: 'Summarize Chapter', icon: BookOpen },
  { id: 'live_lesson', label: 'Start Live Lesson', icon: Video },
  { id: 'homework_help', label: 'Homework Help', icon: HelpCircle },
  { id: 'exam_prep', label: 'Exam Preparation', icon: GraduationCap },
  { id: 'discussion', label: 'Start Discussion', icon: MessageSquare },
];

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English', voice: 'en-US-JennyNeural' },
  { code: 'es-ES', name: 'Spanish', voice: 'es-ES-ElviraNeural' },
  { code: 'fr-FR', name: 'French', voice: 'fr-FR-DeniseNeural' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)', voice: 'zh-CN-XiaoxiaoNeural' },
  { code: 'sw-KE', name: 'Swahili', voice: 'sw-KE-ZuriNeural' },
  { code: 'ar-SA', name: 'Arabic', voice: 'ar-SA-ZariyahNeural' },
  { code: 'de-DE', name: 'German', voice: 'de-DE-KatjaNeural' },
  { code: 'pt-BR', name: 'Portuguese', voice: 'pt-BR-FranciscaNeural' },
];

export default function AIInstructorVideoChat({ courseId, open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [videoUrl, setVideoUrl] = useState(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGenerationError, setVideoGenerationError] = useState(null); // New state for video generation errors
  const [sessionStartTime] = useState(new Date());
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const videoRef = useRef(null);

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const courses = await base44.entities.Course.list();
      return courses.find(c => c.id === courseId);
    },
    enabled: !!courseId,
  });

  const { data: aiInstructor } = useQuery({
    queryKey: ['ai-instructor', courseId],
    queryFn: async () => {
      const instructors = await base44.entities.AIInstructor.filter({ course_id: courseId });
      return instructors[0] || null;
    },
    enabled: !!courseId,
  });

  const { data: modules } = useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: () => base44.entities.Module.filter({ course_id: courseId }),
    enabled: !!courseId,
    initialData: [],
  });

  // Initialize Speech Recognition with language support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [selectedLanguage]);

  // Update recognition language when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (open && messages.length === 0) {
      const languageName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English';
      const greeting = {
        role: 'assistant',
        content: `Hello! I'm ${aiInstructor?.name || 'your AI instructor'} for ${course?.title || 'this course'}. 

Welcome to our live interactive session. I'm fluent in multiple languages and ready to teach in ${languageName}.

I can help you with:
- 🎥 Live interactive video lessons with full animation
- 🗣️ Voice conversations in your preferred language
- 📚 Chapter summaries and detailed explanations
- 📝 Homework guidance and step-by-step walkthroughs
- 📊 Exam preparation and practice tests
- 💬 Academic discussions and debates
- 🔍 Research assistance and writing support

I'm available 24/7 to support your learning journey. What would you like to explore today?`,
        timestamp: new Date()
      };
      setMessages([greeting]);
      
      // Speak the greeting
      if (audioEnabled) {
        speakText(greeting.content);
      }
    }
  }, [open, aiInstructor, course, selectedLanguage, audioEnabled]); // Added audioEnabled to dependencies

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Advanced Text-to-Speech with multilingual support
  const speakText = (text) => {
    if (!audioEnabled || !synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Educational pacing
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = selectedLanguage;

    // Try to get the best voice for the selected language
    const voices = synthRef.current.getVoices();
    const languageVoice = voices.find(voice => 
      voice.lang.startsWith(selectedLanguage.split('-')[0]) &&
      (voice.name.includes('Female') || voice.name.includes('female') || 
       voice.name.includes('Premium') || voice.name.includes('Enhanced'))
    ) || voices.find(voice => voice.lang.startsWith(selectedLanguage.split('-')[0])) || voices[0];
    
    if (languageVoice) {
      utterance.voice = languageVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      }
    }
  };

  // Generate animated video response with graceful fallback
  const generateAnimatedVideo = async (text) => {
    if (!aiInstructor?.avatar_url) {
      console.log('No avatar URL, skipping video generation');
      setVideoGenerationError('AI Instructor avatar not configured. Video generation unavailable.');
      return null;
    }
    
    setIsGeneratingVideo(true);
    setVideoGenerationError(null); // Clear previous errors
    
    try {
      // This will call the backend function to generate talking video
      const response = await base44.functions.invoke('generateTalkingVideo', {
        text: text,
        avatar_url: aiInstructor.avatar_url,
        language: selectedLanguage
      });
      
      // Check if we got a fallback response from the backend
      if (response.data?.fallback) {
        console.log('Video generation fallback:', response.data.message);
        setVideoGenerationError(response.data.message);
        return null;
      }
      
      return response.data?.video_url || null;
    } catch (error) {
      console.error('Video generation error:', error);
      // More specific error message if possible, or a general one
      setVideoGenerationError('Video generation unavailable. Using voice-only mode.');
      return null;
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleQuickAction = async (actionId) => {
    const languageName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English';
    const prompts = {
      syllabus: `Please walk me through the course syllabus in ${languageName}, explaining the structure, grading, and expectations.`,
      chapter_summary: `Can you summarize the key concepts from the current chapter in ${languageName}?`,
      live_lesson: `I'd like to start a live lesson on today's topic in ${languageName}. Please guide me through it interactively.`,
      homework_help: `I need help understanding the current homework assignment. Can you provide guidance in ${languageName}?`,
      exam_prep: `Help me prepare for the upcoming exam in ${languageName}. What should I focus on?`,
      discussion: `Let's have a thoughtful discussion about the main themes in this course in ${languageName}.`
    };

    await sendMessage(prompts[actionId]);
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Stop any ongoing speech
    stopSpeaking();

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setVideoGenerationError(null); // Clear video error on new message

    try {
      const languageName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English';
      
      const context = {
        course: {
          title: course?.title,
          code: course?.code,
          description: course?.description,
          program: course?.program,
          degree_program: course?.degree_program
        },
        instructor: {
          name: aiInstructor?.name || 'AI Instructor',
          tone: aiInstructor?.tone || 'balanced_hybrid',
          specialization: aiInstructor?.specialization,
          personality_traits: aiInstructor?.personality_traits || []
        },
        textbook: aiInstructor?.textbook_content || '',
        syllabus: aiInstructor?.syllabus || course?.syllabus || '',
        modules: modules.map(m => ({
          title: m.title,
          description: m.description,
          order: m.order
        })),
        conversation_history: messages.slice(-5),
        session_duration: Math.floor((new Date() - sessionStartTime) / 1000 / 60) + ' minutes'
      };

      const systemPrompt = `You are ${aiInstructor?.name || 'an AI instructor'}, teaching ${course?.title} in a LIVE VIDEO SESSION.

**CRITICAL: Respond in ${languageName} language. The student is communicating in ${languageName}.**

**Your Teaching Style:**
${aiInstructor?.tone === 'formal_academic' ? 
  '- Professional, lecture-style delivery with rich academic terminology\n- Scholarly citations and rigorous analysis\n- Graduate-level depth' :
  aiInstructor?.tone === 'accessible_friendly' ?
  '- Warm, conversational, and encouraging\n- Clear explanations with everyday examples\n- Student-friendly language' :
  '- Blend of scholarly clarity and accessible language\n- Professional yet personable\n- Clear explanations with real-world examples'}

**Live Teaching Format:**
- Start with engaging hooks and questions
- Use "Let me show you..." and "Think about this..." phrases
- Include pauses for reflection: "(pause for thought)"
- Encourage interaction: "What do you think?" "Can you see why?"
- Use visual language: "Imagine this scenario..." "Picture this..."
- Provide step-by-step explanations
- Summarize key points clearly
- Maintain eye contact and engagement cues

**Course Context:**
- Course: ${course?.code} - ${course?.title}
- Program: ${course?.program} ${course?.degree_program || ''}
- Weeks: ${aiInstructor?.course_weeks || 10}
- Session Duration: ${context.session_duration}

**Your Capabilities:**
1. **Live Teaching**: Conduct interactive lessons with engagement cues and Socratic questioning
2. **Chapter Mastery**: Summarize chapters, explain concepts, provide examples
3. **Homework Support**: Step-by-step guidance (never full solutions)
4. **Discussions**: Foster critical thinking and respectful debate
5. **Exam Prep**: Review objectives, practice questions, study strategies
6. **Research Assistance**: Help with topic refinement, structure, citations
7. **Multilingual Support**: Teach fluently in student's preferred language

**Behavioral Guidelines:**
- Maintain natural conversational flow
- Show empathy and encouragement
- Adapt pace to student understanding
- Provide examples and analogies
- Check for comprehension regularly
- Celebrate student progress

Respond as if you're speaking directly to the student in a live video session in ${languageName}. Be engaging, clear, and interactive.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}

**Student Question (in ${languageName}):** ${messageText}

**Context:** ${JSON.stringify(context, null, 2)}

**IMPORTANT: Your entire response must be in ${languageName}. Respond as ${aiInstructor?.name || 'the AI instructor'} in a live teaching session.**`,
        add_context_from_internet: false
      });

      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Generate animated video for the response (with fallback)
      if (videoEnabled && aiInstructor?.avatar_url) {
        const cleanText = response
          .replace(/[#*_`]/g, '')
          .replace(/\n+/g, '. ')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .substring(0, 500); // Limit for video generation
        
        const video = await generateAnimatedVideo(cleanText);
        if (video) {
          setVideoUrl(video);
        }
        // If video generation fails, the error state will be set by generateAnimatedVideo
        // and we just proceed with voice/text.
      }

      // Speak the response (always works, even if video fails)
      if (audioEnabled) {
        const cleanText = response
          .replace(/[#*_`]/g, '')
          .replace(/\n+/g, '. ')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        speakText(cleanText);
      }
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const instructorAvatar = aiInstructor?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (aiInstructor?.name || 'instructor');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={instructorAvatar} 
                  alt={aiInstructor?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {isSpeaking && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <Volume2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />
                Live Session with {aiInstructor?.name || 'AI Instructor'}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {aiInstructor?.title && <span>{aiInstructor.title} • </span>}
                {course?.code} - {course?.title}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[140px]">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={videoEnabled ? 'default' : 'outline'}
                size="icon"
                onClick={() => setVideoEnabled(!videoEnabled)}
                title="Toggle Video"
              >
                {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
              <Button
                variant={audioEnabled ? 'default' : 'outline'}
                size="icon"
                onClick={() => {
                  setAudioEnabled(!audioEnabled);
                  if (!audioEnabled) stopSpeaking();
                }}
                title="Toggle Audio"
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Badge className="bg-green-100 text-green-700 border-green-200 px-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                LIVE
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Video Section */}
        {videoEnabled && (
          <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
            <div className="max-w-2xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
                {videoUrl && !isGeneratingVideo ? (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    autoPlay
                    className="w-full h-full object-cover"
                    onEnded={() => setVideoUrl(null)}
                  />
                ) : (
                  <img 
                    src={instructorAvatar}
                    alt={aiInstructor?.name}
                    className={`w-full h-full object-cover ${isSpeaking ? 'animate-pulse' : ''}`}
                  />
                )}
                
                {isGeneratingVideo && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-3" />
                      <p className="text-white text-sm">Generating animated response...</p>
                    </div>
                  </div>
                )}
                
                {videoGenerationError && (
                  <div className="absolute top-3 left-3 right-3 bg-yellow-500/90 backdrop-blur-sm px-3 py-2 rounded-lg z-10">
                    <p className="text-white text-xs text-center">{videoGenerationError}</p>
                  </div>
                )}
                
                {isSpeaking && !isGeneratingVideo && (
                  <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center pointer-events-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-8 bg-white/80 rounded animate-bounce" style={{animationDelay: '0ms'}} />
                      <div className="w-2 h-12 bg-white/80 rounded animate-bounce" style={{animationDelay: '150ms'}} />
                      <div className="w-2 h-6 bg-white/80 rounded animate-bounce" style={{animationDelay: '300ms'}} />
                      <div className="w-2 h-10 bg-white/80 rounded animate-bounce" style={{animationDelay: '450ms'}} />
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-white text-sm font-medium">{aiInstructor?.name || 'AI Instructor'}</p>
                </div>
                
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <p className="text-white text-xs">{SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}</p>
                </div>
              </div>
              
              {videoGenerationError && (
                <div className="mt-3 text-center">
                  <p className="text-yellow-300 text-sm">
                    🎤 Voice-only mode active. Full video may require D-ID API key configuration or a valid AI instructor avatar.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map(action => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.id)}
                className="text-xs"
                disabled={isLoading || isSpeaking || isGeneratingVideo}
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 rounded-lg shadow-md ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.isError
                    ? 'bg-red-50 text-red-900 border border-red-200'
                    : 'bg-white text-gray-900'
                }`}>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                  <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {message.language && (
                    <Badge variant="outline" className="text-xs py-0">
                      {SUPPORTED_LANGUAGES.find(l => l.code === message.language)?.name}
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={isListening ? 'default' : 'outline'}
              size="icon"
              onClick={toggleListening}
              disabled={isLoading || isSpeaking || isGeneratingVideo}
              className={isListening ? 'bg-red-500 hover:bg-red-600' : ''}
              title="Voice Input"
            >
              {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? "Listening..." : `Ask your instructor anything in ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}...`}
              className="flex-1 min-h-[60px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading || isListening || isGeneratingVideo}
            />
            <Button 
              type="submit" 
              disabled={!inputMessage.trim() || isLoading || isSpeaking || isGeneratingVideo}
              className="self-end bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              <Sparkles className="w-3 h-3 inline mr-1" />
              24/7 Multilingual Support • Press Enter to send • Shift+Enter for new line • Click mic to speak
            </p>
            {isSpeaking && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={stopSpeaking}
                className="text-red-600 hover:text-red-700"
              >
                <Pause className="w-3 h-3 mr-1" />
                Stop Speaking
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
