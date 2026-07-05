// components/CursorTrail.jsx
import React, { useEffect, useRef } from 'react';

const CursorTrail = () => {
  const trailRef = useRef([]);
  const dotsRef = useRef([]);

  useEffect(() => {
    const dots = [];
    const numDots = 15;
    
    // Buat dot elements
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,100,150,0.8), rgba(255,50,100,0.2));
        transition: all 0.1s ease;
        opacity: 0;
        box-shadow: 0 0 10px rgba(255,100,150,0.3);
      `;
      document.body.appendChild(dot);
      dots.push(dot);
    }
    dotsRef.current = dots;

    let mouseX = 0, mouseY = 0;
    let currentIndex = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Aktifkan dot pertama
      const dot = dots[currentIndex];
      dot.style.left = mouseX - 3 + 'px';
      dot.style.top = mouseY - 3 + 'px';
      dot.style.opacity = '0.8';
      dot.style.transform = 'scale(1)';
      
      currentIndex = (currentIndex + 1) % numDots;
    };

    // Animasi trail
    const animateTrail = () => {
      const positions = [];
      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i];
        if (dot.style.opacity === '0') continue;
        
        const x = parseFloat(dot.style.left);
        const y = parseFloat(dot.style.top);
        positions.push({ x, y, opacity: parseFloat(dot.style.opacity) });
      }
      
      // Update opacity dan scale untuk efek trail
      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i];
        const index = (i - 1 + dotsRef.current.length) % dotsRef.current.length;
        const prev = positions[index];
        
        if (prev) {
          const opacity = 0.8 - (i / dotsRef.current.length) * 0.7;
          const scale = 1 - (i / dotsRef.current.length) * 0.6;
          dot.style.opacity = Math.max(0, opacity);
          dot.style.transform = `scale(${Math.max(0.3, scale)})`;
          dot.style.width = `${6 * (1 - i / dotsRef.current.length * 0.5)}px`;
          dot.style.height = `${6 * (1 - i / dotsRef.current.length * 0.5)}px`;
        }
      }
      
      requestAnimationFrame(animateTrail);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateTrail();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      dots.forEach(dot => dot.remove());
    };
  }, []);

  return null;
};

export default CursorTrail;
