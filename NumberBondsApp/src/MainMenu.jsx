import React from 'react';

const MainMenu = ({ onSelectSection }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-50">
      <h1 className="text-5xl font-bold text-purple-700 mb-8">Choose Your Adventure!</h1>
      <div className="flex gap-8">
        <button 
          onClick={() => onSelectSection('math')}
          className="px-12 py-8 bg-sky-500 text-white font-bold text-3xl rounded-xl shadow-lg hover:bg-sky-600"
        >
          Math ➕
        </button>
        <button 
          onClick={() => onSelectSection('reading')}
          className="px-12 py-8 bg-emerald-500 text-white font-bold text-3xl rounded-xl shadow-lg hover:bg-emerald-600"
        >
          Reading 📚
        </button>
      </div>
    </div>
  );
};

export default MainMenu;