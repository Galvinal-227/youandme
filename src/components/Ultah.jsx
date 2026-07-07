import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from '@studio-freight/lenis';
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa';
import { FiArrowDown, FiStar, FiImage } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

// Target: 22 Januari 2027 00:00:00 WIB (UTC+7)
const TARGET_DATE = new Date('2027-01-21T17:00:00Z').getTime();
const NEXT_BDAY_DATE = new Date('2028-01-21T17:00:00Z').getTime();

export default function Ultah() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Check if time is already passed on load
    const now = new Date().getTime();
    if (now >= TARGET_DATE) {
      triggerUnlockAnimation();
    }
  }, []);

  const triggerUnlockAnimation = () => {
    setIsUnlocked(true);
    // Sequence: Fade out countdown, flash white, zoom in, reveal main
    const tl = gsap.timeline({
      onComplete: () => setShowMain(true)
    });
    
    tl.to('.countdown-content', { opacity: 0, scale: 0.9, duration: 1, ease: 'power2.inOut' })
      .to('.flash-overlay', { opacity: 1, duration: 0.8, ease: 'power2.in' })
      .to('.opening-screen', { scale: 1.5, duration: 1, ease: 'power3.inOut' }, '<')
      .to('.flash-overlay', { opacity: 0, duration: 1, ease: 'power2.out' });
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-purple-500/30">
      {!showMain && <OpeningScreen onComplete={triggerUnlockAnimation} isUnlocked={isUnlocked} />}
      {showMain && <MainWebsite />}
    </div>
  );
}

function OpeningScreen({ onComplete, isUnlocked }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        clearInterval(timer);
        if (!isUnlocked) onComplete();
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isUnlocked, onComplete]);

  return (
    <div className="opening-screen fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 opacity-50" />
      <Particles count={30} className="opacity-40" />
      
      <div className="countdown-content relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-light tracking-widest text-white/90 mb-12 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          A Special Moment Is Coming...
        </h1>
        <div className="flex gap-4 md:gap-8">
          <TimeUnit value={timeLeft.days} label="Days" />
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <TimeUnit value={timeLeft.minutes} label="Minutes" />
          <TimeUnit value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>

      <div className="flash-overlay absolute inset-0 bg-white opacity-0 z-50 pointer-events-none" />
    </div>
  );
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 w-16 md:w-24 h-16 md:h-24 flex items-center justify-center">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs md:text-sm uppercase tracking-widest text-white/50 mt-2">{label}</span>
    </div>
  );
}

function MainWebsite() {
  const mainRef = useRef(null);
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useGSAP(() => {
    // Global Scroll Progress
    gsap.to('.scroll-progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: mainRef.current, start: 'top top', end: 'bottom bottom', scrub: true }
    });

    // Section Transitions
    gsap.utils.toArray('section').forEach((section, i) => {
      gsap.fromTo(section, 
        { opacity: 0.3, scale: 0.95 },
        { 
          opacity: 1, scale: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 20%', scrub: true }
        }
      );
    });
  }, { scope: mainRef });

  return (
    <div ref={mainRef} className="relative w-full bg-black text-white">
      <div className="scroll-progress fixed top-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500 origin-left scale-x-0 z-50" />
      <HeroSection />
      <StorySection />
      <GallerySection />
      <LoveLetterSection />
      <ReasonsSection />
      <QuotesSection />
      <CountdownNextYear />
      <EndingSection />
    </div>
  );
}

function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const heroRef = useRef(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    setIsPlaying(!isPlaying);
  };

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.hero-bg', { opacity: 0, duration: 2, ease: 'power2.inOut' })
      .from('.hero-title span', { y: 100, opacity: 0, stagger: 0.1, duration: 1, ease: 'back.out(1.7)' }, '-=1')
      .from('.hero-name', { scale: 0.8, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
      .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero-btns', { y: 20, opacity: 0, duration: 0.8 }, '-=0.4');

    gsap.to('.floating-element', {
      y: -20,
      rotation: 5,
      yoyo: true,
      repeat: -1,
      duration: 3,
      ease: 'sine.inOut',
      stagger: 0.5
    });

    // Mouse Parallax
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 40;
      const y = (clientY / window.innerHeight - 0.5) * 40;
      gsap.to('.parallax-bg', { x, y, duration: 1, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: heroRef });

  const scrollToStory = () => {
    const story = document.getElementById('story');
    if (story) story.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Audio Placeholder - Since no file is provided, it's just setup */}
      <audio ref={audioRef} loop src="#" />

      {/* Background Elements */}
      <div className="hero-bg absolute inset-0 z-0">
        <div className="parallax-bg absolute inset-[-10%] bg-black">
          <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[128px]" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-pink-600/20 rounded-full blur-[128px]" />
          <Particles count={50} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="hero-title text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-4 flex overflow-hidden">
          {'Happy Birthday'.split(' ').map((word, i) => (
            <span key={i} className="inline-block mr-4 md:mr-8 drop-shadow-2xl">{word}</span>
          ))}
          <span className="floating-element text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">❤️</span>
        </h1>
        
        <h2 className="hero-name text-4xl md:text-6xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 drop-shadow-lg">
          My Love
        </h2>
        
        <p className="hero-subtitle text-lg md:text-xl text-white/70 max-w-2xl font-light mb-12">
          Setiap detik bersamamu adalah puisi yang tak pernah selesai kutulis. Hari ini, mari kita rayakan keindahanmu.
        </p>

        <div className="hero-btns flex flex-col sm:flex-row gap-6">
          <button onClick={scrollToStory} className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            <span className="relative z-10 flex items-center gap-2">Mulai Perjalanan <FiArrowDown className="group-hover:translate-y-1 transition-transform" /></span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button onClick={toggleMusic} className="group px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2">
            {isPlaying ? <FaPause /> : <FaPlay />}
            <span>Putar Musik</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  const sectionRef = useRef(null);

  const stories = [
    { year: 'Awal', title: 'Pertemuan Pertama', desc: 'Momen di mana semesta seolah berhenti.' },
    { year: 'Proses', title: 'Tumbuh Bersama', desc: 'Mengenal tawa, air mata, dan saling menguatkan.' },
    { year: 'Hari Ini', title: 'Merayakanmu', desc: 'Melihatmu bertambah usia dengan penuh cinta.' }
  ];

  useGSAP(() => {
    const cards = gsap.utils.toArray('.story-card');
    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        x: i % 2 === 0 ? -50 : 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });
  }, { scope: sectionRef });

  return (
    <section id="story" ref={sectionRef} className="w-full py-32 px-4 md:px-12 lg:px-24 relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Jejak Perjalanan Kita</span>
        </h2>
        
        <div className="relative border-l border-white/20 ml-4 md:ml-0 md:pl-8 space-y-12">
          {stories.map((story, i) => (
            <div key={i} className="story-card relative pl-8 md:pl-0">
              <div className="absolute -left-10 md:-left-[41px] top-0 w-5 h-5 rounded-full bg-black border-2 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-colors group">
                <span className="text-purple-400 font-mono text-sm tracking-widest block mb-2">{story.year}</span>
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-pink-400 transition-colors">{story.title}</h3>
                <p className="text-white/60 leading-relaxed">{story.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from('.gallery-item', {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'back.out(1.5)'
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full py-32 px-4 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-purple-900/10 blur-[100px] rounded-full w-full h-full" />
      <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center z-10 relative">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400">Bingkai Kenangan</span>
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto relative z-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="gallery-item group relative aspect-[4/5] rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center text-white/20">
              <FiImage size={40} />
            </div>
            {/* Placeholder overlay to mimic an image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex items-end p-4">
              <span className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Momen {i}</span>
            </div>
            <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay group-hover:bg-transparent transition-all duration-500" />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-xl transition-all duration-500 z-20 shadow-[inset_0_0_20px_rgba(168,85,247,0)] group-hover:shadow-[inset_0_0_20px_rgba(168,85,247,0.3)]" />
          </div>
        ))}
      </div>
    </section>
  );
}

function LoveLetterSection() {
  const sectionRef = useRef(null);
  const text = "Sayang, di hari spesialmu ini, aku cuma ingin mengingatkan betapa berharganya dirimu. Dunia ini jauh lebih indah sejak ada kamu di dalamnya. Terima kasih sudah menjadi terang dalam gelapku, penenang dalam kalutku. Selamat ulang tahun, cintaku.";

  useGSAP(() => {
    const words = gsap.utils.toArray('.letter-word');
    gsap.from(words, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: 1
      },
      opacity: 0.1,
      y: 10,
      stagger: 0.1,
      duration: 1
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full py-40 px-4 relative flex justify-center items-center">
      <div className="absolute w-[80%] h-[80%] bg-pink-600/10 blur-[120px] rounded-full z-0" />
      
      <div className="relative z-10 max-w-3xl bg-white/5 backdrop-blur-2xl border border-white/20 p-8 md:p-16 rounded-3xl shadow-2xl">
        <FaHeart className="text-pink-500 text-3xl mb-8 mx-auto animate-pulse shadow-[0_0_15px_rgba(236,72,153,0.5)] rounded-full" />
        <p className="text-xl md:text-3xl leading-relaxed md:leading-loose font-serif text-center flex flex-wrap justify-center gap-x-2">
          {text.split(' ').map((word, i) => (
            <span key={i} className="letter-word text-white/90">{word}</span>
          ))}
        </p>
      </div>
    </section>
  );
}

function ReasonsSection() {
  const sectionRef = useRef(null);
  const reasons = [
    "Senyummu yang mengalihkan duniaku",
    "Caramu menatapku dengan lembut",
    "Hatimu yang tulus dan pemaaf",
    "Tawamu yang menjadi melodi favoritku"
  ];

  useGSAP(() => {
    gsap.from('.reason-card', {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      scale: 0.8,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full py-32 px-4">
      <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Kenapa Aku Memilihmu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {reasons.map((reason, i) => (
          <div key={i} className="reason-card group relative p-1 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 hover:from-purple-500 hover:to-pink-500 transition-all duration-500">
            <div className="bg-black/90 backdrop-blur-xl h-full p-8 rounded-xl flex items-center gap-4 group-hover:scale-[0.98] transition-transform duration-500">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400 opacity-50 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
              <p className="text-lg md:text-xl font-medium text-white/80 group-hover:text-white transition-colors">{reason}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuotesSection() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quotes = [
    "I look at you and see the rest of my life in front of my eyes.",
    "If I know what love is, it is because of you.",
    "You are my today and all of my tomorrows."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      gsap.to('.quote-text', { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        gsap.fromTo('.quote-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
      }});
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <section className="w-full py-32 px-4 flex justify-center text-center bg-gradient-to-b from-transparent to-purple-900/10">
      <div className="max-w-2xl">
        <h2 className="text-5xl text-purple-500/30 mb-6 flex justify-center"><FaQuoteLeft /></h2>
        <p className="quote-text text-2xl md:text-4xl font-serif italic text-white/80 h-24">
          {quotes[quoteIndex]}
        </p>
      </div>
    </section>
  );
}

function CountdownNextYear() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = NEXT_BDAY_DATE - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-24 px-4 flex flex-col items-center border-t border-white/5">
      <h3 className="text-sm tracking-[0.3em] uppercase text-white/40 mb-8">Menuju Ulang Tahun Berikutnya</h3>
      <div className="flex gap-6 md:gap-12">
        <NextTimeUnit value={timeLeft.days} label="D" />
        <NextTimeUnit value={timeLeft.hours} label="H" />
        <NextTimeUnit value={timeLeft.minutes} label="M" />
        <NextTimeUnit value={timeLeft.seconds} label="S" />
      </div>
    </section>
  );
}

function NextTimeUnit({ value, label }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-3xl md:text-5xl font-mono font-light">{String(value).padStart(2, '0')}</span>
      <span className="text-purple-400 font-bold">{label}</span>
    </div>
  );
}

function EndingSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 50%',
      onEnter: () => {
        gsap.to('.ending-text', { scale: 1, opacity: 1, duration: 2, ease: 'elastic.out(1, 0.3)' });
        gsap.to('.confetti', {
          y: '100vh',
          rotation: () => gsap.utils.random(0, 360),
          x: () => gsap.utils.random(-100, 100),
          duration: () => gsap.utils.random(2, 5),
          ease: 'none',
          stagger: { each: 0.02, repeat: -1 }
        });
        gsap.to('.floating-heart-end', {
          y: '-100vh',
          x: () => gsap.utils.random(-50, 50),
          scale: () => gsap.utils.random(0.5, 1.5),
          opacity: 0,
          duration: () => gsap.utils.random(3, 7),
          ease: 'power1.in',
          stagger: { each: 0.1, repeat: -1 }
        });
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-black z-0" />
      
      {/* Confetti Generation */}
      {[...Array(50)].map((_, i) => (
        <div 
          key={`confetti-${i}`} 
          className="confetti absolute top-[-5vh] w-2 h-4 rounded-sm z-10"
          style={{
            left: `${gsap.utils.random(0, 100)}vw`,
            backgroundColor: ['#A855F7', '#EC4899', '#FFFFFF'][Math.floor(Math.random() * 3)]
          }}
        />
      ))}

      {/* Floating Hearts Generation */}
      {[...Array(20)].map((_, i) => (
        <FaHeart 
          key={`heart-${i}`}
          className="floating-heart-end absolute bottom-[-10vh] text-pink-500/50 z-10"
          style={{
            left: `${gsap.utils.random(10, 90)}vw`,
            fontSize: `${gsap.utils.random(1, 3)}rem`
          }}
        />
      ))}

      <div className="z-20 text-center">
        <h1 className="ending-text opacity-0 scale-50 text-5xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          I Love You<br/>Forever <span className="text-pink-500 inline-block drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">❤️</span>
        </h1>
      </div>
    </section>
  );
}

// Reusable Particle Component
function Particles({ count = 20, className = '' }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const particles = gsap.utils.toArray('.particle');
    particles.forEach(particle => {
      gsap.to(particle, {
        y: () => gsap.utils.random(-100, 100),
        x: () => gsap.utils.random(-100, 100),
        opacity: () => gsap.utils.random(0.1, 0.8),
        scale: () => gsap.utils.random(0.5, 1.5),
        duration: () => gsap.utils.random(3, 10),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="particle absolute rounded-full bg-white"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: '0 0 10px 2px rgba(255,255,255,0.3)'
          }}
        />
      ))}
    </div>
  );
}
