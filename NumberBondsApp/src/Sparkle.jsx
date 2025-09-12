import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const rainbowColors = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#9400D3', // Violet
];

const Sparkle = ({ x, y }) => {
  const [color] = useState(rainbowColors[Math.floor(Math.random() * rainbowColors.length)]);
  const [size] = useState(Math.random() * 8 + 4); // Random size between 4px and 12px
  const [rotation] = useState(Math.random() * 360); // Random rotation

  return (
    <motion.div
      className="absolute rounded-full sparkle-fade" // 'sparkle-fade' class for animation
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: color,
        transform: `rotate(${rotation}deg)`,
      }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 1.5, ease: "easeOut" }} // Sparkle lasts for 1.5 seconds
    />
  );
};

export default Sparkle;