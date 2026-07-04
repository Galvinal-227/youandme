// components/Ultah.jsx
import React, { useState, useEffect } from 'react';
import { FaGift, FaClock, FaCalendarDay, FaStar, FaHeart } from 'react-icons/fa';

const Ultah = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isBirthday, setIsBirthday] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);

  // Target tanggal: 22 Januari 2026
  const targetDate = new Date('2026-01-22T00:00:00').getTime();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setIsBirthday(true);
        clearInterval(interval);
        // Tampilkan kejutan setelah 2 detik
        setTimeout(() => setShowSurprise(true), 2000);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Efek CSS untuk animasi kue dan lilin
  useEffect(() => {
    if (showSurprise) {
      // Tambahkan style untuk animasi
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0); }
        }
        .candle-flame {
          animation: flicker 0.5s ease-in-out infinite;
        }
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        .surprise-text {
          animation: fadeInUp 1s ease-out forwards;
        }
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: sparkle 1.5s ease-out infinite;
        }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }
  }, [showSurprise]);

  // Format angka dengan leading zero
  const formatNumber = (num) => String(num).padStart(2, '0');

  // Render countdown
  const renderCountdown = () => (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effect */}
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
          <h1 className="text-4xl md:text-6xl font-light text-white tracking-wider">
            Menuju Hari Spesial
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-[0.3em] mt-4">
            22 Januari 2026
          </p>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-4 md:gap-8">
          {[
            { label: 'Hari', value: timeLeft.days },
            { label: 'Jam', value: timeLeft.hours },
            { label: 'Menit', value: timeLeft.minutes },
            { label: 'Detik', value: timeLeft.seconds }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6">
                <div className="text-4xl md:text-7xl font-light text-white tabular-nums">
                  {formatNumber(item.value)}
                </div>
                <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider mt-3">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer countdown */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm tracking-wider">
            {new Date().getFullYear() === 2025 ? 'Tahun ini akan menjadi istimewa' : 'Momen yang dinanti'}
          </p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <FaStar className="text-white/20 text-xs" />
            <FaStar className="text-white/30 text-xs" />
            <FaStar className="text-white/20 text-xs" />
          </div>
        </div>
      </div>
    </div>
  );

  // Render kejutan ulang tahun
  const renderSurprise = () => (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Cake SVG */}
        <div className="floating mb-8">
          <svg
            version="1.1"
            x="0px"
            y="0px"
            width="200px"
            height="300px"
            viewBox="0 0 200 500"
            className="mx-auto"
          >
            {/* Cake layers - simplified black and white version */}
            <rect x="10" y="475" fill="#333" width="180" height="4" />
            
            {/* Bottom layer */}
            <path fill="#444" d="M173.667,21.571c-33.174,0-111.467,0-147.334,0c-4,0-4-16.002,0-16.002c39.836,0,105.982,0,147.334,0
            C177.668,5.569,177.667,21.571,173.667,21.571z">
              <animate attributeName="opacity" values="0.3;1" dur="1s" fill="freeze" />
            </path>
            
            {/* Middle layer */}
            <path fill="#555" d="M173.667-15.929c-46.512,0-105.486,0-147.334,0c-3.999,0-4-16.002,0-16.002
            c43.566,0,97.96,0,147.334,0C177.667-31.931,177.666-15.929,173.667-15.929z">
              <animate attributeName="opacity" values="0.3;1" dur="1s" begin="0.3s" fill="freeze" />
            </path>
            
            {/* Top layer */}
            <path fill="#666" d="M173.667-13.94c-49.298,0-102.782,0-147.334,0c-3.999,0-4-16.002,0-16.002
            c44.697,0,96.586,0,147.334,0C177.667-29.942,177.668-13.94,173.667-13.94z">
              <animate attributeName="opacity" values="0.3;1" dur="1s" begin="0.6s" fill="freeze" />
            </path>
            
            {/* Frosting */}
            <path fill="#888" d="M104.812,113.216c0,3.119-2.164,5.67-4.812,5.67c-2.646,0-4.812-2.551-4.812-5.67c0-5.594,0-16.782,0-22.375
            c0-5.143,0-15.427,0-20.568c0-7.333,0-21.998,0-29.33c0-5.523,0-16.569,0-22.092c0-3.295,0-9.885,0-13.181
            C95.188,2.551,97.353,0,100,0c2.648,0,4.812,2.551,4.812,5.669c0,3.248,0,9.743,0,12.991c0,5.428,0,16.284,0,21.711
            c0,7.618,0,22.854,0,30.472c0,4.952,0,14.854,0,19.807C104.812,96.292,104.812,107.576,104.812,113.216z">
              <animate attributeName="opacity" values="0.3;1" dur="1s" begin="0.9s" fill="freeze" />
            </path>
            
            {/* Candle */}
            <g>
              <rect x="98" y="208" fill="#aaa" width="5" height="35" rx="2">
                <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.2s" fill="freeze" />
              </rect>
              {/* Flame */}
              <g className="candle-flame">
                <circle cx="100.5" cy="203" r="8" fill="#fff" opacity="0.8">
                  <animate attributeName="r" values="8;6;8" dur="0.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="100.5" cy="203" r="5" fill="#ddd">
                  <animate attributeName="r" values="5;3;5" dur="0.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="100.5" cy="203" r="2" fill="#999">
                  <animate attributeName="r" values="2;1;2" dur="0.5s" repeatCount="indefinite" />
                </circle>
              </g>
            </g>
          </svg>
        </div>

        {/* Message */}
        <div className="text-center surprise-text">
          <div className="flex justify-center items-center gap-3 mb-6">
            <FaHeart className="text-white/40 text-xl" />
            <div className="w-16 h-px bg-white/20"></div>
            <FaGift className="text-white/60 text-2xl" />
            <div className="w-16 h-px bg-white/20"></div>
            <FaHeart className="text-white/40 text-xl" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light text-white tracking-wider mb-4">
            Happy Birthday!
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-2">
            Selamat Ulang Tahun
          </p>
          
          <div className="w-24 h-px bg-white/20 mx-auto my-6"></div>
          
          <p className="text-gray-400 text-sm uppercase tracking-[0.2em]">
            Semoga hari ini menjadi awal dari tahun yang luar biasa
          </p>
          
          <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-6">
            22 Januari 2026
          </p>
        </div>
      </div>
    </div>
  );

  return isBirthday ? renderSurprise() : renderCountdown();
};

export default Ultah;
