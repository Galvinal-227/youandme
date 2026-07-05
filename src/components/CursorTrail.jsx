// components/CursorTrail.jsx
import React, { useEffect, useRef } from 'react';

const CursorTrail = () => {
  const trailRef = useRef([]);
  const dotsRef = useRef([]);

  useEffect(() => {
    const dots = [];
    const numDots = 20;
    
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('div');
      const size = 8 - (i / numDots) * 6;
      dot.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,100,150,0.9), rgba(255,50,100,0.3));
        opacity: 0;
        transition: all 0.08s cubic-bezier(0.2, 0.9, 0.4, 1);
        box-shadow: 0 0 15px rgba(255,100,150,0.4);
        will-change: transform, opacity, left, top;
        filter: blur(0.5px);
      `;
      document.body.appendChild(dot);
      dots.push(dot);
    }
    dotsRef.current = dots;

    let mouseX = 0, mouseY = 0;
    let currentIndex = 0;
    let positions = [];

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      const dot = dots[currentIndex];
      dot.style.left = (mouseX - 4) + 'px';
      dot.style.top = (mouseY - 4) + 'px';
      dot.style.opacity = '1';
      dot.style.transform = 'scale(1)';
      
      currentIndex = (currentIndex + 1) % numDots;
    };

    const animateTrail = () => {
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const progress = i / dots.length;
        const opacity = 0.9 - progress * 0.85;
        const scale = 1 - progress * 0.7;
        const size = 8 - progress * 6;
        
        dot.style.opacity = Math.max(0, opacity);
        dot.style.transform = `scale(${Math.max(0.2, scale)})`;
        dot.style.width = `${Math.max(2, size)}px`;
        dot.style.height = `${Math.max(2, size)}px`;
        
        // Warna berubah dari pink ke putih
        const alpha = opacity * 0.8;
        dot.style.background = `radial-gradient(circle, rgba(255,150,200,${alpha}), rgba(255,50,100,${alpha * 0.5}))`;
        dot.style.boxShadow = `0 0 ${20 * (1 - progress)}px rgba(255,100,150,${alpha * 0.5})`;
      }
      requestAnimationFrame(animateTrail);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateTrail();

    // Mouse leave - fade out semua dot
    const handleMouseLeave = () => {
      dots.forEach(dot => {
        dot.style.opacity = '0';
      });
    };

    const handleMouseEnter = () => {
      // Biar langsung aktif lagi
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      dots.forEach(dot => dot.remove());
    };
  }, []);

  return null;
};

export default CursorTrail;
