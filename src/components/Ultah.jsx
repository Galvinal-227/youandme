import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

// ============================================
// CONSTANTS
// ============================================

const FONTS = [
  "'Playfair Display', serif",
  "'Cormorant Garamond', serif",
  "'Bodoni Moda', serif",
  "'Georgia', serif",
];

const COLORS = {
  gold: '#d4a574',
  goldLight: '#f5e6d3',
  goldDark: '#c9a96e',
};

// ============================================
// CUSTOM HOOKS
// ============================================

const useFontRotation = (fonts, interval = 3000) => {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % fonts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [fonts.length, interval]);
  
  return index;
};

const useMicrophone = (onBlow, isActive) => {
  const [permission, setPermission] = useState(false);
  const [level, setLevel] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const frameRef = useRef(null);
  const sampleCountRef = useRef(0);

  const cleanup = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const init = useCallback(async () => {
    try {
      cleanup();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        } 
      });
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.6;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      setPermission(true);
      
      const dataArray = new Float32Array(analyser.frequencyBinCount);
      
      const monitor = () => {
        if (!analyserRef.current) {
          frameRef.current = requestAnimationFrame(monitor);
          return;
        }
        
        analyserRef.current.getFloatFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const normalizedLevel = Math.min(rms / 0.5, 1);
        
        setLevel(normalizedLevel);
        
        if (isActive && normalizedLevel > 0.65) {
          sampleCountRef.current += 1;
          if (sampleCountRef.current >= 4) {
            onBlow();
            sampleCountRef.current = 0;
          }
        } else {
          sampleCountRef.current = Math.max(0, sampleCountRef.current - 1);
        }
        
        frameRef.current = requestAnimationFrame(monitor);
      };
      
      monitor();
      
    } catch (error) {
      console.warn('Microphone error:', error);
      setPermission(false);
    }
  }, [cleanup, onBlow, isActive]);

  useEffect(() => {
    init();
    return cleanup;
  }, [init, cleanup]);

  return { permission, level };
};

// ============================================
// COMPONENTS
// ============================================

const Candle = ({ isLit, onExtinguish }) => {
  const containerRef = useRef(null);
  const flameRef = useRef(null);
  const innerFlameRef = useRef(null);
  const coreFlameRef = useRef(null);
  const glowRef = useRef(null);

  // Flame animation - FIXED: proper null checks
  useEffect(() => {
    if (!isLit) return;
    
    // Check all refs exist
    if (!flameRef.current || !innerFlameRef.current || !coreFlameRef.current) return;
    
    const flame = flameRef.current;
    const innerFlame = innerFlameRef.current;
    const coreFlame = coreFlameRef.current;
    const glow = glowRef.current;

    // Kill any existing tweens
    gsap.killTweensOf(flame);
    gsap.killTweensOf(innerFlame);
    gsap.killTweensOf(coreFlame);
    if (glow) gsap.killTweensOf(glow);

    // Animate outer flame
    gsap.to(flame, {
      scaleX: 1.12,
      scaleY: 1.18,
      x: 2,
      duration: 1.0,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Animate inner flame
    gsap.to(innerFlame, {
      scaleX: 1.15,
      scaleY: 1.12,
      x: 1.5,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Animate core flame
    gsap.to(coreFlame, {
      scaleX: 1.08,
      scaleY: 1.1,
      x: 1,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Animate glow
    if (glow) {
      gsap.to(glow, {
        opacity: 0.6,
        scale: 1.15,
        duration: 2.0,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    return () => {
      gsap.killTweensOf(flame);
      gsap.killTweensOf(innerFlame);
      gsap.killTweensOf(coreFlame);
      if (glow) gsap.killTweensOf(glow);
    };
  }, [isLit]);

  // Handle extinguish - FIXED: proper null checks
  const handleExtinguish = useCallback(() => {
    if (!isLit || !onExtinguish) return;
    
    // Check all refs exist
    if (!flameRef.current || !innerFlameRef.current || !coreFlameRef.current) {
      onExtinguish();
      return;
    }
    
    const flame = flameRef.current;
    const innerFlame = innerFlameRef.current;
    const coreFlame = coreFlameRef.current;
    const glow = glowRef.current;

    // Kill existing animations
    gsap.killTweensOf(flame);
    gsap.killTweensOf(innerFlame);
    gsap.killTweensOf(coreFlame);
    if (glow) gsap.killTweensOf(glow);

    // Extinguish animation
    const tl = gsap.timeline({
      onComplete: onExtinguish,
    });

    tl.to(flame, {
      scaleX: 1.8,
      scaleY: 0.2,
      opacity: 0,
      y: -30,
      duration: 0.6,
      ease: "power2.in",
    })
    .to(innerFlame, {
      scaleX: 1.5,
      scaleY: 0.1,
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.in",
    }, "-=0.3")
    .to(coreFlame, {
      scaleX: 1.3,
      scaleY: 0.05,
      opacity: 0,
      y: -15,
      duration: 0.4,
      ease: "power2.in",
    }, "-=0.2");

    if (glow) {
      tl.to(glow, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.2");
    }
  }, [isLit, onExtinguish]);

  // Expose extinguish method
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.extinguish = handleExtinguish;
    }
  }, [handleExtinguish]);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center" data-candle>
      {/* Glow */}
      <div
        ref={glowRef}
        className="absolute -inset-20 pointer-events-none"
        style={{
          background: isLit ? 'radial-gradient(circle, rgba(212, 165, 116, 0.1) 0%, transparent 70%)' : 'transparent',
          filter: 'blur(50px)',
          opacity: 0,
        }}
      />
      
      {/* Candle body */}
      <div 
        className="relative w-3 h-20 rounded-full"
        style={{
          background: 'linear-gradient(180deg, #f5e6d3 0%, #e8d5b5 30%, #d4a574 60%, #c9a96e 100%)',
          boxShadow: '0 4px 30px rgba(212, 165, 116, 0.15)',
        }}
      />
      
      {/* Flame */}
      {isLit && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2" style={{ transformOrigin: 'bottom center' }}>
          {/* Outer flame */}
          <div
            ref={flameRef}
            className="absolute -top-8 left-1/2 -translate-x-1/2"
            style={{
              width: '24px',
              height: '34px',
              background: 'radial-gradient(ellipse at bottom, #ffd700 0%, #ff8c00 40%, #ff4500 60%, transparent 80%)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              filter: 'blur(0.5px)',
              boxShadow: '0 0 60px rgba(255, 200, 50, 0.25)',
              transformOrigin: 'bottom center',
            }}
          />
          
          {/* Inner flame */}
          <div
            ref={innerFlameRef}
            className="absolute -top-5 left-1/2 -translate-x-1/2"
            style={{
              width: '13px',
              height: '22px',
              background: 'radial-gradient(ellipse at bottom, #ffffff 0%, #ffd700 35%, #ff8c00 70%, transparent 100%)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              filter: 'blur(0.3px)',
              transformOrigin: 'bottom center',
            }}
          />
          
          {/* Core flame */}
          <div
            ref={coreFlameRef}
            className="absolute -top-2 left-1/2 -translate-x-1/2"
            style={{
              width: '5px',
              height: '11px',
              background: '#ffffff',
              borderRadius: '50%',
              filter: 'blur(0.5px)',
              transformOrigin: 'bottom center',
            }}
          />
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const Ultah = () => {
  const [isCandleLit, setIsCandleLit] = useState(true);
  const [showWish, setShowWish] = useState(false);
  
  const containerRef = useRef(null);
  const wishRef = useRef(null);
  const titleRef = useRef(null);
  
  const fontIndex = useFontRotation(FONTS);

  // Handle extinguish
  const handleExtinguish = useCallback(() => {
    setIsCandleLit(false);
    setShowWish(true);
  }, []);

  // Handle blow from microphone
  const handleBlow = useCallback(() => {
    if (isCandleLit) {
      const candleElement = document.querySelector('[data-candle]');
      if (candleElement && candleElement.extinguish) {
        candleElement.extinguish();
      }
    }
  }, [isCandleLit]);

  // Microphone
  const { permission, level } = useMicrophone(handleBlow, isCandleLit);

  // Wish animation - FIXED: proper null checks
  useEffect(() => {
    if (!showWish || !wishRef.current) return;
    
    const wish = wishRef.current;
    
    // Kill any existing tweens
    gsap.killTweensOf(wish);
    
    gsap.fromTo(wish,
      { 
        opacity: 0, 
        y: 30,
        scale: 0.95,
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
        clearProps: "all",
      }
    );
    
    return () => {
      gsap.killTweensOf(wish);
    };
  }, [showWish]);

  // Reset
  const handleReset = useCallback(() => {
    setIsCandleLit(true);
    setShowWish(false);
    
    if (wishRef.current) {
      gsap.killTweensOf(wishRef.current);
      gsap.set(wishRef.current, { 
        opacity: 0, 
        y: 30,
        scale: 0.95,
      });
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #141414 0%, #0a0a0a 100%)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(212, 165, 116, 0.03) 0%, transparent 70%)',
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        
        {/* Decorative line */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4a574]/20 to-transparent mb-6" />
        
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wider text-center transition-all duration-1000"
          style={{
            fontFamily: FONTS[fontIndex],
            color: COLORS.goldLight,
            textShadow: '0 0 80px rgba(212, 165, 116, 0.06)',
            letterSpacing: '0.05em',
          }}
        >
          Happy Birthday
        </h1>
        
        <div className="w-16 h-px bg-gradient-to-r from-[#d4a574]/20 via-transparent to-[#d4a574]/20 mt-4 mb-8" />
        
        {/* Candle */}
        <Candle isLit={isCandleLit} onExtinguish={handleExtinguish} />
        
        {/* Wish */}
        <div
          ref={wishRef}
          className="text-center mt-8"
          style={{ opacity: 0 }}
        >
          <h2
            className="text-2xl md:text-4xl font-light"
            style={{
              fontFamily: FONTS[fontIndex % FONTS.length],
              color: COLORS.goldLight,
              textShadow: '0 0 100px rgba(212, 165, 116, 0.08)',
              letterSpacing: '0.05em',
            }}
          >
            ✦ May All Your Wishes Come True ✦
          </h2>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col items-center gap-3 mt-6">
          {!permission && (
            <button
              onClick={() => {}}
              className="px-6 py-2 rounded-full border border-[#d4a574]/10 text-[#d4a574]/40 hover:border-[#d4a574]/30 hover:text-[#d4a574]/70 transition-all duration-500 text-[10px] uppercase tracking-[0.3em]"
              style={{
                fontFamily: FONTS[fontIndex % FONTS.length],
              }}
            >
              🎤 Enable Microphone
            </button>
          )}
          
          {permission && isCandleLit && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-[#d4a574]/20 text-[10px] uppercase tracking-[0.3em]">
                {level > 0.5 ? '💨 Blowing...' : '🎤 Blow to extinguish'}
              </div>
              <div className="w-20 h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-150"
                  style={{
                    width: `${Math.min(level * 100, 100)}%`,
                    background: `linear-gradient(90deg, rgba(212, 165, 116, ${0.1 + level * 0.3}), rgba(212, 165, 116, ${0.2 + level * 0.4}))`,
                    opacity: level > 0.3 ? 0.6 : 0.2,
                  }}
                />
              </div>
            </div>
          )}
          
          {!isCandleLit && (
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-full border border-[#d4a574]/10 text-[#d4a574]/30 hover:border-[#d4a574]/40 hover:text-[#d4a574]/60 transition-all duration-500 text-[10px] uppercase tracking-[0.3em]"
              style={{
                fontFamily: FONTS[fontIndex % FONTS.length],
              }}
            >
              🕯️ Light Again
            </button>
          )}
        </div>
        
        {/* Bottom decorative */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-[#d4a574]/10 to-transparent" />
      </div>
    </div>
  );
};

export default Ultah;
