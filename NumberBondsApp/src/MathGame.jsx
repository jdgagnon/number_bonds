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
import MultipleChoice from './MultipleChoice';
import Feedback from './Feedback';
import DancingUnicorn from './DancingUnicorn'; 

// --- Helper Functions ---
const generateBondChoices = (correctAnswer, max) => {
  const choices = new Set([correctAnswer]);
  while (choices.size < 8) {
    const randomChoice = Math.floor(Math.random() * (max + 1));
    choices.add(randomChoice);
  }
  return Array.from(choices).sort(() => Math.random() - 0.5);
};

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

const generatePatternProblem = (max) => {
  const skipOptions = [1, 2, 5, 10];
  const skipCount = skipOptions[Math.floor(Math.random() * skipOptions.length)];
  const sequenceLength = 3;
  
  // Ensure the pattern doesn't go too high
  const startNumber = Math.floor(Math.random() * (max / 2));
  
  const sequence = Array.from({ length: sequenceLength }, (_, i) => startNumber + (i * skipCount));
  const answer = startNumber + (sequenceLength * skipCount);

  // Create distractor choices
  const choices = new Set([answer]);
  while (choices.size < 4) {
    const wrongAnswer = answer + (Math.floor(Math.random() * 5) - 2) * skipCount;
    if (wrongAnswer > 0 && wrongAnswer !== answer) {
      choices.add(wrongAnswer);
    }
  }
  
  // Shuffle the choices
  const shuffledChoices = Array.from(choices).sort(() => Math.random() - 0.5);

  return { sequence, choices: shuffledChoices, answer };
};

const CORRECT_MESSAGES = ["Awesome!", "You got it!", "Super!", "Brilliant!", "Fantastic!"];

// --- Main Component ---
const MathGame = () => {
  const [gameMode, setGameMode] = useState('numberBond'); // 'numberBond', 'comparison', or 'pattern'
  const [patternProblem, setPatternProblem] = useState(() => generatePatternProblem(20));
  const [filledPatternAnswer, setFilledPatternAnswer] = useState(null);
  const [comparisonProblem, setComparisonProblem] = useState(() => generateComparisonProblem(10));
  const [filledOperator, setFilledOperator] = useState(null);
  const [maxTotal, setMaxTotal] = useState(10);
  const [problem, setProblem] = useState(() => generateProblem(maxTotal));
  const [numberBondChoices, setNumberBondChoices] = useState(() => {
    const initialProblem = generateProblem(10);
    setProblem(initialProblem); // Set initial problem here too
    const { part1, part2, whole, blank } = initialProblem;
    const answer = blank === 'whole' ? whole : blank === 'left' ? part1 : part2;
    return generateBondChoices(answer, 10);
  });
  const [sentences, setSentences] = useState(() => generateSentences(problem));
  const [stage, setStage] = useState("bond"); // 'bond' or 'sentence'
  const [feedback, setFeedback] = useState({ type: "", message: "" }); // 'correct' or 'incorrect'
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [filledAnswer, setFilledAnswer] = useState(null);
  const [filledSentenceAnswer, setFilledSentenceAnswer] = useState(null);
  const goal = 5;
  const [stars, setStars] = useState(() => {
    const savedStars = localStorage.getItem('mathGameStars');
    return savedStars !== null ? JSON.parse(savedStars) : 0;
  });

  const [starLevel, setStarLevel] = useState(() => {
    const savedLevel = localStorage.getItem('mathGameStarLevel');
    return savedLevel !== null ? JSON.parse(savedLevel) : 0;
  });
  

  useEffect(() => {
    localStorage.setItem('mathGameStars', JSON.stringify(stars));
    localStorage.setItem('mathGameStarLevel', JSON.stringify(starLevel));
  }, [stars, starLevel]);

  // Re-generate problem when maxTotal changes
  useEffect(() => {
    if (gameMode !== 'numberBond') return; // Only run for the number bond game

    let correctAnswer;
    if (stage === 'bond') {
      const { part1, part2, whole, blank } = problem;
      correctAnswer = blank === 'whole' ? whole : blank === 'left' ? part1 : part2;
    } else { // stage is 'sentence'
      correctAnswer = sentences[currentSentenceIdx].answer;
    }
    
    // Generate and set a fresh set of choices
    setNumberBondChoices(generateBondChoices(correctAnswer, maxTotal));
  }, [problem, stage, currentSentenceIdx, gameMode, sentences, maxTotal]);

  const moveToNextProblem = useCallback(() => {
    const newProblem = generateProblem(maxTotal);
    setProblem(newProblem);
    setSentences(generateSentences(newProblem));
    setStage("bond");
    setFeedback({ type: "", message: "" });
    setCurrentSentenceIdx(0);
    setFilledAnswer(null);
    setFilledSentenceAnswer(null);
    // REMOVED choice generation logic from here
  }, [maxTotal]);

  const handlePatternAnswer = (choice) => {
    if (choice === patternProblem.answer) {
      const randomMessage = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
      setFeedback({ type: "correct", message: `✅ ${randomMessage}` });
      setFilledPatternAnswer(choice);
      awardPoint();
      
      // ADD THESE TWO LINES
      const isGoalMet = (progress + 1) >= goal;
      const transitionDelay = isGoalMet ? 4000 : 1200;
      
      setTimeout(() => {
        setPatternProblem(generatePatternProblem(maxTotal * 2));
        setFilledPatternAnswer(null);
        setFeedback({ type: "", message: "" });
      }, transitionDelay); // Use the calculated delay
    } else {
      handleIncorrectAnswer();
    }
  };
  
  const handleComparisonAnswer = (op) => {
    if (op === comparisonProblem.answer) {
      const randomMessage = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
      setFeedback({ type: "correct", message: `✅ ${randomMessage}` });
      setFilledOperator(op);
      awardPoint();
      
      // ADD THESE TWO LINES
      const isGoalMet = (progress + 1) >= goal;
      const transitionDelay = isGoalMet ? 4000 : 1200;
      
      setTimeout(() => {
        setComparisonProblem(generateComparisonProblem(maxTotal));
        setFilledOperator(null);
        setFeedback({ type: "", message: "" });
      }, transitionDelay); // Use the calculated delay
    } else {
      handleIncorrectAnswer();
    }
  };

  const awardPoint = () => {
    const isGoalMet = (progress + 1) >= goal;

    // Handle star leveling and confetti
    if (isGoalMet) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      
      // This corrected logic checks the number of stars at the right time
      setStars(prevStars => {
      if (prevStars === 5) {
        // Use a functional update for starLevel to avoid stale state
        setStarLevel(prevLevel => {
          const newLevel = prevLevel + 1;
          // Don't let the level number itself reset, just let the colors loop in the StarTracker
          return newLevel;
        });
        return 1;
      }
      return prevStars + 1;
    });
  }

    // Handle progress bar updates
    setProgress(prevProgress => {
      const newProgress = prevProgress + 1;
      return newProgress >= goal ? 0 : newProgress;
    });
  };

  const handleIncorrectAnswer = () => {
    setFeedback({ type: "incorrect", message: "❌ Oops, try again!" });
    setProgress(prevProgress => Math.max(0, prevProgress - 1));
  };

  const handleAnswer = (value) => {
    let correctAnswer;
    if (stage === "bond") {
      correctAnswer = problem.blank === "whole" ? problem.whole : problem.blank === "left" ? problem.part1 : problem.part2;
    } else {
      correctAnswer = sentences[currentSentenceIdx].answer;
    }

    if (value === correctAnswer) {
      const randomMessage = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
      setFeedback({ type: "correct", message: `✅ ${randomMessage}` });

      if (stage === 'bond') setFilledAnswer(correctAnswer);
      else setFilledSentenceAnswer(correctAnswer);
      
      awardPoint(); // Call the generic scoring function

      const isGoalMet = (progress + 1) >= goal;
      const transitionDelay = isGoalMet ? 4000 : 1200;
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
    } else {
      handleIncorrectAnswer();
    }
  };

  const problemKey = `${problem.part1}-${problem.part2}-${currentSentenceIdx}`;
  const activeSentence = sentences[currentSentenceIdx];
  const [partBefore, partAfter] = activeSentence.text.split('?');
  const isMasteryLevel = starLevel >= 10;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-50 font-sans p-4 overflow-x-hidden">
      {/* --- Game Mode Switcher --- */}
      <div className="flex gap-2 p-2 bg-purple-200 rounded-lg mb-4">
        <button onClick={() => setGameMode('numberBond')} className={`px-4 py-2 rounded-md font-semibold ${gameMode === 'numberBond' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}>Number Bonds</button>
        <button onClick={() => setGameMode('comparison')} className={`px-4 py-2 rounded-md font-semibold ${gameMode === 'comparison' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}>Comparison</button>
        <button onClick={() => setGameMode('pattern')} className={`px-4 py-2 rounded-md font-semibold ${gameMode === 'pattern' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}>Patterns</button>
      </div>
      
      <ProgressBar progress={progress} goal={goal} />
      {isMasteryLevel && <DancingUnicorn />}

        <div className="w-full max-w-sm relative h-20">
        {/*
          This container will now be positioned relative to allow the stars
          to be positioned absolutely inside it for the rolling animation.
        */}
        
        {/* --- STAR TRACKER LOGIC --- */}
        {isMasteryLevel ? (
          // If it's mastery level, wrap the StarTracker in the rolling container
          <div className="animate-card-roll">
            <StarTracker count={stars} level={starLevel} />
          </div>
        ) : (
          // Otherwise, display it normally in the center
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <StarTracker count={stars} level={starLevel} />
          </div>
        )}
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

            {/* Use MultipleChoice instead of NumberPad */}
            <MultipleChoice
              choices={numberBondChoices}
              onSelect={handleAnswer}
              disabled={feedback.type === 'correct'}
              color="purple"
            />
          </>
          ) : gameMode === 'comparison' ? (
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
        ): (
          // --- NEW: PATTERN GAME UI ---
          <div className="text-center min-h-[300px]">
            <h3 className="text-2xl font-bold text-gray-600 mb-4">What number comes next?</h3>
            <div className="flex justify-center items-center text-4xl font-bold text-gray-700 p-4 bg-gray-100 rounded-lg">
              {patternProblem.sequence.map((num) => (
                <React.Fragment key={num}>
                  <span>{num}</span>
                  <span className="mx-3 text-3xl text-gray-400">→</span>
                </React.Fragment>
              ))}
              {filledPatternAnswer !== null ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-purple-600"
                >
                  {filledPatternAnswer}
                </motion.span>
              ) : (
                <span className="text-purple-500">?</span>
              )}
            </div>
            <MultipleChoice
              choices={patternProblem.choices}
              onSelect={handlePatternAnswer}
              disabled={filledPatternAnswer !== null}
            />
          </div>
        )}
        <Feedback feedback={feedback} />

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