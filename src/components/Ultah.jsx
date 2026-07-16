import React, { useRef, useEffect, useState, useCallback, useMemo, memo } from 'react';
import { gsap } from 'gsap';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const CONFIG = {
  fonts: [
    "'Playfair Display', serif",
    "'Cormorant Garamond', serif",
    "'Bodoni Moda', serif",
    "'Georgia', serif",
  ],
  colors: {
    gold: '#d4a574',
    goldLight: '#f5e6d3',
    goldDark: '#c9a96e',
    cream: '#f0dcc0',
    warm: '#e8d5b5',
    background: '#0a0a0a',
    surface: '#111111',
  },
  animation: {
    duration: {
      slow: 2.5,
      medium: 1.5,
      fast: 0.8,
    },
    easing: {
      smooth: 'power2.inOut',
      elegant: 'power3.out',
      dramatic: 'power4.out',
    },
  },
  microphone: {
    threshold: 0.65,
    requiredSamples: 4,
    smoothing: 0.6,
  },
};

// ============================================
// HOOKS
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
      audioContextRef.current.close().catch(console.warn);
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
      analyser.smoothingTimeConstant = CONFIG.microphone.smoothing;
      
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
        
        // Calculate RMS for more accurate volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const normalizedLevel = Math.min(rms / 0.5, 1);
        
        setLevel(normalizedLevel);
        
        // Blow detection with debounce
        if (isActive && normalizedLevel > CONFIG.microphone.threshold) {
          sampleCountRef.current += 1;
          if (sampleCountRef.current >= CONFIG.microphone.requiredSamples) {
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
      console.warn('Microphone initialization failed:', error);
      setPermission(false);
    }
  }, [cleanup, onBlow, isActive]);

  useEffect(() => {
    init();
    return cleanup;
  }, [init, cleanup]);

  return { permission, level };
};

const useParticles = (containerRef, count = 80) => {
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const size = 1 + Math.random() * 2;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = 15 + Math.random() * 20;
      const delay = Math.random() * 10;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(212, 165, 116, ${0.1 + Math.random() * 0.2});
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        pointer-events: none;
        filter: blur(${Math.random() * 0.5}px);
        animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
        opacity: ${0.1 + Math.random() * 0.3};
      `;
      
      container.appendChild(particle);
      particles.push(particle);
    }
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% { 
          transform: translate(0, 0) scale(1);
          opacity: ${0.1 + Math.random() * 0.2};
        }
        25% { 
          transform: translate(${10 + Math.random() * 20}px, ${-15 + Math.random() * 30}px) scale(1.2);
          opacity: ${0.2 + Math.random() * 0.3};
        }
        50% { 
          transform: translate(${-5 + Math.random() * 20}px, ${-25 + Math.random() * 20}px) scale(0.8);
          opacity: ${0.05 + Math.random() * 0.2};
        }
        75% { 
          transform: translate(${15 + Math.random() * 15}px, ${-10 + Math.random() * 25}px) scale(1.1);
          opacity: ${0.15 + Math.random() * 0.25};
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      particles.forEach(p => p.remove());
      style.remove();
    };
  }, [containerRef, count]);
};

// ============================================
// COMPONENTS
// ============================================

const AmbientGlow = memo(({ isLit, intensity = 1 }) => {
  const glowRef = useRef(null);
  
  useEffect(() => {
    if (!glowRef.current) return;
    
    const glow = glowRef.current;
    
    if (isLit) {
      gsap.to(glow, {
        opacity: 0.15 * intensity,
        scale: 1.2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    } else {
      gsap.to(glow, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out',
      });
    }
    
    return () => {
      gsap.killTweensOf(glow);
    };
  }, [isLit, intensity]);
  
  return (
    <div
      ref={glowRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(212, 165, 116, 0.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
        opacity: 0,
      }}
    />
  );
});

AmbientGlow.displayName = 'AmbientGlow';

const Candle = memo(({ isLit, onExtinguish }) => {
  const candleRef = useRef(null);
  const flameRef = useRef(null);
  const innerFlameRef = useRef(null);
  const coreFlameRef = useRef(null);
  
  // Realistic flame animation
  useEffect(() => {
    if (!isLit || !flameRef.current) return;
    
    const flame = flameRef.current;
    const innerFlame = innerFlameRef.current;
    const coreFlame = coreFlameRef.current;
    
    // Create natural flame movement using multiple overlapping animations
    const createFlameAnimation = (element, config) => {
      const tl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      
      tl.to(element, {
        scaleX: config.scaleX || 1.1,
        scaleY: config.scaleY || 1.15,
        x: config.x || 2,
        duration: config.duration || 0.8 + Math.random() * 0.4,
      })
      .to(element, {
        scaleX: config.scaleX2 || 0.9,
        scaleY: config.scaleY2 || 0.95,
        x: config.x2 || -2,
        duration: config.duration2 || 0.6 + Math.random() * 0.3,
      })
      .to(element, {
        scaleX: config.scaleX3 || 1.05,
        scaleY: config.scaleY3 || 1.08,
        x: config.x3 || 1,
        duration: config.duration3 || 0.7 + Math.random() * 0.3,
      });
      
      return tl;
    };
    
    const flameTL = createFlameAnimation(flame, {
      scaleX: 1.12,
      scaleY: 1.18,
      x: 3,
      duration: 0.9,
      scaleX2: 0.88,
      scaleY2: 0.92,
      x2: -3,
      duration2: 0.7,
      scaleX3: 1.06,
      scaleY3: 1.1,
      x3: 1.5,
      duration3: 0.8,
    });
    
    const innerTL = createFlameAnimation(innerFlame, {
      scaleX: 1.15,
      scaleY: 1.12,
      x: 1.5,
      duration: 0.7,
      scaleX2: 0.85,
      scaleY2: 0.9,
      x2: -1.5,
      duration2: 0.6,
      scaleX3: 1.08,
      scaleY3: 1.05,
      x3: 0.8,
      duration3: 0.7,
    });
    
    const coreTL = createFlameAnimation(coreFlame, {
      scaleX: 1.08,
      scaleY: 1.1,
      x: 1,
      duration: 0.6,
      scaleX2: 0.92,
      scaleY2: 0.95,
      x2: -1,
      duration2: 0.5,
      scaleX3: 1.04,
      scaleY3: 1.06,
      x3: 0.5,
      duration3: 0.6,
    });
    
    return () => {
      flameTL.kill();
      innerTL.kill();
      coreTL.kill();
    };
  }, [isLit]);
  
  // Extinguish animation
  const handleExtinguish = useCallback(() => {
    if (!isLit) return;
    
    const flame = flameRef.current;
    const innerFlame = innerFlameRef.current;
    const coreFlame = coreFlameRef.current;
    const candle = candleRef.current;
    
    // Dramatic flame death
    const tl = gsap.timeline({
      onComplete: onExtinguish,
    });
    
    tl.to(flame, {
      scaleX: 1.8,
      scaleY: 0.2,
      opacity: 0,
      y: -30,
      duration: 0.6,
      ease: 'power2.in',
    })
    .to(innerFlame, {
      scaleX: 1.5,
      scaleY: 0.1,
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.in',
    }, '-=0.3')
    .to(coreFlame, {
      scaleX: 1.3,
      scaleY: 0.05,
      opacity: 0,
      y: -15,
      duration: 0.4,
      ease: 'power2.in',
    }, '-=0.2')
    .to(candle, {
      opacity: 0.6,
      duration: 0.3,
      ease: 'power2.out',
    }, '-=0.1');
    
  }, [isLit, onExtinguish]);
  
  // Expose extinguish method
  useEffect(() => {
    if (isLit && onExtinguish) {
      // @ts-ignore - attach method for parent
      if (candleRef.current) {
        candleRef.current.extinguish = handleExtinguish;
      }
    }
  }, [isLit, onExtinguish, handleExtinguish]);
  
  return (
    <div ref={candleRef} className="relative flex flex-col items-center">
      {/* Candle body */}
      <div 
        className="relative w-3 h-20 rounded-full"
        style={{
          background: 'linear-gradient(180deg, #f5e6d3 0%, #e8d5b5 30%, #d4a574 60%, #c9a96e 100%)',
          boxShadow: '0 4px 30px rgba(212, 165, 116, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Wax drip details */}
        <div className="absolute -left-0.5 top-1/4 w-1 h-3 rounded-full bg-[#f5e6d3]/20" />
        <div className="absolute -right-0.5 top-1/3 w-0.5 h-2 rounded-full bg-[#f5e6d3]/15" />
      </div>
      
      {/* Flame - positioned precisely on top */}
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
              boxShadow: '0 0 60px rgba(255, 200, 50, 0.25), 0 0 120px rgba(255, 150, 0, 0.08)',
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
      
      {/* Smoke particles when extinguished */}
      {!isLit && (
        <>
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 4 + i * 2,
                  height: 4 + i * 2,
                  background: 'radial-gradient(circle, rgba(200, 180, 160, 0.15), transparent)',
                  left: `${-10 + i * 5}px`,
                  top: `${-10 - i * 8}px`,
                  animation: `smokeRise ${1.5 + i * 0.3}s ease-out ${i * 0.15}s forwards`,
                  opacity: 0,
                }}
              />
            ))}
          </div>
          <style>{`
            @keyframes smokeRise {
              0% { opacity: 0.4; transform: translateY(0) scale(0.5); }
              100% { opacity: 0; transform: translateY(-80px) scale(2); }
            }
          `}</style>
        </>
      )}
    </div>
  );
});

Candle.displayName = 'Candle';

const Balloon = memo(({ position, delay, size, color, index }) => {
  const balloonRef = useRef(null);
  
  useEffect(() => {
    if (!balloonRef.current) return;
    
    const balloon = balloonRef.current;
    const duration = 12 + (index % 3) * 2;
    const floatDistance = 15 + (index % 5) * 3;
    const swayDistance = 8 + (index % 4) * 2;
    
    // Natural floating animation with wind effect
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: delay,
    });
    
    tl.to(balloon, {
      y: -floatDistance,
      duration: duration * 0.35,
      ease: 'sine.inOut',
    })
    .to(balloon, {
      x: swayDistance,
      duration: duration * 0.3,
      ease: 'sine.inOut',
    }, 0)
    .to(balloon, {
      y: 0,
      duration: duration * 0.35,
      ease: 'sine.inOut',
    })
    .to(balloon, {
      x: -swayDistance,
      duration: duration * 0.3,
      ease: 'sine.inOut',
    }, duration * 0.35)
    .to(balloon, {
      y: -floatDistance * 0.7,
      duration: duration * 0.3,
      ease: 'sine.inOut',
    }, duration * 0.65);
    
    // Slight rotation for realism
    gsap.to(balloon, {
      rotation: 1.5,
      duration: duration * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    
    return () => {
      tl.kill();
      gsap.killTweensOf(balloon);
    };
  }, [delay, index]);
  
  return (
    <div
      ref={balloonRef}
      className="absolute pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: size,
        height: size * 1.25,
        opacity: 0.15 + (index % 3) * 0.05,
        transform: `scale(${0.7 + (index % 4) * 0.05})`,
      }}
    >
      <div 
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${color} 0%, transparent 100%)`,
          border: '1px solid rgba(212, 165, 116, 0.03)',
          boxShadow: 'inset -8px -8px 30px rgba(0,0,0,0.02), inset 8px 8px 30px rgba(255,255,255,0.03)',
        }}
      >
        {/* String */}
        <div 
          className="absolute bottom-[-20px] left-1/2 -translate-x-1/2"
          style={{
            width: 1,
            height: 18,
            background: 'linear-gradient(180deg, rgba(212, 165, 116, 0.1), transparent)',
          }}
        />
      </div>
    </div>
  );
});

Balloon.displayName = 'Balloon';

const Balloons = memo(() => {
  const balloons = useMemo(() => {
    const colors = [
      'rgba(212, 165, 116, 0.06)',
      'rgba(200, 180, 160, 0.04)',
      'rgba(180, 160, 140, 0.03)',
      'rgba(240, 220, 200, 0.04)',
    ];
    
    const positions = [
      { x: 4, y: 12 }, { x: 93, y: 10 },
      { x: 2, y: 38 }, { x: 95, y: 35 },
      { x: 6, y: 62 }, { x: 91, y: 58 },
      { x: 10, y: 85 }, { x: 87, y: 82 },
      { x: 18, y: 25 }, { x: 79, y: 22 },
      { x: 14, y: 72 }, { x: 83, y: 70 },
    ];
    
    return positions.map((pos, i) => ({
      ...pos,
      delay: i * 0.6,
      size: 35 + (i % 3) * 12,
      color: colors[i % colors.length],
      index: i,
    }));
  }, []);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {balloons.map((props, i) => (
        <Balloon key={i} {...props} />
      ))}
    </div>
  );
});

Balloons.displayName = 'Balloons';

// ============================================
// MAIN COMPONENT
// ============================================

const Ultah = () => {
  const [isCandleLit, setIsCandleLit] = useState(true);
  const [showWish, setShowWish] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const containerRef = useRef(null);
  const wishRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ambientRef = useRef(null);
  
  const fontIndex = useFontRotation(CONFIG.fonts);
  
  // Handle candle extinguish
  const handleExtinguish = useCallback(() => {
    setIsCandleLit(false);
    setShowWish(true);
    setHasInteracted(true);
  }, []);
  
  // Microphone hook
  const { permission, level } = useMicrophone(() => {
    if (isCandleLit) {
      const candleElement = document.querySelector('[data-candle]');
      if (candleElement && candleElement.extinguish) {
        candleElement.extinguish();
      }
    }
  }, isCandleLit);
  
  // Particles
  useParticles(containerRef, 60);
  
  // Wish animation
  useEffect(() => {
    if (!showWish || !wishRef.current) return;
    
    const wish = wishRef.current;
    
    // Dramatic reveal
    const tl = gsap.timeline({
      defaults: {
        ease: CONFIG.animation.easing.dramatic,
      },
    });
    
    tl.fromTo(wish,
      { 
        opacity: 0, 
        y: 40,
        scale: 0.92,
        filter: 'blur(12px)',
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.8,
      }
    )
    .fromTo(wish.querySelector('.wish-line'),
      { width: 0, opacity: 0 },
      { width: '100%', opacity: 1, duration: 1.2, ease: 'power2.inOut' },
      '-=1.2'
    )
    .fromTo(wish.querySelector('.wish-subtitle'),
      { opacity: 0, y: 15 },
      { opacity: 0.6, y: 0, duration: 1 },
      '-=0.8'
    );
    
    // Sparkle particles on wish reveal
    const sparkles = wish.querySelectorAll('.sparkle');
    sparkles.forEach((sparkle, i) => {
      gsap.fromTo(sparkle,
        { 
          opacity: 0, 
          scale: 0,
          x: 0,
          y: 0,
        },
        {
          opacity: 1,
          scale: 1,
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 80 - 20,
          duration: 1.5 + Math.random(),
          delay: 0.5 + i * 0.1,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(sparkle, {
              opacity: 0,
              duration: 1,
              delay: 1 + Math.random() * 2,
            });
          },
        }
      );
    });
    
    return () => {
      tl.kill();
    };
  }, [showWish]);
  
  // Reset functionality
  const handleReset = useCallback(() => {
    setIsCandleLit(true);
    setShowWish(false);
    setHasInteracted(false);
    
    if (wishRef.current) {
      gsap.set(wishRef.current, { 
        opacity: 0, 
        y: 40,
        scale: 0.92,
        filter: 'blur(12px)',
      });
    }
    
    // Reset candle via ref if available
    const candleElement = document.querySelector('[data-candle]');
    if (candleElement) {
      // Recreate flame via state change
      // The candle will re-render with isLit=true
    }
  }, []);
  
  // Cinematic ambient overlay
  useEffect(() => {
    if (!ambientRef.current) return;
    
    const ambient = ambientRef.current;
    
    // Subtle breathing light
    gsap.to(ambient, {
      opacity: 0.6,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    
    return () => {
      gsap.killTweensOf(ambient);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, #141414 0%, #0a0a0a 100%)
        `,
      }}
    >
      {/* Ambient glow */}
      <div
        ref={ambientRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(212, 165, 116, 0.03) 0%, transparent 70%)',
          opacity: 0.3,
        }}
      />
      
      <AmbientGlow isLit={isCandleLit} intensity={0.5} />
      
      <Balloons />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        
        {/* Decorative line */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4a574]/20 to-transparent mb-6" />
        
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wider text-center transition-all duration-1000"
          style={{
            fontFamily: CONFIG.fonts[fontIndex],
            color: CONFIG.colors.goldLight,
            textShadow: '0 0 80px rgba(212, 165, 116, 0.06)',
            letterSpacing: '0.05em',
          }}
        >
          Happy Birthday
        </h1>
        
        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-[#d4a574]/30 text-xs uppercase tracking-[0.4em] mt-3"
          style={{
            fontFamily: CONFIG.fonts[fontIndex % CONFIG.fonts.length],
            letterSpacing: '0.4em',
          }}
        >
          Celebrate the moment
        </p>
        
        <div className="w-16 h-px bg-gradient-to-r from-[#d4a574]/20 via-transparent to-[#d4a574]/20 mt-4 mb-8" />
        
        {/* Candle */}
        <div className="relative mb-8">
          <Candle 
            isLit={isCandleLit} 
            onExtinguish={handleExtinguish}
          />
        </div>
        
        {/* Wish */}
        <div
          ref={wishRef}
          className="text-center opacity-0"
          style={{ filter: 'blur(12px)' }}
        >
          <div className="wish-line h-px bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent mx-auto mb-4" style={{ width: 0, opacity: 0 }} />
          
          <h2
            className="text-2xl md:text-4xl font-light"
            style={{
              fontFamily: CONFIG.fonts[fontIndex % CONFIG.fonts.length],
              color: CONFIG.colors.goldLight,
              textShadow: '0 0 100px rgba(212, 165, 116, 0.08)',
              letterSpacing: '0.05em',
            }}
          >
            ✦ May All Your Wishes Come True ✦
          </h2>
          
          <p className="wish-subtitle text-[#d4a574]/20 text-xs uppercase tracking-[0.4em] mt-3 opacity-0">
            A beautiful journey awaits
          </p>
          
          {/* Sparkle particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="sparkle absolute pointer-events-none"
              style={{
                width: 2,
                height: 2,
                background: '#d4a574',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                opacity: 0,
                boxShadow: '0 0 6px rgba(212, 165, 116, 0.3)',
              }}
            />
          ))}
        </div>
        
        {/* Controls */}
        <div className="flex flex-col items-center gap-3 mt-6">
          {!permission && !hasInteracted && (
            <button
              onClick={() => {
                // Microphone will be initialized by the hook
                setHasInteracted(true);
              }}
              className="px-6 py-2 rounded-full border border-[#d4a574]/10 text-[#d4a574]/40 hover:border-[#d4a574]/30 hover:text-[#d4a574]/70 transition-all duration-500 text-[10px] uppercase tracking-[0.3em]"
              style={{
                fontFamily: CONFIG.fonts[fontIndex % CONFIG.fonts.length],
              }}
            >
              🎤 Enable Microphone
            </button>
          )}
          
          {permission && isCandleLit && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-[#d4a574]/20 text-[10px] uppercase tracking-[0.3em] transition-all duration-300">
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
                fontFamily: CONFIG.fonts[fontIndex % CONFIG.fonts.length],
              }}
            >
              🕯️ Light Again
            </button>
          )}
        </div>
        
        {/* Bottom decorative */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-[#d4a574]/10 to-transparent" />
        
        {/* Version watermark */}
        <div className="absolute bottom-8 right-8 text-[#d4a574]/5 text-[8px] tracking-[0.2em] uppercase select-none">
          ✦ Cinematic Edition ✦
        </div>
      </div>
    </div>
  );
};

export default Ultah;
