import React, { useState, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import NumberBond from "./NumberBond";
import ProgressBar from "./ProgressBar";
import ProgressTracker from "./ProgressTracker";
import StarTracker from './StarTracker';
import CountingCubes from './CountingCubes';
import OperatorButtons from './OperatorButtons';
import CubeDisplay from './CubeDisplay';
import BaseTenDisplay from './BaseTenDisplay';
import MultipleChoice from './MultipleChoice';
import Feedback from './Feedback';
import WeightPuzzle from './WeightPuzzle';
import NumberLadder from './NumberLadder';
import ShapePuzzle from './ShapePuzzle';
import ProgressReport from './ProgressReport';

// --- Helper Functions ---
const GAME_TYPES = ['numberBond', 'comparison', 'pattern', 'weightPuzzle', 'numberLadder', 'shapePuzzle'];
const DIFFICULTY_LEVELS = {
  easy: { name: 'Easy', max: 10 },
  medium: { name: 'Medium', max: 20 },
  hard: { name: 'Hard', max: 50 },
  expert: { name: 'Expert', max: 100 },
};
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
  // 1. Make the operations dynamic based on the max value
  const addAmount1 = Math.floor(Math.random() * (max / 4)) + 1;
  const addAmount2 = Math.floor(Math.random() * (max / 2)) + 2;
  const subAmount1 = Math.floor(Math.random() * (max / 3)) + 1;

  const operations = [
    { text: `+ ${addAmount1}`, operation: (n) => n + addAmount1 },
    { text: `- ${subAmount1}`, operation: (n) => n - subAmount1, requires: subAmount1 },
    { text: `+ ${addAmount2}`, operation: (n) => n + addAmount2 },
  ];
  
  // 2. Make the starting number dynamic, ensuring it's high enough for subtraction
  const startNumber = Math.floor(Math.random() * (max / 2)) + subAmount1 + 1; 
  const steps = [];
  const answers = [];
  let currentVal = startNumber;

  for (let i = 0; i < 3; i++) {
    // 3. Filter for valid operations (don't go negative or excessively high)
    const validOps = operations.filter(op => 
        (!op.requires || currentVal >= op.requires) && 
        (op.operation(currentVal) < max * 1.5)
    );

    const op = validOps.length > 0 
        ? validOps[Math.floor(Math.random() * validOps.length)]
        // Fallback in case no operations are valid
        : { text: '+ 1', operation: (n) => n + 1 };
    
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
    },
    // 1. Fish
    {
      question: "How many triangles are in the fish?",
      answer: 3,
      width: 150,
      height: 100,
      shapes: [
        { type: 'rect', x: 10, y: 30, width: 100, height: 40, className: "fill-orange-400 stroke-orange-600 stroke-2" },
        { type: 'polygon', points: "110,50 140,20 140,80", className: "fill-orange-500 stroke-orange-700 stroke-2" }, // Tail
        { type: 'polygon', points: "40,30 60,10 80,30", className: "fill-orange-500 stroke-orange-700 stroke-2" }, // Top Fin
        { type: 'polygon', points: "40,70 60,90 80,70", className: "fill-orange-500 stroke-orange-700 stroke-2" }, // Bottom Fin
        { type: 'rect', x: 25, y: 45, width: 8, height: 8, className: "fill-black" }, // Eye
      ],
    },
    // 2. Sailboat
    {
      question: "How many triangles are in the sailboat?",
      answer: 2,
      width: 150,
      height: 150,
      shapes: [
        { type: 'polygon', points: "10,100 140,100 120,130 30,130", className: "fill-amber-800 stroke-amber-900 stroke-2" }, // Hull
        { type: 'rect', x: 70, y: 10, width: 10, height: 90, className: "fill-amber-900" }, // Mast
        { type: 'polygon', points: "85,15 135,95 85,95", className: "fill-white stroke-gray-400 stroke-2" }, // Main Sail
        { type: 'polygon', points: "65,15 20,95 65,95", className: "fill-gray-200 stroke-gray-400 stroke-2" }, // Jib Sail
      ],
    },
    // 3. Christmas Tree
    {
      question: "How many triangles are in the tree?",
      answer: 3,
      width: 120,
      height: 160,
      shapes: [
        { type: 'rect', x: 50, y: 130, width: 20, height: 30, className: "fill-amber-800" }, // Trunk
        { type: 'polygon', points: "60,80 10,140 110,140", className: "fill-green-600 stroke-green-800 stroke-2" }, // Bottom Layer
        { type: 'polygon', points: "60,50 20,110 100,110", className: "fill-green-500 stroke-green-700 stroke-2" }, // Middle Layer
        { type: 'polygon', points: "60,20 30,80 90,80", className: "fill-green-400 stroke-green-600 stroke-2" }, // Top Layer
      ],
    },
    // 4. Train Engine
    {
      question: "How many rectangles are in the train?",
      answer: 6,
      width: 200,
      height: 130,
      shapes: [
        { type: 'rect', x: 10, y: 50, width: 120, height: 40, className: "fill-red-500 stroke-red-700 stroke-2" }, // Main Body
        { type: 'rect', x: 130, y: 20, width: 50, height: 70, className: "fill-blue-500 stroke-blue-700 stroke-2" }, // Cab
        { type: 'rect', x: 30, y: 20, width: 20, height: 30, className: "fill-gray-500 stroke-gray-700 stroke-2" }, // Chimney
        { type: 'rect', x: 145, y: 30, width: 20, height: 20, className: "fill-cyan-200" }, // Window
        { type: 'rect', x: 20, y: 90, width: 30, height: 30, className: "fill-black" }, // Wheel 1
        { type: 'rect', x: 90, y: 90, width: 30, height: 30, className: "fill-black" }, // Wheel 2
      ],
    },
    // 5. Castle Turret
    {
      question: "How many rectangles are in the turret?",
      answer: 4,
      width: 100,
      height: 180,
      shapes: [
        { type: 'polygon', points: "50,0 10,30 90,30", className: "fill-red-500 stroke-red-700 stroke-2" }, // Roof
        { type: 'rect', x: 20, y: 30, width: 15, height: 20, className: "fill-gray-400 stroke-gray-600 stroke-2" }, // Battlement 1
        { type: 'rect', x: 42, y: 30, width: 15, height: 20, className: "fill-gray-400 stroke-gray-600 stroke-2" }, // Battlement 2
        { type: 'rect', x: 65, y: 30, width: 15, height: 20, className: "fill-gray-400 stroke-gray-600 stroke-2" }, // Battlement 3
        { type: 'rect', x: 20, y: 50, width: 60, height: 130, className: "fill-gray-500 stroke-gray-700 stroke-2" }, // Main Tower
      ],
    },
    // 6. Arrow
    {
      question: "How many triangles are in the arrow?",
      answer: 1,
      width: 180,
      height: 80,
      shapes: [
        { type: 'rect', x: 0, y: 30, width: 150, height: 20, className: "fill-amber-800 stroke-amber-900 stroke-2" }, // Shaft
        { type: 'polygon', points: "140,10 180,40 140,70", className: "fill-red-500 stroke-red-700 stroke-2" }, // Head
      ],
    },
    // 7. Simple Car
    {
      question: "How many rectangles are in the car?",
      answer: 5,
      width: 180,
      height: 110,
      shapes: [
        { type: 'rect', x: 0, y: 50, width: 180, height: 30, className: "fill-blue-500 stroke-blue-700 stroke-2" }, // Body
        { type: 'rect', x: 40, y: 20, width: 100, height: 30, className: "fill-blue-400 stroke-blue-600 stroke-2" }, // Top
        { type: 'rect', x: 50, y: 25, width: 80, height: 20, className: "fill-cyan-200" }, // Window
        { type: 'rect', x: 30, y: 80, width: 30, height: 30, className: "fill-black" }, // Wheel 1
        { type: 'rect', x: 120, y: 80, width: 30, height: 30, className: "fill-black" }, // Wheel 2
      ],
    },
    // 8. Kite
    {
      question: "How many triangles are in the kite?",
      answer: 4,
      width: 100,
      height: 180,
      shapes: [
        { type: 'polygon', points: "50,0 0,50 100,50", className: "fill-fuchsia-400 stroke-fuchsia-600 stroke-2" }, // Top half
        { type: 'polygon', points: "50,120 0,50 100,50", className: "fill-cyan-400 stroke-cyan-600 stroke-2" }, // Bottom half
        { type: 'rect', x: 49, y: 120, width: 2, height: 60, className: "fill-gray-400" }, // String
        { type: 'polygon', points: "40,140 50,130 60,140", className: "fill-red-500" }, // Bow 1
        { type: 'polygon', points: "40,160 50,150 60,160", className: "fill-red-500" }, // Bow 2
      ],
    },
    // 9. Pencil
    {
      question: "How many triangles are in the pencil?",
      answer: 1,
      width: 40,
      height: 200,
      shapes: [
        { type: 'rect', x: 10, y: 30, width: 20, height: 130, className: "fill-yellow-300 stroke-yellow-500 stroke-2" }, // Body
        { type: 'rect', x: 10, y: 160, width: 20, height: 20, className: "fill-pink-400 stroke-pink-600 stroke-2" }, // Eraser
        { type: 'rect', x: 8, y: 155, width: 24, height: 10, className: "fill-gray-400 stroke-gray-600 stroke-2" }, // Band
        { type: 'polygon', points: "10,30 30,30 25,10 15,10", className: "fill-orange-200 stroke-orange-400 stroke-2" }, // Wood Tip
        { type: 'polygon', points: "20,0 15,10 25,10", className: "fill-black" }, // Graphite Tip
      ],
    },
    // 10. Ice Cream Cone
    {
      question: "How many triangles are in the ice cream cone?",
      answer: 1,
      width: 80,
      height: 150,
      shapes: [
        { type: 'polygon', points: "40,150 10,50 70,50", className: "fill-orange-300 stroke-orange-500 stroke-2" }, // Cone
        { type: 'rect', x: 20, y: 20, width: 40, height: 40, className: "fill-pink-400 stroke-pink-600 stroke-2" }, // Ice cream scoop 1
        { type: 'rect', x: 30, y: 0, width: 20, height: 20, className: "fill-red-500 stroke-red-700 stroke-2" }, // Cherry
      ],
    },
  ];

  const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

  // NEW: Generate multiple-choice options for the selected puzzle
  const choices = new Set([puzzle.answer]);
  while (choices.size < 4) { // Generate 4 total choices
    const randomChoice = puzzle.answer + (Math.floor(Math.random() * 5) - 2);
    if (randomChoice >= 0 && randomChoice !== puzzle.answer) {
      choices.add(randomChoice);
    }
  }
  
  // Return the puzzle data along with the shuffled choices
  return { 
    ...puzzle, 
    choices: Array.from(choices).sort(() => Math.random() - 0.5) 
  };
};

const updateStats = (gameType, isCorrect) => {
  const stats = JSON.parse(localStorage.getItem('mathGameStats')) || {};

  if (!stats[gameType]) {
    stats[gameType] = { correct: 0, incorrect: 0, totalAttempts: 0 };
  }

  stats[gameType].totalAttempts += 1;
  if (isCorrect) {
    stats[gameType].correct += 1;
  } else {
    stats[gameType].incorrect += 1;
  }

  localStorage.setItem('mathGameStats', JSON.stringify(stats));
  return stats[gameType];
};

// --- CONSTANTS ---
const CORRECT_MESSAGES = ["Awesome!", "You got it!", "Super!", "Brilliant!", "Fantastic!"];

// --- Main Component ---
const MathGame = () => {
  const [showReport, setShowReport] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const maxTotal = DIFFICULTY_LEVELS[difficulty].max;
  const [gameMode, setGameMode] = useState('numberBond'); // 'numberBond', 'comparison', or 'pattern'
  const [patternProblem, setPatternProblem] = useState(() => generatePatternProblem(maxTotal * 2));
  const [filledPatternAnswer, setFilledPatternAnswer] = useState(null);
  const [comparisonProblem, setComparisonProblem] = useState(() => generateComparisonProblem(maxTotal));
  const [isComparisonHard, setIsComparisonHard] = useState(false);
  const [isNumberBondHard, setIsNumberBondHard] = useState(false);
  const [filledOperator, setFilledOperator] = useState(null);
  const [weightProblem, setWeightProblem] = useState(() => generateWeightProblem(maxTotal));
  const [filledWeightAnswer, setFilledWeightAnswer] = useState(null);
  const [puzzleAnimation, setPuzzleAnimation] = useState(""); // For tipping animation
  const [ladderProblem, setLadderProblem] = useState(() => generateLadderProblem(maxTotal));
  const [ladderStep, setLadderStep] = useState(0); // Which step we are on
  const [filledLadderAnswers, setFilledLadderAnswers] = useState([]);
  const [ladderChoices, setLadderChoices] = useState([]);
  const [weightPuzzleChoices, setWeightPuzzleChoices] = useState([]);
  const [mixedBondChoices, setMixedBondChoices] = useState([]);
  const [shapeProblem, setShapeProblem] = useState(() => generateShapeProblem());
  const [mixedProblem, setMixedProblem] = useState(() => generateRandomProblem(maxTotal));
  const [problem, setProblem] = useState(() => generateProblem(maxTotal));
  const [numberBondChoices, setNumberBondChoices] = useState(() => {
    const initialProblem = generateProblem(maxTotal);
    setProblem(initialProblem); // Set initial problem here too
    const { part1, part2, whole, blank } = initialProblem;
    const answer = blank === 'whole' ? whole : blank === 'left' ? part1 : part2;
    return generateBondChoices(answer, maxTotal);
  });
  const [sentences, setSentences] = useState(() => generateSentences(problem));
  const [stage, setStage] = useState("bond"); // 'bond' or 'sentence'
  const [feedback, setFeedback] = useState({ type: "", message: "" }); // 'correct' or 'incorrect'
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [filledAnswer, setFilledAnswer] = useState(null);
  const [filledSentenceAnswer, setFilledSentenceAnswer] = useState(null);
  const [stars, setStars] = useState(() => {
    const savedStars = localStorage.getItem('mathGameStars');
    return savedStars !== null ? JSON.parse(savedStars) : 0;
  });
  const [starLevel, setStarLevel] = useState(() => {
    const savedLevel = localStorage.getItem('mathGameStarLevel');
    return savedLevel !== null ? JSON.parse(savedLevel) : 0;
  });
  // State to track correct answers per game for the current level
  const [levelProgress, setLevelProgress] = useState(() => {
    const saved = localStorage.getItem('mathGameLevelProgress');
    return saved ? JSON.parse(saved) : {};
  });

  // Effect to save levelProgress whenever it changes
  useEffect(() => {
    localStorage.setItem('mathGameLevelProgress', JSON.stringify(levelProgress));
  }, [levelProgress]);

  useEffect(() => {
    localStorage.setItem('mathGameStars', JSON.stringify(stars));
    localStorage.setItem('mathGameStarLevel', JSON.stringify(starLevel));
    }, [stars, starLevel]);

  // Re-generate problem when maxTotal changes
  useEffect(() => {
    if (gameMode !== 'numberBond') return;

    let correctAnswer;
    if (stage === 'bond') {
      const { part1, part2, whole, blank } = problem;
      correctAnswer = blank === 'whole' ? whole : blank === 'left' ? part1 : part2;
    } else {
      correctAnswer = sentences[currentSentenceIdx].answer;
    }
    
    setNumberBondChoices(generateBondChoices(correctAnswer, maxTotal));
  }, [
    gameMode, 
    stage, 
    currentSentenceIdx, 
    maxTotal, 
    problem.whole, // Use specific, stable values
    problem.blank,
    sentences[currentSentenceIdx]?.answer // Use optional chaining for safety
  ]);

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
        const maxChoiceValue = Math.max(maxTotal, correctAnswer + 10); 
        setLadderChoices(generateBondChoices(correctAnswer, maxChoiceValue));
      }
    }
  }, [
    gameMode, 
    ladderStep, 
    ladderProblem.startNumber, // Use a primitive value that changes with the problem
    mixedProblem.data?.startNumber // Also use it for the mixed problem
  ]);

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
  }, [
    gameMode, 
    maxTotal,
    weightProblem.answer, // Use the specific answer
    mixedProblem.data?.answer // Also for the mixed problem
  ]);

  // Move to next problem when difficulty level changes
  useEffect(() => {
    // Generate a new problem for the currently active game mode
    switch (gameMode) {
      case 'numberBond':
        moveToNextProblem();
        break;
      case 'comparison':
        setComparisonProblem(generateComparisonProblem(maxTotal));
        break;
      case 'pattern':
        setPatternProblem(generatePatternProblem(maxTotal * 2));
        break;
      case 'weightPuzzle':
        setWeightProblem(generateWeightProblem(maxTotal));
        break;
      case 'ladderProblem':
        setLadderProblem(generateLadderProblem(maxTotal));
        break;
      case 'mixed':
        moveToNextMixedProblem();
        break;
      // No action needed for shapePuzzle as it doesn't use maxTotal
      default:
        break;
    }
  }, [difficulty]);

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

  // This is the main function for all correct-answer logic
  const randomMessage = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
  const handleCorrectAnswer = () => {
    const randomMessage = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
    setFeedback({ type: "correct", message: `✅ ${randomMessage}` });

    const currentGame = gameMode === 'mixed' ? mixedProblem.type : gameMode;

    setLevelProgress(prev => {
      const gameData = prev[currentGame] || { correct: 0, stars: 0, level: 0, progress: 0 };

      const newCorrect = gameData.correct + 1;
      let newProgress = gameData.progress + 1;
      let newStars = gameData.stars;
      let newLevel = gameData.level;

      if (newProgress >= 5) {
        newProgress = 0;
        if (newStars >= 5) {
          newLevel += 1;
          newStars = 0;
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
        } else {
          newStars += 1;
        }
      }

      return {
        ...prev,
        [currentGame]: { correct: newCorrect, stars: newStars, level: newLevel, progress: newProgress }
      };
    });
  };

  // --- GENERAL INCORRECT ANSWER HANDLER ---
  const handleIncorrectAnswer = () => {
    setFeedback({ type: "incorrect", message: "❌ Oops, try again!" });

    const currentGame = gameMode === 'mixed' ? mixedProblem.type : gameMode;

    setLevelProgress(prev => {
      const gameData = prev[currentGame] || { correct: 0, stars: 0, level: 0, progress: 0 };

      let newProgress = gameData.progress;
      let newStars = gameData.stars;
      let newLevel = gameData.level;

      if (newProgress > 0) {
        newProgress -= 1;
      } else if (newStars > 0) {
        newStars -= 1;
      } else if (newLevel > 0) {
        newLevel -= 1;
        newStars = 5;
      }

      return {
        ...prev,
        [currentGame]: { ...gameData, stars: newStars, level: newLevel, progress: newProgress }
      };
    });
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
    // Call updateStats only ONCE
    const updatedStats = updateStats('numberBond', isCorrect);

    if (isCorrect) {
      if (updatedStats.correct >= 25) {
        setIsNumberBondHard(true);
      }
      
      if (stage === 'bond') {
        setFilledAnswer(correctAnswer);
      } else {
        setFilledSentenceAnswer(correctAnswer);
      }
      
      handleCorrectAnswer();
      
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
      }, 1200);
    } else {
      handleIncorrectAnswer();
    }
  };

  // --- ANSWER HANDLER for the pattern game ---
  const handlePatternAnswer = (choice) => {
    const isCorrect = choice === patternProblem.answer;
    updateStats('pattern', isCorrect, setShowConfetti);

    if (isCorrect) {
      setFilledPatternAnswer(choice);
      handleCorrectAnswer();
      
      setTimeout(() => {
        setPatternProblem(generatePatternProblem(maxTotal * 2));
        setFilledPatternAnswer(null);
        setFeedback({ type: "", message: "" });
      }, 1200);
    } else {
      handleIncorrectAnswer();
    }
  };
  
  // --- ANSWER HANDLER for the comparison game ---
  const handleComparisonAnswer = (op) => {
    const isCorrect = op === comparisonProblem.answer;
    const updatedStats = updateStats('comparison', isCorrect, setShowConfetti);

    if (isCorrect) {
      if (updatedStats.correct >= 25) {
        setIsComparisonHard(true);
      }
      setFilledOperator(op);
      handleCorrectAnswer();
      
      setTimeout(() => {
        setComparisonProblem(generateComparisonProblem(maxTotal));
        setFilledOperator(null);
        setFeedback({ type: "", message: "" });
      }, 1200);
    } else {
      handleIncorrectAnswer();
    }
  };

  // --- ANSWER HANDLER for the weight puzzle ---
  const handleWeightAnswer = (value) => {
    const isCorrect = value === weightProblem.answer;
    // FIX: Correct game name 'weightPuzzle'
    updateStats('weightPuzzle', isCorrect, setShowConfetti);

    if (isCorrect) {
      setFilledWeightAnswer(value);
      setPuzzleAnimation("animate-balance-correct");
      handleCorrectAnswer();

      setTimeout(() => {
        setPuzzleAnimation("");
      }, 1000);

      setTimeout(() => {
        setWeightProblem(generateWeightProblem(maxTotal));
        setFilledWeightAnswer(null);
        setFeedback({ type: "", message: "" });
      }, 1500);
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
    const isCorrect = value === ladderProblem.answers[ladderStep];
    updateStats('numberLadder', isCorrect, setShowConfetti);

    if (isCorrect) {
      const newAnswers = [...filledLadderAnswers, value];
      setFilledLadderAnswers(newAnswers);
      
      if (ladderStep === ladderProblem.answers.length - 1) {
        handleCorrectAnswer();
        // Logic for the final step
        setTimeout(() => {
          setLadderProblem(generateLadderProblem(maxTotal));
          setFilledLadderAnswers([]);
          setLadderStep(0);
          setFeedback({ type: "", message: "" });
        }, 1200);
      } else {
        handleCorrectAnswer();
        // Logic for intermediate steps
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
    // FIX: Correct game name 'shapePuzzle'
    updateStats('shapePuzzle', isCorrect, setShowConfetti);

    if (isCorrect) {
      handleCorrectAnswer();

      setTimeout(() => {
        setShapeProblem(generateShapeProblem());
        setFeedback({ type: "", message: "" });
      }, 1200);
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
    const updatedStats = updateStats(type, isCorrect, setShowConfetti);
    
    // Check the answer and proceed
    if (value === correctAnswer) {
      if (type === 'comparison' && updatedStats.correct >= 25) {
        setIsComparisonHard(true);
      }
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

      setTimeout(moveToNextMixedProblem, 1200);
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

  const activeSentence = sentences[currentSentenceIdx];
  const [partBefore, partAfter] = activeSentence.text.split('?');
  const currentGame = gameMode === 'mixed' ? mixedProblem.type : gameMode;
  const currentGameProgress = levelProgress[currentGame] || { stars: 0, level: 0, progress: 0, correct: 0 };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-50 font-sans p-4 overflow-x-hidden">
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

      {/* Conditionally render the Progress Report Modal */}
      {showReport && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <ProgressReport 
            onClose={() => setShowReport(false)} 
            onClear={() => {
              setLevelProgress({}); // Clear the level progress on 'Clear'
            }}
            levelProgress={levelProgress} // Pass the progress object
            setLevelProgress={setLevelProgress} // Pass the setter function
          />
        </div>
      )}

      {/* --- Star Tracker and Progress --- */}
      <div className="w-full max-w-sm mb-4 space-y-2">
        <StarTracker count={currentGameProgress.stars} level={currentGameProgress.level} />
        <ProgressBar progress={currentGameProgress.progress} goal={5} />
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
                {/* The logic is now inside CountingCubes! */}
                <CountingCubes 
                  part1={problem.part1} 
                  part2={problem.part2}
                  maxTotal={maxTotal}
                  isNumberBondHard={isNumberBondHard}
                  stage={stage}
                  filledAnswer={filledAnswer}
                />
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
                {(!isComparisonHard || filledOperator !== null) && (
                  // This container ensures consistent height and alignment
                  <div className="flex justify-center items-center flex-wrap gap-2 p-2 min-h-[100px]">
                    {maxTotal > 19 ? (
                      <BaseTenDisplay count={comparisonProblem.num1} color="bg-sky-400" />
                    ) : (
                      <CubeDisplay count={comparisonProblem.num1} color="bg-sky-400" />
                    )}
                  </div>
                )}
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
                {(!isComparisonHard || filledOperator !== null) && (
                  // Add the same container here
                  <div className="flex justify-center items-center flex-wrap gap-2 p-2 min-h-[100px]">
                    {maxTotal > 19 ? (
                      <BaseTenDisplay count={comparisonProblem.num2} color="bg-amber-400" />
                    ) : (
                      <CubeDisplay count={comparisonProblem.num2} color="bg-amber-400" />
                    )}
                  </div>
                )}
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
            <MultipleChoice
              choices={shapeProblem.choices}
              onSelect={handleShapeAnswer}
              disabled={feedback.type === 'correct'}
            />
          </div>
        ): (
          // --- MIXED GAME UI ---
          (() => {
            const { type, data } = mixedProblem;
            switch (type) {
              case 'numberBond':
                const bondAnswer = data.blank === 'whole' ? data.whole : data.blank === 'left' ? data.part1 : data.part2;
                const bondChoices = generateBondChoices(bondAnswer, maxTotal);
                return (
                  <>
                    <div className="text-center min-h-[180px]">
                      <div className="mb-4">
                        {/* The logic is now inside CountingCubes! */}
                        <CountingCubes 
                          key={`${data.part1}-${data.part2}`} 
                          part1={data.part1}
                          part2={data.part2}
                          maxTotal={maxTotal}
                          isNumberBondHard={isNumberBondHard}
                          stage={'bond'}
                          filledAnswer={filledAnswer}
                        />
                      </div>
                      <NumberBond problem={data} filledAnswer={filledAnswer} />
                    </div>
                    <MultipleChoice choices={bondChoices} onSelect={handleMixedAnswer} />
                  </>
                );
              case 'comparison':
                return (
                  <div>
                    <div className="flex justify-around items-center text-center">
                      {/* Left Side */}
                      <div className="w-1/3">
                        {(!isComparisonHard || filledOperator !== null) && (
                          <div className="flex justify-center items-center flex-wrap gap-2 p-2 min-h-[100px]">
                            {maxTotal > 19 ? (
                              // FIX: Use data.num1
                              <BaseTenDisplay count={data.num1} color="bg-sky-400" />
                            ) : (
                              // FIX: Use data.num1
                              <CubeDisplay count={data.num1} color="bg-sky-400" />
                            )}
                          </div>
                        )}
                        <div className="text-6xl font-bold text-gray-700">{data.num1}</div>
                      </div>
                      
                      {/* Middle Operator (remains the same) */}
                      <div className="w-1/3 flex justify-center items-center h-24">
                        {filledOperator ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl font-bold text-purple-600">{filledOperator}</motion.div>
                        ) : (
                          <div className="w-20 h-20 border-4 border-dashed border-gray-300 rounded-full"></div>
                        )}
                      </div>

                      {/* Right Side */}
                      <div className="w-1/3">
                        {(!isComparisonHard || filledOperator !== null) && (
                          <div className="flex justify-center items-center flex-wrap gap-2 p-2 min-h-[100px]">
                            {maxTotal > 19 ? (
                              // FIX: Use data.num2
                              <BaseTenDisplay count={data.num2} color="bg-amber-400" />
                            ) : (
                              // FIX: Use data.num2
                              <CubeDisplay count={data.num2} color="bg-amber-400" />
                            )}
                          </div>
                        )}
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
                    <MultipleChoice
                      choices={data.choices}      // Correct data
                      onSelect={handleMixedAnswer}  // Correct function
                      disabled={feedback.type === 'correct'}
                    />
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
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md w-full max-w-sm flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="difficulty-select" className="font-bold text-gray-600">Difficulty:</label>
          <select
            id="difficulty-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="difficulty-dropdown"
          >
            {Object.keys(DIFFICULTY_LEVELS).map(levelKey => (
              <option key={levelKey} value={levelKey}>
                {DIFFICULTY_LEVELS[levelKey].name}
              </option>
            ))}
          </select>
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