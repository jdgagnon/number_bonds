 import React from "react";
import { motion } from "framer-motion";

const MultipleChoice = ({ choices, onSelect, disabled }) => {
  return (
    <div className="flex justify-center flex-wrap gap-3 mt-8">
      {choices.map((choice) => (
        <motion.button
          key={choice}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(choice)}
          disabled={disabled}
          className="w-16 h-16 text-3xl font-bold text-white bg-sky-500 rounded-2xl shadow-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-300"
        >
          {choice}
        </motion.button>
      ))}
    </div>
  );
};

export default MultipleChoice;