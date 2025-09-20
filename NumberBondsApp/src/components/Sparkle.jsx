import React from 'react';

const Sparkle = ({ delay, endX, endY }) => {
  return (
    <div
      className="sparkle"
      style={{
        '--sparkle-delay': `${delay}s`,
        '--sparkle-end-x': `${endX}px`,
        '--sparkle-end-y': `${endY}px`,
      }}
    />
  );
};

export default Sparkle;