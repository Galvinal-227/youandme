import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { FaHome, FaImages, FaHeart, FaInfoCircle, FaUserFriends } from 'react-icons/fa';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Deteksi scroll untuk mengubah style navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll ke section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  // Ambil huruf pertama dan sisanya untuk logo
  const logotext = "Wsyf";
  const firstLetter = logotext.charAt(0);
  const restLetters = logotext.slice(1);

  return (
    <>
      {/* Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'flex justify-center py-4' 
            : 'py-5 px-4 md:px-8'
        }`}
      >
        <div 
          className={`transition-all duration-500 ${
            isScrolled 
              ? 'bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 shadow-lg' 
              : 'bg-transparent w-full'
          }`}
        >
          <div className={`flex items-center ${isScrolled ? 'justify-center gap-8 md:gap-12' : 'justify-between'}`}>
            
            {/* Logo / Brand - Hilang saat discroll */}
            {!isScrolled && (
              <button 
                onClick={() => scrollToSection('hero')}
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
                className="relative group"
              >
                <span className="text-xl md:text-2xl font-light tracking-wider transition-colors duration-300">
                  <span className={isLogoHovered ? 'text-white' : 'text-white'}>{firstLetter}</span>
                  <span className={isLogoHovered ? 'text-white' : 'text-gray-400'}>{restLetters}</span>
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white/50 group-hover:w-full transition-all duration-300"></span>
              </button>
            )}

            {/* Desktop Menu */}
            <div className={`flex items-center gap-4 md:gap-8 ${!isScrolled && 'ml-auto'}`}>
              <NavLink onClick={() => scrollToSection('hero')} icon={<FaHome />} text="Home" isScrolled={isScrolled} />
              <NavLink onClick={() => scrollToSection('gallery')} icon={<FaImages />} text="Gallery" isScrolled={isScrolled} />
              <NavLink onClick={() => scrollToSection('story')} icon={<FaHeart />} text="Story" isScrolled={isScrolled} />
              <NavLink onClick={() => scrollToSection('footer')} icon={<FaInfoCircle />} text="Info" isScrolled={isScrolled} />
              <NavLink onClick={() => scrollToSection('profile')} icon={<FaUserFriends />} text="Profile" isScrolled={isScrolled} />
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 group"
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
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-lg transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ top: '60px' }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <MobileNavLink onClick={() => scrollToSection('hero')} icon={<FaHome />} text="Home" />
          <MobileNavLink onClick={() => scrollToSection('gallery')} icon={<FaImages />} text="Gallery" />
          <MobileNavLink onClick={() => scrollToSection('story')} icon={<FaHeart />} text="Story" />
          <MobileNavLink onClick={() => scrollToSection('footer')} icon={<FaInfoCircle />} text="Info" />
          <MobileNavLink onClick={() => scrollToSection('profile')} icon={<FaUserFriends />} text="Profile" />
        </div>
      </div>
    </>
  );
}

// Component NavLink untuk desktop dengan huruf depan putih
function NavLink({ onClick, icon, text, isScrolled }) {
  const [isHovered, setIsHovered] = useState(false);

  // Ambil huruf pertama dan sisanya
  const firstLetter = text.charAt(0);
  const restLetters = text.slice(1);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative transition-colors duration-300 text-sm uppercase tracking-wider ${
        isScrolled ? 'text-white' : 'text-gray-400 hover:text-white'
      }`}
    >
      <span className="flex items-center gap-2">
        {icon && <span className={!isScrolled ? 'text-gray-400' : 'text-white/80'}>{icon}</span>}
        <span>
          <span className="text-white">{firstLetter}</span>
          <span className={!isScrolled && !isHovered ? 'text-gray-400' : 'text-white'}>{restLetters}</span>
        </span>
      </span>
      {!isScrolled && (
        <span className={`absolute -bottom-1 left-0 h-px bg-white/50 transition-all duration-300 ${isHovered ? 'w-full' : 'w-0'}`}></span>
      )}
    </button>
  );
}

// Component MobileNavLink untuk mobile dengan huruf depan putih
function MobileNavLink({ onClick, icon, text }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Ambil huruf pertama dan sisanya
  const firstLetter = text.charAt(0);
  const restLetters = text.slice(1);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-3 text-gray-300 hover:text-white text-xl uppercase tracking-wider transition-all duration-300 hover:scale-105"
    >
      {icon}
      <span>
        <span className="text-white">{firstLetter}</span>
        <span className={isHovered ? 'text-white' : 'text-gray-400'}>{restLetters}</span>
      </span>
    </button>
  );
}

export default Navbar;