import React from "react";

const STAR_COLORS = [
  { fill: 'fill-yellow-400', stroke: 'stroke-yellow-600' }, // Level 0
  { fill: 'fill-cyan-400', stroke: 'stroke-cyan-600' },   // Level 1
  { fill: 'fill-lime-400', stroke: 'stroke-lime-600' },   // Level 2
  { fill: 'fill-fuchsia-400', stroke: 'stroke-fuchsia-600' }, // Level 3
  { fill: 'fill-orange-400', stroke: 'stroke-orange-600' }, // Level 4
  { fill: 'fill-[url(#rainbow)]', stroke: 'stroke-gray-500' }, // Level 5 (rainbow)
];

// Number of sparkle elements for each star
const NUM_SPARKLES = 50; 

// This is a single Star component. It's either empty (gray) or filled (yellow and glowing with sparkles).
const Star = ({ filled, level, isSpinning }) => {
  const colors = STAR_COLORS[level % STAR_COLORS.length];
  const fillClass = filled ? colors.fill : 'fill-gray-200';
  const strokeClass = filled ? colors.stroke : 'stroke-gray-400';

  return (
    <div className="relative">
      {/* Conditionally add the new 'animate-spin-slow' class */}
      <div className={`${filled ? 'animate-glow' : ''} ${isSpinning ? 'animate-spin-slow' : ''}`}>
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
        <polygon
          className={`${fillClass} ${strokeClass}`}
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        />
      </svg>
    </div>

        {/* Sparkle container for filled stars */}
        {filled && (
        <div className="sparkle-container">
            {Array.from({ length: NUM_SPARKLES }).map((_, i) => (
            <div
                key={i}
                className="sparkle"
                style={{
                // Random starting position within a small radius of the center
                left: `calc(50% + ${Math.random() * 8 - 4}px)`, 
                top: `calc(50% + ${Math.random() * 8 - 4}px)`,
                // Random direction and distance for the spark to travel
                '--sparkle-x': `${Math.random() * 30 - 15}px`,
                '--sparkle-y': `${Math.random() * 30 - 15}px`,
                '--sparkle-x-end': `${Math.random() * 50 - 25}px`,
                '--sparkle-y-end': `${Math.random() * 50 - 25}px`,
                // Stagger the animation delays for a continuous sparkling effect
                '--sparkle-delay': `${Math.random() * 1.5}s`,
                }}
            />
            ))}
        </div>
        )}
    </div>
    );  
};


// This component tracks and displays all 5 stars.
const StarTracker = ({ count, level }) => {
  const maxStars = 5;
  const maxLevel = 6;
  const isSpinning = level >= maxLevel;

  return (
    <div className="flex justify-center gap-2 mb-2">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
      {Array.from({ length: maxStars }).map((_, index) => (
        <Star key={index} filled={index < count} level={level} isSpinning={isSpinning} />
      ))}
    </div>
  );
};

export default StarTracker;