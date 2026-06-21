import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplashScreen from './components/SplashScreen';
import MusicPlayer from './components/MusicPlayer';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Story from './components/Story';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { FaRegHeart } from 'react-icons/fa';
import Profile from './components/Profile';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showMusicPlayer, setShowMusicPlayer] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState('aboutyou');
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    if (!showSplash) {
      setTimeout(() => {
        gsap.fromTo('.main-content',
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.out" }
        );
        
        gsap.fromTo('.hero-title',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out" }
        );
        
        gsap.fromTo('.hero-subtitle',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: "power2.out" }
        );
        
        gsap.fromTo('.scroll-indicator',
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 1, ease: "power2.out" }
        );
      }, 100);
    }
  }, [showSplash]);

  // 🔥 INTERSECTION OBSERVER UNTUK FADE-ON-SCROLL
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Tunggu sebentar sampai DOM siap
    const timeout = setTimeout(() => {
      document.querySelectorAll('.fade-on-scroll').forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [showSplash]);

  const handleSplashChoice = (choice, song) => {
    if (choice === 'yes') {
      setSelectedSong(song);
      setMusicPlaying(true);
      setShowMusicPlayer(true);
    } else {
      setShowMusicPlayer(false);
      setMusicPlaying(false);
    }
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onChoice={handleSplashChoice} />;
  }

  return (
    <div className="main-content opacity-0 bg-black overflow-x-hidden">
      <Navbar />
      
      {showMusicPlayer && (
        <MusicPlayer 
          musicPlaying={musicPlaying}
          setMusicPlaying={setMusicPlaying}
          audioError={audioError}
          setAudioError={setAudioError}
          selectedSong={selectedSong}
        />
      )}
      
      <div id="hero">
        <Hero />
      </div>
      
      <div id="gallery" className="fade-on-scroll">
        <Gallery />
      </div>
      
      <div id="story" className="fade-on-scroll">
        <Story />
      </div>

      <div id="profile" className="fade-on-scroll">
        <Profile />
      </div>

      <div id="love-message" className="love-message py-32 px-4 relative fade-on-scroll">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-12 h-px bg-white/20 mx-auto mb-6"></div>
            <FaRegHeart className="text-gray-500 text-3xl mx-auto animate-pulse" />
            <div className="w-12 h-px bg-white/20 mx-auto mt-6"></div>
          </div>
          <p className="text-gray-300 text-lg font-light leading-relaxed">
            Every picture tells a story. <br />
            This is ours.
          </p>
          <p className="text-gray-500 text-sm mt-6 uppercase tracking-wider">
            forever & always
          </p>
        </div>
      </div>
      
      <div id="footer" className="fade-on-scroll">
        <Footer />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Pixelify+Sans:wght@400..700&family=Share+Tech&display=swap');
        
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        body {
          background-color: black;
          font-family: 'Jost', sans-serif;
          overflow-x: hidden;
        }
        
        .fade-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        
        .fade-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes pulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        .current-lyric {
          text-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
        }
        .love-message {
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.02), transparent);
        }
      `}</style>
    </div>
  );
}

export default App;