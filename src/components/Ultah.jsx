import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from '@studio-freight/lenis';
import { FaHeart } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

export default function Ultah() {
  const [showMain, setShowMain] = useState(false);
  const container = useRef(null);

  return (
    <div ref={container} className="bg-[#170b16] text-[#f6ecdf] min-h-screen selection:bg-[#cf6f7a] selection:text-[#170b16] relative overflow-x-hidden">
      <Starfield />
      {!showMain ? (
        <IntroScreen onOpen={() => setShowMain(true)} />
      ) : (
        <MainContent onReplay={() => setShowMain(false)} />
      )}
      <GlobalStyles />
    </div>
  );
}

/* ============================= STARFIELD ============================= */
function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let raf;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: Math.min(120, Math.floor(window.innerWidth / 10)) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        s: Math.random() * 0.02 + 0.005,
        a: Math.random() * Math.PI * 2,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f6ecdf';
      stars.forEach((st) => {
        st.a += st.s;
        const op = reduceMotion ? 0.5 : ((Math.sin(st.a) + 1) / 2) * 0.7 + 0.15;
        ctx.globalAlpha = op;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

/* ============================= INTRO / ENVELOPE ============================= */
function IntroScreen({ onOpen }) {
  const introRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Wait for animation to complete before showing main content
      setTimeout(() => {
        onOpen();
      }, 1200);
    }
  };

  return (
    <div
      ref={introRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(circle at 50% 30%, #241228 0%, #170b16 70%)' }}
    >
      <div className="intro-label font-caveat text-[#e8b978] text-2xl mb-4">untuk Syafa</div>

      <div className="envlope-wrapper" style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div 
          id="envelope" 
          className={isOpen ? 'open' : 'close'}
          onClick={handleOpen}
          style={{
            position: 'relative',
            width: '280px',
            height: '180px',
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px',
            margin: '0 auto',
            backgroundColor: '#004d73',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            transition: 'box-shadow 0.2s',
            cursor: 'pointer',
          }}
        >
          {/* Front flap */}
          <div className="front flap" style={{
            position: 'absolute',
            width: 0,
            height: 0,
            zIndex: 5,
            pointerEvents: 'none',
            borderLeft: '140px solid transparent',
            borderRight: '140px solid transparent',
            borderBottom: '82px solid transparent',
            borderTop: '98px solid #004d73',
            transformOrigin: 'top',
            transition: 'transform 0.4s ease, z-index 0.6s',
            willChange: 'transform',
            transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
            zIndex: isOpen ? 1 : 5,
          }}></div>

          {/* Pocket */}
          <div className="front pocket" style={{
            position: 'absolute',
            width: 0,
            height: 0,
            zIndex: 3,
            pointerEvents: 'none',
            borderLeft: '140px solid #0077B2',
            borderRight: '140px solid #0077B2',
            borderBottom: '90px solid #006699',
            borderTop: '90px solid transparent',
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px',
          }}></div>

          {/* Letter */}
          <div className="letter" style={{
            position: 'relative',
            backgroundColor: '#ffffff',
            width: '90%',
            margin: '0 auto',
            height: '90%',
            top: '5%',
            borderRadius: '6px',
            boxShadow: '0 2px 26px rgba(0, 0, 0, 0.12)',
            zIndex: 2,
            transition: 'transform 0.4s ease, z-index 0.6s',
            willChange: 'transform',
            pointerEvents: 'none',
            transform: isOpen ? 'translateY(-60px)' : 'translateY(0px)',
            transitionDelay: isOpen ? '0.6s' : '0s',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0) 25%, rgba(215,227,239,0.70) 55%, rgba(215,227,239,1) 100%)',
              borderRadius: '6px',
              pointerEvents: 'none',
            }}></div>
            
            {/* Letter lines */}
            <div className="words line1" style={{
              position: 'absolute',
              left: '10%',
              width: '20%',
              height: '7%',
              top: '15%',
              backgroundColor: '#EEEFF0',
              borderRadius: '4px',
              pointerEvents: 'none',
            }}></div>
            <div className="words line2" style={{
              position: 'absolute',
              left: '10%',
              width: '80%',
              height: '14%',
              top: '30%',
              backgroundColor: '#EEEFF0',
              borderRadius: '4px',
              pointerEvents: 'none',
            }}></div>
            <div className="words line3" style={{
              position: 'absolute',
              left: '10%',
              width: '80%',
              height: '14%',
              top: '50%',
              backgroundColor: '#EEEFF0',
              borderRadius: '4px',
              pointerEvents: 'none',
            }}></div>
            <div className="words line4" style={{
              position: 'absolute',
              left: '10%',
              width: '80%',
              height: '14%',
              top: '70%',
              backgroundColor: '#EEEFF0',
              borderRadius: '4px',
              pointerEvents: 'none',
            }}></div>
          </div>

          {/* Hearts */}
          <div className="hearts" style={{
            position: 'absolute',
            top: '90px',
            left: 0,
            right: 0,
            zIndex: 2,
            pointerEvents: 'none',
          }}>
            <div className="heart a1" style={{
              position: 'absolute',
              bottom: 0,
              pointerEvents: 'none',
              opacity: isOpen ? 1 : 0,
              left: '20%',
              transform: 'scale(0.6)',
              animation: isOpen ? 'slideUp 4s linear 1, sideSway 2s ease-in-out 4 alternate' : 'none',
              animationDelay: '0.7s',
              animationFillMode: 'forwards',
            }}>
              <div style={{
                position: 'absolute',
                content: '',
                left: '50px',
                top: 0,
                width: '50px',
                height: '80px',
                background: '#D00000',
                borderRadius: '50px 50px 0 0',
                transform: 'rotate(-45deg)',
                transformOrigin: '0 100%',
                pointerEvents: 'none',
              }}></div>
              <div style={{
                position: 'absolute',
                content: '',
                left: 0,
                top: 0,
                width: '50px',
                height: '80px',
                background: '#D00000',
                borderRadius: '50px 50px 0 0',
                transform: 'rotate(45deg)',
                transformOrigin: '100% 100%',
                pointerEvents: 'none',
              }}></div>
            </div>
            <div className="heart a2" style={{
              position: 'absolute',
              bottom: 0,
              pointerEvents: 'none',
              opacity: isOpen ? 1 : 0,
              left: '55%',
              transform: 'scale(1)',
              animation: isOpen ? 'slideUp 5s linear 1, sideSway 4s ease-in-out 2 alternate' : 'none',
              animationDelay: '0.7s',
              animationFillMode: 'forwards',
            }}>
              <div style={{
                position: 'absolute',
                content: '',
                left: '50px',
                top: 0,
                width: '50px',
                height: '80px',
                background: '#D00000',
                borderRadius: '50px 50px 0 0',
                transform: 'rotate(-45deg)',
                transformOrigin: '0 100%',
                pointerEvents: 'none',
              }}></div>
              <div style={{
                position: 'absolute',
                content: '',
                left: 0,
                top: 0,
                width: '50px',
                height: '80px',
                background: '#D00000',
                borderRadius: '50px 50px 0 0',
                transform: 'rotate(45deg)',
                transformOrigin: '100% 100%',
                pointerEvents: 'none',
              }}></div>
            </div>
            <div className="heart a3" style={{
              position: 'absolute',
              bottom: 0,
              pointerEvents: 'none',
              opacity: isOpen ? 1 : 0,
              left: '10%',
              transform: 'scale(0.8)',
              animation: isOpen ? 'slideUp 7s linear 1, sideSway 2s ease-in-out 6 alternate' : 'none',
              animationDelay: '0.7s',
              animationFillMode: 'forwards',
            }}>
              <div style={{
                position: 'absolute',
                content: '',
                left: '50px',
                top: 0,
                width: '50px',
                height: '80px',
                background: '#D00000',
                borderRadius: '50px 50px 0 0',
                transform: 'rotate(-45deg)',
                transformOrigin: '0 100%',
                pointerEvents: 'none',
              }}></div>
              <div style={{
                position: 'absolute',
                content: '',
                left: 0,
                top: 0,
                width: '50px',
                height: '80px',
                background: '#D00000',
                borderRadius: '50px 50px 0 0',
                transform: 'rotate(45deg)',
                transformOrigin: '100% 100%',
                pointerEvents: 'none',
              }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="intro-hint mt-6 text-xs tracking-[0.28em] uppercase text-[#b79aa0]">ketuk amplop untuk membuka</div>

      <style>{`
        @keyframes slideUp {
          0% { top: 0; }
          100% { top: -600px; }
        }
        @keyframes sideSway {
          0% { margin-left: 0px; }
          100% { margin-left: 50px; }
        }
        @media (max-width: 400px) {
          #envelope {
            width: 240px !important;
            height: 154px !important;
          }
          #envelope .flap {
            border-left-width: 120px !important;
            border-right-width: 120px !important;
            border-bottom-width: 70px !important;
            border-top-width: 84px !important;
          }
          #envelope .pocket {
            border-left-width: 120px !important;
            border-right-width: 120px !important;
            border-bottom-width: 77px !important;
            border-top-width: 77px !important;
          }
          #envelope .hearts {
            top: 77px !important;
          }
          #envelope .heart::before,
          #envelope .heart::after {
            width: 40px !important;
            height: 64px !important;
            left: 40px !important;
          }
          #envelope .heart::after {
            left: 0 !important;
          }
          #envelope .a1 { left: 15% !important; transform: scale(0.5) !important; }
          #envelope .a2 { left: 55% !important; transform: scale(0.8) !important; }
          #envelope .a3 { left: 8% !important; transform: scale(0.6) !important; }
          #envelope.open .letter {
            transform: translateY(-50px) !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ============================= MAIN CONTENT ============================= */
function MainContent({ onReplay }) {
  const heroRefs = useRef([]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useGSAP(() => {
    gsap.utils.toArray('#hero .reveal').forEach((el, i) => {
      gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: i * 0.15, ease: 'power3.out' });
    });
    gsap.utils.toArray('section:not(#hero) .reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } }
      );
    });
    gsap.fromTo(
      '.letter-paper',
      { rotateX: -12, opacity: 0, transformPerspective: 800 },
      { rotateX: 0, opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '#letter', start: 'top 75%' } }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <main className="relative z-[1]">
      <HeroSection />
      <AboutSection />
      <ReasonsSection />
      <LetterSection />
      <FinaleSection onReplay={onReplay} />
      <footer className="text-center py-12 text-[#b79aa0] text-xs tracking-wider">
        dibuat dengan hati, khusus untuk Syafa 🤍
      </footer>
    </main>
  );
}

function HeroSection() {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="reveal font-fraunces italic uppercase text-[#b79aa0] text-sm md:text-base tracking-widest">
        Selamat Ulang Tahun,
      </h1>
      <div
        className="reveal font-caveat font-bold leading-none my-2"
        style={{
          fontSize: 'clamp(4rem,16vw,10rem)',
          background: 'linear-gradient(180deg,#f6ecdf 40%, #cf6f7a 130%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Syafa
      </div>
      <p className="reveal text-[#b79aa0] max-w-[32ch] text-base md:text-lg">
        Semoga hari ini seringan tawamu dan sehangat pelukmu. Ini surat kecil, dari aku, untukmu.
      </p>
      <div className="scroll-cue mt-16" />
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="px-6 py-28 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 md:gap-24 items-center">
      <div className="reveal">
        <span className="font-caveat text-[#e8b978] text-xl block mb-2">tentang kamu</span>
        <h2 className="font-fraunces font-semibold text-4xl md:text-5xl mb-6">
          Hal-hal kecil<br />yang jadi besar
        </h2>
        <p className="text-[#b79aa0] text-lg leading-relaxed max-w-[46ch]">
          Kamu punya cara sendiri membuat hari biasa terasa spesial — cara ketawa, cara peduli, cara diam-diam
          memperhatikan hal yang orang lain lewatkan.{' '}
          <em>(Ganti paragraf ini dengan cerita nyata kalian berdua — momen, kebiasaan lucunya, atau alasan spesifik kamu sayang dia.)</em>
        </p>
        <p className="font-caveat text-[#e8b978] text-xl mt-5">— dan aku bersyukur bisa jadi bagian dari harinya.</p>
      </div>

      <div className="reveal relative h-[300px] md:h-[380px] max-w-[340px] md:max-w-none mx-auto w-full">
        <Polaroid className="absolute top-0 left-0 -rotate-6 z-[2]" image="/image1.jpeg" caption="momen favorit #1" />
        <Polaroid className="absolute bottom-0 right-0 rotate-6 z-[1]" image="/image2.jpeg" caption="momen favorit #2" />
      </div>
    </section>
  );
}

function Polaroid({ className, image, caption }) {
  return (
    <figure className={`polaroid w-[58%] bg-[#f6ecdf] p-3 pb-10 rounded-sm shadow-2xl text-[#33192a] ${className}`}>
      <img 
        src={image} 
        alt={caption}
        className="aspect-square w-full object-cover rounded-sm"
      />
      <figcaption className="font-caveat text-lg text-center mt-2">{caption}</figcaption>
    </figure>
  );
}

const REASONS = [
  'Cara kamu tertawa sampai lupa jaga image.',
  'Kamu selalu ingat hal kecil yang aku sendiri lupa.',
  'Cara kamu peduli, bahkan waktu kamu capek sendiri.',
  'Rasanya rumah, setiap kali cerita apapun ke kamu.',
  'Kamu percaya sama aku, bahkan waktu aku ragu sendiri.',
  'Karena kamu, ya kamu. Nggak perlu alasan lain.',
];

function ReasonsSection() {
  const [flipped, setFlipped] = useState(() => REASONS.map(() => false));

  const toggle = (i) => setFlipped((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <section id="reasons" className="py-24 px-6">
      <div className="reveal text-center max-w-xl mx-auto mb-14">
        <span className="font-caveat text-[#e8b978] text-xl block mb-2">enam alasan, dari banyak alasan</span>
        <h2 className="font-fraunces font-semibold text-4xl md:text-5xl">Kenapa aku sayang kamu</h2>
      </div>

      <div className="reveal flex gap-6 overflow-x-auto pb-8 px-1" style={{ scrollSnapType: 'x mandatory' }}>
        {REASONS.map((reason, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            className="postcard flex-none w-60 h-[300px] cursor-pointer"
            style={{ perspective: '1200px', scrollSnapAlign: 'start' }}
          >
            <div
              className="postcard-inner relative w-full h-full transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              <div
                className="pc-face absolute inset-0 rounded-2xl flex flex-col items-center justify-center text-center p-6 border border-[#e8b978]/25"
                style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(160deg,#2b1730,#241228)' }}
              >
                <div className="font-fraunces italic text-[#a9895f] text-xs tracking-[0.2em] uppercase mb-3">alasan</div>
                <div className="text-[#b79aa0] text-sm">sentuh kartu untuk baca</div>
                <FaHeart className="mt-4 text-[#cf6f7a]" size={20} />
              </div>
              <div
                className="pc-face absolute inset-0 rounded-2xl flex items-center justify-center text-center p-6 font-fraunces text-lg text-[#f6ecdf]"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: 'linear-gradient(160deg,#cf6f7a,#9c4f5c)',
                }}
              >
                {reason}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LetterSection() {
  return (
    <section id="letter" className="py-24 px-6 flex justify-center">
      <article
        className="letter-paper relative w-full max-w-xl text-[#33192a] rounded-sm shadow-2xl"
        style={{ background: '#f6ecdf', padding: 'clamp(32px,6vw,64px)' }}
      >
        <p className="text-lg leading-8 mb-4 first-letter:font-fraunces first-letter:italic first-letter:text-5xl first-letter:float-left first-letter:leading-none first-letter:mr-2 first-letter:text-[#cf6f7a]">
          Hai adek, selamat ulang tahun yaa 🤍.
          Hari ini hari yang paling spesial, karena di hari inilah orang yang paling mas sayang lahir ke dunia.
          Mas bener-bener bersyukur bisa kenal sama adek, bisa deket, sampai akhirnya bisa jalan bareng kayak sekarang.
        </p>

        <p className="text-lg leading-8 mb-4">
          Makasih ya dek, udah nemenin mas selama ini. Makasih udah mau dengerin cerita mas, nemenin pas lagi capek,
          pas lagi seneng, bahkan pas lagi banyak masalah. Walaupun kadang kita berantem, salah paham, ngambek-ngambekan,
          tapi mas selalu percaya kalau semua itu cuma bagian kecil dari perjalanan kita.
        </p>

        <p className="text-lg leading-8 mb-4">
          Mas minta maaf kalau selama ini masih sering bikin adek kesel, bikin adek nunggu, atau kadang belum bisa jadi
          yang terbaik. Tapi mas selalu berusaha buat jadi lebih baik sedikit demi sedikit, supaya adek bangga punya mas.
        </p>

        <p className="text-lg leading-8 mb-4">
          Semoga di umur yang baru ini semua doa adek satu-satu dikabulin. Semoga adek selalu sehat, selalu bahagia,
          dimudahkan sekolahnya, dimudahkan semua urusannya, dan semoga senyumnya nggak pernah hilang.
          Mas juga berharap semoga nanti kita masih bisa ngerayain ulang tahun bareng di tahun-tahun berikutnya.
        </p>

        <p className="text-lg leading-8">
          Sekali lagi, selamat ulang tahun yaa adek. Jangan lupa selalu jaga kesehatan, jangan sering telat makan,
          dan inget... ada mas yang selalu sayang sama adek. ❤️
        </p>

        <div className="font-caveat text-2xl text-right text-[#cf6f7a] mt-6">
          — Dari mas yang paling sayang sama adek.
        </div>

        <div
          className="absolute rounded-full"
          style={{
            bottom: -18,
            right: 36,
            width: 44,
            height: 44,
            background:
              'radial-gradient(circle at 35% 30%,#e2828f,#cf6f7a 60%,#9c4650 100%)',
            boxShadow: '0 6px 14px rgba(0,0,0,.4)',
          }}
        />
      </article>
    </section>
  );
}

function FinaleSection({ onReplay }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 0.9 + Math.random() * 1.3,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 8,
        glyph: i % 2 === 0 ? '♥' : '♡',
      })),
    []
  );

  return (
    <section id="finale" className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden px-6">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-float absolute text-[#cf6f7a]"
          style={{
            bottom: '-10%',
            left: `${h.left}%`,
            fontSize: `${h.size}rem`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.glyph}
        </span>
      ))}

      <div
        className="reveal font-fraunces font-extrabold uppercase relative z-10"
        style={{
          fontSize: 'clamp(2.8rem,11vw,7rem)',
          background: 'linear-gradient(180deg,#f6ecdf,#cf6f7a)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        I Love You
      </div>
      <div className="reveal font-caveat text-[#e8b978] mt-1 relative z-10" style={{ fontSize: 'clamp(2rem,6vw,3.4rem)' }}>
        Syafa
      </div>
      <div className="reveal mt-6 text-[#b79aa0] text-sm tracking-[0.15em] uppercase relative z-10">
        sekarang, nanti, dan seterusnya
      </div>
      <button
        onClick={onReplay}
        className="relative z-10 mt-10 px-8 py-3.5 rounded-full border border-[#e8b978]/40 text-sm tracking-[0.15em] uppercase transition-all duration-500 hover:bg-[#e8b978] hover:text-[#170b16]"
      >
        Putar ulang
      </button>
    </section>
  );
}

/* ============================= GLOBAL STYLES ============================= */
function GlobalStyles() {
  return (
    <style jsx global>{`
      .font-fraunces { font-family: 'Fraunces', serif; }
      .font-caveat { font-family: 'Caveat', cursive; }

      .scroll-cue {
        width: 1px;
        height: 50px;
        background: linear-gradient(to bottom, #e8b978, transparent);
        position: relative;
      }
      .scroll-cue::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: -3px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #e8b978;
        animation: dripline 2s ease-in-out infinite;
      }
      @keyframes dripline {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(20px); opacity: 0; }
      }

      .heart-float {
        animation-name: rise;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        opacity: 0.7;
      }
      @keyframes rise {
        0% { transform: translateY(0) scale(0.8); opacity: 0; }
        10% { opacity: 0.8; }
        100% { transform: translateY(-110vh) scale(1.1); opacity: 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .heart-float, .scroll-cue::after { animation: none !important; }
      }
    `}</style>
  );
}
