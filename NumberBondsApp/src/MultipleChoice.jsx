import React from "react";
import { motion } from "framer-motion";

// Color themes for the buttons
const colorClasses = {
  purple: {
    bg: 'bg-purple-500',
    hover: 'hover:bg-purple-600',
    ring: 'focus:ring-purple-400',
  },
  sky: {
    bg: 'bg-sky-500',
    hover: 'hover:bg-sky-600',
    ring: 'focus:ring-sky-400',
  },
};

const MultipleChoice = ({ choices, onSelect, disabled, color = 'sky' }) => {
  const colors = colorClasses[color] || colorClasses.sky;

  return (
    <div className="flex justify-center flex-wrap gap-3 mt-8">
      {choices.map((choice) => (
        <motion.button
          key={choice}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(choice)}
          disabled={disabled}
          className={`w-16 h-16 text-3xl font-bold text-white rounded-2xl shadow-md disabled:bg-gray-300 ${colors.bg} ${colors.hover} ${colors.ring}`}
        >
          {choice}
        </motion.button>
      ))}
    </div>
  );
};

export default MultipleChoice;