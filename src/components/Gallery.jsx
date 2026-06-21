import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { memories } from '../data/galleryData';

function Gallery() {
  const galleryRefs = useRef([]);
  const sectionRef = useRef(null);
  const [likedItems, setLikedItems] = useState({});

  useEffect(() => {
    // Animasi untuk setiap item gallery
    galleryRefs.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(item,
          { 
            y: 60, 
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "top 60%",
              toggleActions: "play none none none",
              once: true
            }
          }
        );
      }
    });

    // Animasi judul section
    if (sectionRef.current) {
      gsap.fromTo(sectionRef.current.querySelector('.gallery-title'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleLike = (id, e) => {
    e.stopPropagation();
    setLikedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div ref={sectionRef} className="py-24 px-4 md:px-8 bg-gradient-to-b from-transparent via-black/50 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 gallery-title">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/20"></div>
              <h2 className="text-3xl md:text-4xl font-light text-white tracking-[0.15em]">
                Memories
              </h2>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/20"></div>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-[0.3em]">
              a collection of moments we treasure
            </p>
          </div>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {memories.map((memory, index) => (
            <div
              key={memory.id}
              ref={el => galleryRefs.current[index] = el}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-900/50 cursor-pointer opacity-0 border border-white/5 hover:border-white/20 transition-all duration-500"
            >
              {/* Image */}
              <img 
                src={memory.image}
                alt={memory.title}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
              </div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="space-y-2">
                  <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                    {memory.category}
                  </p>
                  <h3 className="text-xl text-white font-light tracking-wide">
                    {memory.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {memory.description}
                  </p>
                  
                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(memory.id, e)}
                    className="mt-3 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group/like"
                  >
                    {likedItems[memory.id] ? (
                      <FaHeart className="text-red-500 text-sm animate-pulse" />
                    ) : (
                      <FaRegHeart className="text-sm group-hover/like:scale-110 transition-transform duration-300" />
                    )}
                    <span className="text-xs tracking-wider">
                      {likedItems[memory.id] ? 'Liked' : 'Like'}
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Decorative Corner */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
          ))}
        </div>
        
        {/* Footer Gallery */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 text-gray-600 text-xs tracking-[0.2em]">
            <div className="w-8 h-px bg-gray-800"></div>
            <span>{memories.length} memories</span>
            <div className="w-8 h-px bg-gray-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;