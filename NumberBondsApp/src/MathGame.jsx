import React, { useState, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import NumberBond from "./NumberBond";
import NumberPad from "./NumberPad";
import ProgressBar from "./ProgressBar";

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
  { text: `___ + ${p.part2} = ${p.whole}`, answer: p.part1 },
  { text: `${p.part1} + ___ = ${p.whole}`, answer: p.part2 },
  { text: `${p.whole} - ${p.part1} = ___`, answer: p.part2 },
  { text: `${p.whole} - ___ = ${p.part2}`, answer: p.part1 },
];

const CORRECT_MESSAGES = ["Awesome!", "You got it!", "Super!", "Brilliant!", "Fantastic!"];

// --- Main Component ---
const MathGame = () => {
  const [maxTotal, setMaxTotal] = useState(10);
  const [problem, setProblem] = useState(() => generateProblem(maxTotal));
  const [sentences, setSentences] = useState(() => generateSentences(problem));
  const [stage, setStage] = useState("bond"); // 'bond' or 'sentence'
  const [feedback, setFeedback] = useState({ type: "", message: "" }); // 'correct' or 'incorrect'
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);

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
  }, [maxTotal]);

  const handleCorrectAnswer = () => {
    const newProgress = progress + 1;
    const randomMessage = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
    setFeedback({ type: "correct", message: `✅ ${randomMessage}` });

    if (newProgress >= goal) {
      setProgress(0);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } else {
      setProgress(newProgress);
    }
    
    // Transition to the next stage/problem after a short delay
    setTimeout(() => {
      if (stage === "bond") {
        setStage("sentence");
        setFeedback({ type: "", message: "" });
      } else if (currentSentenceIdx < sentences.length - 1) {
        setCurrentSentenceIdx(currentSentenceIdx + 1);
        setFeedback({ type: "", message: "" });
      } else {
        moveToNextProblem();
      }
    }, 1200);
  };

  const handleIncorrectAnswer = () => {
    setFeedback({ type: "incorrect", message: "❌ Oops, try again!" });
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
      handleCorrectAnswer();
    } else {
      handleIncorrectAnswer();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-50 font-sans p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      
      {/* --- Settings --- */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
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

      <ProgressBar progress={progress} goal={goal} />

       {/* --- Main Game Card --- */}
      {/* Make this parent div 'relative' for absolute positioning of confetti */}
      <motion.div 
        key={problem.whole + problem.part1} 
        initial={{ opacity: 0, y: -50, rotate: -5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        className="relative w-full max-w-sm p-6 bg-white rounded-3xl shadow-2xl border-4 border-purple-300 overflow-hidden" // Added overflow-hidden to contain confetti
      >
        {/* Confetti burst - now positioned absolutely within the card */}
        {showConfetti && (
          <Confetti
            // Remove width and height props; Confetti will adapt to its parent's size
            // width={width}
            // height={height}
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

        {/* --- The Question Area --- */}
        <div className="text-center min-h-[180px]">
          {stage === 'bond' ? (
            <NumberBond problem={problem} />
          ) : (
            <div className="flex justify-center items-center h-full text-4xl font-bold text-gray-700 tracking-wider">
              {sentences[currentSentenceIdx].text}
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
      </motion.div>
    </div>
  );
};

export default MathGame;