// App.jsx
// Integrated with FlightPlane component for cinematic scroll animation

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
import LunarGravityCard from './components/ui/lunar-gravity-card';
import Ultah from './components/Ultah';
import FlightPlane from './components/FlightPlane/FlightPlane';

const Card = ({ onAccept, onMoreOptions, onPrivacyPolicy }) => {
  return (
    <div 
      className="w-full max-w-[500px] rounded-t-2xl bg-white shadow-2xl"
      style={{ 
        pointerEvents: 'auto',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.3)'
      }}
    >
      <div className="flex flex-col items-center px-8 pt-6 pb-8 relative">
        
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
        
        <div className="flex items-start gap-4 w-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" height={40} width={56} className="flex-shrink-0 mt-1">
            <path stroke="#000" fill="#EAB789" d="M49.157 15.69L44.58.655l-12.422 1.96L21.044.654l-8.499 2.615-6.538 5.23-4.576 9.153v11.114l4.576 8.5 7.846 5.23 10.46 1.96 7.845-2.614 9.153 2.615 11.768-2.615 7.846-7.846 1.96-5.884.655-7.191-7.846-1.308-6.537-3.922z" />
            <path fill="#9C6750" d="M32.286 3.749c-6.94 3.65-11.69 11.053-11.69 19.591 0 8.137 4.313 15.242 10.724 19.052a20.513 20.513 0 01-8.723 1.937c-11.598 0-21-9.626-21-21.5 0-11.875 9.402-21.5 21-21.5 3.495 0 6.79.874 9.689 2.42z" clipRule="evenodd" fillRule="evenodd" />
            <path fill="#634647" d="M64.472 20.305a.954.954 0 00-1.172-.824 4.508 4.508 0 01-3.958-.934.953.953 0 00-1.076-.11c-.46.252-.977.383-1.502.382a3.154 3.154 0 01-2.97-2.11.954.954 0 00-.833-.634 4.54 4.54 0 01-4.205-4.507c.002-.23.022-.46.06-.687a.952.952 0 00-.213-.767 3.497 3.497 0 01-.614-3.5.953.953 0 00-.382-1.138 3.522 3.522 0 01-1.5-3.992.951.951 0 00-.762-1.227A22.611 22.611 0 0032.3 2.16 22.41 22.41 0 0022.657.001a22.654 22.654 0 109.648 43.15 22.644 22.644 0 0032.167-22.847zM22.657 43.4a20.746 20.746 0 110-41.493c2.566-.004 5.11.473 7.501 1.407a22.64 22.64 0 00.003 38.682 20.6 20.6 0 01-7.504 1.404zm19.286 0a20.746 20.746 0 112.131-41.384 5.417 5.417 0 001.918 4.635 5.346 5.346 0 00-.133 1.182A5.441 5.441 0 0046.879 11a5.804 5.804 0 00-.028.568 6.456 6.456 0 005.38 6.345 5.053 5.053 0 006.378 2.472 6.412 6.412 0 004.05 1.12 20.768 20.768 0 01-20.716 21.897z" />
            <path fill="#644647" d="M54.962 34.3a17.719 17.719 0 01-2.602 2.378.954.954 0 001.14 1.53 19.637 19.637 0 002.884-2.634.955.955 0 00-1.422-1.274z" />
            <path strokeWidth="1.8" stroke="#644647" fill="#845556" d="M44.5 32.829c-.512 0-1.574.215-2 .5-.426.284-.342.263-.537.736a2.59 2.59 0 104.98.99c0-.686-.458-1.241-.943-1.726-.485-.486-.814-.5-1.5-.5zm-30.916-2.5c-.296 0-.912.134-1.159.311-.246.177-.197.164-.31.459a1.725 1.725 0 00-.086.932c.058.312.2.6.41.825.21.226.477.38.768.442.291.062.593.03.867-.092s.508-.329.673-.594a1.7 1.7 0 00.253-.896c0-.428-.266-.774-.547-1.076-.281-.302-.471-.31-.869-.311zm17.805-11.375c-.143-.492-.647-1.451-1.04-1.78-.392-.33-.348-.255-.857-.31a2.588 2.588 0 10.441 5.06c.66-.194 1.064-.788 1.395-1.39.33-.601.252-.92.06-1.58zm-22 2c-.143-.492-.647-1.451-1.04-1.78-.391-.33-.347-.255-.856-.31a2.589 2.589 0 10.44 5.06c.66-.194 1.064-.788 1.395-1.39.33-.601.252-.92.06-1.58zM38.112 7.329c-.395 0-1.216.179-1.545.415-.328.236-.263.218-.415.611-.151.393-.19.826-.114 1.243.078.417.268.8.548 1.1.28.301.636.506 1.024.59.388.082.79.04 1.155-.123.366-.163.678-.438.898-.792.22-.354.337-.77.337-1.195 0-.57-.354-1.031-.73-1.434-.374-.403-.628-.415-1.158-.415zm-19.123.703c.023-.296-.062-.92-.219-1.18-.157-.26-.148-.21-.432-.347a1.726 1.726 0 00-.922-.159 1.654 1.654 0 00-.856.344 1.471 1.471 0 00-.501.73c-.085.285-.077.589.023.872.1.282.287.532.538.718a1.7 1.7 0 00.873.323c.427.033.793-.204 1.116-.46.324-.256.347-.445.38-.841z" />
            <path fill="#634647" d="M15.027 15.605a.954.954 0 00-1.553 1.108l1.332 1.863a.955.955 0 001.705-.77.955.955 0 00-.153-.34l-1.331-1.861z" />
            <path fill="#644647" d="M43.31 23.21a.954.954 0 101.553-1.11l-1.266-1.772a.954.954 0 10-1.552 1.11l1.266 1.772z" />
            <path fill="#634647" d="M19.672 35.374a.954.954 0 00-.954.953v2.363a.954.954 0 001.907 0v-2.362a.954.954 0 00-.953-.954z" />
            <path fill="#644647" d="M33.129 29.18l-2.803 1.065a.953.953 0 00-.053 1.764.957.957 0 00.73.022l2.803-1.065a.953.953 0 00-.677-1.783v-.003zm24.373-3.628l-2.167.823a.956.956 0 00-.054 1.764.954.954 0 00.73.021l2.169-.823a.954.954 0 10-.678-1.784v-.001z" />
          </svg>
          <div className="flex-1">
            <h5 className="text-sm font-semibold mb-1 text-left text-zinc-700">
              Your privacy is important to us
            </h5>
            <p className="text-xs text-justify text-gray-600 leading-relaxed">
              We process your personal information to measure and improve our sites and
              services, to assist our campaigns and to provide personalised content.
              <br />
              For more information see our
              <a 
                className="ml-1 text-xs cursor-pointer font-semibold transition-colors hover:text-[#634647] underline underline-offset-2"
                onClick={onPrivacyPolicy}
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full mt-2">
          <button 
            className="text-xs text-zinc-600 cursor-pointer font-semibold transition-colors hover:text-[#634647] hover:underline underline-offset-2 px-2 py-1"
            onClick={onMoreOptions}
          >
            More Options
          </button>
          <button 
            className="flex-1 font-semibold cursor-pointer py-2.5 px-6 text-sm rounded-lg transition-all text-white bg-[#634647] hover:bg-[#7a5554] shadow-md hover:shadow-lg" 
            type="button"
            onClick={onAccept}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showMusicPlayer, setShowMusicPlayer] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState('aboutyou');
  const [audioError, setAudioError] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem('cookieConsent');
    if (!hasAcceptedCookies) {
      const timer = setTimeout(() => {
        setShowCookieConsent(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

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

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookieConsent(false);
    console.log('Cookies accepted');
  };

  const handleMoreOptions = () => {
    console.log('🔧 More options clicked');
    alert('More cookie settings would appear here');
  };

  const handlePrivacyPolicy = () => {
    console.log('📄 Privacy policy clicked');
    alert('Opening privacy policy page');
  };

  if (showSplash) {
    return <SplashScreen onChoice={handleSplashChoice} />;
  }

  return (
    <div className="main-content opacity-0 bg-black overflow-x-hidden relative">
      {/* Paper Airplane - Fixed overlay */}
      <FlightPlane />
      
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
      
      {showCookieConsent && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-[999999999999] animate-in slide-up"
          style={{ pointerEvents: 'none' }}
        >
          <div className="max-w-lg mx-auto px-4 pb-4" style={{ pointerEvents: 'auto' }}>
            <Card 
              onAccept={handleAcceptCookies}
              onMoreOptions={handleMoreOptions}
              onPrivacyPolicy={handlePrivacyPolicy}
            />
          </div>
        </div>
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

      <div id="love" className="fade-on-scroll">
        <LunarGravityCard 
          title={
            <>
              <span className="text-zinc-50 drop-shadow-sm">My Love</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-pink-400 via-rose-400 to-red-400 drop-shadow-md">
                For You.
              </span>
            </>
          }
          description="My love for you is as vast as the universe. Infinite, timeless, and growing with every heartbeat. You are my moon, my stars, my everything."
        />
      </div>

      <div id="profile" className="fade-on-scroll">
        <Profile />
      </div>

      <div id="ultah" className="fade-on-scroll">
        <Ultah />
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
        
        /* Animasi slide up untuk cookie card */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .slide-up {
          animation: slideUp 0.6s cubic-bezier(0.2, 0.9, 0.4, 1) forwards;
        }

        /* Ensure sections have enough height for scrolling */
        #hero,
        #gallery,
        #story,
        #love,
        #profile,
        #ultah,
        #love-message,
        #footer {
          min-height: 100vh;
          position: relative;
          z-index: 10;
        }

        /* Make sure content is above the airplane */
        .main-content > *:not(.flight-container) {
          position: relative;
          z-index: 10;
        }

        /* Fix for fixed airplane overlay */
        .flight-container {
          z-index: 5;
        }
      `}</style>
    </div>
  );
}

export default App;
