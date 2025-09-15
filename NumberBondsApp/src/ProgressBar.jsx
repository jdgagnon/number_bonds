import React from 'react';

const ProgressBar = ({ progress, goal, isComplete }) => {
  const percent = goal > 0 ? (progress / goal) * 100 : 0;
  
  // Use a green color when the goal for this game is complete
  const barColor = isComplete ? 'bg-green-400' : 'bg-yellow-400';
  const textColor = isComplete ? 'text-green-800' : 'text-yellow-800';

  return (
    <div className="relative w-full bg-gray-200 rounded-full h-8 shadow-inner overflow-hidden border-2 border-white">
      <div 
        className={`absolute top-0 left-0 h-full ${barColor} transition-all duration-500 ease-out`}
        style={{ width: `${percent}%` }}
      ></div>
      <div className={`relative z-10 flex items-center justify-center h-full font-bold ${textColor}`}>
        {progress} / {goal}
      </div>
    </div>
  );
};

export default ProgressBar;