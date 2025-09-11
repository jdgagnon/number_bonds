import React, { useState, useEffect } from "react";

// A small helper component for the cube itself
const Cube = ({ isCounted, onClick, color }) => (
  <div
    onClick={onClick}
    className={`relative w-8 h-8 ${color} rounded-md cursor-pointer shadow-sm transition-transform hover:scale-110`}
  >
    {isCounted && (
      <div
        className="absolute top-1/2 left-0 w-full h-1 bg-red-500 transform -rotate-45"
        style={{ pointerEvents: "none" }}
      />
    )}
  </div>
);

const CountingCubes = ({ part1, part2 }) => {
  const totalCubes = part1 + part2;
  const [counted, setCounted] = useState(Array(totalCubes).fill(false));

  useEffect(() => {
    setCounted(Array(totalCubes).fill(false));
  }, [part1, part2]);

  const handleCubeClick = (index) => {
    const newCounted = [...counted];
    newCounted[index] = !newCounted[index];
    setCounted(newCounted);
  };

  return (
    <div className="flex justify-center items-center flex-wrap gap-3 p-4 border rounded-lg bg-gray-50">
      {/* --- Group 1 (part1) --- */}
      <div className="flex gap-2 flex-wrap justify-center">
        {Array.from({ length: part1 }).map((_, index) => (
          <Cube
            key={index}
            isCounted={counted[index]}
            onClick={() => handleCubeClick(index)}
            color="bg-sky-400" // First color
          />
        ))}
      </div>

      {/* The plus sign separator has been removed from here */}

      {/* --- Group 2 (part2) --- */}
      <div className="flex gap-2 flex-wrap justify-center">
        {Array.from({ length: part2 }).map((_, index) => (
          <Cube
            key={part1 + index}
            isCounted={counted[part1 + index]}
            onClick={() => handleCubeClick(part1 + index)}
            color="bg-amber-400" // Second color
          />
        ))}
      </div>
    </div>
  );
};

export default CountingCubes;