import React from "react";
import { motion } from "framer-motion";

const NumberPad = ({ maxNumber, onNumberClick, disabled }) => {
  return (
    <div className="grid grid-cols-5 gap-2 mt-4">
      {Array.from({ length: maxNumber + 1 }, (_, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onNumberClick(i)}
          disabled={disabled}
          className="p-3 text-xl font-bold text-white bg-purple-500 rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-300"
        >
          {i}
        </motion.button>
      ))}
    </div>
  );
};

export default NumberPad;