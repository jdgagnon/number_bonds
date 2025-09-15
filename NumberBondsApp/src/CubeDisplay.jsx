import React, { useState } from "react";

const CubeDisplay = ({ count, color }) => {
  const [crossedOff, setCrossedOff] = useState(new Set());

  const toggleCrossOff = (id) => {
    setCrossedOff(prevCrossedOff => {
      const newSet = new Set(prevCrossedOff);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    // Add the background, border, and rounding classes here
    <div className="flex justify-center items-center flex-wrap gap-2 p-2 min-h-[100px] bg-gray-100 rounded-lg border-2 border-gray-200">
      {Array.from({ length: count }).map((_, index) => {
        const id = `cube-${index}`;
        const isCrossed = crossedOff.has(id);
        return (
          <div
            key={id}
            onClick={() => toggleCrossOff(id)}
            className={`w-6 h-6 ${color} rounded-md shadow-sm cursor-pointer transition-opacity 
                       ${isCrossed ? 'opacity-30' : 'opacity-100'}`}
          />
        );
      })}
    </div>
  );
};

export default CubeDisplay;