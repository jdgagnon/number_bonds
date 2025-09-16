import React from 'react';
import MasteryStar from './MasteryStar';

const GAME_TYPES = ['numberBond', 'comparison', 'pattern', 'weightPuzzle', 'numberLadder', 'shapePuzzle'];

const MasteryTracker = ({ levelProgress }) => {
  return (
    <div className="w-full max-w-sm p-3 bg-purple-200 rounded-lg shadow-md">
      <h3 className="text-center text-md font-bold text-purple-800 mb-2">Game Mastery</h3>
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