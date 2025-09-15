import React from "react";
import DancingUnicorn from './DancingUnicorn';

const STAR_COLORS = [
  { fill: 'fill-yellow-400', stroke: 'stroke-yellow-600' }, // Level 0
  { fill: 'fill-cyan-400', stroke: 'stroke-cyan-600' },   // Level 1
  { fill: 'fill-lime-400', stroke: 'stroke-lime-600' },   // Level 2
  { fill: 'fill-fuchsia-400', stroke: 'stroke-fuchsia-600' }, // Level 3
  { fill: 'fill-orange-400', stroke: 'stroke-orange-600' }, // Level 4
  { fill: 'fill-[url(#rainbow1)]', stroke: 'stroke-gray-500' }, // Level 5 (rainbow1)
  { fill: 'fill-[url(#rainbow2)]', stroke: 'stroke-gray-500' }, // Level 6 (rainbow2)
  { fill: 'fill-[url(#rainbow3)]', stroke: 'stroke-gray-500' }, // Level 7 (rainbow3)
  { fill: 'fill-[url(#rainbow4)]', stroke: 'stroke-gray-500' }, // Level 8 (rainbow4)
  { fill: 'fill-[url(#rainbow5)]', stroke: 'stroke-gray-500' }, // Level 9 (rainbow5)
  { fill: 'fill-[url(#rainbow6)]', stroke: 'stroke-gray-500' }, // Level 10 (rainbow6)
];

// Number of sparkle elements for each star
const NUM_SPARKLES = 50; 

// This is a single Star component. It's either empty (gray) or filled (yellow and glowing with sparkles).
const Star = ({ filled, level, isSpinning, isShooting }) => {
  if (level >= 33) {
    // Only show a unicorn for stars that are "filled" (earned)
    if (filled) {
      return <DancingUnicorn />;
    }
    // For unfilled stars at high levels, show a simple placeholder
    return (
      <div className="w-[50px] h-[50px] bg-gray-200 rounded-full border-2 border-gray-400 opacity-50"></div>
    );
  }
  const colors = STAR_COLORS[level % STAR_COLORS.length];
  let fillClass = filled ? colors.fill : 'fill-gray-200';
  const strokeClass = filled ? colors.stroke : 'stroke-gray-400';

  let animationClass = '';
  if (isShooting) {
    animationClass = 'animate-shooting-star';
  } else if (isSpinning) {
    animationClass = 'animate-spin-slow';
  }

  return (
    <div className="relative">
      {/* Conditionally add the new 'animate-spin-slow' class */}
      <div className={`${filled ? 'animate-glow' : ''} ${animationClass}`}>
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={isShooting ? { animationDelay: `${Math.random() * 2}s` } : {}}
        >
        <polygon
          className={`${fillClass} ${strokeClass}`}
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        />
      </svg>
      {filled && (
          <div className="sparkle-container">
              {Array.from({ length: NUM_SPARKLES }).map((_, i) => (
              <div
                  key={i}
                  className="sparkle"
                  style={{
                    left: `calc(50% + ${Math.random() * 8 - 4}px)`, 
                    top: `calc(50% + ${Math.random() * 8 - 4}px)`,
                    '--sparkle-x': `${Math.random() * 30 - 15}px`,
                    '--sparkle-y': `${Math.random() * 30 - 15}px`,
                    '--sparkle-x-end': `${Math.random() * 50 - 25}px`,
                    '--sparkle-y-end': `${Math.random() * 50 - 25}px`,
                    '--sparkle-delay': `${Math.random() * 1.5}s`,
                  }}
              />
              ))}
          </div>
        )}
      </div>
    </div>
    );  
};


// This component tracks and displays all 5 stars.
const StarTracker = ({ count, level }) => {
  const maxStars = 5;
  const spinLevel = 12;
  const shootLevel = 23;
  const isSpinning = level >= spinLevel;
  const isShooting = level >= shootLevel;

  return (
    // Add overflow-hidden to contain the shooting stars
    <div className="flex justify-center gap-2 mb-2 p-2 bg-purple-100 rounded-full shadow-inner overflow-hidden">
      <svg width="0" height="0" className="absolute">
        <defs>

          <linearGradient id="rainbow1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#ef4444' }} />   
            <stop offset="17%" style={{ stopColor: '#f97316' }} />  
            <stop offset="34%" style={{ stopColor: '#eab308' }} />  
            <stop offset="51%" style={{ stopColor: '#22c55e' }} />  
            <stop offset="68%" style={{ stopColor: '#3b82f6' }} />  
            <stop offset="85%" style={{ stopColor: '#4f46e5' }} />  
            <stop offset="100%" style={{ stopColor: '#8b5cf6' }} /> 
          </linearGradient>
          <linearGradient id="rainbow2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="rainbow3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fb7185' }} />   
            <stop offset="25%" style={{ stopColor: '#facc15' }} />  
            <stop offset="50%" style={{ stopColor: '#4ade80' }} />  
            <stop offset="75%" style={{ stopColor: '#60a5fa' }} />  
            <stop offset="100%" style={{ stopColor: '#c084fc' }} /> 
          </linearGradient>
          <linearGradient id="rainbow4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f97316' }} />   
            <stop offset="50%" style={{ stopColor: '#ef4444' }} />  
            <stop offset="100%" style={{ stopColor: '#c026d3' }} /> 
          </linearGradient>
          <linearGradient id="rainbow5" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#14b8a6' }} />   
            <stop offset="50%" style={{ stopColor: '#3b82f6' }} />  
            <stop offset="100%" style={{ stopColor: '#8b5cf6' }} /> 
          </linearGradient>
          <linearGradient id="rainbow6" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" style={{ stopColor: '#a3e635' }} />   
            <stop offset="50%" style={{ stopColor: '#22d3ee' }} />  
            <stop offset="100%" style={{ stopColor: '#f472b6' }} /> 
          </linearGradient>
        </defs>
      </svg>
      {Array.from({ length: maxStars }).map((_, index) => (
        <Star 
          key={index} 
          filled={index < count} 
          level={level} 
          isSpinning={isSpinning}
          isShooting={isShooting}
        />
      ))}
    </div>
  );
};

export default StarTracker;