import React, { useState, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import NumberBond from "./NumberBond";
import NumberPad from "./NumberPad";
import ProgressBar from "./ProgressBar";
import StarTracker from './StarTracker';
import CountingCubes from './CountingCubes';
import OperatorButtons from './OperatorButtons';
import CubeDisplay from './CubeDisplay';

// --- Helper Functions ---
const generateProblem = (maxTotal) => {
  if (maxTotal < 2) return { part1: 1, part2: 1, whole: 2, blank: "whole" };

  const part1 = Math.floor(Math.random() * (maxTotal - 1)) + 1;
  const maxPart2 = maxTotal - part1;
  const part2 = Math.floor(Math.random() * maxPart2) + 1;
  const whole = part1 + part2;

  const blanks = ["whole", "left", "right"];
  const blank = blanks[Math.floor(Math.random() * 3)];

  return { part1, part2, whole, blank };
};

const generateSentences = (p) => [
  { text: `? + ${p.part2} = ${p.whole}`, answer: p.part1 },
  { text: `${p.part1} + ? = ${p.whole}`, answer: p.part2 },
  { text: `${p.whole} - ${p.part1} = ?`, answer: p.part2 },
  { text: `${p.whole} - ? = ${p.part2}`, answer: p.part1 },
];

const generateComparisonProblem = (max) => {
  const num1 = Math.floor(Math.random() * (max + 1));
  let num2;
  // Give a 20% chance for the numbers to be equal
  if (Math.random() < 0.2) {
    num2 = num1;
  } else {
    num2 = Math.floor(Math.random() * (max + 1));
  }

  let answer;
  if (num1 > num2) answer = '>';
  else if (num1 < num2) answer = '<';
  else answer = '=';

  return { num1, num2, answer };
};

const CORRECT_MESSAGES = ["Awesome!", "You got it!", "Super!", "Brilliant!", "Fantastic!"];

// --- Main Component ---
const MathGame = () => {
  const [gameMode, setGameMode] = useState('numberBond'); // 'numberBond' or 'comparison'
  const [comparisonProblem, setComparisonProblem] = useState(() => generateComparisonProblem(10));
  const [filledOperator, setFilledOperator] = useState(null);
  const [maxTotal, setMaxTotal] = useState(10);
  const [problem, setProblem] = useState(() => generateProblem(maxTotal));
  const [sentences, setSentences] = useState(() => generateSentences(problem));
  const [stage, setStage] = useState("bond"); // 'bond' or 'sentence'
  const [feedback, setFeedback] = useState({ type: "", message: "" }); // 'correct' or 'incorrect'
  const [progress, setProgress] = useState(0);
  const [stars, setStars] = useState(0);
  const [starLevel, setStarLevel] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [filledAnswer, setFilledAnswer] = useState(null);
  const [filledSentenceAnswer, setFilledSentenceAnswer] = useState(null);
  const goal = 5;

  // Re-generate problem when maxTotal changes
  useEffect(() => {
    moveToNextProblem();
  }, [maxTotal]);

  const moveToNextProblem = useCallback(() => {
    const newProblem = generateProblem(maxTotal);
    setProblem(newProblem);
    setSentences(generateSentences(newProblem));
    setStage("bond");
    setFeedback({ type: "", message: "" });
    setCurrentSentenceIdx(0);
    setFilledAnswer(null);
    setFilledSentenceAnswer(null); // Ensure this is reset
  }, [maxTotal]);

  const handleComparisonAnswer = (op) => {
    if (op === comparisonProblem.answer) {
      setFilledOperator(op);
      handleCorrectAnswer(); // We can reuse the same correct/incorrect handlers!
      // After a delay, generate a new problem
      setTimeout(() => {
        setComparisonProblem(generateComparisonProblem(maxTotal));
        setFilledOperator(null);
      }, 1200);
    } else {
      handleIncorrectAnswer();
    }
  };

  const handleCorrectAnswer = () => {
    // Determine if the goal will be met on this turn
    const isGoalMet = (progress + 1) >= goal;
    const transitionDelay = isGoalMet ? 4000 : 1200;

    setFeedback({ type: "correct", message: `✅ Great job!` });

    // Handle awarding stars and confetti if the goal is met
    // This logic is now separate and will only run once
    if (isGoalMet) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      
      setStars(prevStars => {
        if (prevStars === 5) {
          setStarLevel(prevLevel => prevLevel + 1);
          return 1; // Reset to 1 star for the new level
        }
        return prevStars + 1; // Otherwise, just add a new star
      });
    }

    // Use a functional update for progress to prevent stale state
    setProgress(prevProgress => {
      const newProgress = prevProgress + 1;
      if (newProgress >= goal) {
        return 0; // Just reset the progress bar
      }
      return newProgress; // Otherwise, just increment progress
    });
    
    // Schedule the next game step using the calculated delay
    setTimeout(() => {
      setFeedback({ type: "", message: "" });

      if (stage === 'bond') {
        setStage('sentence');
      } else if (currentSentenceIdx < sentences.length - 1) {
        setFilledSentenceAnswer(null); 
        setCurrentSentenceIdx(prevIdx => prevIdx + 1);
      } else {
        moveToNextProblem();
      }
    }, transitionDelay);
  };

  const handleIncorrectAnswer = () => {
    setFeedback({ type: "incorrect", message: "❌ Oops, try again!" });
    setProgress(prevProgress => Math.max(0, prevProgress - 1));
  };

  const handleAnswer = (value) => {
    let correctAnswer;
    if (stage === "bond") {
      correctAnswer =
        problem.blank === "whole"
          ? problem.whole
          : problem.blank === "left"
          ? problem.part1
          : problem.part2;
    } else {
      correctAnswer = sentences[currentSentenceIdx].answer;
    }

    if (value === correctAnswer) {
      // Set the appropriate answer for animation here
      if (stage === 'bond') {
        setFilledAnswer(correctAnswer);
      } else {
        setFilledSentenceAnswer(correctAnswer);
      }
      // Then, handle the rest of the logic
      handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  };

  const problemKey = `${problem.part1}-${problem.part2}-${currentSentenceIdx}`;
  const activeSentence = sentences[currentSentenceIdx];
  const [partBefore, partAfter] = activeSentence.text.split('?');

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-50 font-sans p-4">
      {/* --- Game Mode Switcher --- */}
      <div className="flex gap-2 p-2 bg-purple-200 rounded-lg mb-4">
        <button onClick={() => setGameMode('numberBond')} className={`px-4 py-2 rounded-md font-semibold ${gameMode === 'numberBond' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}>Number Bonds</button>
        <button onClick={() => setGameMode('comparison')} className={`px-4 py-2 rounded-md font-semibold ${gameMode === 'comparison' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}>Comparison (&lt; &gt; =)</button>
      </div>
      
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

       {/* --- Star Tracker and Progress Bar --- */}
        <div className="w-full max-w-sm">
          <ProgressBar progress={progress} goal={goal} />
          <StarTracker count={stars} level={starLevel} />
        </div>

      {/* --- Main Game Card --- */}
      <motion.div 
        key={gameMode} // Animate when game mode changes
        initial={{ opacity: 0, y: -50, rotate: -5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        className="relative w-full max-w-sm p-6 bg-white rounded-3xl shadow-2xl border-4 border-purple-300 overflow-hidden" // Added overflow-hidden to contain confetti
      >
        {/* Confetti burst - now positioned absolutely within the card */}
        {showConfetti && (
          <Confetti
            recycle={false}
            numberOfPieces={200} // A few less pieces for a contained burst
            gravity={0.1} // Less gravity for a gentle fall within the card
            initialVelocityY={-5} // Less initial velocity
            // Position it absolutely to cover the card
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 50,
              pointerEvents: "none",
            }}
          />
        )}

        {/* --- CONDITIONAL UI RENDERING BASED ON GAME MODE --- */}

        {gameMode === 'numberBond' ? (
          // --- NUMBER BOND GAME UI ---
          <>
          {/* --- The Question Area --- */}
        <div className="text-center min-h-[180px]">
          <div className="mb-4">
            <CountingCubes 
              key={problemKey} 
              part1={problem.part1} 
              part2={problem.part2} />
          </div>
          {stage === 'bond' ? (
            <NumberBond problem={problem} filledAnswer={filledAnswer} />
          ) : (
            <div className="flex justify-center items-center h-full text-4xl font-bold text-gray-700 tracking-wider min-h-[160px]">
              <span>{partBefore}</span>
              {filledSentenceAnswer !== null ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="inline-block px-2 text-purple-600"
                >
                  {filledSentenceAnswer}
                </motion.span>
              ) : (
                <span className="px-2">?</span>
              )}
              <span>{partAfter}</span>
            </div>
          )}
        </div>
        
        {/* Feedback Message */}
        <div className="text-center h-8 my-2 text-2xl font-semibold">
          {feedback.message && (
             <motion.p
                key={feedback.message}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={feedback.type === 'incorrect' ? 'text-red-500' : 'text-green-500'}
             >
                {feedback.message}
             </motion.p>
          )}
        </div>
        
        {/* Number Pad */}
        <NumberPad 
          maxNumber={maxTotal} 
          onNumberClick={handleAnswer} 
          disabled={feedback.type === 'correct'}
        />
          </>
          ) : (
          // --- NEW: COMPARISON GAME UI ---
          <div>
            <div className="flex justify-around items-center text-center">
              {/* Left Side */}
              <div className="w-1/3">
                <CubeDisplay count={comparisonProblem.num1} color="bg-sky-400" />
                <div className="text-6xl font-bold text-gray-700">{comparisonProblem.num1}</div>
              </div>
              
              {/* Middle Operator */}
              <div className="w-1/3 flex justify-center items-center h-24">
                {filledOperator ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl font-bold text-purple-600">{filledOperator}</motion.div>
                ) : (
                  <div className="w-20 h-20 border-4 border-dashed border-gray-300 rounded-full"></div>
                )}
              </div>

              {/* Right Side */}
              <div className="w-1/3">
                <CubeDisplay count={comparisonProblem.num2} color="bg-amber-400" />
                <div className="text-6xl font-bold text-gray-700">{comparisonProblem.num2}</div>
              </div>
            </div>
            <OperatorButtons onSelect={handleComparisonAnswer} disabled={filledOperator !== null} />
          </div>
        )}

      </motion.div>

      {/* --- Settings --- */}
      <div className="mt-6 bg-white p-3 rounded-lg shadow-md">
        <label htmlFor="maxTotal" className="font-bold text-gray-600">Max Total: </label>
        <input
          type="number"
          id="maxTotal"
          value={maxTotal}
          min={2}
          max={99}
          onChange={(e) => setMaxTotal(Number(e.target.value))}
          className="w-16 p-1 border-2 border-gray-200 rounded-md text-center"
        />
      </div>
    </div>
  );
};

export default MathGame;