import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FaHome, FaImages, FaHeart, FaInfoCircle, FaUserFriends, FaGift } from 'react-icons/fa';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const navRef = useRef(null);
  const pillRef = useRef(null);
  const navItemsRef = useRef([]);
  const glareRef = useRef(null);

  const navLinks = [
    { id: 'hero', icon: <FaHome />, text: 'Home' },
    { id: 'gallery', icon: <FaImages />, text: 'Gallery' },
    { id: 'story', icon: <FaHeart />, text: 'Story' },
    { id: 'ultah', icon: <FaGift />, text: 'Ultah' },
    { id: 'profile', icon: <FaUserFriends />, text: 'Profile' },
    { id: 'footer', icon: <FaInfoCircle />, text: 'Info' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updatePill = () => {
      const activeBtn = navItemsRef.current[activeIndex];
      if (activeBtn && pillRef.current) {
        const pill = pillRef.current;
        const btn = activeBtn;
        pill.style.width = `${btn.offsetWidth}px`;
        pill.style.transform = `translateX(${btn.offsetLeft}px)`;
      }
    };

    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [activeIndex]);

  const scrollToSection = (sectionId, index) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveIndex(index);
      setIsMobileMenuOpen(false);
    }
  };

  const handleMouseMove = (e) => {
    if (navRef.current && glareRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glareRef.current.style.setProperty('--x', `${x}px`);
      glareRef.current.style.setProperty('--y', `${y}px`);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav 
        ref={navRef}
        onMouseMove={handleMouseMove}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4' : 'py-5 px-4 md:px-8'
        }`}
      >
        <div 
          className={`transition-all duration-500 mx-auto ${
            isScrolled 
              ? 'max-w-4xl' 
              : 'max-w-7xl'
          }`}
        >
          <div className={`liquid-nav ${isScrolled ? 'mx-auto' : ''}`}>
            {/* Glare Effect */}
            <div className="liquid-glare-container">
              <div className="liquid-glare" ref={glareRef}></div>
            </div>

            {/* Logo - Only when not scrolled */}
            {!isScrolled && (
              <button 
                onClick={() => scrollToSection('hero', 0)}
                className="logo-btn"
              >
                <span className="text-xl md:text-2xl font-light tracking-wider text-white">
                  <span className="text-white">W</span>
                  <span className="text-white/60">syf</span>
                </span>
              </button>
            )}

            {/* Desktop Navigation Items */}
            <div className="nav-items hidden md:flex">
              <div className="active-pill" ref={pillRef}></div>
              
              {navLinks.map((link, index) => (
                <button
                  key={link.id}
                  ref={el => navItemsRef.current[index] = el}
                  onClick={() => scrollToSection(link.id, index)}
                  className={`nav-btn ${activeIndex === index ? 'active' : ''}`}
                >
                  <div className="btn-content">
                    <span className="nav-icon">{link.icon}</span>
                    <span>{link.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50 ml-auto"
            >
              <span className={`w-6 h-px bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-px bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-px bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ 
          top: '0px',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="relative flex flex-col items-center justify-center h-full gap-8 px-4">
          {navLinks.map((link, index) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id, index)}
              className="flex items-center gap-4 text-white/80 hover:text-white text-xl uppercase tracking-wider transition-all duration-300 hover:scale-105"
            >
              <span className="text-white/60">{link.icon}</span>
              <span>
                <span className="text-white">{link.text.charAt(0)}</span>
                <span className="text-white/60">{link.text.slice(1)}</span>
              </span>
            </button>
          ))}
          <div className="w-12 h-px bg-white/10 mt-4"></div>
        </div>
      </div>

      <style jsx>{`
        /* =========================================
           DARK LIQUID GLASS NAVBAR STYLES
           ========================================= */
        :root {
          --glass-bg: rgba(20, 20, 25, 0.6);
          --glass-border: rgba(255, 255, 255, 0.08);
          --glass-shadow: rgba(0, 0, 0, 0.9);
          --glass-highlight: rgba(255, 255, 255, 0.08);
          --glass-caustic: rgba(255, 255, 255, 0.03);
          --reflection-start: rgba(255, 255, 255, 0.06);
          --reflection-end: rgba(255, 255, 255, 0.0);
          --glare-color: rgba(255, 255, 255, 0.08);
          --pill-bg: rgba(60, 60, 65, 0.5);
          --pill-shadow: 0 4px 20px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.05);
          --icon-color: rgba(255, 255, 255, 0.4);
          --icon-active: #ffffff;
        }

        .liquid-nav {
          position: relative;
          display: flex;
          align-items: center;
          padding: 8px;
          border-radius: 99px;
          background: var(--glass-bg);
          backdrop-filter: blur(50px) saturate(200%);
          -webkit-backdrop-filter: blur(50px) saturate(200%);
          box-shadow: 
            0 40px 80px -20px var(--glass-shadow),
            0 10px 30px -10px var(--glass-shadow),
            inset 0 2px 3px -1px var(--glass-highlight),
            inset 0 -2px 4px -1px var(--glass-caustic),
            inset 0 0 0 1px var(--glass-border);
          transition: all 0.5s ease;
          z-index: 10;
          gap: 4px;
        }

        .liquid-nav::before {
          content: '';
          position: absolute;
          top: 1px;
          left: 1px;
          right: 1px;
          height: 46%;
          border-radius: 99px 99px 24px 24px / 99px 99px 12px 12px;
          background: linear-gradient(180deg, var(--reflection-start) 0%, var(--reflection-end) 100%);
          pointer-events: none;
          z-index: 6;
          transition: background 0.5s ease;
        }

        .liquid-glare-container {
          position: absolute;
          inset: 0;
          border-radius: 99px;
          overflow: hidden;
          pointer-events: none;
          z-index: 5;
        }

        .liquid-glare {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
          background: radial-gradient(circle 90px at var(--x, 50%) var(--y, 50%), var(--glare-color) 0%, transparent 100%);
          mix-blend-mode: overlay;
        }

        .liquid-nav:hover .liquid-glare {
          opacity: 1;
        }

        .nav-items {
          position: relative;
          display: flex;
          gap: 4px;
          z-index: 3;
          flex: 1;
        }

        .active-pill {
          position: absolute;
          top: 0;
          left: 0;
          height: 44px;
          background: var(--pill-bg);
          border-radius: 99px;
          box-shadow: var(--pill-shadow);
          transition: transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1), 
                      width 0.5s cubic-bezier(0.34, 1.2, 0.64, 1),
                      background 0.5s ease, 
                      box-shadow 0.5s ease;
          z-index: 1;
        }

        .nav-btn {
          position: relative;
          background: transparent;
          border: none;
          padding: 0 20px;
          height: 44px;
          border-radius: 99px;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--icon-color);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: color 0.3s ease;
          outline: none;
          z-index: 2;
          white-space: nowrap;
        }

        .btn-content {
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: none;
          transition: transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
        }

        .nav-btn:active .btn-content {
          transform: scale(0.92);
        }

        .nav-btn.active {
          color: var(--icon-active);
        }

        .nav-icon {
          display: flex;
          align-items: center;
        }

        .logo-btn {
          position: relative;
          background: transparent;
          border: none;
          padding: 0 16px;
          height: 44px;
          color: white;
          cursor: pointer;
          z-index: 3;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif;
          outline: none;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .liquid-nav {
            padding: 6px 12px;
            gap: 2px;
          }
          
          .nav-btn {
            padding: 0 14px;
            font-size: 13px;
            height: 38px;
          }
          
          .active-pill {
            height: 38px;
          }
          
          .logo-btn {
            height: 38px;
            padding: 0 8px;
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .nav-btn {
            padding: 0 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;
