import React from 'react';
import { motion } from 'framer-motion';

const NumberLadder = ({ problem, filledAnswers }) => {
  const { steps, startNumber } = problem;
  let currentVal = startNumber;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-2xl font-bold bg-sky-200 text-sky-800 px-4 py-2 rounded-lg shadow-md">
        Start: {startNumber}
      </div>

      {steps.map((step, index) => {
        const result = step.operation(currentVal);
        currentVal = result; // Update currentVal for the next step's calculation

        return (
          <div key={index} className="flex flex-col items-center">
            <div className="text-2xl text-gray-400">↓</div>
            <div className="text-xl font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {step.text}
            </div>
            <div className="text-2xl text-gray-400">↓</div>
            <div className="w-24 h-24 border-4 border-dashed border-purple-300 rounded-full flex justify-center items-center text-4xl font-bold">
              {filledAnswers[index] !== undefined ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-purple-600"
                >
                  {filledAnswers[index]}
                </motion.span>
              ) : (
                <span className="text-purple-400">?</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NumberLadder;