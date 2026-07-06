// components/Ultah.jsx
import React, { useState, useEffect } from 'react';
import { FaClock, FaGift, FaHeart, FaStar, FaChevronRight } from 'react-icons/fa';

const Ultah = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isBirthday, setIsBirthday] = useState(false);
  const [showCake, setShowCake] = useState(false);

  useEffect(() => {
    // Target: 22 Januari 2027
    const target = new Date(2027, 0, 22, 0, 0, 0);

    const updateCountdown = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setIsBirthday(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  // Tampilan Kue Ulang Tahun (setelah klik Continue)
  if (showCake) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Background sparkle */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${Math.random() * 2 + 1}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.5 + 0.1
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          {/* Simple Cake SVG */}
          <div className="flex justify-center mb-8">
            <svg width="250" height="250" viewBox="0 0 250 250">
              {/* Cake bottom */}
              <rect x="35" y="160" width="180" height="35" rx="8" fill="#a88679" />
              {/* Cake middle */}
              <rect x="50" y="135" width="150" height="30" rx="8" fill="#c49a8c" />
              {/* Cake top */}
              <rect x="65" y="110" width="120" height="30" rx="8" fill="#dbb8ab" />
              {/* Frosting */}
              <rect x="60" y="105" width="130" height="12" rx="6" fill="#fefae9" />
              {/* Frosting drips */}
              <path d="M70 105 Q75 120 80 105" fill="#fefae9" />
              <path d="M100 105 Q105 125 110 105" fill="#fefae9" />
              <path d="M140 105 Q145 118 150 105" fill="#fefae9" />
              <path d="M170 105 Q175 122 180 105" fill="#fefae9" />
              {/* Candle */}
              <rect x="118" y="70" width="14" height="40" rx="3" fill="#ff6b6b" />
              {/* Candle stripes */}
              <rect x="118" y="80" width="14" height="4" fill="#fff" opacity="0.3" />
              <rect x="118" y="90" width="14" height="4" fill="#fff" opacity="0.3" />
              <rect x="118" y="100" width="14" height="4" fill="#fff" opacity="0.3" />
              {/* Flame */}
              <ellipse cx="125" cy="62" rx="8" ry="15" fill="#ffd93d">
                <animate attributeName="ry" values="15;10;15" dur="0.4s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="125" cy="58" rx="4" ry="10" fill="#ff6b35">
                <animate attributeName="ry" values="10;6;10" dur="0.4s" repeatCount="indefinite" />
              </ellipse>
              {/* Decorations */}
              <circle cx="85" cy="135" r="5" fill="#ff6b6b" opacity="0.7" />
              <circle cx="165" cy="135" r="5" fill="#ff6b6b" opacity="0.7" />
              <circle cx="105" cy="160" r="5" fill="#ffd93d" opacity="0.7" />
              <circle cx="145" cy="160" r="5" fill="#ffd93d" opacity="0.7" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex justify-center items-center gap-3 mb-4">
            <FaHeart className="text-pink-500/50 text-sm" />
            <div className="w-12 h-px bg-white/20"></div>
            <FaGift className="text-white/50 text-lg" />
            <div className="w-12 h-px bg-white/20"></div>
            <FaHeart className="text-pink-500/50 text-sm" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light text-white tracking-wider mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Happy Birthday!
          </h1>
          <p className="text-2xl text-gray-400 font-light italic">
            Syafa 🎂
          </p>
        </div>

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.5); }
          }
        `}</style>
      </div>
    );
  }

  // Tampilan Countdown
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background subtle */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-12 h-px bg-white/20"></div>
            <FaClock className="text-white/40 text-2xl" />
            <div className="w-12 h-px bg-white/20"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-white tracking-wider">
            Menuju Hari Spesial
          </h2>
          <p className="text-gray-500 text-sm uppercase tracking-[0.3em] mt-4">
            22 Januari 2027
          </p>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-5xl md:text-7xl font-light text-white">
                {formatNumber(timeLeft.days)}
              </div>
              <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider mt-2">
                Hari
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-5xl md:text-7xl font-light text-white">
                {formatNumber(timeLeft.hours)}
              </div>
              <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider mt-2">
                Jam
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-5xl md:text-7xl font-light text-white">
                {formatNumber(timeLeft.minutes)}
              </div>
              <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider mt-2">
                Menit
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-5xl md:text-7xl font-light text-white">
                {formatNumber(timeLeft.seconds)}
              </div>
              <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider mt-2">
                Detik
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Tombol Continue muncul otomatis saat isBirthday true */}
        <div className="text-center mt-12">
          {isBirthday ? (
            <button
              onClick={() => setShowCake(true)}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-white/30 rounded-full hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <span className="text-white text-base uppercase tracking-wider font-light">
                🎉 Lihat Kejutan
              </span>
              <FaChevronRight className="text-white/70 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          ) : (
            <>
              <div className="flex justify-center items-center gap-2 mb-4">
                <FaStar className="text-white/20 text-xs" />
                <FaStar className="text-white/30 text-xs" />
                <FaStar className="text-white/20 text-xs" />
              </div>
              <p className="text-gray-600 text-xs tracking-wider">
                {new Date().getFullYear() === 2026 ? 'Menuju 2027 yang istimewa ✨' : 'Momen yang dinanti'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ultah;
