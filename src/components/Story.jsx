import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaRegHeart, FaHeart, FaCalendarAlt, FaQuoteLeft, FaBookOpen } from 'react-icons/fa';
import { ceritaData } from '../data/ceritaData';

gsap.registerPlugin(ScrollTrigger);

function Story() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Animasi parallax untuk setiap container gambar
    cardsRef.current.forEach((container) => {
      if (!container) return;
      
      const img = container.querySelector('img');
      if (!img) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          scrub: true,
          start: "top bottom",
          end: "bottom top",
        }
      });

      tl.fromTo(img, 
        { yPercent: -15, scale: 1.2 },
        { yPercent: 15, scale: 1.2, ease: 'none' }
      );
    });

    // Animasi text muncul saat scroll
    gsap.utils.toArray('.story-text').forEach((text, i) => {
      gsap.fromTo(text,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: text,
            start: "top 80%",
            end: "top 50%",
            scrub: 0.5,
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Gambar untuk setiap chapter (ganti dengan gambar kamu)
  const chapterImages = [
    "/image1.jpeg",
    "/Chat.png",
    "/image2.jpeg",
    "/image9.jpeg",
  ];

  // Warna gradient untuk setiap chapter
  const chapterColors = [
    "from-amber-500/20",
    "from-blue-500/20",
    "from-emerald-500/20",
    "from-rose-500/20",
  ];

  return (
    <div ref={sectionRef} id="story" className="relative bg-black py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/30 to-black pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        
        {/* Section Title */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wider mb-4">
            Our Story
          </h2>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
          <p className="text-gray-400 text-sm md:text-base mt-4 max-w-2xl mx-auto">
            Perjalanan cinta yang dimulai dari tak sengaja menjadi tak tergantikan
          </p>
        </div>

        {/* Stories dari ceritaData */}
        {ceritaData.map((story, index) => (
          <div 
            key={story.id}
            className="mb-32 md:mb-48 last:mb-0"
          >
            <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}>
              
              {/* Gambar dengan efek parallax */}
              <div className="w-full md:w-1/2">
                <div 
                  ref={el => cardsRef.current[index] = el}
                  className="img-container relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl"
                  style={{ paddingTop: '80%' }}
                >
                  <img 
                    src={chapterImages[index % chapterImages.length]}
                    alt={story.title}
                    className="absolute top-0 left-1/2 w-auto h-full object-cover"
                    style={{ transform: 'translateX(-50%) scale(1.2)' }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${chapterColors[index % chapterColors.length]} to-transparent opacity-30`}></div>
                  
                  {/* Year Badge */}
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md rounded-full px-3 py-1">
                    <span className="text-white/80 text-xs font-mono">{story.year}</span>
                  </div>
                </div>
              </div>
              
              {/* Text content */}
              <div className="w-full md:w-1/2 story-text">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                  
                  {/* Title & Badge */}
                  <div className="mb-4">
                    <span className="text-xs text-pink-400 uppercase tracking-wider">
                      Chapter {String(story.id).padStart(2, '0')}
                    </span>
                    <h3 className="text-2xl md:text-3xl text-white font-light mt-1">
                      {story.title}
                    </h3>
                  </div>
                  
                  {/* Year */}
                  <div className="flex items-center gap-2 mb-6 text-gray-400 text-sm">
                    <FaCalendarAlt size={12} />
                    <span>{story.year}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="text-gray-300 leading-relaxed space-y-4">
                    {story.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-sm md:text-base">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                  
                  {/* Quote/Heart decoration */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-pink-500/40">
                      <FaHeart size={12} />
                      <FaHeart size={10} />
                      <FaHeart size={8} />
                      <span className="text-xs text-gray-500 ml-2">kenangan indah</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Closing Message */}
        <div className="text-center mt-24 pt-12 border-t border-white/10">
          <p className="text-gray-300 text-lg font-light">
            Dan masih banyak cerita yang akan kita tulis bersama...
          </p>
          <p className="text-gray-500 text-sm mt-4 uppercase tracking-wider">
            to be continued...
          </p>
        </div>
        
      </div>
    </div>
  );
}

export default Story;