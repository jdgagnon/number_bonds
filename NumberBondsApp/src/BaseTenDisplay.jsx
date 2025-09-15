import React, { useState } from 'react';

const BaseTenDisplay = ({ count, color }) => {
  const tens = Math.floor(count / 10);
  const ones = count % 10;
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
    // ADD a background color, border, and rounded corners to this wrapper
    <div className="flex justify-center items-center flex-wrap gap-2 p-2 min-h-[100px] bg-gray-100 rounded-lg border-2 border-gray-200">
      {/* Main container for the base-ten blocks */}
      <div className="flex justify-center items-start gap-3 w-full">
        {/* Group 1: Ten Rods */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {Array.from({ length: tens }).map((_, rodIndex) => (
            <div key={`ten-${rodIndex}`} className="flex flex-col-reverse gap-px">
              {Array.from({ length: 10 }).map((_, cubeIndex) => {
                const id = `ten-${rodIndex}-${cubeIndex}`;
                const isCrossed = crossedOff.has(id);
                return (
                  <div 
                    key={id}
                    onClick={() => toggleCrossOff(id)}
                    className={`w-6 h-[5.5px] ${color} rounded-sm cursor-pointer transition-opacity ${isCrossed ? 'opacity-30' : 'opacity-100'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Group 2: Unit Cubes */}
        <div className="flex flex-wrap justify-center gap-1">
          {Array.from({ length: ones }).map((_, oneIndex) => {
            const id = `one-${oneIndex}`;
            const isCrossed = crossedOff.has(id);
            return (
              <div 
                key={id}
                onClick={() => toggleCrossOff(id)}
                className={`w-6 h-6 ${color} rounded-sm cursor-pointer transition-opacity ${isCrossed ? 'opacity-30' : 'opacity-100'}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BaseTenDisplay;