import React, { useState } from "react";
import Confetti from "react-confetti";


const NumberBondApp = () => {
  const [maxTotal, setMaxTotal] = useState(10);

  // Utility to generate random number bond problems
  const generateProblem = () => {
    if (maxTotal < 2) return { part1: 1, part2: 1, whole: 2, blank: "whole" }; // fallback

    // Randomly pick part1 between 1 and maxTotal - 1
    const part1 = Math.floor(Math.random() * (maxTotal - 1)) + 1;

    // Randomly pick part2 so that the sum does not exceed maxTotal
    const maxPart2 = maxTotal - part1;
    const part2 = Math.floor(Math.random() * maxPart2) + 1;

    const whole = part1 + part2;

    // Randomly pick which circle is blank
    const blanks = ["whole", "left", "right"];
    const blank = blanks[Math.floor(Math.random() * 3)];

    return { part1, part2, whole, blank };
  };
  const [problem, setProblem] = useState(generateProblem());
  const [studentAnswer, setStudentAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const goal = 5; // how many correct answers to fill thermometer
  

  // Generate number sentences for the current problem
  const generateSentences = (p) => [
    { text: `___ + ${p.part2} = ${p.whole}`, answer: p.part1 },
    { text: `${p.part1} + ___ = ${p.whole}`, answer: p.part2 },
    { text: `${p.whole} - ___ = ${p.part2}`, answer: p.part1 },
    { text: `${p.whole} - ${p.part1} = ___`, answer: p.part2 },
  ];

  const sentences = generateSentences(problem);
  const activeSentence = sentences[currentSentenceIdx];

  const moveToNextProblem = () => {
    setProblem(generateProblem());
    setStudentAnswer(null);
    setFeedback("");
    setShowConfetti(false);
    setCurrentSentenceIdx(0);
  };

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
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= goal) {
          // 🎉 Trigger big celebration
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000); // hides after 3s

          return 0; // 🔄 reset thermometer
        }
        return next;
      });

      setTimeout(() => {
        setShowConfetti(false);
        setFeedback("");
      }, 1200);
    } else {
      setFeedback("❌ Try again!");
    }
  };

  const handleSentenceAnswer = (val) => {
    if (val === activeSentence.answer) {
      setFeedback("✅ Correct!");
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= goal) {
          // 🎉 Trigger big celebration
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000); // hides after 3s

          return 0; // 🔄 reset thermometer
        }
        return next;
      });

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-50">
      <div className="relative max-w-md w-full flex flex-col items-center space-x-6">
      
        {/* Maximum total selection */}
        <div className="mb-6 w-full text-center">
          <label className="mr-2 text-lg font-medium">Maximum total:</label>
          <input
            type="number"
            value={maxTotal}
            min={2}
            max={20}
            onChange={(e) => setMaxTotal(Number(e.target.value))}
            className="border px-3 py-1 rounded text-lg w-20 text-center"
          />
        </div>

        {/* Confetti burst */}
        {showConfetti && (
          <Confetti
            width={300}
            height={200}
            recycle={false}
            numberOfPieces={200}
            gravity={0.4}
            initialVelocityY={-10}
            style={{
              position: "absolute",
              top: -100,
              left: 0,
              zIndex: 50,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Success message */}
        {showConfetti && (
          <div className="absolute -top-16 w-full flex items-center justify-center z-50">
            <div className="animate-bounce text-3xl font-extrabold text-pink-600 drop-shadow-lg">
              🎉 Great job! 🎉
            </div>
          </div>
        )}

        {/* Rainbow thermometer */}
        <div className="w-48 h-8 bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-blue-400 to-purple-500 rounded-full overflow-hidden relative shadow-lg">
          <div
            className="absolute bottom-0 left-0 w-full bg-white transition-all duration-500"
            style={{ height: `${100 - (progress / goal) * 100}%` }}
            />
        </div>

        {/* Number bond card */}
        <div className="p-6 border-4 border-yellow-300 rounded-3xl shadow-xl bg-white relative z-10">
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">
            Number Bond Challenge
          </h2>
              <div className="flex justify-center items-center text-2xl font-semibold text-gray-800">
                <svg width="250" height="160">
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
                  <text x="125" y="45" fontSize="20" textAnchor="middle">
                    {problem.blank === "whole"
                      ? studentAnswer || "___"
                      : problem.whole}
                  </text>

                  {/* Bottom left circle */}
                  <circle cx="70" cy="120" r="28" fill="white" stroke="black" />
                  <text x="70" y="125" fontSize="20" textAnchor="middle">
                    {problem.blank === "left"
                      ? studentAnswer || "___"
                      : problem.part1}
                  </text>

                  {/* Bottom right circle */}
                  <circle cx="180" cy="120" r="28" fill="white" stroke="black" />
                  <text x="180" y="125" fontSize="20" textAnchor="middle">
                    {problem.blank === "right"
                      ? studentAnswer || "___"
                      : problem.part2}
                  </text>
                </svg>
              </div>

              {/* Number line for bond */}
              {!studentAnswer && (
                <div className="mt-4 flex justify-center flex-wrap gap-2">
                  {Array.from({ length: maxTotal + 1 }, (_, i) => (
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

              {/* Number sentences */}
              {studentAnswer && (
                <div className="mt-1">
                  <div className="flex justify-center items-center text-2xl font-semibold text-gray-800 py-5">{activeSentence.text}</div>
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
        </div>
      </div>
    </div>
  );
};

export default NumberBondApp;
