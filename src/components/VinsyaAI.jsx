import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSend, FiMic, FiSquare } from 'react-icons/fi';

const PERSONAL_DATA = {
  galvin: {
    nama_lengkap: 'Galvin Alfito',
    nama_panggilan: 'Galvin',
    tanggal_lahir: '7 Oktober 2008',
    hobi: [
      'ngoding',
      'ngegame',
      'nonton YouTube'
    ],
    makanan_kesukaan: 'Makanan yang enak',
    minuman_kesukaan: 'Kopi Hitam Tanpa Gula Karena Manisnya Udah Ada Di dia Hhihihihi',
    warna_kesukaan: 'Pink dan biru',
    music_kesukaan: 'Pop, Indie',
    film_kesukaan: 'Dracin',
    zodiak: 'Libra',
    motto_hidup: 'Pengen Jadi Programmer Handal Tapi Males Ngoding',
    deskripsi_singkat:
      'Seseorang yang suka web development dan hampir selalu punya sesuatu untuk dikoding.',
    fakta_unik:
      'Kalau sudah ngoding, bisa ngoding, ngoding lagi, lalu ngoding lagi.',
    cita_cita:
      'Menjadi seseorang yang ahli di bidang web development.'
  },

  syafa: {
    nama_lengkap: 'Syafa',
    nama_panggilan: 'Syafa',
    tanggal_lahir: '22 Januari 2010',
    hobi: [
      'membaca',
      'menulis',
      'marah-marah'
    ],
    makanan_kesukaan: 'Makanan yang enak',
    minuman_kesukaan: 'Semua Yang enak enak aja',
    warna_kesukaan: 'Pink dan biru',
    music_kesukaan: 'Pop, Indie',
    film_kesukaan: 'Dracin dan Drakor',
    zodiak: 'Aquarius',
    motto_hidup: 'Males Kalo Ga Ada Temennya',
    deskripsi_singkat:
      'Seseorang yang suka membaca, menulis, dan punya sisi emosional yang cukup kuat.',
    fakta_unik:
      'Bisa membaca, menulis, dan marah-marah dalam satu paket.',
    cita_cita:
      'Belum pasti.'
  },

  hubungan: {
    status: 'Pasangan',
    tanggal_jadian: '18 JUNI 2023',
    lama_bersama: '4 TAHUN',
    cerita_pertemuan: 'Perang Stiker Di Whatsapp',
    deskripsi:
      'YouAndMe adalah website personal yang dibuat untuk menyimpan cerita, kenangan, dan momen Galvin dan Syafa.'
  },
};

/* ============================================================
   SYSTEM PROMPT UNTUK VINSYA AI
   Data di atas otomatis disisipkan ke dalam prompt.
============================================================ */
const generateSystemPrompt = () => {
  const g = PERSONAL_DATA.galvin;
  const s = PERSONAL_DATA.syafa;
  const h = PERSONAL_DATA.hubungan;

  return `
You are Vinsya AI, a gentle and warm assistant inside the YouAndMe website.
The website is a personal space dedicated to Galvin and Syafa.

You help visitors understand the website and also answer questions about Galvin and Syafa using the data below.

=== PERSONAL DATA GALVIN ===
Nama Lengkap: ${g.nama_lengkap || 'Tidak diisi'}
Nama Panggilan: ${g.nama_panggilan || 'Tidak diisi'}
Tanggal Lahir: ${g.tanggal_lahir || 'Tidak diisi'}
Hobi: ${g.hobi.length > 0 ? g.hobi.join(', ') : 'Tidak diisi'}
Makanan Kesukaan: ${g.makanan_kesukaan || 'Tidak diisi'}
Minuman Kesukaan: ${g.minuman_kesukaan || 'Tidak diisi'}
Warna Kesukaan: ${g.warna_kesukaan || 'Tidak diisi'}
Musik Kesukaan: ${g.music_kesukaan || 'Tidak diisi'}
Film Kesukaan: ${g.film_kesukaan || 'Tidak diisi'}
Zodiak: ${g.zodiak || 'Tidak diisi'}
Motto Hidup: ${g.motto_hidup || 'Tidak diisi'}
Deskripsi Singkat: ${g.deskripsi_singkat || 'Tidak diisi'}
Fakta Unik: ${g.fakta_unik || 'Tidak diisi'}

=== PERSONAL DATA SYAFA ===
Nama Lengkap: ${s.nama_lengkap || 'Tidak diisi'}
Nama Panggilan: ${s.nama_panggilan || 'Tidak diisi'}
Tanggal Lahir: ${s.tanggal_lahir || 'Tidak diisi'}
Hobi: ${s.hobi.length > 0 ? s.hobi.join(', ') : 'Tidak diisi'}
Makanan Kesukaan: ${s.makanan_kesukaan || 'Tidak diisi'}
Minuman Kesukaan: ${s.minuman_kesukaan || 'Tidak diisi'}
Warna Kesukaan: ${s.warna_kesukaan || 'Tidak diisi'}
Musik Kesukaan: ${s.music_kesukaan || 'Tidak diisi'}
Film Kesukaan: ${s.film_kesukaan || 'Tidak diisi'}
Zodiak: ${s.zodiak || 'Tidak diisi'}
Motto Hidup: ${s.motto_hidup || 'Tidak diisi'}
Deskripsi Singkat: ${s.deskripsi_singkat || 'Tidak diisi'}
Fakta Unik: ${s.fakta_unik || 'Tidak diisi'}

=== HUBUNGAN MEREKA ===
Status: ${h.status || 'Tidak diisi'}
Tanggal Jadian: ${h.tanggal_jadian || 'Tidak diisi'}
Lama Bersama: ${h.lama_bersama || 'Tidak diisi'}
Cerita Pertemuan: ${h.cerita_pertemuan || 'Tidak diisi'}

=== PETUNJUK PENTING ===
- Jika data di atas "Tidak diisi", jangan mengarang. Jawab dengan jujur: "Aku belum punya informasi itu, tapi nanti bisa ditambahkan oleh Galvin."
- Jika user bertanya tentang tanggal lahir, hobi, makanan kesukaan, dll, gunakan data yang ada di atas.
- Jawab dalam bahasa yang digunakan user (Indonesia atau Inggris). Default ke Indonesia.
- Untuk pertanyaan umum di luar data Galvin/Syafa, jawab natural seperti asisten biasa.
- Jaga nada hangat dan personal.
`;
};

const QUICK_QUESTIONS = [
  'Kapan Syafa ulang tahun?',
  'Apa hobi Galvin?',
  'Makanan kesukaan Syafa apa?',
  'Ceritain tentang hubungan kalian',
];

/* ============================================================
   HELPERS
============================================================ */
const formatTime = (date) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

/* ============================================================
   PRESENTATIONAL SUBCOMPONENTS
============================================================ */

const ChatHeader = ({ onClose }) => (
  <header className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
    <div className="flex flex-col">
      <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/90">
        Vinsya
      </span>
      <span className="mt-1.5 text-[10px] tracking-[0.08em] text-white/40">
        a little guide to You And Me
      </span>
    </div>
    <button
      onClick={onClose}
      aria-label="Close chat"
      className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors duration-300 hover:bg-white/[0.06] hover:text-white/80"
    >
      <FiX className="h-4 w-4" />
    </button>
  </header>
);

const MessageItem = ({ msg }) => {
  const isAI = msg.sender === 'ai';
  return (
    <div
      className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
      style={{ animation: 'vinsyaMsgIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <span className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">
        {isAI ? 'Vinsya' : 'You'}
      </span>

      {isAI ? (
        <p className="max-w-[92%] whitespace-pre-wrap text-[14px] leading-[1.8] text-white/80">
          {msg.text}
        </p>
      ) : (
        <div className="max-w-[85%] rounded-[14px] border border-white/[0.08] bg-white/[0.06] px-4 py-2.5 text-[14px] leading-[1.7] text-white/90">
          {msg.text}
        </div>
      )}

      <span className="mt-2 text-[9px] tracking-[0.15em] text-white/25">
        {formatTime(msg.timestamp)}
      </span>
    </div>
  );
};

const LoadingState = () => (
  <div
    className="flex flex-col items-start"
    style={{ animation: 'vinsyaMsgIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
  >
    <span className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">
      Vinsya
    </span>
    <div className="flex items-center gap-2 text-[13px] italic tracking-[0.05em] text-white/40">
      <span>thinking</span>
      <span className="flex items-center gap-[3px] pt-[3px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-[3px] w-[3px] rounded-full bg-white/60"
            style={{
              animation: 'vinsyaDot 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </span>
    </div>
  </div>
);

const QuickQuestions = ({ questions, onSelect }) => (
  <div className="border-t border-white/[0.06] pt-6">
    <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-white/35">
      Ask Something
    </div>
    <div className="flex flex-col">
      {questions.map((q, i) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="group flex items-baseline gap-4 py-2.5 text-left"
        >
          <span className="text-[10px] tracking-[0.15em] text-white/30 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-white/60">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="border-b border-transparent pb-0.5 text-[13px] text-white/50 transition-all duration-300 ease-out group-hover:border-white/20 group-hover:text-white/95">
            {q}
          </span>
        </button>
      ))}
    </div>
  </div>
);

/* ============================================================
   MAIN COMPONENT
============================================================ */
const VinsyaAI = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hai, aku Vinsya AI! Kamu bisa tanya apa saja tentang Galvin, Syafa, atau website ini. Coba tanya hobi, makanan kesukaan, atau tanggal ulang tahun mereka!",
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
    return `${generateSystemPrompt()}\n\nConversation:\n${history}\n\nVinsya AI:`;
  };

  const getFallbackResponse = (text) => {
    const lower = text.toLowerCase();
    const g = PERSONAL_DATA.galvin;
    const s = PERSONAL_DATA.syafa;
    const h = PERSONAL_DATA.hubungan;

    if (lower.includes('ulang') || lower.includes('lahir') || lower.includes('tanggal lahir')) {
      if (lower.includes('syafa')) {
        return s.tanggal_lahir ? `Syafa lahir tanggal ${s.tanggal_lahir}.` : 'Aku belum punya info tanggal lahir Syafa.';
      }
      if (lower.includes('galvin')) {
        return g.tanggal_lahir ? `Galvin lahir tanggal ${g.tanggal_lahir}.` : 'Aku belum punya info tanggal lahir Galvin.';
      }
      return 'Siapa yang ingin kamu tanyakan? Galvin atau Syafa?';
    }

    if (lower.includes('hobi')) {
      if (lower.includes('syafa')) {
        return s.hobi.length > 0 ? `Hobi Syafa: ${s.hobi.join(', ')}.` : 'Aku belum punya info hobi Syafa.';
      }
      if (lower.includes('galvin')) {
        return g.hobi.length > 0 ? `Hobi Galvin: ${g.hobi.join(', ')}.` : 'Aku belum punya info hobi Galvin.';
      }
      return 'Hobi siapa yang ingin kamu tanyakan?';
    }

    if (lower.includes('makanan kesukaan') || lower.includes('makanan favorit')) {
      if (lower.includes('syafa')) {
        return s.makanan_kesukaan ? `Makanan kesukaan Syafa adalah ${s.makanan_kesukaan}.` : 'Aku belum tahu makanan kesukaan Syafa.';
      }
      if (lower.includes('galvin')) {
        return g.makanan_kesukaan ? `Makanan kesukaan Galvin adalah ${g.makanan_kesukaan}.` : 'Aku belum tahu makanan kesukaan Galvin.';
      }
      return 'Makanan kesukaan siapa? Galvin atau Syafa?';
    }

    if (lower.includes('minuman kesukaan') || lower.includes('minuman favorit')) {
      if (lower.includes('syafa')) {
        return s.minuman_kesukaan ? `Minuman kesukaan Syafa adalah ${s.minuman_kesukaan}.` : 'Aku belum tahu minuman kesukaan Syafa.';
      }
      if (lower.includes('galvin')) {
        return g.minuman_kesukaan ? `Minuman kesukaan Galvin adalah ${g.minuman_kesukaan}.` : 'Aku belum tahu minuman kesukaan Galvin.';
      }
      return 'Minuman kesukaan siapa?';
    }

    if (lower.includes('warna kesukaan') || lower.includes('warna favorit')) {
      if (lower.includes('syafa')) {
        return s.warna_kesukaan ? `Warna kesukaan Syafa adalah ${s.warna_kesukaan}.` : 'Aku belum tahu warna kesukaan Syafa.';
      }
      if (lower.includes('galvin')) {
        return g.warna_kesukaan ? `Warna kesukaan Galvin adalah ${g.warna_kesukaan}.` : 'Aku belum tahu warna kesukaan Galvin.';
      }
      return 'Warna kesukaan siapa?';
    }

    if (lower.includes('jadian') || lower.includes('hubungan') || lower.includes('pacaran')) {
      if (h.status || h.tanggal_jadian || h.lama_bersama) {
        return `Mereka ${h.status || 'pacaran'} sejak ${h.tanggal_jadian || 'tanggal yang belum diisi'} (${h.lama_bersama || 'lama bersama belum diisi'}).`;
      }
      return 'Aku belum punya detail hubungan mereka.';
    }

    return 'Aku belum bisa menjawab itu. Coba tanya tentang Galvin, Syafa, atau website ini ya.';
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
        }
      }

      if (!responseText.trim()) {
        responseText = getFallbackResponse(text);
      }

      const aiMessage = {
        id: messages.length + 2,
        text: responseText.trim(),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Vinsya AI error:', error);
      const aiMessage = {
        id: messages.length + 2,
        text: 'Maaf, terjadi kesalahan. Coba lagi ya.',
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

  const hasUserInteracted = messages.some((m) => m.sender === 'user');

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[99999999999999] flex flex-col overflow-hidden
        bg-[#050505]/95 backdrop-blur-xl
        md:inset-auto md:bottom-6 md:right-6
        md:h-[min(680px,calc(100vh-100px))]
        md:w-[min(460px,calc(100vw-32px))]
        md:rounded-[20px]
        md:border md:border-white/[0.10]
      "
      style={{
        animation: 'vinsyaFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
      }}
    >
      <ChatHeader onClose={onClose} />

      {/* Messages area */}
      <div className="vinsya-scroll flex-1 min-h-0 space-y-7 overflow-y-auto px-6 py-7">
        {messages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} />
        ))}

        {isLoading && <LoadingState />}

        {!hasUserInteracted && !isLoading && (
          <QuickQuestions
            questions={QUICK_QUESTIONS}
            onSelect={handleQuickQuestion}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex items-center gap-3 border-t border-white/[0.08] px-6 py-4"
      >
        {isListening && (
          <div className="flex items-end gap-[3px] pr-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[2px] rounded-full bg-white/70"
                style={{
                  height: '14px',
                  animation: 'vinsyaBar 1s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? 'LISTENING...' : 'Ask Vinsya anything...'}
          disabled={isLoading}
          className="
            flex-1 bg-transparent text-[13px] tracking-wide text-white
            placeholder-white/30 outline-none
            disabled:opacity-50
          "
        />

        <button
          type="button"
          onClick={toggleListening}
          aria-label="Voice input"
          className={`
            flex h-8 w-8 items-center justify-center rounded-full
            transition-colors duration-300
            ${
              isListening
                ? 'bg-white/[0.10] text-white'
                : 'text-white/40 hover:bg-white/[0.06] hover:text-white/80'
            }
          `}
        >
          {isListening ? (
            <FiSquare className="h-3.5 w-3.5" />
          ) : (
            <FiMic className="h-4 w-4" />
          )}
        </button>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          className="
            flex h-8 w-8 items-center justify-center rounded-full
            text-white/60 transition-colors duration-300
            hover:bg-white/[0.06] hover:text-white
            disabled:opacity-30 disabled:hover:bg-transparent
          "
        >
          <FiSend className="h-4 w-4" />
        </button>
      </form>

      <style>{`
        @keyframes vinsyaFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes vinsyaMsgIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes vinsyaDot {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
        @keyframes vinsyaBar {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .vinsya-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .vinsya-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .vinsya-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 2px;
        }
        .vinsya-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        .vinsya-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
      `}</style>
    </div>
  );
};

export default VinsyaAI;
