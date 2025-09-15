import React from 'react';

const BaseTenDisplay = ({ count, color }) => {
  const tens = Math.floor(count / 10);
  const ones = count % 10;

  return (
    <div className="flex justify-center items-end gap-2 h-24">
      {/* Container for the Ten Rods */}
      <div className="flex items-end gap-1">
        {Array.from({ length: tens }).map((_, index) => (
          <div 
            key={`ten-${index}`} 
            className={`relative w-4 h-20 ${color} rounded-sm shadow-md border border-black/20 
                        flex items-center justify-center text-xs font-bold text-gray-800`} // Added flex/justify for centering text
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">10</span> 
          </div>
        ))}
      </div>

      {/* Container for the Unit Cubes */}
      <div className="flex flex-wrap-reverse gap-1 w-16">
        {Array.from({ length: ones }).map((_, index) => (
          <div key={`one-${index}`} className={`w-4 h-4 ${color} rounded-sm shadow-md border border-black/20`}></div>
        ))}
      </div>
    </div>
  );
};

export default BaseTenDisplay;