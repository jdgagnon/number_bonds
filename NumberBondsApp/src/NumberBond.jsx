import React from "react";
import { motion } from "framer-motion";


const Circle = ({ cx, cy, value, isBlank }) => {
  const yPosition = cy + 7;
  return(
    <motion.g
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
  >
    <circle
      cx={cx}
      cy={cy}
      r="30"
      strokeWidth="3"
      className={`${
        isBlank ? "fill-purple-200" : "fill-gray-100"
      } stroke-purple-500`}
    />
    <text
      x={cx}
      y={yPosition}
      fontSize="22"
      textAnchor="middle"
      className="font-bold fill-purple-800 select-none"
    >
      {isBlank ? "?" : value}
    </text>
  </motion.g>
  );
};

const NumberBond = ({ problem }) => {
  const { part1, part2, whole, blank } = problem;

  return (
    <div className="flex justify-center items-center">
      <svg width="250" height="160" viewBox="0 0 250 160">
        <line
          x1={125} // Also changed to a number for consistency
          y1={40}
          x2={70}
          y2={120}
          className="stroke-purple-500"
          strokeWidth="3"
        />
        <line
          x1={125}
          y1={40}
          x2={180}
          y2={120}
          className="stroke-purple-500"
          strokeWidth="3"
        />
        
        {/* --- THE FIX IS HERE --- */}
        {/* Using curly braces {} to pass numbers instead of strings */}
        <Circle cx={125} cy={40} value={whole} isBlank={blank === "whole"} />
        <Circle cx={70} cy={120} value={part1} isBlank={blank === "left"} />
        <Circle cx={180} cy={120} value={part2} isBlank={blank === "right"} />
        {/* --------------------- */}
      </svg>
    </div>
  );
};

export default NumberBond;