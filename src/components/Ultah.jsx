import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

const Ultah = () => {
  const [fontIndex, setFontIndex] = useState(0);
  const [isCandleLit, setIsCandleLit] = useState(true);
  const [showWish, setShowWish] = useState(false);
  const [micPermission, setMicPermission] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const flameRef = useRef(null);
  const glowRef = useRef(null);
  const wishRef = useRef(null);
  const candleRef = useRef(null);
  const containerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  
  const fonts = [
    "'Playfair Display', serif",
    "'Georgia', serif",
    "'Times New Roman', serif",
    "'Garamond', serif",
    "'Bodoni Moda', serif",
    "'Cormorant Garamond', serif",
    "'Merriweather', serif",
    "'Lora', serif",
  ];

  // Font rotation SLOW
  useEffect(() => {
    const interval = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % fonts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // INIT MIC
  const initMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.5;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      setMicPermission(true);
      
      // Monitor blow
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let blowCount = 0;
      
      const checkBlow = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const level = average / 128;
        setAudioLevel(level);
        
        // Detect blow - threshold lebih tinggi biar gak false positive
        if (level > 0.7 && isCandleLit) {
          blowCount++;
          if (blowCount > 3) { // butuh 3 deteksi berturut2
            blowCandle();
            blowCount = 0;
          }
        } else {
          blowCount = 0;
        }
        
        requestAnimationFrame(checkBlow);
      };
      
      checkBlow();
    } catch (error) {
      console.error('Mic error:', error);
    }
  }, [isCandleLit]);

  // BLOW CANDLE - smooth
  const blowCandle = useCallback(() => {
    if (!isCandleLit) return;
    
    // Flame padam
    gsap.to(flameRef.current, {
      scaleX: 1.5,
      scaleY: 0.2,
      opacity: 0,
      y: -40,
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => {
        setIsCandleLit(false);
        setShowWish(true);
        
        // Wish muncul dari gelap
        gsap.fromTo(wishRef.current,
          { opacity: 0, y: 30, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 1.5, 
            ease: "power2.out",
            delay: 0.3
          }
        );
        
        // Glow hilang pelan
        gsap.to(glowRef.current, {
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        });
      }
    });
  }, [isCandleLit]);

  // API ANIMATION - SINGKRON, TEPAT DI ATAS LILIN
  useEffect(() => {
    if (!isCandleLit || !flameRef.current) return;
    
    const flame = flameRef.current;
    
    // API utama - gerakan smooth
    gsap.to(flame, {
      scaleX: 1.08,
      scaleY: 1.12,
      x: 2,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    
    // Glow - pulsing halus
    gsap.to(glowRef.current, {
      scale: 1.1,
      opacity: 0.6,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    
  }, [isCandleLit]);

  // Stars background - subtle
  useEffect(() => {
    const container = containerRef.current;
    const stars = [];
    
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div');
      const size = 1 + Math.random() * 1.5;
      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: twinkle ${3 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
        pointer-events: none;
      `;
      container.appendChild(star);
      stars.push(star);
    }
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.1; transform: scale(0.8); }
        50% { opacity: 0.4; transform: scale(1.2); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      stars.forEach(s => s.remove());
      style.remove();
    };
  }, []);

  // RESET
  const resetCandle = useCallback(() => {
    setIsCandleLit(true);
    setShowWish(false);
    setAudioLevel(0);
    
    if (flameRef.current) {
      gsap.to(flameRef.current, {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }
    
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.4,
        duration: 0.8,
        ease: "power2.out",
      });
    }
    
    if (wishRef.current) {
      gsap.to(wishRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, []);

  // BALLOONS - ELEGAN, RELAX, GA STRESS
  const renderBalloons = () => {
    const balloons = [];
    const colors = [
      'rgba(212, 165, 116, 0.08)',
      'rgba(200, 180, 160, 0.06)',
      'rgba(180, 160, 140, 0.05)',
    ];
    
    // Posisi tetap, teratur
    const positions = [
      {x: 5, y: 10}, {x: 92, y: 8}, 
      {x: 3, y: 35}, {x: 94, y: 32},
      {x: 8, y: 60}, {x: 89, y: 58},
      {x: 15, y: 85}, {x: 82, y: 82},
    ];

    positions.forEach((pos, i) => {
      const size = 40 + Math.random() * 20;
      const color = colors[i % colors.length];
      const delay = i * 0.8;
      const duration = 10 + Math.random() * 3; // SANGAT LAMBAT
      
      balloons.push(
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: size,
            height: size * 1.2,
            background: `radial-gradient(circle at 35% 30%, ${color}, transparent)`,
            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
            border: '1px solid rgba(212, 165, 116, 0.03)',
            transform: `scale(0.8)`,
            animation: `balloonFloat ${duration}s ease-in-out ${delay}s infinite`,
            opacity: 0.3,
          }}
        >
          <div style={{
            position: 'absolute',
            bottom: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1,
            height: 20,
            background: 'rgba(200, 180, 160, 0.05)',
          }} />
        </div>
      );
    });
    
    return balloons;
  };

  // Init mic on mount
  useEffect(() => {
    initMicrophone();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [initMicrophone]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a]"
    >
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none" />
      
      {/* Balloons - RELAX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {renderBalloons()}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        
        {/* Gold Line */}
        <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent mb-6" />
        
        {/* Title */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wider text-center transition-all duration-1000"
          style={{
            fontFamily: fonts[fontIndex],
            color: '#f5e6d3',
            textShadow: '0 0 60px rgba(212, 165, 116, 0.1)',
          }}
        >
          Happy Birthday
        </h1>
        
        <div className="w-20 h-px bg-gradient-to-r from-[#d4a574]/30 via-transparent to-[#d4a574]/30 mt-4 mb-8" />

        {/* CANDLE SECTION - API TEPAT DI ATAS */}
        <div className="relative flex flex-col items-center">
          
          {/* Candle Container */}
          <div ref={candleRef} className="relative flex flex-col items-center">
            
            {/* Candle Body */}
            <div 
              className="relative w-3 h-20 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #f5e6d3 0%, #e8d5b5 30%, #d4a574 60%, #c9a96e 100%)',
                boxShadow: '0 4px 30px rgba(212, 165, 116, 0.15)',
              }}
            />
            
            {/* GLOW - di sekitar lilin */}
            <div
              ref={glowRef}
              className="absolute -inset-20 rounded-full pointer-events-none"
              style={{
                background: isCandleLit 
                  ? 'radial-gradient(circle, rgba(212, 165, 116, 0.08) 0%, transparent 70%)'
                  : 'transparent',
                filter: 'blur(40px)',
                transition: 'all 0.8s ease',
              }}
            />
            
            {/* FLAME - TEPAT DI ATAS LILIN (center) */}
            {isCandleLit && (
              <div 
                ref={flameRef}
                className="absolute -top-12 left-1/2 -translate-x-1/2"
                style={{ transformOrigin: 'bottom center' }}
              >
                {/* Outer Flame */}
                <div 
                  className="absolute -top-8 left-1/2 -translate-x-1/2"
                  style={{
                    width: '22px',
                    height: '32px',
                    background: 'radial-gradient(ellipse at bottom, #ffd700 0%, #ff8c00 40%, #ff4500 65%, transparent 100%)',
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    filter: 'blur(1px)',
                    boxShadow: '0 0 50px rgba(255, 200, 50, 0.3), 0 0 100px rgba(255, 150, 0, 0.1)',
                  }}
                />
                
                {/* Inner Flame */}
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                  style={{
                    width: '12px',
                    height: '20px',
                    background: 'radial-gradient(ellipse at bottom, #ffffff 0%, #ffd700 40%, #ff8c00 100%)',
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    filter: 'blur(0.5px)',
                  }}
                />
                
                {/* Core */}
                <div 
                  className="absolute -top-1 left-1/2 -translate-x-1/2"
                  style={{
                    width: '5px',
                    height: '10px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    filter: 'blur(1px)',
                  }}
                />
              </div>
            )}
          </div>

          {/* WISH - muncul dari gelap */}
          <div
            ref={wishRef}
            className="text-center mt-16 opacity-0"
          >
            <h2
              className="text-2xl md:text-4xl font-light"
              style={{
                fontFamily: fonts[fontIndex % fonts.length],
                color: '#f5e6d3',
                textShadow: '0 0 80px rgba(212, 165, 116, 0.15)',
              }}
            >
              ✨ Happy Birthday ✨
            </h2>
            <p
              className="text-[#d4a574] text-sm md:text-base mt-3 opacity-40 tracking-widest"
              style={{
                fontFamily: fonts[fontIndex % fonts.length],
                letterSpacing: '0.2em',
              }}
            >
              may your wishes come true
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 mt-8">
          {!micPermission && (
            <button
              onClick={initMicrophone}
              className="px-6 py-2 rounded-full border border-[#d4a574]/20 text-[#d4a574]/60 hover:border-[#d4a574]/40 hover:text-[#d4a574] transition-all duration-500 text-xs uppercase tracking-widest"
            >
              🎤 Enable Mic
            </button>
          )}
          
          {micPermission && isCandleLit && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-[#d4a574]/30 text-[10px] uppercase tracking-[0.3em]">
                {audioLevel > 0.5 ? '💨 blow harder...' : '🎤 blow to extinguish'}
              </div>
              <div className="w-24 h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d4a574] to-[#c9a96e] rounded-full transition-all duration-150"
                  style={{
                    width: `${Math.min(audioLevel * 100, 100)}%`,
                    opacity: audioLevel > 0.3 ? 0.6 : 0.2,
                  }}
                />
              </div>
            </div>
          )}
          
          {!isCandleLit && (
            <button
              onClick={resetCandle}
              className="px-6 py-2 rounded-full border border-[#d4a574]/20 text-[#d4a574]/40 hover:border-[#d4a574]/60 hover:text-[#d4a574] transition-all duration-500 text-xs uppercase tracking-widest"
            >
              🕯️ light again
            </button>
          )}
        </div>

        {/* Bottom Line */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-[#d4a574]/10 to-transparent" />
      </div>

      {/* CSS ANIMATIONS */}
      <style>{`
        @keyframes balloonFloat {
          0%, 100% { transform: translateY(0px) scale(0.8); }
          25% { transform: translateY(-8px) scale(0.82); }
          50% { transform: translateY(-4px) scale(0.78); }
          75% { transform: translateY(-10px) scale(0.81); }
        }
      `}</style>
    </div>
  );
};

export default Ultah;
