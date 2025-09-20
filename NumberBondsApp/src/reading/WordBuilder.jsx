import React from 'react';

const WordBuilder = ({ problem, placedLetters, onTileClick, onClear }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Image for the word */}
      <img src={problem.image} alt={problem.word} className="w-32 h-32 mb-4" />

      {/* Answer Area */}
      <div className="flex items-center gap-2">
        <div className="flex gap-2 p-4 bg-gray-200 rounded-lg min-h-[80px] min-w-[200px]">
          {placedLetters.map((letter, index) => (
            <div key={index} className="w-14 h-14 bg-white text-3xl font-bold text-purple-700 flex items-center justify-center rounded-md shadow-md">
              {letter}
            </div>
          ))}
        </div>
        {/* Clear Button */}
        <button onClick={onClear} className="w-14 h-14 bg-red-500 text-white text-3xl font-bold rounded-full shadow-lg hover:bg-red-600">
          X
        </button>
      </div>
      
      {/* Letter Tiles Area */}
      <div className="flex flex-wrap justify-center gap-2 p-4 mt-6">
        {problem.tiles.map((tile, index) => (
          <button
            key={index}
            onClick={() => onTileClick(tile)}
            className="w-14 h-14 bg-sky-400 text-3xl font-bold text-white flex items-center justify-center rounded-md shadow-lg hover:bg-sky-500"
          >
            {tile.content}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WordBuilder;