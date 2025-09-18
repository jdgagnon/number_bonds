import React from 'react';

const RollButton = ({ onClick, disabled }) => {
  return (
    <div className="flex justify-center my-4">
      <button 
        onClick={onClick}
        disabled={disabled}
        className="px-8 py-4 bg-green-500 text-white font-bold text-2xl rounded-lg shadow-lg hover:bg-green-600 disabled:bg-gray-400"
      >
        Roll Dice! 🎲
      </button>
    </div>
  );
};

export default RollButton;