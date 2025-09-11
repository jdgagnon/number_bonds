import React from "react";

const ProgressBar = ({ progress, goal }) => {
  const percentage = (progress / goal) * 100;

  return (
    <div className="w-full max-w-sm mb-4">
      <h3 className="text-center text-xl font-bold text-yellow-500 mb-2">⭐ Star Power ⭐</h3>
      <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
        <div
          style={{ width: `${percentage}%` }}
          className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-500 ease-out"
        />
      </div>
    </div>
  );
};

export default ProgressBar;