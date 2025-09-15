import React from 'react';

const ProgressTracker = ({ levelProgress, gameTypes, goal = 5 }) => {
  return (
    <div className="p-3 bg-white/50 rounded-lg shadow-md">
      <h3 className="text-center font-bold text-purple-800 mb-2">Level Progress</h3>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        {gameTypes.map(game => {
          const count = levelProgress[game] || 0;
          const isComplete = count >= goal;
          // Format name like "Number Bonds"
          const gameName = game.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

          return (
            <div key={game} className="text-sm text-gray-700">
              <span>{gameName}: </span>
              <span className={`font-bold ${isComplete ? 'text-green-500' : 'text-yellow-600'}`}>
                {count} / {goal} {isComplete && '✅'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;