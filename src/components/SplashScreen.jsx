import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  FaPlay, 
  FaTimes, 
  FaMusic, 
  FaArrowLeft,
  FaChevronRight,
  FaSpotify,
  FaMicrophone
} from 'react-icons/fa';
import { GiMusicalNotes } from 'react-icons/gi';
import { PiVinylRecord } from 'react-icons/pi';

function SplashScreen({ onChoice }) {
  const [showSongPicker, setShowSongPicker] = useState(false);
  const [hoveredSong, setHoveredSong] = useState(null);
  const isMounted = useRef(true);
  const animationDone = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    
    // Animasi utama - hanya dijalankan sekali
    if (!animationDone.current) {
      animationDone.current = true;
      
      const tl = gsap.timeline();
      tl.fromTo('.splash-container',
        { opacity: 0, scale: 0.98, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: "power4.out" }
      )
      .fromTo('.splash-icon-wrapper',
        { opacity: 0, scale: 0.8, rotate: -30 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: "back.out(1.7)" },
        '-=0.8'
      )
      .fromTo('.splash-line-left',
        { width: 0, opacity: 0 },
        { width: '4rem', opacity: 1, duration: 0.8, ease: "power3.out" },
        '-=0.5'
      )
      .fromTo('.splash-line-right',
        { width: 0, opacity: 0 },
        { width: '4rem', opacity: 1, duration: 0.8, ease: "power3.out" },
        '-=0.7'
      )
      .fromTo('.splash-title',
        { opacity: 0, y: 20, letterSpacing: '0em' },
        { opacity: 1, y: 0, letterSpacing: '0.3em', duration: 0.7, ease: "power2.out" },
        '-=0.4'
      )
      .fromTo('.splash-subtitle',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        '-=0.3'
      )
      .fromTo('.splash-buttons',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        '-=0.2'
      )
      .fromTo('.splash-footer',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        '-=0.1'
      );

      createParticles();
    }

    return () => {
      isMounted.current = false;
      const container = document.querySelector('.particles-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  const createParticles = () => {
    const container = document.querySelector('.particles-container');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 2 + 1}px;
        height: ${Math.random() * 2 + 1}px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floatParticle ${Math.random() * 15 + 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      container.appendChild(particle);
    }
  };

  useEffect(() => {
    if (showSongPicker && isMounted.current) {
      const tl = gsap.timeline();
      tl.fromTo('.song-picker',
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power4.out" }
      )
      .fromTo('.song-item',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        '-=0.3'
      );
    }
  }, [showSongPicker]);

  const handleYesClick = () => {
    setShowSongPicker(true);
  };

  const handleSongSelect = (song) => {
    if (!isMounted.current) return;
    
    gsap.to('.song-picker', {
      scale: 0.95,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        if (isMounted.current && onChoice) {
          onChoice('yes', song);
        }
      }
    });
  };

  const handleNoClick = () => {
    if (!isMounted.current) return;
    
    gsap.to('.splash-container', {
      scale: 0.95,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        if (isMounted.current && onChoice) {
          onChoice('no', null);
        }
      }
    });
  };

  // Jika showSongPicker true, tampilkan halaman pilih lagu
  if (showSongPicker) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
        <div className="particles-container absolute inset-0 overflow-hidden pointer-events-none"></div>
        
        <div className="song-picker text-center max-w-md mx-auto px-6 w-full relative">
          {/* Header */}
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                  <FaMusic className="text-white/60 text-2xl animate-spin-slow" />
                </div>
                <div className="absolute -inset-1 rounded-full border border-white/5 animate-pulse-slow"></div>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl text-white font-light tracking-[0.3em]">
              Pilih Lagu
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20"></div>
              <FaMusic className="text-white/10 text-xs" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20"></div>
            </div>
          </div>

          {/* Pilihan Lagu */}
          <div className="space-y-3 mb-10">
            {[
              { id: 'aboutyou', title: 'About You', artist: 'The 1975', genre: 'Indie Pop', duration: '3:45' },
              { id: 'lesungpipi', title: 'Lesung Pipi', artist: 'Raim Laode', genre: 'Pop', duration: '4:12' },
              { id: 'senja', title: 'Senja', artist: 'Raim Laode', genre: 'Pop', duration: '3:58' }
            ].map((song) => (
              <button
                key={song.id}
                onClick={() => handleSongSelect(song.id)}
                onMouseEnter={() => setHoveredSong(song.id)}
                onMouseLeave={() => setHoveredSong(null)}
                className="song-item w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.06] hover:border-white/[0.15] p-5 transition-all duration-700"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                        <FaMusic className="text-white/30 group-hover:text-white/50 text-sm transition-colors duration-300" />
                      </div>
                      <div>
                        <p className="text-white text-base font-light tracking-wide group-hover:tracking-wider transition-all duration-300">
                          {song.title}
                        </p>
                        <p className="text-white/40 text-xs tracking-wider">{song.artist}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white/20 text-xs tracking-wider">{song.duration}</p>
                      <p className="text-white/10 text-[10px] tracking-wider">{song.genre}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${
                      hoveredSong === song.id ? 'border-white/40 bg-white/10 scale-110' : ''
                    }`}>
                      <FaPlay className={`text-white/40 text-xs transition-all duration-500 ${
                        hoveredSong === song.id ? 'text-white/80' : ''
                      }`} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Tombol Back */}
          <button
            onClick={() => setShowSongPicker(false)}
            className="group flex items-center justify-center gap-2 text-white/30 hover:text-white/100 text-xs tracking-[0.2em] transition-all duration-300 mx-auto"
          >
            <FaArrowLeft className="text-[10px] group-hover:-translate-x-1 transition-transform duration-300" />
            <span>KEMBALI</span>
          </button>
        </div>
      </div>
    );
  }

  // Tampilan utama (Play This Music)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      <div className="particles-container absolute inset-0 overflow-hidden pointer-events-none"></div>
      
      <div className="splash-container text-center max-w-md mx-auto px-6 w-full relative">
        {/* Icon */}
        <div className="splash-icon-wrapper mb-8 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm">
              <GiMusicalNotes className="text-white/60 text-3xl" />
            </div>
            <div className="absolute -inset-2 rounded-full border border-white/5 animate-spin-slow"></div>
            <div className="absolute -inset-4 rounded-full border border-white/[0.02] animate-spin-slower"></div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="splash-line-left h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="splash-line-right h-px bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
          </div>
          
          <h1 className="splash-title text-3xl md:text-4xl text-white font-light tracking-[0.3em]">
            Play This
          </h1>
          <p className="splash-subtitle text-white text-xs tracking-[0.3em] mt-2">
            MUSIC ?
          </p>
          
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/50"></div>
            <PiVinylRecord className="text-white/100 text-sm" />
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/50"></div>
          </div>
        </div>

        {/* Tombol */}
        <div className="splash-buttons flex gap-4 justify-center">
          <button
            onClick={handleYesClick}
            className="group relative px-10 py-4 overflow-hidden rounded-full border border-white/10 hover:border-white/30 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-3">
              <FaPlay className="text-white/60 group-hover:text-white/80 text-xs transition-all duration-300" />
              <span className="text-white/80 group-hover:text-white text-xs uppercase tracking-[0.2em] transition-all duration-300">
                Ya
              </span>
              <FaChevronRight className="text-white/20 group-hover:text-white/40 text-[10px] translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </button>
          
          <button
            onClick={handleNoClick}
            className="group px-10 py-4 rounded-full border border-white/[0.03] hover:border-white transition-all duration-500"
          >
            <div className="flex items-center gap-3">
              <FaTimes className="text-white/50 group-hover:text-white text-xs transition-all duration-300" />
              <span className="text-white/50 group-hover:text-white text-xs uppercase tracking-[0.2em] transition-all duration-300">
                Tidak
              </span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="splash-footer mt-10">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-6 bg-gradient-to-r from-transparent to-white/40"></div>
            <FaSpotify className="text-white/50 text-xs" />
            <div className="h-px w-6 bg-gradient-to-l from-transparent to-white/40"></div>
          </div>
          <p className="text-white/50 text-[10px] tracking-[0.2em] mt-2">
            SELECT A SONG
          </p>
        </div>
      </div>

      {/* Style untuk animasi */}
      <style>{`
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(50px) scale(0);
            opacity: 0;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-slower {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slower {
          animation: spin-slower 30s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;