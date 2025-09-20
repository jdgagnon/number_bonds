import React, { useState } from 'react';
import { generateWordProblem } from './ReadingHelpers';
import WordBuilder from './WordBuilder';
import Feedback from '../components/Feedback';

const ReadingGame = () => {
  const [problem, setProblem] = useState(() => generateWordProblem());
  const [placedLetters, setPlacedLetters] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleTileClick = (tile) => {
    // Add the clicked letter to the answer
    const newPlacedLetters = [...placedLetters, tile.content];
    setPlacedLetters(newPlacedLetters);

    // Check if the word is now complete and correct
    if (newPlacedLetters.length === problem.word.length) {
      const userAnswer = newPlacedLetters.join('');
      if (userAnswer === problem.word) {
        setFeedback({ type: 'correct', message: '✅ Great Job!' });
        setTimeout(() => {
          setProblem(generateWordProblem());
          setPlacedLetters([]);
          setFeedback({ type: '', message: '' });
        }, 1500);
      } else {
        setFeedback({ type: 'incorrect', message: '❌ Oops, try again!' });
      }
    }
  };

  const handleClear = () => {
    setPlacedLetters([]);
    setFeedback({ type: '', message: '' });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-emerald-50">
      <div className="w-full max-w-md p-6 bg-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-4">Word Builder</h2>
        <WordBuilder 
          problem={problem}
          placedLetters={placedLetters}
          onTileClick={handleTileClick}
          onClear={handleClear}
        />
        <Feedback feedback={feedback} />
      </div>
    </div>
  );
};

export default ReadingGame;