'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppState } from '../lib/useAppState';
import { useRouter } from 'next/navigation';
import styles from './adviser.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContext {
  country: string;
  path: string;
  skills: string[];
  matchesCount: number;
  riskData?: {
    flood: number;
    cyclone: number;
    heat: number;
  };
}

export default function AdviserPage() {
  const { state } = useAppState();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and set initial context state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      // On desktop, open by default only if user has profile data
      // On mobile, always start closed
      setIsContextOpen(!mobile && hasProfileData);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hasProfileData = !!(state.country && state.path && state.skills.length > 0);

  const chatContext: ChatContext = {
    country: state.country || 'Not selected',
    path: state.path ? 
      state.path.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
      : 'Not selected',
    skills: state.skills,
    matchesCount: 0,
  };

  // Auto-scroll to bottom of messages - FIXED
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Fix initial scroll position
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Also scroll chat container to top
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, []);

  const quickPrompts = [
    "How can I prepare for a green-tech job?",
    "What climate challenges are biggest in my region?",
    "How do I train for disaster-response logistics?",
    "What skills should I develop next?",
    "Find local volunteer opportunities"
  ];

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          context: chatContext,
          conversationHistory: messages.slice(-10),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const navigateToMatches = () => {
    router.push('/matches');
  };

  return (
    <div className={styles.adviserPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {hasProfileData ? (
            <div className={styles.contextChip}>
              <span>{chatContext.country}</span>
              <span>•</span>
              <span>Path: {chatContext.path}</span>
              <span>•</span>
              <span>{chatContext.skills.length} skills</span>
            </div>
          ) : (
            <div className={styles.setupPrompt}>
              <span>Complete your profile to get personalized advice</span>
              <button 
                className={styles.setupButton}
                onClick={navigateToMatches}
              >
                Set Up Profile →
              </button>
            </div>
          )}
          <h1 className={styles.title}>AI Climate Adviser</h1>
          <p className={styles.subtitle}>
            Ask our AI adviser how to grow your impact.
          </p>
        </div>
      </header>

      <div className={`${styles.layout} ${!hasProfileData ? styles.layoutFullWidth : ''}`}>
        {/* Context Sidebar - Only show if user has profile data */}
        {hasProfileData && (
          <aside className={`${styles.sidebar} ${isContextOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarHeader}>
                <h3>Your Context</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setIsContextOpen(false)}
                  aria-label="Close context panel"
                >
                  ×
                </button>
              </div>

              <div className={styles.contextSection}>
                <h4>Profile Summary</h4>
                <div className={styles.contextItem}>
                  <strong>Country:</strong> {chatContext.country}
                </div>
                <div className={styles.contextItem}>
                  <strong>Path:</strong> {chatContext.path}
                </div>
                <div className={styles.contextItem}>
                  <strong>Skills:</strong>
                  <div className={styles.skillsList}>
                    {chatContext.skills.length > 0 ? (
                      chatContext.skills.map(skill => (
                        <span key={skill} className={styles.skillTag}>{skill}</span>
                      ))
                    ) : (
                      <span className={styles.noSkills}>No skills added</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.quickActions}>
                <h4>Quick Actions</h4>
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleQuickPrompt("Upgrade my skills for climate action")}
                  >
                    Upgrade Skills
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleQuickPrompt("Find training opportunities in my region")}
                  >
                    Find Training
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleQuickPrompt("Tell me about climate risks in my country")}
                  >
                    Regional Info
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Chat Area */}
        <main className={`${styles.main} ${(!isContextOpen || !hasProfileData) ? styles.mainExpanded : ''}`}>
          {/* Show context toggle button only when user has profile data and context is closed */}
          {hasProfileData && !isContextOpen && (
            <button 
              className={styles.openContextButton}
              onClick={() => setIsContextOpen(true)}
              aria-label="Open context panel"
            >
              Show Profile
            </button>
          )}

          <div className={styles.chatContainer} ref={chatContainerRef}>
            {/* Setup guidance when no profile data - Now shows on desktop too */}
            {!hasProfileData && (
              <div className={styles.setupGuide}>
                <div className={styles.setupEmoji}>🎯</div>
                <h3>Let's personalize your experience</h3>
                <p>To get the most relevant climate action advice, please set up your profile first.</p>
                
                <div className={styles.setupSteps}>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>1</span>
                    <div className={styles.stepContent}>
                      <strong>Choose your path</strong>
                      <p>Select how you want to contribute - help hospitals, support communities, or join the green workforce</p>
                    </div>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>2</span>
                    <div className={styles.stepContent}>
                      <strong>Set your location</strong>
                      <p>Tell us your country so we can provide region-specific climate risks and opportunities</p>
                    </div>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>3</span>
                    <div className={styles.stepContent}>
                      <strong>Add your skills</strong>
                      <p>List your existing skills so we can match you with the most suitable climate actions</p>
                    </div>
                  </div>
                </div>

                <button 
                  className={styles.primarySetupButton}
                  onClick={navigateToMatches}
                >
                  Set Up Your Profile Now →
                </button>

                <div className={styles.chatAnyway}>
                  <p>You can still chat with the AI adviser below, but responses won't be personalized to your situation.</p>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className={styles.messages}>
              {messages.length === 0 && hasProfileData ? (
                <div className={styles.welcomeMessage}>
                  <div className={styles.welcomeEmoji}>🌍</div>
                  <h3>Hello! I'm your AI Climate Adviser</h3>
                  <p>I can help you with:</p>
                  <ul className={styles.welcomeList}>
                    <li>Career guidance for green jobs</li>
                    <li>Climate risk information for your region</li>
                    <li>Skill development recommendations</li>
                    <li>Local volunteer opportunities</li>
                  </ul>
                  
                  <div className={styles.quickPrompts}>
                    <p>Try asking:</p>
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        className={styles.quickPrompt}
                        onClick={() => handleQuickPrompt(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : messages.length === 0 && !hasProfileData ? (
                <div className={styles.genericWelcome}>
                  <div className={styles.welcomeEmoji}>💬</div>
                  <h3>Welcome to AI Climate Adviser</h3>
                  <p>I can answer general questions about climate action, but for personalized advice, please set up your profile first.</p>
                  <p>Feel free to ask me about:</p>
                  <ul className={styles.welcomeList}>
                    <li>General climate change information</li>
                    <li>Career paths in sustainability</li>
                    <li>Skill development suggestions</li>
                    <li>Climate action opportunities</li>
                  </ul>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${
                      message.role === 'user' ? styles.userMessage : styles.assistantMessage
                    }`}
                  >
                    <div className={styles.messageContent}>
                      {message.content.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                    <div className={styles.messageTime}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className={styles.typingIndicator}>
                  <div className={styles.typingDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>AI Adviser is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Always available */}
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <div className={styles.inputContainer}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    hasProfileData 
                      ? "Ask about climate action, skills, or opportunities..."
                      : "Ask general questions about climate action..."
                  }
                  className={styles.textInput}
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={styles.sendButton}
                  aria-label="Send message"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2 21l21-9L2 3v7l15 2-15 2v7z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
              
              {messages.length > 0 && (
                <div className={styles.chatActions}>
                  <button 
                    type="button" 
                    className={styles.clearButton}
                    onClick={clearChat}
                  >
                    Clear Chat
                  </button>
                  {hasProfileData && (
                    <button 
                      type="button" 
                      className={styles.saveButton}
                    >
                      Save Conversation
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}