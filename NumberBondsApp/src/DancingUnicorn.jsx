import React, { useState, useEffect, useRef } from "react";
import Sparkle from './Sparkle'; // Import the Sparkle component

const DancingUnicorn = () => {
  const unicornRef = useRef(null); // Ref to get unicorn's position
  const [sparkles, setSparkles] = useState([]);
  const [unicornX, setUnicornX] = useState(0);
  const [unicornY, setUnicornY] = useState(0);

  // Effect to update unicorn's position and spawn sparkles
  useEffect(() => {
  const updatePosition = () => {
    if (unicornRef.current) {
      const rect = unicornRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Create three new sparkles for a multi-stranded trail
      const newSparkles = [
        { id: Date.now() + 1, x: centerX + (Math.random() * 20 - 10), y: centerY + (Math.random() * 20 - 10) },
        { id: Date.now() + 2, x: centerX + (Math.random() * 20 - 10), y: centerY + (Math.random() * 20 - 10) },
        { id: Date.now() + 3, x: centerX + (Math.random() * 20 - 10), y: centerY + (Math.random() * 20 - 10) },
      ];

      // Add the new sparkles to the existing array
      setSparkles(prevSparkles => [...prevSparkles, ...newSparkles]);
      
      // Clean up old sparkles to prevent performance issues
      setSparkles(prevSparkles => prevSparkles.filter(s => Date.now() - s.id < 2000));
    }
  };

  // Keep the interval the same, but now it spawns 3 sparkles each time
  const interval = setInterval(updatePosition, 50);
  return () => clearInterval(interval);
}, []); // Empty dependency array means this runs once on mount

  return (
    // The main container for the unicorn and its sparkles
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Render all active sparkles */}
      {sparkles.map(s => (
        <Sparkle key={s.id} x={s.x} y={s.y} />
      ))}

      {/* This container handles the animation across the screen */}
      <div className="animate-cross-screen" ref={unicornRef}>
        {/* This container handles the dancing animation */}
        <div className="animate-dance">
          <img
            src="/unicorn.png"
            alt="A dancing unicorn"
            width="100"
            height="100"
            className="transform scale-x-[-1]"
          />
        </div>
      </div>
    </div>
  );
};

export default DancingUnicorn;