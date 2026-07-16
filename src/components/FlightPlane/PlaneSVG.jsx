// PlaneSVG.jsx
// Renders a premium layered paper airplane as an inline React SVG component.
// Each part has a className for independent GSAP animation.

import React from 'react';

const PlaneSVG = React.memo(({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 38"
      width="64"
      height="38"
      className={`plane-svg ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Gradients for premium look */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8f9fa" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#e9ecef" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ced4da" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#dee2e6" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a8d8ff" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#a8d8ff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#a8d8ff" stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.2" />
        </filter>
      </defs>

      <g id="paper-plane" transform="translate(1, 2)" filter="url(#dropShadow)">
        {/* Glow layer - behind the plane */}
        <ellipse
          className="plane-glow"
          cx="30"
          cy="16"
          rx="28"
          ry="18"
          fill="url(#glowGrad)"
          filter="url(#softGlow)"
        />

        {/* Shadow layer - subtle drop shadow on the body */}
        <path
          className="plane-shadow"
          fill="url(#shadowGrad)"
          d="M 22 20.4 L 27 22.2 L 43.8 32.8 L 22.2 20.4 L 1.1 18.5 C 0.2 18.2 -0.3 17.2 0 16.3 L 60.8 0 C 61.7 0.3 62.2 1.3 61.9 2.3 L 43.8 32.8 Z"
        />

        {/* Left Wing */}
        <path
          className="plane-wing-left"
          fill="url(#wingGrad)"
          stroke="#adb5bd"
          strokeWidth="0.5"
          strokeLinejoin="round"
          d="M 27 22.2 L 22.2 20.4 L 1.1 18.5 C 0.2 18.2 -0.3 17.2 0 16.3 L 60.8 0 C 61.7 0.3 62.2 1.3 61.9 2.3 L 43.8 32.8 C 43.5 33.7 42.5 34.2 41.5 33.9 L 27 22.2 Z"
        />

        {/* Right Wing (mirrored upper wing) */}
        <path
          className="plane-wing-right"
          fill="url(#wingGrad)"
          stroke="#adb5bd"
          strokeWidth="0.5"
          strokeLinejoin="round"
          d="M 27 22.2 L 22.2 20.4 L 61.375 1.125 L 27 22.2 Z"
        />

        {/* Body - main fuselage */}
        <path
          className="plane-body"
          fill="url(#bodyGrad)"
          stroke="#8c8f94"
          strokeWidth="0.8"
          strokeLinejoin="round"
          d="M 27 22.2 L 22.2 20.4 L 1.1 18.5 C 0.2 18.2 -0.3 17.2 0 16.3 L 60.8 0 C 61.7 0.3 62.2 1.3 61.9 2.3 L 43.8 32.8 C 43.5 33.7 42.5 34.2 41.5 33.9 L 22.2 20.4 L 61.375 1.125 L 27 22.2 Z"
        />

        {/* Highlight - subtle reflection on the body */}
        <path
          className="plane-highlight"
          fill="#ffffff"
          opacity="0.25"
          d="M 25 18 L 28 20 L 40 28 L 25 18 Z"
        />
      </g>
    </svg>
  );
});

PlaneSVG.displayName = 'PlaneSVG';

export default PlaneSVG;
