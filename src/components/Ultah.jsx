import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Ultah = () => {
  const [fontIndex, setFontIndex] = useState(0);
  const [isCandleLit, setIsCandleLit] = useState(true);
  const [isBlowing, setIsBlowing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [micPermission, setMicPermission] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [name, setName] = useState('Sayang');
  const [showWish, setShowWish] = useState(false);
  
  const candleRef = useRef(null);
  const flameRef = useRef(null);
  const glowRef = useRef(null);
  const wishRef = useRef(null);
  const containerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const fonts = [
    "'Playfair Display', serif",
    "'Georgia', serif",
    "'Times New Roman', serif",
    "'Garamond', serif",
    "'Bodoni Moda', serif",
    "'Cormorant Garamond', serif",
    "'Merriweather', serif",
    "'Lora', serif",
    "'Inter', sans-serif",
    "'Poppins', sans-serif",
    "'Montserrat', sans-serif",
    "'Open Sans', sans-serif",
    "'Roboto', sans-serif",
    "'Jost', sans-serif",
    "'Nunito', sans-serif",
    "'Quicksand', sans-serif",
    "'Raleway', sans-serif",
    "'Oswald', sans-serif",
    "'Pacifico', cursive",
    "'Lobster', cursive",
    "'Dancing Script', cursive",
    "'Great Vibes', cursive",
  ];

  const messages = [
    "Happy Birthday",
    "Wishing You All The Best",
    "Stay Blessed",
    "Keep Shining",
    "Dream Big",
    "You're Amazing",
    "Make A Wish",
  ];

  // Font rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % fonts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Initialize microphone
  const initMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      
      setMicPermission(true);
      startAudioMonitoring();
    } catch (error) {
      console.error('Mic access denied:', error);
      setMicPermission(false);
    }
  }, []);

  // Monitor audio for blow detection
  const startAudioMonitoring = useCallback(() => {
    const checkBlow = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        sum += dataArrayRef.current[i];
      }
      const average = sum / dataArrayRef.current.length;
      const level = average / 128;
      
      setAudioLevel(level);
      
      // Detect blow: high amplitude with specific frequency pattern
      if (level > 0.6 && isCandleLit && !isBlowing) {
        setIsBlowing(true);
        blowCandle();
      }
      
      if (level < 0.3 && isBlowing) {
        setIsBlowing(false);
      }
      
      animationFrameRef.current = requestAnimationFrame(checkBlow);
    };
    
    checkBlow();
  }, [isCandleLit, isBlowing]);

  // Blow candle effect
  const blowCandle = useCallback(() => {
    if (!isCandleLit) return;
    
    // Animate flame
    gsap.to(flameRef.current, {
      scaleX: 2,
      scaleY: 0.3,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setIsCandleLit(false);
        setShowWish(true);
        setShowConfetti(true);
        
        // Glow fade
        gsap.to(glowRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
        
        // Show wish with animation
        gsap.fromTo(wishRef.current,
          { scale: 0.8, opacity: 0, y: 30 },
          { 
            scale: 1, 
            opacity: 1, 
            y: 0, 
            duration: 1.2, 
            ease: "back.out(1.7)",
            delay: 0.3
          }
        );
        
        // Trigger confetti
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    });
    
    // Smoke effect
    gsap.to(flameRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power1.out",
    });
  }, [isCandleLit]);

  // Candle flame animation (elegant)
  useEffect(() => {
    if (!isCandleLit || !flameRef.current) return;
    
    const flame = flameRef.current;
    const tl = gsap.timeline({ 
      repeat: -1, 
      yoyo: true,
      ease: "sine.inOut"
    });
    
    tl.to(flame, {
      scaleX: 1.15,
      scaleY: 1.2,
      x: 2,
      duration: 0.8,
    })
    .to(flame, {
      scaleX: 0.9,
      scaleY: 0.95,
      x: -2,
      duration: 0.6,
    })
    .to(flame, {
      scaleX: 1.05,
      scaleY: 1.1,
      x: 1,
      duration: 0.7,
    });
    
    // Glow pulse
    const glowTl = gsap.timeline({ 
      repeat: -1, 
      yoyo: true,
      ease: "sine.inOut"
    });
    
    glowTl.to(glowRef.current, {
      scale: 1.2,
      opacity: 0.8,
      duration: 1.5,
    })
    .to(glowRef.current, {
      scale: 1,
      opacity: 0.4,
      duration: 1.5,
    });
    
    return () => {
      tl.kill();
      glowTl.kill();
    };
  }, [isCandleLit]);

  // Generate stars background
  useEffect(() => {
    const container = containerRef.current;
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 2 + 1;
      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: white;
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.6 + 0.2};
        animation: twinkle ${Math.random() * 4 + 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
        pointer-events: none;
      `;
      container.appendChild(star);
    }
    
    // Add keyframes for twinkle
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.5); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      style.remove();
      container.querySelectorAll('div').forEach(el => el.remove());
    };
  }, []);

  // Confetti effect (elegant)
  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    const colors = ['#d4a574', '#c9a96e', '#f5d6b3', '#ffffff', '#f0dcc0', '#e8c9a0'];
    const confetti = [];
    
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 200 + Math.random() * 400;
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity - 300;
      const rotation = Math.random() * 720 - 360;
      const size = 6 + Math.random() * 10;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 0.8;
      
      confetti.push(
        <div
          key={i}
          className="absolute"
          style={{
            left: '50%',
            top: '40%',
            width: size / 2,
            height: size,
            background: color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: 'translate(-50%, -50%) rotate(0deg)',
            animation: `confettiFall ${1.5 + Math.random() * 1.5}s ease-out ${delay}s forwards`,
            animationFillMode: 'forwards',
            opacity: 0,
            boxShadow: `0 0 10px ${color}40`,
          }}
        />
      );
    }
    
    // Add keyframes for confetti
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confettiFall {
        0% {
          opacity: 1;
          transform: translate(-50%, -50%) rotate(0deg) translate(0, 0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -50%) rotate(${Math.random() > 0.5 ? 360 : -360}deg) 
                     translate(${Math.random() * 600 - 300}px, ${Math.random() * 600 + 200}px) 
                     scale(0.3);
        }
      }
    `;
    document.head.appendChild(style);
    
    return <div className="confetti-container absolute inset-0 pointer-events-none z-50">{confetti}</div>;
  };

  // Balloons
  const renderBalloons = () => {
    const balloons = [];
    const colors = ['#d4a574', '#c9a96e', '#f5d6b3', '#ffffff', '#e8d5b5'];
    
    for (let i = 0; i < 12; i++) {
      const x = 5 + Math.random() * 90;
      const y = 10 + Math.random() * 30;
      const size = 40 + Math.random() * 40;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 3;
      const duration = 4 + Math.random() * 3;
      
      balloons.push(
        <div
          key={i}
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size * 1.2,
            background: `radial-gradient(circle at 30% 30%, ${color}cc, ${color}66)`,
            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
            boxShadow: `inset -5px -5px 20px rgba(0,0,0,0.1), 
                       inset 5px 5px 20px rgba(255,255,255,0.2),
                       0 0 30px ${color}30`,
            transform: `scale(${0.6 + Math.random() * 0.4}) rotate(${Math.random() * 10 - 5}deg)`,
            animation: `balloonFloat ${duration}s ease-in-out ${delay}s infinite`,
            pointerEvents: 'none',
            opacity: 0.6,
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: -15,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 2,
              height: 25,
              background: 'rgba(200, 180, 160, 0.3)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -18,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 12,
              height: 6,
              background: color,
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              opacity: 0.7,
            }}
          />
        </div>
      );
    }
    
    // Add keyframes for balloons
    const style = document.createElement('style');
    style.textContent = `
      @keyframes balloonFloat {
        0%, 100% { transform: translateY(0px) rotate(-2deg); }
        25% { transform: translateY(-20px) rotate(2deg); }
        50% { transform: translateY(-10px) rotate(-1deg); }
        75% { transform: translateY(-25px) rotate(1deg); }
      }
    `;
    document.head.appendChild(style);
    
    return balloons;
  };

  // Reset candle (for testing)
  const resetCandle = useCallback(() => {
    setIsCandleLit(true);
    setShowWish(false);
    setShowConfetti(false);
    setAudioLevel(0);
    
    if (flameRef.current) {
      gsap.to(flameRef.current, {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.5,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    
    if (wishRef.current) {
      gsap.to(wishRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(wishRef.current, { scale: 0.8 });
        }
      });
    }
  }, []);

  // Init mic on mount
  useEffect(() => {
    initMicrophone();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [initMicrophone]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a]"
    >
      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none" />
      
      {/* Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none" />
      
      {/* Balloons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {renderBalloons()}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        
        {/* Gold decorative line */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4a574] to-transparent mb-8" />
        
        {/* Title with rotating font */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wider text-center"
          style={{
            fontFamily: fonts[fontIndex],
            background: 'linear-gradient(135deg, #f5e6d3 0%, #d4a574 50%, #c9a96e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 30px rgba(212, 165, 116, 0.2))',
            transition: 'all 0.5s ease',
          }}
        >
          Happy Birthday
        </h1>
        
        <div className="w-24 h-px bg-gradient-to-r from-[#d4a574] via-transparent to-[#d4a574] mt-4 mb-2" />
        
        <p
          className="text-[#c9a96e] text-sm md:text-base uppercase tracking-[0.3em] mt-2"
          style={{
            fontFamily: fonts[fontIndex % fonts.length],
            letterSpacing: '0.3em',
          }}
        >
          {messages[Math.floor(Date.now() / 3000) % messages.length]}
        </p>
        
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4a574] to-transparent mt-6 mb-12" />

        {/* Cake and Candle Section */}
        <div className="relative flex flex-col items-center mb-12">
          {/* Cake */}
          <div className="relative w-64 h-40 md:w-80 md:h-48">
            {/* Cake bottom layer */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 md:w-80 h-20 rounded-t-2xl rounded-b-lg"
              style={{
                background: 'linear-gradient(180deg, #8B7355 0%, #6B5B4B 50%, #5C4A3A 100%)',
                boxShadow: 'inset 0 -10px 30px rgba(0,0,0,0.3), 0 10px 40px rgba(0,0,0,0.2)',
              }}
            >
              {/* Decorative icing */}
              <div className="absolute -top-3 left-0 right-0 flex justify-center gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-4 rounded-full"
                    style={{
                      background: 'linear-gradient(180deg, #f5e6d3 0%, #e8d5b5 100%)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Cake top layer */}
            <div 
              className="absolute bottom-16 left-1/2 -translate-x-1/2 w-52 md:w-64 h-16 rounded-t-2xl rounded-b-lg"
              style={{
                background: 'linear-gradient(180deg, #A0845C 0%, #8B7355 50%, #7A6345 100%)',
                boxShadow: 'inset 0 -10px 30px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.2)',
              }}
            >
              {/* Decorative icing top */}
              <div className="absolute -top-3 left-0 right-0 flex justify-center gap-3">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-3 rounded-full"
                    style={{
                      background: 'linear-gradient(180deg, #f0dcc0 0%, #e0ccb0 100%)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Candle */}
            <div 
              ref={candleRef}
              className="absolute bottom-44 left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              {/* Candle body */}
              <div 
                className="w-4 h-16 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, #f5e6d3 0%, #e8d5b5 30%, #d4a574 60%, #c9a96e 100%)',
                  boxShadow: '0 4px 20px rgba(212, 165, 116, 0.3)',
                }}
              >
                {/* Candle stripes */}
                <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a574] to-transparent opacity-30" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a574] to-transparent opacity-20" />
              </div>
              
              {/* Glow effect */}
              <div
                ref={glowRef}
                className="absolute -bottom-10 -left-20 -right-20 -top-20 rounded-full"
                style={{
                  background: isCandleLit 
                    ? 'radial-gradient(circle, rgba(212, 165, 116, 0.15) 0%, rgba(212, 165, 116, 0.05) 50%, transparent 70%)'
                    : 'transparent',
                  filter: 'blur(30px)',
                  pointerEvents: 'none',
                  transition: 'all 0.8s ease',
                }}
              />
              
              {/* Flame */}
              {isCandleLit && (
                <div 
                  ref={flameRef}
                  className="absolute -top-8 left-1/2 -translate-x-1/2"
                  style={{
                    transformOrigin: 'bottom center',
                  }}
                >
                  {/* Outer flame */}
                  <div 
                    className="absolute -top-8 left-1/2 -translate-x-1/2"
                    style={{
                      width: '20px',
                      height: '30px',
                      background: 'radial-gradient(ellipse at bottom, #ffd700 0%, #ff8c00 40%, #ff4500 70%, transparent 100%)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'blur(1px)',
                      animation: 'flameFlicker 1.5s ease-in-out infinite',
                      boxShadow: '0 0 40px rgba(255, 200, 50, 0.4), 0 0 80px rgba(255, 150, 0, 0.2)',
                    }}
                  />
                  
                  {/* Inner flame */}
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2"
                    style={{
                      width: '10px',
                      height: '18px',
                      background: 'radial-gradient(ellipse at bottom, #ffffff 0%, #ffd700 40%, #ff8c00 100%)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'blur(0.5px)',
                      animation: 'flameFlicker 1s ease-in-out infinite 0.3s',
                    }}
                  />
                  
                  {/* Core flame */}
                  <div 
                    className="absolute -top-2 left-1/2 -translate-x-1/2"
                    style={{
                      width: '4px',
                      height: '8px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      filter: 'blur(1px)',
                      animation: 'flameFlicker 0.8s ease-in-out infinite 0.5s',
                    }}
                  />
                </div>
              )}
              
              {/* Smoke when blown */}
              {!isCandleLit && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-50">
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(200, 180, 160, 0.3) 0%, transparent 100%)',
                      animation: 'smokeRise 2s ease-out forwards',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Wish text */}
          <div
            ref={wishRef}
            className="text-center mt-16 opacity-0"
          >
            <h2
              className="text-3xl md:text-5xl font-light"
              style={{
                fontFamily: fonts[fontIndex % fonts.length],
                background: 'linear-gradient(135deg, #f5e6d3 0%, #d4a574 50%, #c9a96e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 40px rgba(212, 165, 116, 0.3))',
              }}
            >
              Happy Birthday, {name}! 🎉
            </h2>
            <p
              className="text-[#c9a96e] text-sm md:text-base mt-3 opacity-60"
              style={{
                fontFamily: fonts[fontIndex % fonts.length],
                letterSpacing: '0.2em',
              }}
            >
              May all your wishes come true
            </p>
          </div>
        </div>

        {/* Mic status and controls */}
        <div className="flex flex-col items-center gap-4 mt-4">
          {!micPermission && (
            <button
              onClick={initMicrophone}
              className="px-6 py-3 rounded-full border border-[#d4a574]/30 text-[#d4a574] hover:border-[#d4a574]/60 hover:bg-[#d4a574]/10 transition-all duration-300 text-sm uppercase tracking-wider"
              style={{
                fontFamily: fonts[fontIndex % fonts.length],
              }}
            >
              🎤 Enable Microphone to Blow
            </button>
          )}
          
          {micPermission && isCandleLit && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-[#d4a574] text-xs uppercase tracking-widest opacity-50">
                {audioLevel > 0.3 ? '💨 Blowing...' : '🎤 Blow to extinguish'}
              </div>
              <div className="w-32 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d4a574] to-[#c9a96e] rounded-full transition-all duration-100"
                  style={{
                    width: `${Math.min(audioLevel * 100, 100)}%`,
                    opacity: audioLevel > 0.3 ? 1 : 0.3,
                  }}
                />
              </div>
            </div>
          )}
          
          {!isCandleLit && (
            <button
              onClick={resetCandle}
              className="px-6 py-3 rounded-full border border-[#d4a574]/30 text-[#d4a574] hover:border-[#d4a574]/60 hover:bg-[#d4a574]/10 transition-all duration-300 text-sm uppercase tracking-wider"
              style={{
                fontFamily: fonts[fontIndex % fonts.length],
              }}
            >
              🕯️ Light Again
            </button>
          )}
        </div>

        {/* Decorative bottom line */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[#d4a574]/20 to-transparent" />
      </div>

      {/* Confetti */}
      {renderConfetti()}

      {/* Flame animation keyframes */}
      <style>{`
        @keyframes flameFlicker {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1, 0.95) rotate(2deg); }
          50% { transform: scale(0.95, 1.05) rotate(-2deg); }
          75% { transform: scale(1.05, 0.98) rotate(1deg); }
        }
        
        @keyframes smokeRise {
          0% { transform: translateY(0) scale(1); opacity: 0.5; }
          100% { transform: translateY(-100px) scale(3); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Ultah;
