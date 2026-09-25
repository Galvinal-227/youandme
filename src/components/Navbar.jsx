import React, { useEffect, useState } from 'react';
import {
  FaHome,
  FaImages,
  FaHeart,
  FaInfoCircle,
  FaUserFriends,
  FaGift,
} from 'react-icons/fa';

const navItems = [
  { id: 'hero', label: 'Home', icon: FaHome },
  { id: 'gallery', label: 'Gallery', icon: FaImages },
  { id: 'story', label: 'Story', icon: FaHeart },
  { id: 'love', label: 'Love', icon: FaGift },
  { id: 'profile', label: 'Profile', icon: FaUserFriends },
  { id: 'footer', label: 'Info', icon: FaInfoCircle },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) return;

    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-out
          ${isScrolled ? 'px-4 md:px-6 pt-4' : 'px-5 md:px-8 pt-6'}
        `}
      >
        <div
          className={`
            mx-auto flex items-center justify-between
            transition-all duration-500 ease-out
            ${
              isScrolled
                ? `
                  max-w-5xl
                  rounded-full
                  border border-white/[0.08]
                  bg-black/70
                  backdrop-blur-xl
                  px-5 py-3
                `
                : 'w-full'
            }
          `}
        >
          <button
            onClick={() => scrollToSection('hero')}
            aria-label="Go to home"
            className="group relative shrink-0"
          >
            <span className="font-light text-xl md:text-2xl tracking-[0.08em] text-white">
              W
              <span className="text-white/40 transition-colors duration-300 group-hover:text-white">
                syf
              </span>
            </span>

            <span
              className="
                absolute -bottom-1 left-0
                h-px w-0
                bg-white
                transition-all duration-500
                group-hover:w-full
              "
            />
          </button>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <DesktopNavLink
                key={item.id}
                item={item}
                isScrolled={isScrolled}
                onClick={() => scrollToSection(item.id)}
              />
            ))}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden relative flex h-9 w-9 items-center justify-center"
          >
            <div className="relative h-5 w-6">
              <span
                className={`
                  absolute left-0 top-0
                  h-px w-6 bg-white
                  transition-all duration-300
                  ${isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}
                `}
              />

              <span
                className={`
                  absolute left-0 top-2
                  h-px w-6 bg-white
                  transition-all duration-300
                  ${isMobileMenuOpen ? 'opacity-0' : ''}
                `}
              />

              <span
                className={`
                  absolute left-0 top-4
                  h-px w-6 bg-white
                  transition-all duration-300
                  ${isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}
                `}
              />
            </div>
          </button>
        </div>
      </nav>

      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-all duration-500
          ${
            isMobileMenuOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }
        `}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="mb-12 text-xs uppercase tracking-[0.4em] text-white/30">
            You And Me
          </div>

          <div className="flex flex-col items-center gap-7">
            {navItems.map((item, index) => (
              <MobileNavLink
                key={item.id}
                item={item}
                index={index}
                onClick={() => scrollToSection(item.id)}
              />
            ))}
          </div>

          <div className="absolute bottom-10 h-px w-10 bg-white/20" />
        </div>
      </div>
    </>
  );
}

function DesktopNavLink({ item, isScrolled, onClick }) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`
        group relative
        flex items-center gap-2
        text-[13px] uppercase
        tracking-[0.08em]
        transition-colors duration-300
        ${
          isScrolled
            ? 'text-white/70 hover:text-white'
            : 'text-white/50 hover:text-white'
        }
      `}
    >
      <Icon
        className="
          text-[11px]
          transition-transform duration-300
          group-hover:-translate-y-px
        "
      />

      <span>{item.label}</span>

      <span
        className="
          absolute -bottom-2 left-0
          h-px w-0
          bg-white
          transition-all duration-300
          group-hover:w-full
        "
      />
    </button>
  );
}

function MobileNavLink({ item, index, onClick }) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className="
        group flex items-center gap-5
        text-xl uppercase
        tracking-[0.12em]
        text-white/50
        transition-all duration-300
        hover:text-white
      "
      style={{
        transitionDelay: `${index * 40}ms`,
      }}
    >
      <Icon
        className="
          text-sm text-white/30
          transition-colors duration-300
          group-hover:text-white
        "
      />

      <span>{item.label}</span>
    </button>
  );
}

export default Navbar;
