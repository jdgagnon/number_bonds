import React, { useState, useEffect } from "react";
import Sparkle from './Sparkle';

const DancingUnicorn = () => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const spawnSparkle = () => {
      const newSparkle = {
        id: Date.now(),
        delay: Math.random() * 0.5, // Random delay up to 0.5s
        // Random end position in a circular pattern
        endX: (Math.random() - 0.5) * 100,
        endY: (Math.random() - 0.5) * 100,
      };

      // Correctly add the new sparkle and clean up old ones
      setSparkles(prevSparkles => [
        ...prevSparkles.filter(s => Date.now() - s.id < 1000), // Keep sparkles for 1 second
        newSparkle
      ]);
    };

    const interval = setInterval(spawnSparkle, 100); // Spawn a sparkle every 100ms
    return () => clearInterval(interval);
  }, []);

  return (
    // This container is now relative, so it stays within its parent (the star slot)
    <div className="relative w-[50px] h-[50px] flex items-center justify-center">
      
      {/* Render all active sparkles */}
      {sparkles.map(s => (
        <Sparkle key={s.id} delay={s.delay} endX={s.endX} endY={s.endY} />
      ))}

      {/* This container handles the dancing animation */}
      <div className="animate-dance">
        <img
          src="/unicorn.png"
          alt="A dancing unicorn"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default DancingUnicorn;