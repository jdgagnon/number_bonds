import React from 'react';

const MASTERY_COLORS = [
  { fill: 'fill-yellow-400', stroke: 'stroke-yellow-600' }, // Level 0
  { fill: 'fill-cyan-400', stroke: 'stroke-cyan-600' },   // Level 1
  { fill: 'fill-lime-400', stroke: 'stroke-lime-600' },   // Level 2
  { fill: 'fill-fuchsia-400', stroke: 'stroke-fuchsia-600' }, // Level 3
  { fill: 'fill-orange-400', stroke: 'stroke-orange-600' }, // Level 4
  { fill: 'fill-[url(#rainbow1)]', stroke: 'stroke-gray-500' }, // Level 5 (rainbow1)
  { fill: 'fill-[url(#rainbow2)]', stroke: 'stroke-gray-500' }, // Level 6 (rainbow2)
  { fill: 'fill-[url(#rainbow3)]', stroke: 'stroke-gray-500' }, // Level 7 (rainbow3)
  { fill: 'fill-[url(#rainbow4)]', stroke: 'stroke-gray-500' }, // Level 8 (rainbow4)
  { fill: 'fill-[url(#rainbow5)]', stroke: 'stroke-gray-500' }, // Level 9 (rainbow5)
  { fill: 'fill-[url(#rainbow6)]', stroke: 'stroke-gray-500' }, // Level 10 (rainbow6)
];

const NUM_SPARKLES = 30;

const MasteryStar = ({ level, gameType }) => {
  const displayLevel = level || 0;
  const isSparkling = displayLevel >= 11;
  const isSpinning = displayLevel >= 23;
  const sparkleContainerClass = (isSparkling && !isSpinning) ? 'animate-sparkle-colors' : '';
  
  let colors;
  // If the level is 0, use a fixed gray color
  if (displayLevel === 0) {
    colors = { fill: 'fill-gray-300', stroke: 'stroke-gray-400' };
  } else {
    // For any level above 0, use the main color list.
    // We subtract 1 because level 1 should match the first item (index 0).
    colors = MASTERY_COLORS[(displayLevel - 1) % MASTERY_COLORS.length];
  }
  return (
    <div className="flex flex-col items-center">
      {/* This container holds the star and sparkles for correct alignment */}
      <div className={`relative ${sparkleContainerClass}`}>
        <div className={isSpinning ? 'animate-spin-slow' : ''}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon
              className={`${colors.fill} ${colors.stroke}`}
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
        </div>

        {isSparkling && (
          <div className="sparkle-container">
            {Array.from({ length: NUM_SPARKLES }).map((_, i) => (
              <div
                key={i}
                className="sparkle"
                style={{
                  left: `calc(50% + ${Math.random() * 8 - 4}px)`, 
                  top: `calc(50% + ${Math.random() * 8 - 4}px)`,
                  '--sparkle-x': `${Math.random() * 20 - 10}px`,
                  '--sparkle-y': `${Math.random() * 20 - 10}px`,
                  '--sparkle-x-end': `${Math.random() * 40 - 20}px`,
                  '--sparkle-y-end': `${Math.random() * 40 - 20}px`,
                  '--sparkle-delay': `${Math.random() * 1.5}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MasteryStar;