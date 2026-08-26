import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSend, FiMic, FiSquare } from 'react-icons/fi';

const WEBSITE_CONTEXT = `
You are Vinsya AI, a gentle assistant inside the YouAndMe website.

The website is a personal space dedicated to Galvin and Syafa. It contains:
- Hero section with their names and a welcoming message.
- Gallery of their memories (photos).
- Story section about their journey.
- Profile section introducing each of them.
- A special "My Love" section with a lunar gravity card.
- A love message area.
- Footer.

Your role is to help visitors understand the website, the content of each section, and the general vibe of the site. You can answer about:
- Galvin (general: he is one of the two people this website is about)
- Syafa (general: she is the other person)
- The website's purpose and sections
- The memories and story shown in the gallery/story sections
- The music player if they ask about the background song (if known from the site)
- Any questions about the website's design or content

IMPORTANT:
- Do NOT invent personal details (like full names, ages, locations, specific dates) unless clearly provided in the website context.
- If you don't know something, say "I don't have that information yet" or a natural equivalent.
- Always answer in the language the user uses (Indonesian or English). Default to Indonesian if unsure.
- Keep answers concise, warm, and helpful.
- Do not break character.
`;

const QUICK_QUESTIONS = [
  'Tell me about Galvin',
  'Tell me about Syafa',
  "What's this website about?",
  'Tell me about your memories',
];

const VinsyaAI = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, I'm Vinsya AI. Ask me about Galvin, Syafa, their memories, or anything you find on this website.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [puterReady, setPuterReady] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (window.puter && typeof window.puter.ai?.chat === 'function') {
      setPuterReady(true);
      console.log('[Vinsya AI] Puter ready');
    } else {
      console.warn('[Vinsya AI] Puter not found, fallback will be used');
      setPuterReady(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'id-ID';
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setInput(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const buildContext = () => {
    const history = messages
      .filter((m) => m.sender !== 'system')
      .slice(-10)
      .map((m) => `${m.sender === 'ai' ? 'Vinsya AI' : 'User'}: ${m.text}`)
      .join('\n');
    return `${WEBSITE_CONTEXT}\n\nConversation:\n${history}\n\nVinsya AI:`;
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';
      if (puterReady && window.puter && typeof window.puter.ai?.chat === 'function') {
        abortControllerRef.current = new AbortController();
        const fullPrompt = buildContext() + ' ' + text.trim() + '\n';
        const response = await window.puter.ai.chat(fullPrompt, {
          model: 'gpt-4o-mini',
          max_tokens: 500,
          temperature: 0.7,
        });

        if (typeof response === 'string') {
          responseText = response;
        } else if (response?.message?.content) {
          responseText = response.message.content;
        } else if (response?.content) {
          responseText = response.content;
        } else if (response?.text) {
          responseText = response.text;
        } else {
          responseText = "I'm not sure how to answer that right now.";
        }
      } else {
        const lower = text.toLowerCase();
        if (lower.includes('galvin')) {
          responseText = 'Galvin is one of the two people this website is dedicated to. He is a part of the YouAndMe story.';
        } else if (lower.includes('syafa')) {
          responseText = 'Syafa is the other person this website is about. Together with Galvin, they make up the YouAndMe journey.';
        } else if (lower.includes('website') || lower.includes('situs')) {
          responseText = 'This website is a personal space for Galvin and Syafa to share their memories, photos, and story.';
        } else if (lower.includes('memori') || lower.includes('kenangan') || lower.includes('memory')) {
          responseText = 'The website contains a gallery and story section filled with their shared memories.';
        } else {
          responseText = "I'm sorry, I can only help with questions about the YouAndMe website, Galvin, Syafa, or their memories.";
        }
      }

      const aiMessage = {
        id: messages.length + 2,
        text: responseText.trim() || "I couldn't generate a response. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Vinsya AI error:', error);
      const aiMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          recognitionRef.current.start();
          setIsListening(true);
        })
        .catch(() => {
          setIsListening(false);
        });
    }
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const hasUserInteracted = messages.some((m) => m.sender === 'user');

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-24 right-6 z-[9999999999999999999] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl"
      style={{
        width: 'min(420px, calc(100vw - 2rem))',
        height: 'min(600px, calc(100vh - 120px))',
        animation: 'vinsyaFadeIn 0.3s ease-out',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Vinsya AI</h3>
          <p className="text-xs text-zinc-400">Your little guide to YouAndMe</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="mb-1 px-1 text-[10px] font-medium text-zinc-500">
              {msg.sender === 'ai' ? 'Vinsya AI' : 'You'}
            </span>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white'
                  : 'bg-white/5 text-zinc-200'
              }`}
            >
              {msg.text}
            </div>
            <span className="mt-1 px-1 text-[9px] text-zinc-600">
              {formatTime(msg.timestamp)}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2 pl-1">
            <span className="text-[10px] font-medium text-zinc-500">Vinsya AI</span>
            <div className="flex items-center gap-1 px-2 py-2">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce"
                  style={{ animationDelay: `${dot * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {!hasUserInteracted && !isLoading && (
          <div className="mt-4 flex flex-wrap gap-2 px-1">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleQuickQuestion(q)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isListening
                ? 'bg-red-500/20 text-red-400'
                : 'text-zinc-400 hover:bg-white/10 hover:text-white'
            }`}
            aria-label="Voice input"
          >
            {isListening ? <FiSquare className="h-4 w-4" /> : <FiMic className="h-4 w-4" />}
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? 'Listening...' : 'Ask Vinsya anything...'}
            disabled={isLoading}
            className="flex-1 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-rose-400/50 focus:ring-1 focus:ring-rose-400/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
            aria-label="Send message"
          >
            <FiSend className="h-4 w-4" />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes vinsyaFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default VinsyaAI;
