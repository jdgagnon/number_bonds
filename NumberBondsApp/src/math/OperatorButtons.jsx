import React from "react";
import { motion } from "framer-motion";

const OperatorButtons = ({ onSelect, disabled }) => {
  const operators = ['<', '>', '='];

  return (
    <div className="flex justify-center gap-4 mt-4">
      {operators.map((op) => (
        <motion.button
          key={op}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(op)}
          disabled={disabled}
          className="w-20 h-20 text-4xl font-bold text-white bg-purple-500 rounded-2xl shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-300"
        >
          {op}
        </motion.button>
      ))}
    </div>
  );
};

export default OperatorButtons;