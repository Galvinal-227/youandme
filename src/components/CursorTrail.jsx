// components/CursorTrail.jsx
import React, { useEffect } from 'react';

const CursorTrail = () => {
  useEffect(() => {
    const symbols = ['♥', '❤', '♡', '✦', '✧'];
    const colors = ['#ff4d7a', '#ffd700', '#ff6b8a', '#64c8ff', '#ff8fa3'];
    
    // Buat container untuk trail
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    document.body.appendChild(container);

    const particles = [];
    const numParticles = 15;

    for (let i = 0; i < numParticles; i++) {
      const el = document.createElement('div');
      const size = 14 - (i / numParticles) * 8;
      el.style.cssText = `
        position: absolute;
        font-size: ${size}px;
        opacity: 0;
        transition: all 0.1s ease;
        pointer-events: none;
        user-select: none;
        will-change: transform, opacity;
        filter: drop-shadow(0 0 4px rgba(255,100,150,0.3));
      `;
      el.textContent = symbols[i % symbols.length];
      el.style.color = colors[i % colors.length];
      container.appendChild(el);
      particles.push({
        el: el,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        size: size,
        opacity: 0.9 - (i / numParticles) * 0.8,
        index: i
      });
    }

    let mouseX = 0, mouseY = 0;
    let currentIndex = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update target untuk particle berikutnya
      const p = particles[currentIndex];
      p.targetX = mouseX;
      p.targetY = mouseY;
      
      // Aktifkan particle
      p.el.style.opacity = p.opacity;
      p.el.style.transform = 'scale(1) rotate(0deg)';
      
      currentIndex = (currentIndex + 1) % numParticles;
    };

    const animate = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Smooth follow
        p.x += (p.targetX - p.x) * 0.12;
        p.y += (p.targetY - p.y) * 0.12;
        
        // Update posisi
        p.el.style.left = (p.x - 10) + 'px';
        p.el.style.top = (p.y - 10) + 'px';
        
        // Efek fade dan scale berdasarkan jarak dari mouse
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = 300;
        const fade = Math.max(0, 1 - (dist / maxDist));
        
        const opacity = p.opacity * fade * 0.9;
        const scale = 0.3 + 0.7 * fade;
        const rotation = dist * 0.5;
        
        p.el.style.opacity = opacity;
        p.el.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        
        // Ukuran mengecil seiring jarak
        const sizeFactor = 0.4 + 0.6 * fade;
        p.el.style.fontSize = (p.size * sizeFactor) + 'px';
      }
      
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    // Mouse leave - fade out
    const handleMouseLeave = () => {
      particles.forEach(p => {
        p.el.style.opacity = '0';
      });
    };

    const handleMouseEnter = () => {
      // Reset
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      container.remove();
    };
  }, []);

  return null;
};

export default CursorTrail;
