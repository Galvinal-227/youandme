// planeAnimation.js
// GSAP animation logic using ScrollTrigger based on document scroll.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/**
 * Animates the paper airplane along a path based on document scroll progress.
 * ScrollTrigger is attached to the document body, not a fixed container.
 */
export function animatePlane({
  pathData,          // SVG path string (d attribute)
  planeRef,          // Ref to the plane container
  onUpdate = null,   // Callback with progress and position
}) {
  if (!planeRef || !pathData) return null;

  const ctx = gsap.context(() => {
    const planeEl = planeRef.current;
    if (!planeEl) return;

    // Create a temporary path element for MotionPath
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    svg.appendChild(path);
    document.body.appendChild(svg);
    
    const motionPath = path;

    // Create ScrollTrigger based on document height
    const scrollTrigger = {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (onUpdate && motionPath) {
          try {
            const progress = self.progress;
            const length = motionPath.getTotalLength();
            const point = motionPath.getPointAtLength(progress * length);
            onUpdate({ progress, x: point.x, y: point.y });
          } catch (e) {
            // Silently handle path errors
          }
        }
      },
    };

    // 1. Master timeline for the plane
    const tl = gsap.timeline({
      scrollTrigger: scrollTrigger,
    });

    // 2. Plane follows the path with auto-rotation
    tl.to(planeEl, {
      motionPath: {
        path: motionPath,
        align: motionPath,
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
      },
      ease: 'none',
      duration: 1,
    });

    // 3. Subtle wing flutter (alternating rotation)
    const leftWing = planeEl.querySelector('.plane-wing-left');
    const rightWing = planeEl.querySelector('.plane-wing-right');

    if (leftWing && rightWing) {
      gsap.to(leftWing, {
        rotation: 2,
        transformOrigin: '50% 80%',
        yoyo: true,
        repeat: -1,
        duration: 0.8,
        ease: 'sine.inOut',
      });
      gsap.to(rightWing, {
        rotation: -2,
        transformOrigin: '50% 80%',
        yoyo: true,
        repeat: -1,
        duration: 0.9,
        ease: 'sine.inOut',
        delay: 0.2,
      });
    }

    // 4. Glow pulse
    const glow = planeEl.querySelector('.plane-glow');
    if (glow) {
      gsap.to(glow, {
        scale: 1.15,
        opacity: 0.7,
        yoyo: true,
        repeat: -1,
        duration: 2.5,
        ease: 'sine.inOut',
      });
    }

    // 5. Highlight shimmer
    const highlight = planeEl.querySelector('.plane-highlight');
    if (highlight) {
      gsap.to(highlight, {
        opacity: 0.5,
        yoyo: true,
        repeat: -1,
        duration: 3,
        ease: 'sine.inOut',
        delay: 0.5,
      });
    }

    // Clean up temporary SVG
    return () => {
      if (svg && svg.parentNode) {
        svg.parentNode.removeChild(svg);
      }
    };
  });

  return ctx;
}

/**
 * Fade out the glow at the end of the journey (near bottom of page).
 */
export function fadeGlow(glowRef) {
  if (!glowRef) return null;
  return gsap.to(glowRef, {
    opacity: 0,
    duration: 1.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: document.body,
      start: 'bottom bottom-=200px',
      end: 'bottom bottom',
      scrub: 1,
    },
  });
}

/**
 * Make the plane float gently forever at the end (when at bottom).
 */
export function floatForever(planeRef) {
  if (!planeRef) return null;
  const el = planeRef.current;
  if (!el) return null;

  return gsap.to(el, {
    y: '-=8',
    rotation: 0.5,
    duration: 2.5,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    delay: 0.5,
    scrollTrigger: {
      trigger: document.body,
      start: 'bottom bottom',
      end: 'bottom bottom+=1px',
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Clean up all ScrollTriggers and GSAP contexts.
 */
export function cleanupAnimations(ctx) {
  if (ctx) {
    ctx.revert();
  }
  ScrollTrigger.getAll().forEach((st) => st.kill());
}
