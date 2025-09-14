import React, { useState, useEffect } from 'react';

const ProgressReport = ({ onClose, onClear, stars, setStars, starLevel, setStarLevel }) => { 
  const [stats, setStats] = useState(null);

  // NEW: Add local state to manage the input fields
  const [editableStars, setEditableStars] = useState(stars);
  const [editableLevel, setEditableLevel] = useState(starLevel);

  useEffect(() => {
    const savedStats = JSON.parse(localStorage.getItem('mathGameStats'));
    if (savedStats) {
      setStats(savedStats);
    }
  }, []);

  // NEW: Add a function to handle clearing the stats
  const handleClearStats = () => {
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to permanently delete all your progress data?"
    );

    if (isConfirmed) {
      // Remove the item from localStorage
      localStorage.removeItem('mathGameStats');
      // Update the component's state to show that the data is gone
      setStats(null);
      onClear();
    }
  };

  const handleSaveStarData = () => {
    const newStars = Number(editableStars);
    const newLevel = Number(editableLevel);

    // Update the parent component's state
    setStars(newStars);
    setStarLevel(newLevel);

    // Save the new values to localStorage
    localStorage.setItem('mathGameStars', JSON.stringify(newStars));
    localStorage.setItem('mathGameStarLevel', JSON.stringify(newLevel));

    alert("Star and Level data saved!"); // Give user feedback
  };

  if (!stats) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full text-center">
        <p className="text-gray-700">No progress data yet. Play a few rounds!</p>
        {/* --- NEW: Manual Editor Section --- */}
        <div className="mt-6 p-4 border-t-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Edit Rewards</h3>
          <div className="flex justify-around items-center gap-4">
            <div className="flex flex-col">
              <label htmlFor="stars-input" className="font-semibold text-gray-600">Stars</label>
              <input
                id="stars-input"
                type="number"
                value={editableStars}
                onChange={(e) => setEditableStars(e.target.value)}
                className="w-20 p-2 border-2 border-gray-300 rounded-md text-center"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="level-input" className="font-semibold text-gray-600">Level</label>
              <input
                id="level-input"
                type="number"
                value={editableLevel}
                onChange={(e) => setEditableLevel(e.target.value)}
                className="w-20 p-2 border-2 border-gray-300 rounded-md text-center"
              />
            </div>
            <button 
              onClick={handleSaveStarData} 
              className="self-end px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Your Progress Report 📈</h2>
      
      {/* --- The stats display section remains the same --- */}
      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
        {stats ? Object.entries(stats).map(/*...*/) : <p>No game data yet.</p>}
      </div>

      {/* --- NEW: Manual Editor Section --- */}
      <div className="mt-6 p-4 border-t-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Edit Rewards</h3>
        <div className="flex justify-around items-center gap-4">
          <div className="flex flex-col">
            <label htmlFor="stars-input" className="font-semibold text-gray-600">Stars</label>
            <input
              id="stars-input"
              type="number"
              value={editableStars}
              onChange={(e) => setEditableStars(e.target.value)}
              className="w-20 p-2 border-2 border-gray-300 rounded-md text-center"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="level-input" className="font-semibold text-gray-600">Level</label>
            <input
              id="level-input"
              type="number"
              value={editableLevel}
              onChange={(e) => setEditableLevel(e.target.value)}
              className="w-20 p-2 border-2 border-gray-300 rounded-md text-center"
            />
          </div>
          <button 
            onClick={handleSaveStarData} 
            className="self-end px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>

      {/* --- Buttons Section --- */}
      <div className="flex justify-center items-center gap-4 mt-6 border-t-2 border-gray-200 pt-4">
        <button onClick={onClose} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold">
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