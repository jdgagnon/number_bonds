import React from 'react';
import { motion } from 'framer-motion';

const NumberLadder = ({ problem, filledAnswers }) => {
  const currentStep = filledAnswers.length;

  return (
    <div className="flex flex-col items-center w-full mb-4">
      <h3 className="text-2xl font-bold text-gray-600 mb-4 text-center">Solve the ladder!</h3>
      
      <div className="p-2 bg-gray-100 rounded-lg">
        <div className="flex items-end justify-center">
          {/* Start Number Box */}
          <div className="flex items-center justify-center w-16 h-16 bg-white text-3xl font-bold text-gray-700 rounded-lg shadow-md border-2 border-gray-300">
            {problem.startNumber}
          </div>

          {/* Map over the steps to create the subsequent sections */}
          {problem.steps.map((step, index) => {
            const isFilled = index < currentStep;
            const isActive = index === currentStep;

            return (
              // Each step is a group containing the operation, arrow, and answer box
              <div key={index} className="flex flex-col items-center">
                {/* Top Part: Operation Text */}
                <div className="h-8 flex items-end">
                  <span className="text-xl font-bold text-purple-600">{step.text}</span>
                </div>
                
                {/* Bottom Part: Arrow and Answer Box */}
                <div className="flex items-center">
                  <span className="text-2xl text-gray-400 mx-1">→</span>
                  <div 
                    className={`flex items-center justify-center w-16 h-16 text-3xl font-bold rounded-lg shadow-md border-2
                      ${isFilled ? 'bg-purple-500 text-white border-purple-600' : ''}
                      ${isActive ? 'bg-yellow-200 text-yellow-800 border-yellow-400 animate-pulse' : ''}
                      ${!isFilled && !isActive ? 'bg-white text-gray-400 border-gray-300' : ''}
                    `}
                  >
                    {isFilled ? (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        {filledAnswers[index]}
                      </motion.span>
                    ) : (
                      '?'
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NumberLadder;