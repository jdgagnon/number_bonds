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
import WeightPuzzle from './WeightPuzzle';
import NumberLadder from './NumberLadder';
import ShapePuzzle from './ShapePuzzle';
import ProgressReport from './ProgressReport';

// --- Helper Functions ---
const GAME_TYPES = ['numberBond', 'comparison', 'pattern', 'weightPuzzle', 'numberLadder', 'shapePuzzle'];

const generateRandomProblem = (max) => {
  // 1. Pick a random game type from the list
  const randomType = GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)];
  let problemData;

  // 2. Call the appropriate generator for that type
  switch (randomType) {
    case 'numberBond':
      problemData = generateProblem(max);
      break;
    case 'comparison':
      problemData = generateComparisonProblem(max);
      break;
    case 'pattern':
      problemData = generatePatternProblem(max * 2);
      break;
    case 'weightPuzzle':
      problemData = generateWeightProblem(max);
      break;
    case 'numberLadder':
      problemData = generateLadderProblem(max);
      break;
    case 'shapePuzzle':
      problemData = generateShapeProblem();
      break;
    default:
      problemData = generateProblem(max); // Fallback
  }
  
  // 3. Return an object with both the type and the data
  return { type: randomType, data: problemData };
};

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

const generateWeightProblem = (max) => {
  const leftWeight1 = Math.floor(Math.random() * (max / 2)) + 1;
  const leftWeight2 = Math.floor(Math.random() * (max / 2)) + 1;
  const totalLeft = leftWeight1 + leftWeight2;

  const rightWeight1 = Math.floor(Math.random() * (totalLeft - 1)) + 1;
  const answer = totalLeft - rightWeight1;

  const problem = {
    leftSide: [
      { color: 'bg-sky-400', shape: 'square', weight: leftWeight1 },
      { color: 'bg-sky-400', shape: 'square', weight: leftWeight2 },
    ],
    rightSide: [
      { color: 'bg-amber-400', shape: 'circle', weight: rightWeight1 },
    ],
    unknownShape: { color: 'bg-fuchsia-400', shape: 'square' },
    answer: answer,
  };
  return problem;
};

const generateLadderProblem = (max) => {
  const operations = [
    { text: '+ 2', operation: (n) => n + 2 },
    { text: '- 3', operation: (n) => n - 3, requires: 3 }, // requires: n >= 3
    { text: '+ 5', operation: (n) => n + 5 },
    { text: '+ 10', operation: (n) => n + 10 },
  ];
  
  // Start with a higher number to give subtraction a chance
  const startNumber = Math.floor(Math.random() * 10) + 5; 
  const steps = [];
  const answers = [];
  let currentVal = startNumber;

  for (let i = 0; i < 3; i++) {
    // Filter to only include valid operations
    const validOps = operations.filter(op => {
      // If an operation has a 'requires' property, check if the current value meets it
      // Otherwise, it's always valid (like addition)
      return !op.requires || currentVal >= op.requires;
    });

    // Choose a random operation from the valid list
    const op = validOps[Math.floor(Math.random() * validOps.length)];
    
    steps.push(op);
    currentVal = op.operation(currentVal);
    answers.push(currentVal);
  }

  return { startNumber, steps, answers };
};

const generateShapeProblem = () => {
  const puzzles = [
    {
      question: "How many triangles are in the rocket?",
      answer: 4,
      width: 120,
      height: 160,
      shapes: [
        // Rocket Body (large triangle)
        { type: 'polygon', points: "60,10 20,110 100,110", className: "fill-gray-300 stroke-gray-500 stroke-2" },
        // Nose Cone (small triangle)
        { type: 'polygon', points: "60,10 40,40 80,40", className: "fill-red-500 stroke-red-700 stroke-2" },
        // Left Fin (small triangle)
        { type: 'polygon', points: "20,110 20,80 5,110", className: "fill-blue-500 stroke-blue-700 stroke-2" },
        // Right Fin (small triangle)
        { type: 'polygon', points: "100,110 100,80 115,110", className: "fill-blue-500 stroke-blue-700 stroke-2" },
        // Window (not a triangle, distractor)
        { type: 'rect', x: 50, y: 60, width: 20, height: 20, className: "fill-cyan-200 stroke-cyan-400 stroke-2" }
      ],
    },
    {
      question: "How many rectangles are in the house?",
      answer: 2,
      width: 140,
      height: 140,
      shapes: [
        // House Body (large rectangle)
        { type: 'rect', x: 20, y: 70, width: 100, height: 70, className: "fill-yellow-300 stroke-yellow-500 stroke-2" },
        // Door (small rectangle)
        { type: 'rect', x: 55, y: 100, width: 30, height: 40, className: "fill-orange-400 stroke-orange-600 stroke-2" },
        // Roof (not a rectangle, distractor)
        { type: 'polygon', points: "10,70 130,70 70,20", className: "fill-red-500 stroke-red-700 stroke-2" },
      ]
    }
  ];
  // Return a random puzzle from the list
  return puzzles[Math.floor(Math.random() * puzzles.length)];
};

const updateStats = (gameType, isCorrect) => {
  // 1. Get existing stats from localStorage or create a new object
  const stats = JSON.parse(localStorage.getItem('mathGameStats')) || {};

  // 2. Ensure the gameType entry exists
  if (!stats[gameType]) {
    stats[gameType] = { correct: 0, incorrect: 0, totalAttempts: 0 };
  }

  // 3. Update the stats
  stats[gameType].totalAttempts += 1;
  if (isCorrect) {
    stats[gameType].correct += 1;
  } else {
    stats[gameType].incorrect += 1;
  }

  // 4. Save the updated stats back to localStorage
  localStorage.setItem('mathGameStats', JSON.stringify(stats));
};

// --- CONSTANTS ---
const CORRECT_MESSAGES = ["Awesome!", "You got it!", "Super!", "Brilliant!", "Fantastic!"];

// --- Main Component ---
const MathGame = () => {
  const [showReport, setShowReport] = useState(false);
  const [maxTotal, setMaxTotal] = useState(10);
  const [gameMode, setGameMode] = useState('numberBond'); // 'numberBond', 'comparison', or 'pattern'
  const [patternProblem, setPatternProblem] = useState(() => generatePatternProblem(20));
  const [filledPatternAnswer, setFilledPatternAnswer] = useState(null);
  const [comparisonProblem, setComparisonProblem] = useState(() => generateComparisonProblem(10));
  const [filledOperator, setFilledOperator] = useState(null);
  const [weightProblem, setWeightProblem] = useState(() => generateWeightProblem(10));
  const [filledWeightAnswer, setFilledWeightAnswer] = useState(null);
  const [puzzleAnimation, setPuzzleAnimation] = useState(""); // For tipping animation
  const [ladderProblem, setLadderProblem] = useState(() => generateLadderProblem(10));
  const [ladderStep, setLadderStep] = useState(0); // Which step we are on
  const [filledLadderAnswers, setFilledLadderAnswers] = useState([]);
  const [ladderChoices, setLadderChoices] = useState([]);
  const [weightPuzzleChoices, setWeightPuzzleChoices] = useState([]);
  const [mixedBondChoices, setMixedBondChoices] = useState([]);
  const [shapeProblem, setShapeProblem] = useState(() => generateShapeProblem());
  const [mixedProblem, setMixedProblem] = useState(() => generateRandomProblem(maxTotal));
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

  // Re-generate answer choices for mixedBond
  useEffect(() => {
    if (gameMode === 'mixed' && mixedProblem.type === 'numberBond') {
      const { data } = mixedProblem;
      if (data) {
        const correctAnswer = data.blank === 'whole' ? data.whole : data.blank === 'left' ? data.part1 : data.part2;
        setMixedBondChoices(generateBondChoices(correctAnswer, maxTotal));
      }
    }
    // This stable dependency array prevents the infinite loop
  }, [gameMode, mixedProblem.type, mixedProblem.data?.whole, maxTotal]);

  // Re-generate answer choices for ladderProblem
  useEffect(() => {
    if (gameMode === 'numberLadder' || (gameMode === 'mixed' && mixedProblem.type === 'numberLadder')) {
      const problemSource = gameMode === 'mixed' ? mixedProblem.data : ladderProblem;
      if (problemSource?.answers?.[ladderStep] !== undefined) {
        const correctAnswer = problemSource.answers[ladderStep];
        const maxChoiceValue = Math.max(20, correctAnswer + 10); 
        setLadderChoices(generateBondChoices(correctAnswer, maxChoiceValue));
      }
    }
    // FIX: Make the dependency array more stable
  }, [gameMode, ladderProblem, mixedProblem.data?.answers, ladderStep]);

  // Re-generate answer choices for weightPuzzle
  useEffect(() => {
    if (gameMode === 'weightPuzzle' || (gameMode === 'mixed' && mixedProblem.type === 'weightPuzzle')) {
      const problemSource = gameMode === 'mixed' ? mixedProblem.data : weightProblem;
      if (problemSource?.answer !== undefined) {
        const correctAnswer = problemSource.answer;
        const maxChoiceValue = Math.max(maxTotal, correctAnswer + 5);
        setWeightPuzzleChoices(generateBondChoices(correctAnswer, maxChoiceValue));
      }
    }
    // FIX: Make the dependency array more stable
  }, [gameMode, weightProblem, mixedProblem.data?.answer, maxTotal]);

  // --- NEXT PROBLEM FUNCTION ---
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

  // --- AWARD POINT FUNCTION ---
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

  // --- GENERAL CORRECT ANSWER HANDLER ---
  const handleCorrectAnswer = () => {
    const randomMessage = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
    setFeedback({ type: "correct", message: `✅ ${randomMessage}` });
    awardPoint();
  };

  // --- GENERAL INCORRECT ANSWER HANDLER ---
  const handleIncorrectAnswer = () => {
    setFeedback({ type: "incorrect", message: "❌ Oops, try again!" });
    setProgress(prevProgress => Math.max(0, prevProgress - 1));
  };

  // -- ANSWER HANDLER FOR NUMBER BOND AND NUMBER SENTENCES ---
  const handleAnswer = (value) => {
    let correctAnswer;
    if (stage === "bond") {
      correctAnswer = problem.blank === "whole" ? problem.whole : problem.blank === "left" ? problem.part1 : problem.part2;
    } else {
      correctAnswer = sentences[currentSentenceIdx].answer;
    }
    const isCorrect = value === correctAnswer;
    updateStats('numberBond', isCorrect); // Use 'numberBond' for consistency

    if (isCorrect) {
      const randomMessage = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
      setFeedback({ type: "correct", message: `✅ ${randomMessage}` });

      if (stage === 'bond') {
        setFilledAnswer(correctAnswer);
      } else {
        setFilledSentenceAnswer(correctAnswer);
      }
      
      awardPoint();

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

  // --- ANSWER HANDLER for the pattern game ---
  const handlePatternAnswer = (choice) => {
    const isCorrect = choice === patternProblem.answer;
    updateStats('pattern', isCorrect);

    if (isCorrect) {
      const randomMessage = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
      setFeedback({ type: "correct", message: `✅ ${randomMessage}` });
      setFilledPatternAnswer(choice);
      awardPoint();
      
      const isGoalMet = (progress + 1) >= goal;
      const transitionDelay = isGoalMet ? 4000 : 1200;
      
      setTimeout(() => {
        setPatternProblem(generatePatternProblem(maxTotal * 2));
        setFilledPatternAnswer(null);
        setFeedback({ type: "", message: "" });
      }, transitionDelay);
    } else {
      handleIncorrectAnswer();
    }
  };
  
  // --- ANSWER HANDLER for the comparison game ---
  const handleComparisonAnswer = (op) => {
    const isCorrect = op === comparisonProblem.answer;
    updateStats('comparison', isCorrect);
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

  // --- ANSWER HANDLER for the weight puzzle ---
  const handleWeightAnswer = (value) => {
    const isCorrect = value === weightProblem.answer;
    updateStats('weight', isCorrect);
    if (value === weightProblem.answer) {
      setFilledWeightAnswer(value); // Fill in the answer
      setPuzzleAnimation("animate-balance-correct"); // Trigger the animation
      handleCorrectAnswer();

      setTimeout(() => {
        setPuzzleAnimation("");
      }, 1000);

      const isGoalMet = (progress + 1) >= goal;
      const transitionDelay = isGoalMet ? 4000 : 1500; // A slightly longer delay

      setTimeout(() => {
        setWeightProblem(generateWeightProblem(maxTotal));
        setFilledWeightAnswer(null);
        setFeedback({ type: "", message: "" });
      }, transitionDelay);
    } else {
      handleIncorrectAnswer();
      const totalLeft = weightProblem.leftSide.reduce((sum, item) => sum + item.weight, 0);
      const totalRightKnown = weightProblem.rightSide.reduce((sum, item) => sum + item.weight, 0);

      if ((totalRightKnown + value) > totalLeft) {
        // User's guess made the right side too heavy
        setPuzzleAnimation("animate-tip-right");
      } else {
        // User's guess made the right side too light
        setPuzzleAnimation("animate-tip-left");
      }
      setTimeout(() => setPuzzleAnimation(""), 500);
    }
  };

  // --- ANSWER HANDLER for the number ladder ---
  const handleLadderAnswer = (value) => {
    // 1. Determine correctness ONCE using the correct logic for the current step.
    const isCorrect = value === ladderProblem.answers[ladderStep];
    
    // 2. Update stats with the correct result.
    updateStats('numberLadder', isCorrect);

    // 3. Use the 'isCorrect' variable to proceed with the rest of the logic.
    if (isCorrect) {
      const newAnswers = [...filledLadderAnswers, value];
      setFilledLadderAnswers(newAnswers);
      
      if (ladderStep === ladderProblem.answers.length - 1) {
        handleCorrectAnswer();

        const isGoalMet = (progress + 1) >= goal;
        const transitionDelay = isGoalMet ? 4000 : 1200;

        setTimeout(() => {
          setLadderProblem(generateLadderProblem(maxTotal));
          setFilledLadderAnswers([]);
          setLadderStep(0);
          setFeedback({ type: "", message: "" });
        }, transitionDelay);
      } else {
        awardPoint();
        setLadderStep(prevStep => prevStep + 1);
        setFeedback({ type: "", message: "" });
      }
    } else {
      handleIncorrectAnswer();
    }
  };

  // --- ANSWER HANDLER for the shape puzzle ---
  const handleShapeAnswer = (value) => {
    const isCorrect = value === shapeProblem.answer;
    updateStats('shape', isCorrect);
    if (value === shapeProblem.answer) {
      handleCorrectAnswer(); // <-- Use the new function here

      const isGoalMet = (progress + 1) >= goal;
      const transitionDelay = isGoalMet ? 4000 : 1200;

      setTimeout(() => {
        setShapeProblem(generateShapeProblem());
        setFeedback({ type: "", message: "" });
      }, transitionDelay);
    } else {
      handleIncorrectAnswer();
    }
  };

  // Function to advance to the next mixed problem
  const moveToNextMixedProblem = useCallback(() => {
    setMixedProblem(generateRandomProblem(maxTotal));
    // Reset any game-specific states if necessary
    setFilledOperator(null);
    setFilledPatternAnswer(null);
    setFilledLadderAnswers([]);
    setFilledAnswer(null);
    setFilledWeightAnswer(null);
    setPuzzleAnimation("");
    setLadderStep(0);
    setFeedback({ type: "", message: "" });
  }, [maxTotal]);

  // Universal answer handler for the mixed mode
  const handleMixedAnswer = (value) => {
    const { type, data } = mixedProblem;
    let correctAnswer;

    // Determine the correct answer based on the problem type
    switch (type) {
      case 'numberBond':
        correctAnswer = data.blank === 'whole' ? data.whole : data.blank === 'left' ? data.part1 : data.part2;
        break;
      case 'comparison':
        correctAnswer = data.answer;
        break;
      case 'pattern':
        correctAnswer = data.answer;
        break;
      case 'weightPuzzle':
        correctAnswer = data.answer;
        break;
      case 'numberLadder':
        // For ladders, the answer depends on the current step
        correctAnswer = data.answers[ladderStep];
        break;
      case 'shapePuzzle':
        correctAnswer = data.answer;
        break;
      default:
        return;
    }

    const isCorrect = value === correctAnswer;
    updateStats(type, isCorrect);
    
    // Check the answer and proceed
    if (value === correctAnswer) {
      handleCorrectAnswer(); // This properly awards points/confetti
      
      switch(type) {
        case 'comparison':
          setFilledOperator(value);
          break;
        case 'pattern':
          setFilledPatternAnswer(value);
          break;
        case 'numberBond':
          setFilledAnswer(value); // This assumes a single-stage bond for mixed mode
          break;
        case 'weightPuzzle': 
          setFilledWeightAnswer(value);
          setPuzzleAnimation("animate-balance-correct");
          setTimeout(() => setPuzzleAnimation(""), 1000); 
          break;
      }

      const isGoalMet = (progress + 1) >= goal;
      const transitionDelay = isGoalMet ? 4000 : 1200;

      // Special handling for multi-step ladder game
      if (type === 'numberLadder') {
        setFilledLadderAnswers(prev => [...prev, value]); // Show correct answer
        if (ladderStep < data.answers.length - 1) {
          setLadderStep(prev => prev + 1); // Go to next step
          setTimeout(() => {
            setFeedback({ type: "", message: "" });
          }, 1200);
          return; // Don't move to the next problem yet
        }
      }

      setTimeout(moveToNextMixedProblem, transitionDelay);
    } else {
      handleIncorrectAnswer();
      if (type === 'weightPuzzle') { // Trigger animation for this specific game
        const totalLeft = data.leftSide.reduce((sum, item) => sum + item.weight, 0);
        const totalRightKnown = data.rightSide.reduce((sum, item) => sum + item.weight, 0);

        if ((totalRightKnown + value) > totalLeft) {
          setPuzzleAnimation("animate-tip-right");
        } else {
          setPuzzleAnimation("animate-tip-left");
        }
        setTimeout(() => setPuzzleAnimation(""), 500);
      }
    }
  };

  const problemKey = `${problem.part1}-${problem.part2}-${currentSentenceIdx}`;
  const activeSentence = sentences[currentSentenceIdx];
  const [partBefore, partAfter] = activeSentence.text.split('?');

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-50 font-sans p-4 overflow-x-hidden">
      {/* Conditionally render the Progress Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <ProgressReport onClose={() => setShowReport(false)} />
        </div>
      )}
      {/* --- Game Mode Switcher --- */}
      <div className="flex items-center gap-2 p-2 bg-purple-200 rounded-lg mb-4">
        <label htmlFor="game-mode-select" className="font-semibold text-purple-800">
          Game Mode:
        </label>
        
        {/* Add a relative container for positioning the custom arrow */}
        <div className="relative">
          <select
            id="game-mode-select"
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
            // The 'appearance-none' class hides the default browser arrow
            className="appearance-none w-full px-4 py-2 pr-8 rounded-md font-semibold bg-white text-purple-600 border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="numberBond">Number Bonds</option>
            <option value="comparison">Comparison</option>
            <option value="pattern">Patterns</option>
            <option value="weightPuzzle">Weight Puzzle</option>
            <option value="numberLadder">Number Ladders</option>
            <option value="shapePuzzle">Shape Puzzles</option>
            <option value="mixed">Mixed Review 🎲</option>
          </select>
          
          {/* Custom Arrow SVG Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-600">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* --- Star Tracker and Progress Bar --- */}
      <div className="w-full max-w-sm mb-4">
        <StarTracker count={stars} level={starLevel} />
        <ProgressBar progress={progress} goal={goal} />
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
        ): gameMode === 'pattern' ? (
          // --- PATTERN GAME UI ---
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
        ) : gameMode === 'weightPuzzle' ? (
          // --- WEIGHT PUZZLE GAME UI ---
          <div>
            <h3 className="text-2xl font-bold text-gray-600 mb-4 text-center">Make the scale balance!</h3>
            <div className={puzzleAnimation}>
              <WeightPuzzle 
                problem={weightProblem} 
                filledAnswer={filledWeightAnswer} 
                animationClass={puzzleAnimation} 
              />
            </div>
            <MultipleChoice
              choices={weightPuzzleChoices}
              onSelect={handleWeightAnswer}
              disabled={feedback.type === 'correct'}
            />
          </div>
        ): gameMode === 'numberLadder' ? (
          // --- NUMBER LADDER UI ---
          <div>
            <NumberLadder problem={ladderProblem} filledAnswers={filledLadderAnswers} />
            <MultipleChoice
              choices={ladderChoices}
              onSelect={handleLadderAnswer}
              disabled={feedback.type === 'correct'}
            />
          </div>
        ): gameMode === 'shapePuzzle' ? (
          // -- SHAPE PUZZLE ---
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-600 mb-4">{shapeProblem.question}</h3>
            <ShapePuzzle problem={shapeProblem} />
            <NumberPad 
              maxNumber={10} // The number of shapes to count is usually small
              onNumberClick={handleShapeAnswer}
              disabled={feedback.type === 'correct'}
            />
          </div>
        ): (
          // --- MIXED GAME UI ---
          (() => {
            const { type, data } = mixedProblem;
            switch (type) {
              case 'numberBond':
                return (
                  <>
                    <div className="text-center min-h-[180px]">
                      <div className="mb-4"><CountingCubes part1={data.part1} part2={data.part2} /></div>
                      <NumberBond problem={data} filledAnswer={filledAnswer} />
                    </div>
                    <MultipleChoice choices={mixedBondChoices} onSelect={handleMixedAnswer} />
                  </>
                );
              case 'comparison':
                return (
                  <div>
                    <div className="flex justify-around items-center text-center">
                      <div className="w-1/3">
                        <CubeDisplay count={data.num1} color="bg-sky-400" />
                        <div className="text-6xl font-bold text-gray-700">{data.num1}</div>
                      </div>
                      <div className="w-1/3 flex justify-center items-center h-24">
                        {filledOperator ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl font-bold text-purple-600">{filledOperator}</motion.div>
                        ) : (
                          <div className="w-20 h-20 border-4 border-dashed border-gray-300 rounded-full"></div>
                        )}
                      </div>
                      <div className="w-1/3">
                        <CubeDisplay count={data.num2} color="bg-amber-400" />
                        <div className="text-6xl font-bold text-gray-700">{data.num2}</div>
                      </div>
                    </div>
                    <OperatorButtons onSelect={handleMixedAnswer} disabled={filledOperator !== null} />
                  </div>
                );
              case 'pattern':
                return (
                    <div className="text-center min-h-[300px]">
                      <h3 className="text-2xl font-bold text-gray-600 mb-4">What number comes next?</h3>
                      <div className="flex justify-center items-center text-4xl font-bold text-gray-700 p-4 bg-gray-100 rounded-lg">
                        {data.sequence.map((num) => (
                          <React.Fragment key={num}>
                            <span>{num}</span>
                            <span className="mx-3 text-3xl text-gray-400">→</span>
                          </React.Fragment>
                        ))}
                        {filledPatternAnswer !== null ? (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-purple-600">{filledPatternAnswer}</motion.span>
                        ) : (
                          <span className="text-purple-500">?</span>
                        )}
                      </div>
                      <MultipleChoice choices={data.choices} onSelect={handleMixedAnswer} disabled={filledPatternAnswer !== null}/>
                    </div>
                  );
              case 'weightPuzzle':
                return (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-4 text-center">Make the scale balance!</h3>
                    <WeightPuzzle 
                      problem={data} 
                      filledAnswer={filledWeightAnswer} 
                      animationClass={puzzleAnimation} 
                    />
                    <MultipleChoice
                      choices={weightPuzzleChoices}
                      onSelect={handleMixedAnswer}
                      disabled={feedback.type === 'correct'}
                    />
                  </div>
                );
              case 'numberLadder':
                return (
                  <div>
                    <NumberLadder problem={data} filledAnswers={filledLadderAnswers} />
                    <MultipleChoice choices={ladderChoices} onSelect={handleMixedAnswer} disabled={feedback.type === 'correct'}/>
                  </div>
                );
              case 'shapePuzzle':
                return (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-600 mb-4">{data.question}</h3>
                    <ShapePuzzle problem={data} />
                    <NumberPad maxNumber={10} onNumberClick={handleMixedAnswer} disabled={feedback.type === 'correct'}/>
                  </div>
                );
              default:
                return <div>Loading problem...</div>;
            }
          })()
        )}

        <Feedback feedback={feedback} />

      </motion.div>

      {/* --- Settings --- */}
      <div className="mt-6 bg-white p-3 rounded-lg shadow-md flex items-center gap-4">
        <div>
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
        {/* Add a button to show the report */}
        <button 
          onClick={() => setShowReport(true)}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          View Progress
        </button>
      </div>
    </div>
  );
};

export default MathGame;