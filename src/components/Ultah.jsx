import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ikon dari react-icons
import { BsCake2Fill, BsImages, BsCalendarHeart } from 'react-icons/bs';
import { FaHeart, FaGift, FaStar } from 'react-icons/fa6';
import { IoMail, IoMusicalNotes } from 'react-icons/io5';
import { HiSparkles } from 'react-icons/hi2';
import { LuArrowDown, LuClock3 } from 'react-icons/lu';

// Daftarkan plugin GSAP
gsap.registerPlugin(ScrollTrigger);

// ─── KOMPONEN UTAMA ───
export default function Ultah() {
  // ── State ──
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [countdownActive, setCountdownActive] = useState(true);
  const [countdownDone, setCountdownDone] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [galleryImages] = useState([
    'https://picsum.photos/id/1/600/800',
    'https://picsum.photos/id/26/800/600',
    'https://picsum.photos/id/42/600/800',
    'https://picsum.photos/id/64/800/600',
    'https://picsum.photos/id/78/600/800',
    'https://picsum.photos/id/91/800/600',
  ]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [cakeBlown, setCakeBlown] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const [micActive, setMicActive] = useState(false);
  
  // ── STATE NAVIGASI ──
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 12; // 0:Loading, 1:Countdown, 2:Hero, 3:Letter, 4:Timeline, 5:Gallery, 6:Reasons, 7:Wishes, 8:Cake, 9:Gift, 10:Final, 11:Ending

  // ── Ref untuk DOM dan animasi ──
  const heroRef = useRef(null);
  const letterRef = useRef(null);
  const timelineRef = useRef(null);
  const galleryRef = useRef(null);
  const reasonsRef = useRef(null);
  const wishesRef = useRef(null);
  const cakeRef = useRef(null);
  const giftRef = useRef(null);
  const finalRef = useRef(null);
  const endingRef = useRef(null);
  const countdownRef = useRef(null);
  const typewriterRef = useRef(null);
  const particlesCanvas = useRef(null);
  const confettiCanvas = useRef(null);
  const fireworksCanvas = useRef(null);

  // ── NAVIGASI ──
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const goToPage = useCallback((page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // ── PARTIKEL (Canvas) ──
  useEffect(() => {
    const canvas = particlesCanvas.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1 + Math.random() * 2.5,
        o: 0.15 + Math.random() * 0.35,
      });
    }

    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ── CONFETTI ──
  const fireConfetti = useCallback(() => {
    const canvas = confettiCanvas.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;

    const pieces = [];
    for (let i = 0; i < 180; i++) {
      const isCircle = Math.random() > 0.6;
      pieces.push({
        x: w / 2 + (Math.random() - 0.5) * 80,
        y: h / 2 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 18,
        vy: -Math.random() * 20 - 4,
        r: 3 + Math.random() * 6,
        size: 4 + Math.random() * 10,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        life: 1,
        decay: 0.002 + Math.random() * 0.006,
        isCircle,
        color: 150 + Math.floor(Math.random() * 105),
      });
    }

    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.rot += p.rotSpeed;
        p.life -= p.decay;
        if (p.life <= 0) continue;
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.life * 0.9;
        const c = p.color;
        ctx.fillStyle = `rgb(${c},${c},${c})`;
        if (p.isCircle) {
          ctx.beginPath();
          ctx.arc(0, 0, p.r * p.life, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      }
      if (alive) {
        frame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };
    draw();

    setTimeout(() => {
      if (frame) cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, w, h);
    }, 5000);
  }, []);

  // ── FIREWORKS ──
  const burstFirework = useCallback((cx, cy) => {
    const canvas = fireworksCanvas.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;

    const count = 80 + Math.floor(Math.random() * 60);
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.006 + Math.random() * 0.014,
        r: 2 + Math.random() * 4,
      });
    }

    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.life -= p.decay;
        if (p.life <= 0) continue;
        alive = true;
        ctx.globalAlpha = p.life * 0.9;
        ctx.fillStyle = `rgba(255,255,255,${p.life * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = 'rgba(255,255,255,0.3)';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      if (alive) {
        frame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };
    draw();

    setTimeout(() => {
      if (frame) cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, w, h);
    }, 3000);
  }, []);

  const multiBurst = useCallback((count = 6) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = 100 + Math.random() * (window.innerWidth - 200);
        const y = 100 + Math.random() * (window.innerHeight * 0.6);
        burstFirework(x, y);
      }, i * 400);
    }
  }, [burstFirework]);

  // ── LOADING ──
  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 1 + Math.random() * 3;
      if (t >= 100) { t = 100; clearInterval(interval); setTimeout(() => {
        setLoading(false);
        setCurrentPage(1); // langsung ke countdown
      }, 400); }
      setProgress(Math.min(t, 100));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // ── COUNTDOWN ──
  useEffect(() => {
    if (!countdownActive) return;
    const target = new Date();
    target.setDate(target.getDate() + 1);
    target.setHours(0, 0, 0, 0);

    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, target - now);
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown({ days: d, hours: h, minutes: m, seconds: s });
      if (diff <= 0) {
        setCountdownActive(false);
        setCountdownDone(true);
        if (countdownRef.current) {
          gsap.to(countdownRef.current, { opacity: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.4 });
        }
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [countdownActive]);

  // ── GSAP : Hero ──
  useEffect(() => {
    if (loading || !showSurprise || currentPage !== 2) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });
      tl.fromTo('.hero-title', { opacity: 0, y: 60, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1.6 })
        .fromTo('.hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, '-=0.8')
        .fromTo('.hero-icon', { opacity: 0, scale: 0.5, rotate: -15 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.4 }, '-=1')
        .fromTo('.hero-arrow', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' }, '-=0.6');
    }, heroRef);
    return () => ctx.revert();
  }, [loading, showSurprise, currentPage]);

  // ── GSAP : Letter typewriter ──
  useEffect(() => {
    if (loading || !showSurprise || currentPage !== 3) return;
    const text = 'For you, a letter woven from the quietest hours, where every word is a candle lit just for you.';
    let index = 0;
    const el = typewriterRef.current;
    if (!el) return;
    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);

    const type = () => {
      if (index < text.length) {
        const char = text[index];
        const node = document.createTextNode(char);
        el.insertBefore(node, cursor);
        index++;
        setTimeout(type, 28 + Math.random() * 18);
      } else {
        setTypewriterDone(true);
        gsap.to(cursor, { opacity: 0, duration: 0.6, delay: 1 });
      }
    };
    setTimeout(type, 600);

    gsap.to(letterRef.current, {
      y: -8,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, [loading, showSurprise, currentPage]);

  // ── GSAP : Timeline ──
  useEffect(() => {
    if (loading || !showSurprise || currentPage !== 4) return;
    const ctx = gsap.context(() => {
      const items = timelineRef.current?.querySelectorAll('.timeline-item');
      if (!items) return;
      gsap.fromTo(items, { opacity: 0, y: 60, scale: 0.96 }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.25,
      });
    }, timelineRef);
    return () => ctx.revert();
  }, [loading, showSurprise, currentPage]);

  // ── GSAP : Gallery ──
  useEffect(() => {
    if (loading || !showSurprise || currentPage !== 5) return;
    const ctx = gsap.context(() => {
      const items = galleryRef.current?.querySelectorAll('.masonry-item');
      if (!items) return;
      gsap.fromTo(items, { opacity: 0, y: 50, scale: 0.94 }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.12,
      });
    }, galleryRef);
    return () => ctx.revert();
  }, [loading, showSurprise, currentPage]);

  // ── GSAP : Reasons ──
  useEffect(() => {
    if (loading || !showSurprise || currentPage !== 6) return;
    const ctx = gsap.context(() => {
      const cards = reasonsRef.current?.querySelectorAll('.reason-card');
      if (!cards) return;
      gsap.fromTo(cards, { opacity: 0, y: 50, rotateX: 8 }, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        stagger: 0.18,
      });
      cards.forEach((el, i) => {
        gsap.to(el, {
          y: -6 + (i % 3) * 2,
          duration: 2.4 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.15,
        });
      });
    }, reasonsRef);
    return () => ctx.revert();
  }, [loading, showSurprise, currentPage]);

  // ── GSAP : Wishes ──
  useEffect(() => {
    if (loading || !showSurprise || currentPage !== 7) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(wishesRef.current, { opacity: 0, y: 40 }, {
        opacity: 1,
        y: 0,
        duration: 1.4,
      });
    }, wishesRef);
    return () => ctx.revert();
  }, [loading, showSurprise, currentPage]);

  // ── GSAP : Cake ──
  useEffect(() => {
    if (loading || !showSurprise || currentPage !== 8) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(cakeRef.current, { opacity: 0, scale: 0.92, y: 30 }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
      });
    }, cakeRef);
    return () => ctx.revert();
  }, [loading, showSurprise, currentPage]);

  // ── GSAP : Gift ──
  useEffect(() => {
    if (loading || !showSurprise || currentPage !== 9) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(giftRef.current, { opacity: 0, y: 40, scale: 0.94 }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
      });
    }, giftRef);
    return () => ctx.revert();
  }, [loading, showSurprise, currentPage]);

  // ── GSAP : Final Letter ──
  useEffect(() => {
    if (loading || !showSurprise || currentPage !== 10) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(finalRef.current, { opacity: 0, y: 40 }, {
        opacity: 1,
        y: 0,
        duration: 1.4,
      });
    }, finalRef);
    return () => ctx.revert();
  }, [loading, showSurprise, currentPage]);

  // ── GSAP : Ending ──
  useEffect(() => {
    if (!showEnding || currentPage !== 11) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(endingRef.current, { opacity: 0, scale: 0.96 }, {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: 'power3.out',
      });
      setTimeout(() => multiBurst(8), 600);
      setTimeout(() => fireConfetti(), 1200);
    }, endingRef);
    return () => ctx.revert();
  }, [showEnding, multiBurst, fireConfetti, currentPage]);

  // ── BLOW DETECTION ──
  const startBlowDetection = useCallback(() => {
    if (cakeBlown || micActive) return;
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        setMicActive(true);
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;
        const data = new Uint8Array(analyser.fftSize);

        const checkBlow = () => {
          if (cakeBlown) return;
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length;
          if (avg > 35) {
            setCakeBlown(true);
            setMicActive(false);
            audioCtx.close();
            stream.getTracks().forEach(t => t.stop());
            fireConfetti();
            setTimeout(() => multiBurst(4), 400);

            const flame = document.querySelector('.flame');
            if (flame) {
              flame.classList.add('flame-extinguished');
              // smoke
              const smokeCanvas = document.createElement('canvas');
              smokeCanvas.style.position = 'fixed';
              smokeCanvas.style.inset = '0';
              smokeCanvas.style.pointerEvents = 'none';
              smokeCanvas.style.zIndex = '9997';
              document.body.appendChild(smokeCanvas);
              const ctx = smokeCanvas.getContext('2d');
              const w = smokeCanvas.width = window.innerWidth;
              const h = smokeCanvas.height = window.innerHeight;
              const particles = [];
              for (let i = 0; i < 40; i++) {
                particles.push({
                  x: w / 2 + (Math.random() - 0.5) * 120,
                  y: h / 2 + (Math.random() - 0.5) * 80,
                  vx: (Math.random() - 0.5) * 3,
                  vy: -Math.random() * 2 - 1,
                  r: 20 + Math.random() * 50,
                  o: 0.3 + Math.random() * 0.3,
                  life: 1,
                  decay: 0.004 + Math.random() * 0.006,
                });
              }
              let smokeFrame;
              const drawSmoke = () => {
                ctx.clearRect(0, 0, w, h);
                let alive = false;
                for (const p of particles) {
                  p.x += p.vx + (Math.random() - 0.5) * 0.6;
                  p.y += p.vy;
                  p.vy -= 0.02;
                  p.r += 0.6;
                  p.life -= p.decay;
                  if (p.life <= 0) continue;
                  alive = true;
                  ctx.globalAlpha = p.life * p.o * 0.6;
                  ctx.fillStyle = '#fff';
                  ctx.beginPath();
                  ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
                  ctx.fill();
                }
                if (alive) {
                  smokeFrame = requestAnimationFrame(drawSmoke);
                } else {
                  ctx.clearRect(0, 0, w, h);
                  smokeCanvas.remove();
                }
              };
              drawSmoke();
              setTimeout(() => {
                if (smokeFrame) cancelAnimationFrame(smokeFrame);
                smokeCanvas.remove();
              }, 5000);
            }
            return;
          }
          if (!cakeBlown) {
            requestAnimationFrame(checkBlow);
          }
        };
        checkBlow();
      })
      .catch(() => {
        alert('🎤 Microphone access denied. Click the candle to blow it out!');
        setMicActive(false);
      });
  }, [cakeBlown, micActive, fireConfetti, multiBurst]);

  // ── GIFT OPEN ──
  const handleGiftOpen = useCallback(() => {
    if (giftOpen) return;
    setGiftOpen(true);
    fireConfetti();
    setTimeout(() => multiBurst(3), 500);
  }, [giftOpen, fireConfetti, multiBurst]);

  // ── SURPRISE REVEAL ──
  const handleSurpriseReveal = useCallback(() => {
    setShowSurprise(true);
    setCountdownActive(false);
    setCountdownDone(true);
    setCurrentPage(2); // langsung ke halaman Hero
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  // ── RENDER PAGE ──
  const renderPage = () => {
    // PAGE 0: LOADING
    if (loading) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
        }}>
          <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
            <HiSparkles />
          </div>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
            Preparing Something Special...
          </p>
          <div style={{ width: '200px', height: '2px', background: '#222', borderRadius: '99px', overflow: 'hidden', marginTop: '1.5rem' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #666, #fff)', borderRadius: '99px', transition: 'width 0.15s linear' }} />
          </div>
        </div>
      );
    }

    // PAGE 1: COUNTDOWN
    if (!showSurprise && currentPage === 1) {
      return (
        <PageContainer title="Counting Down" icon={<LuClock3 />}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              maxWidth: '480px',
              margin: '0 auto 2rem',
            }}>
              {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                <div key={unit} style={{
                  textAlign: 'center',
                  padding: '0.75rem 0.5rem',
                  borderRadius: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ fontSize: '2.8rem', fontWeight: 300, fontVariantNumeric: 'tabular-nums' }}>
                    {String(countdown[unit]).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#888', marginTop: '0.25rem' }}>
                    {unit}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSurpriseReveal} className="btn-outline">
              Open the Surprise
            </button>
          </div>
        </PageContainer>
      );
    }

    // PAGE 2-11: SETELAH SURPRISE
    if (showSurprise) {
      const pages = [
        // PAGE 2: Hero
        {
          component: (
            <div ref={heroRef} style={{ textAlign: 'center' }}>
              <div className="hero-icon" style={{ fontSize: '4.5rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
                <BsCake2Fill />
              </div>
              <h1 className="hero-title" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 200, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.9)' }}>
                Happy Birthday
              </h1>
              <p className="hero-sub" style={{ fontSize: 'clamp(1.25rem, 3vw, 2.5rem)', fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', marginTop: '1rem' }}>
                Wasiatus Syafana
              </p>
              <div className="hero-arrow" style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.2)', marginTop: '3rem' }}>
                <LuArrowDown />
              </div>
            </div>
          )
        },
        // PAGE 3: Letter
        {
          component: (
            <div ref={letterRef} style={{ maxWidth: '672px', margin: '0 auto' }}>
              <div className="glass-light" style={{ padding: '2rem 3rem', position: 'relative', borderRadius: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.4)' }}><IoMail /></div>
                </div>
                <p ref={typewriterRef} style={{ fontSize: '0.875rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', fontWeight: 300 }} />
              </div>
            </div>
          )
        },
        // PAGE 4: Timeline
        {
          component: (
            <div ref={timelineRef} style={{ maxWidth: '768px', margin: '0 auto' }}>
              <PageHeader icon={<BsCalendarHeart />} title="Our Timeline" />
              <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { icon: <FaHeart />, year: '2023', text: 'The day our paths crossed — a quiet spark that lit everything.' },
                  { icon: <FaStar />, year: '2024', text: 'Every laugh, every late-night conversation, every glance that said more than words.' },
                  { icon: <BsCalendarHeart />, year: '2025', text: 'And now, this moment — a celebration of you, of us, of everything beautiful.' },
                ].map((item, i) => (
                  <div key={i} className="timeline-item" style={{ marginBottom: i === 2 ? 0 : '2rem', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-2.6rem',
                      top: '0.25rem',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.8)',
                      border: '2px solid #000',
                    }} />
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.3)' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>{item.year}</span>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 300 }}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        },
        // PAGE 5: Gallery
        {
          component: (
            <div ref={galleryRef} style={{ maxWidth: '1024px', margin: '0 auto' }}>
              <PageHeader icon={<BsImages />} title="Memories in Light" />
              <div style={{ columnCount: 3, columnGap: '1rem' }}>
                {galleryImages.map((src, i) => (
                  <div
                    key={i}
                    className="masonry-item"
                    style={{
                      breakInside: 'avoid',
                      marginBottom: '1rem',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      background: '#111',
                      cursor: 'pointer',
                    }}
                    onClick={() => { setLightboxSrc(src); setLightboxOpen(true); }}
                  >
                    <img src={src} alt={`Memory ${i+1}`} loading="lazy" style={{ width: '100%', display: 'block', height: `${200 + (i % 3) * 120}px`, objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )
        },
        // PAGE 6: Reasons
        {
          component: (
            <div ref={reasonsRef} style={{ maxWidth: '1024px', margin: '0 auto' }}>
              <PageHeader icon={<FaHeart />} title="Reasons I Love You" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  'Your laugh — a melody I could listen to forever.',
                  'The way you see the world, soft and full of wonder.',
                  'Your quiet strength that holds everything together.',
                  'The kindness in your eyes, even on the hardest days.',
                  'Your heart — brave, generous, and endlessly beautiful.',
                  'Every single part of you, exactly as you are.',
                ].map((text, i) => (
                  <div key={i} className="reason-card glass" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '1rem' }}>
                    <div style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.2)', marginBottom: '0.75rem' }}>
                      <FaHeart />
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 300 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        },
        // PAGE 7: Wishes
        {
          component: (
            <div ref={wishesRef} style={{ maxWidth: '672px', margin: '0 auto' }}>
              <PageHeader icon={<HiSparkles />} title="Birthday Wishes" />
              <div className="glass-light" style={{ padding: '2rem 3rem', borderRadius: '1.5rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 300, lineHeight: 1.8 }}>
                  May this year bring you everything your heart desires — joy that spills over, peace that settles deep, and love that reminds you how truly extraordinary you are. You deserve all the beauty this world has to offer.
                </p>
              </div>
            </div>
          )
        },
        // PAGE 8: Cake
        {
          component: (
            <div ref={cakeRef} style={{ maxWidth: '448px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: '3.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>
                <BsCake2Fill />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
                Make a Wish
              </h2>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
                {cakeBlown ? '✨ Your wish is on its way' : 'Blow the candle'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '12rem', height: '4rem', background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05))', borderTopLeftRadius: '9999px', borderTopRightRadius: '9999px', margin: '0 auto' }} />
                  <div style={{ width: '1rem', height: '6rem', background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.05))', borderRadius: '9999px', margin: '0.25rem auto 0', position: 'relative' }}>
                    <div className="flame" style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '40px',
                      background: 'radial-gradient(ellipse at bottom, #fff 0%, #ccc 40%, #888 70%, transparent 100%)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'blur(1px)',
                      animation: 'flicker 0.3s infinite alternate ease-in-out',
                      transformOrigin: 'bottom center',
                      boxShadow: '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.1)',
                      transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      opacity: cakeBlown ? 0 : 1,
                      transform: cakeBlown ? 'scale(0.2) translateY(20px)' : 'translateX(-50%)',
                      filter: cakeBlown ? 'blur(8px)' : 'blur(1px)',
                    }} />
                  </div>
                </div>
                {!cakeBlown && (
                  <button onClick={startBlowDetection} className="btn-outline" style={{ marginTop: '2rem', fontSize: '0.65rem' }}>
                    {micActive ? '🎤 Listening...' : '💨 Blow the Candle'}
                  </button>
                )}
                {cakeBlown && (
                  <div style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', fontWeight: 300 }}>
                    ✦ A wish carried on the wind ✦
                  </div>
                )}
              </div>
            </div>
          )
        },
        // PAGE 9: Gift
        {
          component: (
            <div ref={giftRef} style={{ maxWidth: '448px', margin: '0 auto', textAlign: 'center' }}>
              <PageHeader icon={<FaGift />} title="A Gift for You" />
              <div
                className={giftOpen ? 'open' : ''}
                onClick={handleGiftOpen}
                style={{
                  width: '200px',
                  height: '180px',
                  background: '#111',
                  borderRadius: '0.5rem 0.5rem 0 0',
                  position: 'relative',
                  cursor: 'pointer',
                  margin: '0 auto',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div style={{
                  width: '100%',
                  height: '30px',
                  background: '#1a1a1a',
                  borderRadius: '0.5rem 0.5rem 0 0',
                  borderBottom: '2px solid rgba(255,255,255,0.06)',
                  transformOrigin: 'bottom center',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: giftOpen ? 'rotateX(-90deg) translateY(-4px)' : 'none',
                }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '8px', background: '#fff', transform: 'translateY(-50%)', opacity: 0.9 }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '8px', background: '#fff', transform: 'translateX(-50%)', opacity: 0.9 }} />
                <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', fontSize: '2rem', color: '#fff', opacity: 0.8 }}>✦</div>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: giftOpen ? 1 : 0,
                  pointerEvents: giftOpen ? 'auto' : 'none',
                  transition: 'opacity 0.6s ease 0.4s',
                  padding: '0.5rem',
                  textAlign: 'center',
                  color: '#ddd',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>💌 You are the most beautiful part of every day.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', color: 'rgba(255,255,255,0.3)', fontSize: '1.25rem' }}>
                      <IoMusicalNotes /><FaHeart /><HiSparkles />
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                      A playlist of all the songs that remind me of you.
                    </p>
                  </div>
                </div>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                {giftOpen ? '✨ Open with love' : 'Click to open'}
              </p>
            </div>
          )
        },
        // PAGE 10: Final Letter
        {
          component: (
            <div ref={finalRef} style={{ maxWidth: '672px', margin: '0 auto' }}>
              <PageHeader icon={<IoMail />} title="A Final Letter" />
              <div className="glass-light" style={{ padding: '2.5rem 3.5rem', borderRadius: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom right, rgba(255,255,255,0.05), transparent, transparent)' }} />
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 300, lineHeight: 1.8, position: 'relative', zIndex: 10 }}>
                  In the quiet hours, when the world falls still, it is you I think of — the warmth of your presence, the light in your smile, the gentle way you make everything feel possible. This day, and every day, you are cherished beyond measure.
                  <br /><br />
                  With all my love,
                  <br />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Always.</span>
                </p>
              </div>
            </div>
          )
        },
        // PAGE 11: Ending
        {
          component: (
            <div ref={endingRef} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem' }}>
                <FaHeart />
              </div>
              <h2 style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 200, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.8)' }}>
                Thank You
              </h2>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', fontWeight: 300, marginTop: '1rem', textTransform: 'uppercase' }}>
                For being you
              </p>
              <button onClick={() => { setShowEnding(true); }} className="btn-outline" style={{ marginTop: '2rem', fontSize: '0.65rem' }}>
                Celebrate
              </button>
              {showEnding && (
                <div style={{ marginTop: '2rem' }}>
                  <div style={{ fontSize: '4.5rem', color: 'rgba(255,255,255,0.2)', animation: 'pulse 2s infinite' }}>
                    <FaHeart />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 300, marginTop: '1rem' }}>
                    Forever and always
                  </p>
                </div>
              )}
            </div>
          )
        },
      ];

      const pageIndex = currentPage - 2;
      if (pageIndex >= 0 && pageIndex < pages.length) {
        return pages[pageIndex].component;
      }
    }

    return null;
  };

  // ── RENDER ──
  return (
    <>
      {/* CANVAS: partikel global */}
      <canvas ref={particlesCanvas} id="particles-canvas" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      {/* CANVAS: confetti */}
      <canvas ref={confettiCanvas} id="confetti-canvas" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }} />

      {/* CANVAS: fireworks */}
      <canvas ref={fireworksCanvas} id="fireworks-canvas" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9997 }} />

      {/* LIGHTBOX */}
      <div id="lightbox" className={lightboxOpen ? 'open' : ''} onClick={() => { setLightboxOpen(false); setLightboxSrc(''); }} style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: lightboxOpen ? 1 : 0,
        pointerEvents: lightboxOpen ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
        padding: '2rem',
      }}>
        <img src={lightboxSrc} alt="Enlarged" style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '1.5rem', objectFit: 'contain' }} />
      </div>

      {/* PAGE CONTAINER */}
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
      }}>
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          {renderPage()}

          {/* CONTINUE BUTTON */}
          {!loading && currentPage > 0 && currentPage < totalPages - 1 && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button onClick={goToNextPage} className="btn-outline">
                Continue →
              </button>
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.15)', marginTop: '0.5rem', letterSpacing: '0.1em' }}>
                {currentPage} / {totalPages - 1}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes flicker {
          0% { transform: scale(1) rotate(-2deg); }
          100% { transform: scale(1.08, 0.92) rotate(2deg); }
        }
        .typewriter-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: #fff;
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: blink 0.8s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .btn-outline {
          display: inline-block;
          padding: 0.75rem 2.4rem;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 99px;
          color: #fff;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: transparent;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(8px);
        }
        .btn-outline:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.5);
          transform: scale(1.02);
          box-shadow: 0 0 40px rgba(255,255,255,0.04);
        }
        .glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(12px) saturate(1.2);
          -webkit-backdrop-filter: blur(12px) saturate(1.2);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .glass-light {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .masonry-item {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .masonry-item:hover {
          transform: scale(1.02);
        }
        .masonry-item img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .masonry-item:hover img {
          transform: scale(1.06);
        }
        .flame-extinguished {
          opacity: 0 !important;
          transform: scale(0.2) translateY(20px) !important;
          filter: blur(8px) !important;
        }
      `}</style>
    </>
  );
}

// ── COMPONENT HELPER ──
function PageHeader({ icon, title }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{ fontSize: '1.875rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>
        {icon}
      </div>
      <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
        {title}
      </h2>
    </div>
  );
}

function PageContainer({ children, title, icon }) {
  return (
    <div style={{ textAlign: 'center' }}>
      {icon && <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.3)', marginBottom: '2.5rem' }}>{icon}</div>}
      {title && <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 300, marginBottom: '2rem' }}>{title}</h2>}
      {children}
    </div>
  );
}
