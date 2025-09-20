import React from 'react';
import CubeDisplay from './CubeDisplay';
import BaseTenDisplay from './BaseTenDisplay';

const CountingCubes = ({ part1, part2, maxTotal, isNumberBondHard, stage, filledAnswer }) => {
  
  // Hide cubes if it's hard mode, the bond stage, AND no answer has been filled in yet.
  // Checking for 'null' ensures it works correctly.
  if (isNumberBondHard && stage === 'bond' && filledAnswer === null) {
    return <div className="min-h-[100px]" />;
  }

  if (maxTotal > 20) {
    return (
      <div className="flex justify-center items-center flex-wrap gap-2 p-2 min-h-[100px]">
        <div className="flex justify-center gap-4">
          <BaseTenDisplay count={part1} color="bg-sky-400" />
          {/* FIX: Corrected the color class typo below */}
          <BaseTenDisplay count={part2} color="bg-amber-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-4 p-2 min-h-[100px]">
      <CubeDisplay count={part1} color="bg-sky-400" />
      <CubeDisplay count={part2} color="bg-amber-400" />
    </div>
  );
};

export default CountingCubes;