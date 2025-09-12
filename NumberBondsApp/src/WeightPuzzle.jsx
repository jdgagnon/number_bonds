import React from 'react';
import { motion } from 'framer-motion';

// A reusable component for individual shapes
const Shape = ({ color, shape, weight }) => {
  const shapeClasses = shape === 'square' ? 'rounded-md' : 'rounded-full';
  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 ${color} ${shapeClasses} shadow-md`}></div>
      <span className="mt-1 font-bold text-gray-700">{weight}</span>
    </div>
  );
};

// A reusable component for the unknown shape
const UnknownShape = ({ color, shape }) => {
  const shapeClasses = shape === 'square' ? 'rounded-md' : 'rounded-full';
  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 ${color} ${shapeClasses} shadow-md flex justify-center items-center`}>
        <span className="text-3xl font-bold text-white">?</span>
      </div>
      <span className="mt-1 font-bold text-gray-700">?</span>
    </div>
  );
};

const WeightPuzzle = ({ problem }) => {
  const { leftSide, rightSide, unknownShape } = problem;
  
  // Calculate total weights for display on the scale pans
  const totalLeftWeight = leftSide.reduce((sum, item) => sum + item.weight, 0);
  const totalRightWeight = rightSide.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="flex flex-col items-center p-4">
      {/* --- Shape Display Area (Above the Scale) --- */}
      <div className="w-full flex justify-between items-start mb-6 min-h-[80px]">
        {/* Left Side Shapes */}
        <div className="flex gap-3">
          {leftSide.map((item, index) => (
            <Shape key={`left-${index}`} {...item} />
          ))}
        </div>
        
        {/* Right Side Shapes (including the unknown) */}
        <div className="flex gap-3">
          {rightSide.map((item, index) => (
            <Shape key={`right-${index}`} {...item} />
          ))}
          <UnknownShape {...unknownShape} />
        </div>
      </div>

      {/* --- Scale Graphic --- */}
      <div className="relative w-full max-w-xs mb-16">
        {/* Scale Beam */}
        <div className="h-2 bg-gray-500 rounded-full"></div>
        
        {/* Left Pan */}
        <div className="absolute bottom-[-50px] left-[-20px] w-24 h-12 bg-sky-200 border-4 border-sky-400 rounded-lg flex justify-center items-center">
          <span className="text-2xl font-bold text-sky-800">{totalLeftWeight}</span>
        </div>
        
        {/* Right Pan */}
        <div className="absolute bottom-[-50px] right-[-20px] w-24 h-12 bg-amber-200 border-4 border-amber-400 rounded-lg flex justify-center items-center">
           {/* Display the known total + a question mark */}
          <span className="text-2xl font-bold text-amber-800">{totalRightWeight} + ?</span>
        </div>
        
        {/* Fulcrum */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 
          border-l-[20px] border-l-transparent
          border-r-[20px] border-r-transparent
          border-t-[30px] border-t-gray-500">
        </div>
      </div>
    </div>
  );
};

export default WeightPuzzle;