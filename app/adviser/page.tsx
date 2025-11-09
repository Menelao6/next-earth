// app/adviser/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppState } from '../lib/useAppState';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatContext: ChatContext = {
    country: state.country || 'Not selected',
    path: state.path ? 
      state.path.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
      : 'Not selected',
    skills: state.skills,
    matchesCount: 0,
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

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

  return (
    <div className={styles.adviserPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.contextChip}>
            <span>{chatContext.country}</span>
            <span>•</span>
            <span>Path: {chatContext.path}</span>
            <span>•</span>
            <span>{chatContext.matchesCount} matches found</span>
          </div>
          <h1 className={styles.title}>AI Climate Adviser</h1>
          <p className={styles.subtitle}>
            Ask our AI adviser how to grow your impact.
          </p>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Context Sidebar */}
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

            <div className={styles.resources}>
              <h4>Learning Resources</h4>
              <div className={styles.resourceList}>
                <a href="#" className={styles.resourceLink}>Climate Science Basics</a>
                <a href="#" className={styles.resourceLink}>Green Career Guide</a>
                <a href="#" className={styles.resourceLink}>Local NGO Directory</a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className={`${styles.main} ${!isContextOpen ? styles.mainExpanded : ''}`}>
          {!isContextOpen && (
            <button 
              className={styles.openContextButton}
              onClick={() => setIsContextOpen(true)}
              aria-label="Open context panel"
            >
              Show Context
            </button>
          )}

          <div className={styles.chatContainer}>
            {/* Messages */}
            <div className={styles.messages}>
              {messages.length === 0 ? (
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

            {/* Input Area */}
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <div className={styles.inputContainer}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about climate action, skills, or opportunities..."
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
                  <button 
                    type="button" 
                    className={styles.saveButton}
                  >
                    Save Conversation
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}