import React from "react";
import { motion } from "framer-motion";

const Circle = ({ cx, cy, value, isBlank, filledAnswer }) => {
  const yPosition = cy + 7;

  return (
    <g>
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
        opacity={isBlank && filledAnswer !== null ? 0 : 1}
      >
        {isBlank ? "?" : value}
      </text>

      {/* This animates the correct answer when it's filled in */}
      {isBlank && filledAnswer !== null && (
        <motion.text
          x={cx}
          y={yPosition}
          fontSize="22"
          textAnchor="middle"
          className="font-bold fill-purple-800 select-none"
          // --- THIS IS THE FIX ---
          // Set the position statically above, and only animate the appearance.
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {filledAnswer}
        </motion.text>
      )}
    </g>
  );
};

const NumberBond = ({ problem, filledAnswer }) => {
  const { part1, part2, whole, blank } = problem;

  return (
    <div className="flex justify-center items-center">
      <svg width="250" height="160" viewBox="0 0 250 160">
        <line
          x1={125}
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

        <Circle cx={125} cy={40} value={whole} isBlank={blank === "whole"} filledAnswer={filledAnswer} />
        <Circle cx={70} cy={120} value={part1} isBlank={blank === "left"} filledAnswer={filledAnswer} />
        <Circle cx={180} cy={120} value={part2} isBlank={blank === "right"} filledAnswer={filledAnswer} />
      </svg>
    </div>
  );
};

export default NumberBond;