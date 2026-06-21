import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Hero() {
  const heroRef = useRef(null);
  const photoContainerRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fontIndex, setFontIndex] = useState(0);

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

  // Ganti foto setiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Ganti font setiap 3 detik
  useEffect(() => {
    const fontInterval = setInterval(() => {
      setFontIndex((prevIndex) => (prevIndex + 1) % fonts.length);
    }, 3000);
    return () => clearInterval(fontInterval);
  }, []);

  // Animasi GSAP (scroll dan fade in)
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
        
        {/* SVG Kiri - Tanpa efek kedip */}
        <div className="hero-svg-left absolute left-4 md:left-28 top-1/2 -translate-y-1/2 z-20 opacity-0">
          <svg 
            width="100" 
            height="100" 
            viewBox="0 0 444 65" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 md:w-28 h-auto"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255, 200, 50, 0.4))',
              opacity: 0.8,
            }}
          >
            <path d="M9.1 64.3V55.3H2.38419e-07V1.90735e-06H10.1V54.3H18.1V36.1H27.3V9.1H37.3V36.1H46.5V54.3H54.6V1.90735e-06H64.6V55.3H55.6V64.3H45.5V55.3H36.3V37.1H28.3V55.3H19.1V64.3H9.1ZM82.7328 64.3V55.3H73.6328V27.2H82.7328V18.1H110.933V27.2H120.133V54.3H129.233V64.3H119.133V55.3H110.933V64.3H82.7328ZM83.7328 54.3H109.933V28.1H83.7328V54.3ZM138.281 64.3V54.3H174.581V46.2H147.381V37.1H138.281V27.2H147.381V18.1H184.781V28.1H148.381V36.1H175.581V45.2H184.781V55.3H175.581V64.3H138.281ZM196.875 64.3V18.1H206.975V64.3H196.875ZM196.875 10.1V1.90735e-06H206.975V10.1H196.875ZM226.19 64.3V55.3H217.09V27.2H226.19V18.1H254.39V27.2H263.59V54.3H272.69V64.3H262.59V55.3H254.39V64.3H226.19ZM227.19 54.3H253.39V28.1H227.19V54.3ZM291.83 64.3V55.3H282.83V28.1H273.73V18.1H282.83V1.90735e-06H292.83V18.1H320.23V28.1H292.83V54.3H319.23V45.2H329.33V55.3H320.23V64.3H291.83ZM348.553 64.3V55.3H339.453V18.1H349.553V54.3H375.753V18.1H385.953V55.3H376.753V64.3H348.553ZM397.07 64.3V54.3H433.37V46.2H406.17V37.1H397.07V27.2H406.17V18.1H443.57V28.1H407.17V36.1H434.37V45.2H443.57V55.3H434.37V64.3H397.07Z" fill="#FFD700" fillOpacity="0.6"/>
          </svg>
        </div>

        {/* Container Foto - Tanpa efek proyektor */}
        <div className="projector-photo-container relative w-full max-w-2xl md:max-w-3xl h-full max-h-[70vh] md:max-h-[80vh] mx-auto my-auto">
          
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              className="projector-photo absolute inset-0 transition-opacity duration-1000 ease-in-out rounded-1xl overflow-hidden shadow-2xl"
              style={{
                backgroundImage: `url('${img}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: currentImageIndex === index ? 1 : 0,
                zIndex: currentImageIndex === index ? 1 : 0,
                filter: 'blur(2px)',
                transform: 'scale(1.02)',
              }}
            />
          ))}
        </div>

        {/* SVG Kanan - Tanpa efek kedip */}
        <div className="hero-svg-right absolute right-4 md:right-28 top-1/2 -translate-y-1/2 z-20 opacity-0">
          <svg 
            width="100" 
            height="100" 
            viewBox="0 0 405 83" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 md:w-28 h-auto"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255, 200, 50, 0.4))',
              opacity: 0.8,
            }}
          >
            <path d="M9.1 64.3V55.3H2.38419e-07V45.2H10.1V54.3H36.3V37.1H9.1V28.1H2.38419e-07V9.10003H9.1V3.24249e-05H37.3V9.10003H46.5V19.1H36.3V10.1H10.1V27.2H37.3V36.1H46.5V55.3H37.3V64.3H9.1ZM67.6938 82.4V73.4H58.5938V63.4H68.6938V72.4H94.9938V55.3H67.6938V46.2H58.5938V18.1H68.6938V45.2H94.9938V18.1H105.094V73.4H95.9938V82.4H67.6938ZM126.288 64.3V55.3H117.188V27.2H126.288V18.1H154.488V27.2H163.688V54.3H172.788V64.3H162.688V55.3H154.488V64.3H126.288ZM127.288 54.3H153.488V28.1H127.288V54.3ZM179.883 64.3V9.10003H188.983V3.24249e-05H217.183V9.10003H226.383V19.1H216.183V10.1H189.983V27.2H208.183V37.1H189.983V64.3H179.883ZM237.616 64.3V55.3H228.516V27.2H237.616V18.1H265.816V27.2H275.016V54.3H284.116V64.3H274.016V55.3H265.816V64.3H237.616ZM238.616 54.3H264.816V28.1H238.616V54.3ZM293.164 64.3V18.1H330.464V27.2H339.664V64.3H329.464V28.1H303.264V64.3H293.164ZM357.83 64.3V55.3H348.73V27.2H357.83V18.1H386.03V27.2H395.23V54.3H404.33V64.3H394.23V55.3H386.03V64.3H357.83ZM358.83 54.3H385.03V28.1H358.83V54.3Z" fill="#FFD700" fillOpacity="0.6"/>
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
