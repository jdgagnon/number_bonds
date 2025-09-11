import React from "react";

// This component just displays a single group of colored cubes.
const CubeDisplay = ({ count, color }) => {
  return (
    <div className="flex justify-center items-center flex-wrap gap-2 p-2 min-h-[100px]">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`w-6 h-6 ${color} rounded-md shadow-sm`}
        />
      ))}
    </div>
  );
};

export default CubeDisplay;