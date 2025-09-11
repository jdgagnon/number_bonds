import React from "react";

// Number of sparkle elements for each star
const NUM_SPARKLES = 50; 

// This is a single Star component. It's either empty (gray) or filled (yellow and glowing with sparkles).
const Star = ({ filled }) => (
  <div className="relative"> {/* Added relative positioning for sparkles */}
    <div className={filled ? 'animate-glow' : ''}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill={filled ? '#facc15' : '#e5e7eb'} // Yellow for filled, gray for empty
        stroke={filled ? '#ca8a04' : '#d1d5db'} // Darker border for filled
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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


// This component tracks and displays all 5 stars.
const StarTracker = ({ count }) => {
  const maxStars = 5;

  return (
    <div className="flex justify-center gap-2 mb-2">
      {Array.from({ length: maxStars }).map((_, index) => (
        <Star key={index} filled={index < count} />
      ))}
    </div>
  );
};

export default StarTracker;