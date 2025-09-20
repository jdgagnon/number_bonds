import React, { useState, useEffect } from 'react';

const GAME_TYPES = ['numberBond', 'comparison', 'pattern', 'weightPuzzle', 'numberLadder', 'shapePuzzle', 'diceGame'];

const ProgressReport = ({ onClose, onClear, levelProgress, setLevelProgress }) => { 
  const [editableStars, setEditableStars] = useState(0);
  const [editableLevel, setEditableLevel] = useState(0);
  const [selectedGame, setSelectedGame] = useState('');

  useEffect(() => {
    if (selectedGame && levelProgress && levelProgress[selectedGame]) {
      setEditableStars(levelProgress[selectedGame].stars || 0);
      // FIX: Corrected the typo
      setEditableLevel(levelProgress[selectedGame].level || 0);
    } else {
      setEditableStars(0);
      setEditableLevel(0);
    }
  }, [selectedGame, levelProgress]);

  const handleSaveData = () => {
    if (!selectedGame) {
      alert("Please select a game to edit.");
      return;
    }
    
    const newStars = Number(editableStars);
    const newLevel = Number(editableLevel);

    setLevelProgress(prev => {
      const newProgress = {
        ...prev,
        [selectedGame]: {
          ...(prev[selectedGame] || { correct: 0, progress: 0 }),
          stars: newStars,
          level: newLevel,
        }
      };
      localStorage.setItem('mathGameLevelProgress', JSON.stringify(newProgress));
      return newProgress;
    });

    alert("Rewards data saved!");
  };

  const handleClearStats = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to permanently delete all your progress data?"
    );

    if (isConfirmed) {
      localStorage.removeItem('mathGameStats');
      localStorage.removeItem('mathGameLevelProgress');
      if (onClear) {
        onClear();
      }
      window.location.reload();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Your Progress Report 📈</h2>
      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
        {levelProgress && Object.keys(levelProgress).length > 0 ? (
          Object.entries(levelProgress).map(([gameType, data]) => {
            const gameName = gameType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const mainStats = JSON.parse(localStorage.getItem('mathGameStats')) || {};
            const gameMainStats = mainStats[gameType] || { correct: 0, totalAttempts: 0 };
            const percentCorrect = gameMainStats.totalAttempts > 0 
              ? ((gameMainStats.correct / gameMainStats.totalAttempts) * 100).toFixed(0) 
              : 0;
            
            return (
              <div key={gameType} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="text-xl font-bold capitalize text-gray-800">{gameName}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-semibold text-purple-600">{data.level || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Stars:</span>
                  <span className="font-semibold text-yellow-500">{data.stars || 0} / 5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Correctness:</span>
                  <span className="font-semibold text-green-600">{percentCorrect}%</span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-700">No data yet. Play a few rounds!</p>
        )}
      </div>
      
      {/* --- Manual Editor Section --- */}
      <div className="mt-6 p-4 border-t-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Edit Rewards</h3>
        {/* This container will now wrap its contents */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          {/* Dropdown for game selection */}
          <select 
            onChange={(e) => setSelectedGame(e.target.value)} 
            value={selectedGame} 
            className="difficulty-dropdown"
          >
            <option value="">Select Game...</option>
            {GAME_TYPES.map(gameType => {
              const gameName = gameType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return <option key={gameType} value={gameType}>{gameName}</option>;
            })}
          </select>
          
          {/* Group the two input fields together */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <label htmlFor="stars-select" className="font-semibold text-gray-600 text-sm text-center">Stars</label>
                {/* NEW: Stars Dropdown */}
                <select
                  id="stars-select"
                  value={editableStars}
                  onChange={(e) => setEditableStars(e.target.value)}
                  className="difficulty-dropdown"
                >
                  {/* Create options for 0 to 5 stars */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="level-select" className="font-semibold text-gray-600 text-sm text-center">Level</label>
                {/* NEW: Level Dropdown */}
                <select
                  id="level-select"
                  value={editableLevel}
                  onChange={(e) => setEditableLevel(e.target.value)}
                  className="difficulty-dropdown"
                >
                  {/* Create options for level 0 to 50 */}
                  {Array.from({ length: 51 }).map((_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>

          {/* Save button */}
          <button 
            onClick={handleSaveData} 
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
      
      <div className="flex justify-center items-center gap-4 mt-6 border-t-2 border-gray-200 pt-4">
        <button 
          onClick={onClose} 
          className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
        >
          Close
        </button>
        <button 
          onClick={handleClearStats} 
          className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
        >
          Clear Progress
        </button>
      </div>
    </div>
  );
};

export default ProgressReport;