'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  AlertTriangle,
  Phone,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { useAssessmentStore } from '@/stores/assessment-store';
import { MALAYSIA_HOTLINES } from '@/lib/constants/hotlines';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: `Hello! I'm your mental health assistant. I'm here to provide support and guidance based on your assessment results.

Please remember:
- I'm not a replacement for professional help
- If you're in crisis, please call Talian Kasih at 15999
- I'm here to listen and provide general mental health information

How can I help you today?`,
  timestamp: new Date(),
};

const BLOCKED_MESSAGE: Message = {
  id: 'blocked',
  role: 'system',
  content: `For your safety, the chat feature has been temporarily disabled.

Based on your assessment, we strongly encourage you to reach out to a mental health professional or call one of our crisis hotlines:

- **Talian Kasih**: 15999 (24/7)
- **Befrienders**: 03-7956 8145 (24/7)

You are not alone, and help is available.`,
  timestamp: new Date(),
};

export default function ChatPage() {
  const { isEmergency, hasSuicidalIdeation, riskLevel } = useAssessmentStore();

  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if chat should be blocked
  const isChatBlocked = isEmergency || hasSuicidalIdeation || riskLevel === 'imminent';

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show blocked message if chat is blocked
  useEffect(() => {
    if (isChatBlocked) {
      setMessages([BLOCKED_MESSAGE]);
    }
  }, [isChatBlocked]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isChatBlocked) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // In production, this would call the AI API with RAG
      // const response = await fetch('/api/v1/chat', {
      //   method: 'POST',
      //   body: JSON.stringify({ message: input, context: assessmentContext }),
      // });

      // Mock AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockResponses = [
        "Thank you for sharing that with me. It sounds like you're going through a challenging time. Can you tell me more about what you're experiencing?",
        "I understand how difficult this can be. Remember that it's okay to feel this way, and seeking help is a sign of strength. Would you like me to share some coping strategies that might help?",
        "That's a very common experience, and you're not alone in feeling this way. Have you considered speaking with a mental health professional about these feelings?",
        "I hear you. It takes courage to talk about these things. Based on your situation, I'd recommend trying some relaxation techniques. Would you like me to guide you through one?",
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again later, or if you need immediate help, call Talian Kasih at 15999.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-4 flex flex-col">
        <div className="mx-auto max-w-3xl px-4 flex-1 flex flex-col w-full">
          {/* Chat Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <GlassCard className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <Bot className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="font-semibold text-neutral-900 dark:text-white">
                  Mental Health Assistant
                </h1>
                <p className="text-sm text-neutral-500">
                  Powered by AI with professional guidance
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Chat Blocked Warning */}
          {isChatBlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <GlassCard className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200">
                      We Care About Your Safety
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      Based on your responses, we want to ensure you get the support you need.
                      Please reach out to a crisis hotline.
                    </p>
                    <div className="mt-4 space-y-2">
                      {MALAYSIA_HOTLINES.slice(0, 2).map((hotline) => (
                        <a
                          key={hotline.number}
                          href={`tel:${hotline.number.replace(/\s|-/g, '')}`}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <Phone className="w-5 h-5 text-primary-600" />
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {hotline.name}
                            </p>
                            <p className="text-primary-600 font-semibold">
                              {hotline.number}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[300px]">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary-500 text-white rounded-2xl rounded-br-md'
                        : message.role === 'system'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-2xl border border-red-200 dark:border-red-800'
                        : 'glass rounded-2xl rounded-bl-md'
                    } px-4 py-3`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-primary-500" />
                        <span className="text-xs font-medium text-primary-600">
                          Assistant
                        </span>
                      </div>
                    )}
                    <p
                      className={`text-sm whitespace-pre-wrap ${
                        message.role === 'user'
                          ? ''
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user'
                          ? 'text-white/70'
                          : 'text-neutral-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                    <span className="text-sm text-neutral-500">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className={isChatBlocked ? 'opacity-50' : ''}>
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isChatBlocked
                      ? 'Chat is currently disabled for your safety'
                      : 'Type your message...'
                  }
                  disabled={isChatBlocked || isLoading}
                  className="flex-1 bg-transparent border-none outline-none resize-none text-neutral-900 dark:text-white placeholder-neutral-400 min-h-[44px] max-h-[120px]"
                  rows={1}
                />
                <GlassButton
                  variant="primary"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || isChatBlocked}
                  className="self-end"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </GlassButton>
              </div>
            </GlassCard>

            {/* Disclaimer */}
            <p className="text-xs text-center text-neutral-400 mt-3">
              This AI assistant is not a substitute for professional mental health care.
              If you&apos;re in crisis, please call Talian Kasih at 15999.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer showEmergencyBanner={!isChatBlocked} />
    </div>
  );
}
