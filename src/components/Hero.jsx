import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Hero() {
  const heroRef = useRef(null);
  const photoContainerRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fontIndex, setFontIndex] = useState(0);
  const [isProjectorOn, setIsProjectorOn] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);
  const [svgGlow, setSvgGlow] = useState(true);

  const backgroundImages = [
    "/image1.jpeg",
    "/image2.jpeg",
    "/image3.jpeg",
    "/image9.jpeg",
    "/image5.jpeg",
    "/image6.jpeg",
    "/image7.jpeg",
    "/image8.jpeg",
  ];

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
    "'Courier New', monospace",
    "'Fira Code', monospace",
    "'JetBrains Mono', monospace",
    "'Source Code Pro', monospace",
    "'Pacifico', cursive",
    "'Lobster', cursive",
    "'Dancing Script', cursive",
    "'Playball', cursive",
    "'Great Vibes', cursive",
    "'Bebas Neue', sans-serif",
    "'Anton', sans-serif",
    "'Fjalla One', sans-serif",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fontInterval = setInterval(() => {
      setFontIndex((prevIndex) => (prevIndex + 1) % fonts.length);
    }, 300);
    return () => clearInterval(fontInterval);
  }, []);

  // EFEK LAMPU KUNING BERKEDIP JARANG (3-8 detik sekali)
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = Math.random() * 5000 + 3000; // 3-8 detik
      const blinkDuration = Math.random() * 30 + 10; // 100-400ms

      const timeoutId = setTimeout(() => {
        // Matikan lampu
        setSvgGlow(false);
        
        // Nyalakan lagi setelah blinkDuration
        setTimeout(() => {
          setSvgGlow(true);
        }, blinkDuration);
        
        // Jadwalkan kedip berikutnya
        scheduleBlink();
      }, delay);
      
      return timeoutId;
    };

    const initialTimeout = scheduleBlink();
    return () => clearTimeout(initialTimeout);
  }, []);

  // EFEK PROYEKTOR JADUL
  useEffect(() => {
    const startFastFlicker = (duration = 300) => {
      if (!isProjectorOn) return;
      
      let flickerCount = 0;
      const maxFlicks = 10;
      const flickerInterval = setInterval(() => {
        if (flickerCount >= maxFlicks) {
          clearInterval(flickerInterval);
          applyPhotoEffect(true);
          return;
        }
        const isOnPhase = (flickerCount % 2 === 0);
        applyPhotoEffect(isOnPhase);
        flickerCount++;
      }, 35);
      
      setTimeout(() => {
        clearInterval(flickerInterval);
        applyPhotoEffect(true);
      }, duration);
    };
    
    const applyGlitchEffect = (duration = 250) => {
      if (!isProjectorOn || isGlitching) return;
      setIsGlitching(true);
      
      const photoElements = document.querySelectorAll('.projector-photo');
      const photoContainer = document.querySelector('.projector-photo-container');
      
      photoElements.forEach(el => {
        el.style.transition = 'all 0.03s ease';
        el.style.filter = 'blur(9px) hue-rotate(15deg) contrast(1.5) brightness(1.2)';
        el.style.transform = 'translate(3px, -2px) scale(1.02)';
      });
      
      if (photoContainer) {
        const noiseOverlay = photoContainer.querySelector('.photo-noise');
        if (noiseOverlay) {
          noiseOverlay.style.opacity = '0.45';
        }
      }
      
      let glitchSteps = 0;
      const glitchInt = setInterval(() => {
        if (glitchSteps >= 8) {
          clearInterval(glitchInt);
          return;
        }
        const randX = (Math.random() - 0.5) * 7;
        const randY = (Math.random() - 0.5) * 5;
        photoElements.forEach(el => {
          el.style.transform = `translate(${randX}px, ${randY}px) scale(1.02)`;
          el.style.filter = `blur(9px) hue-rotate(${Math.random() * 35}deg) contrast(${1.2 + Math.random() * 0.6}) brightness(${1 + Math.random() * 0.4})`;
        });
        glitchSteps++;
      }, 40);
      
      setTimeout(() => {
        clearInterval(glitchInt);
        photoElements.forEach(el => {
          el.style.filter = 'blur(9px)';
          el.style.transform = 'scale(1.02)';
          el.style.transition = '';
        });
        if (photoContainer) {
          const noiseOverlay = photoContainer.querySelector('.photo-noise');
          if (noiseOverlay) {
            noiseOverlay.style.opacity = '0';
          }
        }
        setIsGlitching(false);
      }, duration);
    };
    
    const temporaryPowerOff = (duration = 400) => {
      setIsProjectorOn(false);
      applyPhotoEffect(false);
      
      setTimeout(() => {
        setIsProjectorOn(true);
        applyPhotoEffect(true);
      }, duration);
    };
    
    const applyPhotoEffect = (isOn) => {
      const photos = document.querySelectorAll('.projector-photo');
      const photoContainer = document.querySelector('.projector-photo-container');
      
      if (isOn) {
        photos.forEach(photo => {
          photo.style.opacity = '1';
          photo.style.filter = 'blur(9px)';
        });
        if (photoContainer) {
          photoContainer.style.opacity = '1';
        }
      } else {
        photos.forEach(photo => {
          photo.style.opacity = '0.15';
          photo.style.filter = 'blur(9px) brightness(0.3)';
        });
        if (photoContainer) {
          photoContainer.style.opacity = '0.5';
        }
      }
    };
    
    const complexProjectorEffect = () => {
      if (!isProjectorOn) return;
      
      const r = Math.random();
      if (r < 0.4) {
        startFastFlicker(280);
        setTimeout(() => {
          if (Math.random() > 0.5) applyGlitchEffect(220);
        }, 150);
      } else if (r < 0.7) {
        temporaryPowerOff(320);
        setTimeout(() => {
          if (Math.random() > 0.6) applyGlitchEffect(180);
        }, 400);
      } else {
        applyGlitchEffect(300);
        setTimeout(() => {
          if (Math.random() > 0.7) startFastFlicker(150);
        }, 320);
      }
    };
    
    let timeoutId;
    const scheduleRandomEvent = () => {
      const delay = Math.random() * 15000 + 5000;
      timeoutId = setTimeout(() => {
        if (isProjectorOn) {
          complexProjectorEffect();
        }
        scheduleRandomEvent();
      }, delay);
    };
    
    scheduleRandomEvent();
    
    const animateSpotlight = () => {
      const spotlight = document.querySelector('.photo-spotlight');
      if (!spotlight) return;
      
      const interval = setInterval(() => {
        if (!isProjectorOn) {
          if (spotlight) spotlight.style.opacity = '0.05';
          return;
        }
        
        const offsetX = Math.sin(Date.now() * 0.0015) * 3;
        const offsetY = Math.cos(Date.now() * 0.0012) * 2;
        
        if (spotlight) {
          spotlight.style.background = `radial-gradient(ellipse at ${50 + offsetX}% ${50 + offsetY}%, 
                                          rgba(255, 235, 150, 0.35) 0%, 
                                          rgba(255, 210, 80, 0.2) 40%,
                                          rgba(0,0,0,0.85) 100%)`;
        }
        
        if (isProjectorOn && Math.random() > 0.97 && spotlight) {
          spotlight.style.opacity = '0.6';
          setTimeout(() => {
            if (isProjectorOn && spotlight) {
              spotlight.style.opacity = '1';
            }
          }, 40);
        }
      }, 70);
      
      return interval;
    };
    
    const spotlightInterval = animateSpotlight();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (spotlightInterval) clearInterval(spotlightInterval);
    };
  }, [isProjectorOn, isGlitching]);

  // Animasi GSAP
  useEffect(() => {
    if (photoContainerRef.current) {
      gsap.to(photoContainerRef.current, {
        scale: 0.8,
        opacity: 0,
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom center",
          scrub: 1.5,
        }
      });
    }

    gsap.fromTo(".hero-title", 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power3.out" }
    );
    
    gsap.fromTo(".hero-subtitle", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" }
    );
    
    gsap.fromTo(".hero-line", 
      { width: 0, opacity: 0 },
      { width: 64, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
    );
    
    gsap.fromTo(".scroll-indicator", 
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 1.2, ease: "power2.out" }
    );

    gsap.fromTo(".hero-svg-left", 
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: "power3.out" }
    );
    
    gsap.fromTo(".hero-svg-right", 
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: "power3.out" }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative h-screen overflow-hidden"
    >
      <div 
        ref={photoContainerRef}
        className="absolute inset-0 flex items-center justify-center z-0"
      >
        
        {/* SVG Kiri - Kedip jarang */}
        <div className="hero-svg-left absolute left-4 md:left-28 top-1/2 -translate-y-1/2 z-20 opacity-0">
          <svg 
            width="100" 
            height="100" 
            viewBox="0 0 444 65" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 md:w-28 h-auto transition-all duration-100"
            style={{
              filter: svgGlow 
                ? 'drop-shadow(0 0 15px rgba(255, 200, 50, 0.8)) drop-shadow(0 0 30px rgba(255, 180, 30, 0.5))' 
                : 'drop-shadow(0 0 3px rgba(255, 200, 50, 0.1))',
              opacity: svgGlow ? 1 : 0.15,
              transition: 'all 0.2s ease'
            }}
          >
            <path d="M9.1 64.3V55.3H2.38419e-07V1.90735e-06H10.1V54.3H18.1V36.1H27.3V9.1H37.3V36.1H46.5V54.3H54.6V1.90735e-06H64.6V55.3H55.6V64.3H45.5V55.3H36.3V37.1H28.3V55.3H19.1V64.3H9.1ZM82.7328 64.3V55.3H73.6328V27.2H82.7328V18.1H110.933V27.2H120.133V54.3H129.233V64.3H119.133V55.3H110.933V64.3H82.7328ZM83.7328 54.3H109.933V28.1H83.7328V54.3ZM138.281 64.3V54.3H174.581V46.2H147.381V37.1H138.281V27.2H147.381V18.1H184.781V28.1H148.381V36.1H175.581V45.2H184.781V55.3H175.581V64.3H138.281ZM196.875 64.3V18.1H206.975V64.3H196.875ZM196.875 10.1V1.90735e-06H206.975V10.1H196.875ZM226.19 64.3V55.3H217.09V27.2H226.19V18.1H254.39V27.2H263.59V54.3H272.69V64.3H262.59V55.3H254.39V64.3H226.19ZM227.19 54.3H253.39V28.1H227.19V54.3ZM291.83 64.3V55.3H282.83V28.1H273.73V18.1H282.83V1.90735e-06H292.83V18.1H320.23V28.1H292.83V54.3H319.23V45.2H329.33V55.3H320.23V64.3H291.83ZM348.553 64.3V55.3H339.453V18.1H349.553V54.3H375.753V18.1H385.953V55.3H376.753V64.3H348.553ZM397.07 64.3V54.3H433.37V46.2H406.17V37.1H397.07V27.2H406.17V18.1H443.57V28.1H407.17V36.1H434.37V45.2H443.57V55.3H434.37V64.3H397.07Z" fill="#FFD700" fillOpacity={svgGlow ? 1 : 0.1}/>
          </svg>
        </div>

        {/* Container Foto */}
        <div className="projector-photo-container relative w-full max-w-2xl md:max-w-3xl h-full max-h-[70vh] md:max-h-[80vh] mx-auto my-auto">
          
          <div className="photo-spotlight absolute inset-0 pointer-events-none z-10 mix-blend-screen rounded-1xl overflow-hidden"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(ellipse at center, rgba(255,235,150,0.3) 0%, rgba(255,210,80,0.15) 40%, rgba(0,0,0,0.8) 100%)',
              transition: 'opacity 0.02s linear',
              opacity: 1,
              borderRadius: 'inherit'
            }}
          />
          
          <div className="photo-lens-flare absolute inset-0 pointer-events-none z-9 mix-blend-overlay rounded-1xl overflow-hidden"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 30% 40%, rgba(255,220,100,0.2) 0%, transparent 70%)',
              transition: 'opacity 0.05s ease',
              opacity: 0.6,
              borderRadius: 'inherit'
            }}
          />
          
          <div className="photo-noise absolute inset-0 pointer-events-none z-11 mix-blend-overlay rounded-1xl overflow-hidden"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjciIG51bU9jdGF2ZXM9IjMiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjZikiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==')`,
              backgroundRepeat: 'repeat',
              backgroundSize: '150px',
              opacity: 0,
              transition: 'opacity 0.02s',
              borderRadius: 'inherit'
            }}
          />
          
          <div className="photo-scanline absolute inset-0 pointer-events-none z-8 rounded-1xl overflow-hidden"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 6px)',
              opacity: 0.25,
              borderRadius: 'inherit'
            }}
          />
          
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              className="projector-photo absolute inset-0 transition-opacity duration-300 ease-in-out rounded-1xl overflow-hidden shadow-2xl"
              style={{
                backgroundImage: `url('${img}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: currentImageIndex === index ? 1 : 0,
                zIndex: currentImageIndex === index ? 1 : 0,
                filter: 'blur(9px)',
                transform: 'scale(1.02)',
                transition: 'all 0.03s ease'
              }}
            />
          ))}
        </div>

        {/* SVG Kanan - Kedip jarang */}
        <div className="hero-svg-right absolute right-4 md:right-28 top-1/2 -translate-y-1/2 z-20 opacity-0">
          <svg 
            width="100" 
            height="100" 
            viewBox="0 0 405 83" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 md:w-28 h-auto transition-all duration-100"
            style={{
              filter: svgGlow 
                ? 'drop-shadow(0 0 15px rgba(255, 200, 50, 0.8)) drop-shadow(0 0 30px rgba(255, 180, 30, 0.5))' 
                : 'drop-shadow(0 0 3px rgba(255, 200, 50, 0.1))',
              opacity: svgGlow ? 1 : 0.15,
              transition: 'all 0.2s ease'
            }}
          >
            <path d="M9.1 64.3V55.3H2.38419e-07V45.2H10.1V54.3H36.3V37.1H9.1V28.1H2.38419e-07V9.10003H9.1V3.24249e-05H37.3V9.10003H46.5V19.1H36.3V10.1H10.1V27.2H37.3V36.1H46.5V55.3H37.3V64.3H9.1ZM67.6938 82.4V73.4H58.5938V63.4H68.6938V72.4H94.9938V55.3H67.6938V46.2H58.5938V18.1H68.6938V45.2H94.9938V18.1H105.094V73.4H95.9938V82.4H67.6938ZM126.288 64.3V55.3H117.188V27.2H126.288V18.1H154.488V27.2H163.688V54.3H172.788V64.3H162.688V55.3H154.488V64.3H126.288ZM127.288 54.3H153.488V28.1H127.288V54.3ZM179.883 64.3V9.10003H188.983V3.24249e-05H217.183V9.10003H226.383V19.1H216.183V10.1H189.983V27.2H208.183V37.1H189.983V64.3H179.883ZM237.616 64.3V55.3H228.516V27.2H237.616V18.1H265.816V27.2H275.016V54.3H284.116V64.3H274.016V55.3H265.816V64.3H237.616ZM238.616 54.3H264.816V28.1H238.616V54.3ZM293.164 64.3V18.1H330.464V27.2H339.664V64.3H329.464V28.1H303.264V64.3H293.164ZM357.83 64.3V55.3H348.73V27.2H357.83V18.1H386.03V27.2H395.23V54.3H404.33V64.3H394.23V55.3H386.03V64.3H357.83ZM358.83 54.3H385.03V28.1H358.83V54.3Z" fill="#FFD700" fillOpacity={svgGlow ? 1 : 0.1}/>
          </svg>
        </div>
      </div>
      
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
      
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-white px-4">
        <div className="text-center">
          <div className="hero-line h-px bg-white/40 mx-auto mb-6" style={{ width: 64 }}></div>
          
          <h1 
            key={fontIndex}
            className="hero-title text-6xl md:text-7xl lg:text-8xl font-light tracking-wider transition-all duration-200"
            style={{ 
              fontFamily: fonts[fontIndex],
              transition: "all 0.2s ease"
            }}
          >
            You And Me
          </h1>
          
          <div className="hero-line h-px bg-white/40 mx-auto mt-6" style={{ width: 64 }}></div>
          
          <p 
            key={fontIndex + 100}
            className="hero-subtitle text-gray-300 text-sm uppercase tracking-wider mt-8 transition-all duration-200"
            style={{ 
              fontFamily: fonts[fontIndex],
              transition: "all 0.2s ease"
            }}
          >
            moments captured in time
          </p>
        </div>
      </div>
      
      <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 z-20">
        <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
          <div className="w-px h-2 bg-white/50 mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default Hero;