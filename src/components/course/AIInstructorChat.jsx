import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

const QUICK_ACTIONS = [
  { id: 'syllabus', label: 'Explain Syllabus', icon: FileText },
  { id: 'chapter_summary', label: 'Summarize Chapter', icon: BookOpen },
  { id: 'live_lesson', label: 'Start Live Lesson', icon: Video },
  { id: 'homework_help', label: 'Homework Help', icon: HelpCircle },
  { id: 'exam_prep', label: 'Exam Preparation', icon: GraduationCap },
  { id: 'discussion', label: 'Start Discussion', icon: MessageSquare },
];

export default function AIInstructorChat({ courseId, open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    if (open && messages.length === 0) {
      // Initial greeting
      const greeting = {
        role: 'assistant',
        content: `Hello! I'm ${aiInstructor?.name || 'your AI instructor'} for ${course?.title || 'this course'}. 

I'm here to help you with:
- 📚 Chapter summaries and explanations
- 🎓 Live interactive lessons
- 📝 Homework guidance and walkthroughs
- 📖 Syllabus and course structure
- 💬 Thoughtful discussions
- 📊 Exam preparation

How can I assist you today?`,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [open, aiInstructor, course]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickAction = async (actionId) => {
    const prompts = {
      syllabus: "Please walk me through the course syllabus, explaining the structure, grading, and expectations.",
      chapter_summary: "Can you summarize the key concepts from the current chapter?",
      live_lesson: "I'd like to start a live lesson on today's topic. Please guide me through it interactively.",
      homework_help: "I need help understanding the current homework assignment. Can you provide guidance?",
      exam_prep: "Help me prepare for the upcoming exam. What should I focus on?",
      discussion: "Let's have a thoughtful discussion about the main themes in this course."
    };

    await sendMessage(prompts[actionId]);
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build context for AI
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
        conversation_history: messages.slice(-5) // Last 5 messages for context
      };

      const systemPrompt = `You are ${aiInstructor?.name || 'an AI instructor'}, teaching ${course?.title}.

**Your Teaching Style:**
${aiInstructor?.tone === 'formal_academic' ? 
  '- Professional, lecture-style delivery with rich academic terminology\n- Scholarly citations and rigorous analysis\n- Graduate-level depth' :
  '- Blend of scholarly clarity and accessible language\n- Professional yet personable\n- Clear explanations with real-world examples'}

**Course Context:**
- Course: ${course?.code} - ${course?.title}
- Program: ${course?.program} ${course?.degree_program || ''}
- Weeks: ${aiInstructor?.course_weeks || 10}

**Your Capabilities:**
1. **Live Teaching**: Conduct interactive lessons with engagement cues, think-pair-share prompts, and Socratic questioning
2. **Chapter Mastery**: Summarize chapters, explain key concepts, provide analogies and examples
3. **Homework Support**: Step-by-step scaffolding, hints (never full solutions during assessments)
4. **Discussions**: Foster critical thinking, respectful debate, and faith-reason integration
5. **Exam Prep**: Review objectives, practice questions, study strategies
6. **Syllabus Guidance**: Explain policies, grading, expectations, and course flow

**Teaching Principles:**
- Encourage critical thinking and humility in learning
- Integrate faith with academic rigor (when appropriate)
- Use Socratic method for deeper understanding
- Provide real-world applications
- Be encouraging and supportive
- Never give direct answers to assessed work - guide instead
- Cite sources when making claims

${context.textbook ? '**Textbook Reference Available** - You have access to the course textbook and can reference specific chapters and concepts.' : ''}

Respond as the AI instructor, maintaining your persona, using proper formatting, and engaging the student meaningfully.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}

**Student Question:** ${messageText}

**Context:** ${JSON.stringify(context, null, 2)}

Respond as ${aiInstructor?.name || 'the AI instructor'}, maintaining your academic tone while being helpful and engaging.`,
        add_context_from_internet: false
      });

      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              {aiInstructor?.avatar_url ? (
                <img src={aiInstructor.avatar_url} alt={aiInstructor.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <Bot className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{aiInstructor?.name || 'AI Instructor'}</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {aiInstructor?.title && <span>{aiInstructor.title} • </span>}
                {course?.code} - {course?.title}
              </p>
            </div>
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </DialogHeader>

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
                disabled={isLoading}
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-100' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.isError
                    ? 'bg-red-50 text-red-900 border border-red-200'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <ReactMarkdown className="prose prose-sm max-w-none">
                    {message.content}
                  </ReactMarkdown>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your AI instructor anything..."
              className="flex-1 min-h-[60px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={!inputMessage.trim() || isLoading}
              className="self-end"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

AIInstructorChat.propTypes = {
  courseId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};