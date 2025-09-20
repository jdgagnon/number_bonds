import React from 'react';
import MasteryStar from './MasteryStar';

const GAME_TYPES = ['numberBond', 'comparison', 'pattern', 'weightPuzzle', 'numberLadder', 'shapePuzzle', 'diceGame'];

const MasteryTracker = ({ levelProgress }) => {
  return (
    <div className="w-full max-w-sm p-3 bg-purple-200 rounded-lg shadow-md">
      <h3 className="text-center text-md font-bold text-purple-800 mb-2">Game Mastery</h3>
      {/* ADD THIS SVG DEFINITION BLOCK */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="rainbow1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#ef4444' }} />   
            <stop offset="17%" style={{ stopColor: '#f97316' }} />  
            <stop offset="34%" style={{ stopColor: '#eab308' }} />  
            <stop offset="51%" style={{ stopColor: '#22c55e' }} />  
            <stop offset="68%" style={{ stopColor: '#3b82f6' }} />  
            <stop offset="85%" style={{ stopColor: '#4f46e5' }} />  
            <stop offset="100%" style={{ stopColor: '#8b5cf6' }} /> 
          </linearGradient>
          <linearGradient id="rainbow2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="rainbow3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fb7185' }} />   
            <stop offset="25%" style={{ stopColor: '#facc15' }} />  
            <stop offset="50%" style={{ stopColor: '#4ade80' }} />  
            <stop offset="75%" style={{ stopColor: '#60a5fa' }} />  
            <stop offset="100%" style={{ stopColor: '#c084fc' }} /> 
          </linearGradient>
          <linearGradient id="rainbow4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f97316' }} />   
            <stop offset="50%" style={{ stopColor: '#ef4444' }} />  
            <stop offset="100%" style={{ stopColor: '#c026d3' }} /> 
          </linearGradient>
          <linearGradient id="rainbow5" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#14b8a6' }} />   
            <stop offset="50%" style={{ stopColor: '#3b82f6' }} />  
            <stop offset="100%" style={{ stopColor: '#8b5cf6' }} /> 
          </linearGradient>
          <linearGradient id="rainbow6" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" style={{ stopColor: '#a3e635' }} />   
            <stop offset="50%" style={{ stopColor: '#22d3ee' }} />  
            <stop offset="100%" style={{ stopColor: '#f472b6' }} /> 
          </linearGradient>
        </defs>
      </svg>
      <div className="flex justify-around">
        {GAME_TYPES.map(gameType => {
          // Find the level for this specific game, default to 0
          const gameLevel = levelProgress[gameType]?.level || 0;
          return <MasteryStar key={gameType} level={gameLevel} gameType={gameType} />;
        })}
      </div>
    </div>
  );
};

export default MasteryTracker;