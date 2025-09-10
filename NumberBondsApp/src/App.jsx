import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

// Utility to generate random number bond problems
const generateProblem = () => {
  const part1 = Math.floor(Math.random() * 6) + 1; // 1–6
  const part2 = Math.floor(Math.random() * 6) + 1;
  const whole = part1 + part2;

  // Randomly decide which part is blank
  const blanks = ["whole", "left", "right"];
  const blank = blanks[Math.floor(Math.random() * blanks.length)];

  return { part1, part2, whole, blank };
};

const NumberBondApp = () => {
  const [problem, setProblem] = useState(generateProblem());
  const [studentAnswer, setStudentAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);

  // Generate number sentences for the current problem
  const generateSentences = (p) => [
    { text: `___ + ${p.part2} = ${p.whole}`, answer: p.part1 },
    { text: `${p.part1} + ___ = ${p.whole}`, answer: p.part2 },
    { text: `${p.whole} - ___ = ${p.part2}`, answer: p.part1 },
    { text: `${p.whole} - ${p.part1} = ___`, answer: p.part2 },
  ];

  const sentences = generateSentences(problem);
  const activeSentence = sentences[currentSentenceIdx];

  // Move to the next problem
  const moveToNextProblem = () => {
    setProblem(generateProblem());
    setStudentAnswer(null);
    setFeedback("");
    setShowConfetti(false);
    setCurrentSentenceIdx(0);
  };

  // Handle number bond answer
  const handleBondAnswer = (val) => {
    let correctAnswer =
      problem.blank === "whole"
        ? problem.whole
        : problem.blank === "left"
        ? problem.part1
        : problem.part2;

    if (val === correctAnswer) {
      setStudentAnswer(val);
      setFeedback("✅ Correct!");
      setShowConfetti(true);

      // After delay, hide confetti & move to sentences
      setTimeout(() => {
        setShowConfetti(false);
        setFeedback("");
      }, 1200);
    } else {
      setFeedback("❌ Try again!");
    }
  };

  // Handle number sentence answer
  const handleSentenceAnswer = (val) => {
    if (val === activeSentence.answer) {
      setFeedback("✅ Correct!");
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setFeedback("");
        if (currentSentenceIdx < sentences.length - 1) {
          setCurrentSentenceIdx(currentSentenceIdx + 1);
        } else {
          moveToNextProblem();
        }
      }, 1200);
    } else {
      setFeedback("❌ Try again!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="p-6 border rounded-2xl shadow bg-white w-full max-w-md text-center">
        {/* Number bond diagram */}
        <svg width="250" height="160">
          {/* Lines */}
          <line
            x1="125"
            y1="40"
            x2="70"
            y2="120"
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1="125"
            y1="40"
            x2="180"
            y2="120"
            stroke="black"
            strokeWidth="2"
          />

          {/* Top circle */}
          <circle cx="125" cy="40" r="28" fill="white" stroke="black" />
          <text
            x="125"
            y="45"
            fontSize="20"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {problem.blank === "whole"
              ? studentAnswer || "___"
              : problem.whole}
          </text>

          {/* Bottom left circle */}
          <circle cx="70" cy="120" r="28" fill="white" stroke="black" />
          <text
            x="70"
            y="125"
            fontSize="20"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {problem.blank === "left"
              ? studentAnswer || "___"
              : problem.part1}
          </text>

          {/* Bottom right circle */}
          <circle cx="180" cy="120" r="28" fill="white" stroke="black" />
          <text
            x="180"
            y="125"
            fontSize="20"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {problem.blank === "right"
              ? studentAnswer || "___"
              : problem.part2}
          </text>
        </svg>

        {/* Number line for answering bond */}
        {!studentAnswer && (
          <div className="mt-4 flex justify-center flex-wrap gap-2">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => handleBondAnswer(i)}
                className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-blue-100 text-lg"
              >
                {i}
              </button>
            ))}
          </div>
        )}

        {/* Number sentence stage */}
        {studentAnswer && (
          <div className="mt-6">
            <div className="text-xl font-bold mb-4">
              {activeSentence.text}
            </div>

            <div className="flex justify-center flex-wrap gap-2">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleSentenceAnswer(i)}
                  className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-blue-100 text-lg"
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="mt-3">{feedback}</p>
        {showConfetti && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}
      </div>
    </div>
  );
};

export default NumberBondApp;
