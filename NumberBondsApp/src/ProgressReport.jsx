import React, { useState, useEffect } from 'react';

const ProgressReport = ({ onClose }) => {
  const [stats, setStats] = useState(null);

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
    }
  };

  if (!stats) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full text-center">
        <p className="text-gray-700">No progress data yet. Play a few rounds!</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Your Progress Report 📈</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {Object.entries(stats).map(([gameType, data]) => {
          const percentCorrect = data.totalAttempts > 0 ? ((data.correct / data.totalAttempts) * 100).toFixed(0) : 0;

          return (
            <div key={gameType} className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-xl font-bold capitalize text-gray-800">{gameType.replace(/([A-Z])/g, ' $1')}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Correctness:</span>
                <span className="font-semibold text-green-600">{percentCorrect}%</span>
              </div>
               <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Attempts:</span>
                <span className="font-semibold text-gray-500">{data.totalAttempts}</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* UPDATE: Add a flex container for the buttons */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button onClick={onClose} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold">
          Close
        </button>
        {/* NEW: The button to clear stats */}
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