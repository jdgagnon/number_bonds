import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

function NumberLine({ max = 10, onSelect }) {
  return (
    <div className="flex justify-center flex-wrap gap-3 mt-4">
      {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onSelect(num)}
          className="w-16 h-16 text-xl rounded-full border flex items-center justify-center hover:bg-blue-100 transition transform active:scale-95"
        >
          {num}
        </button>
      ))}
    </div>
  );
}

export default function NumberBondApp() {
  const totalProblems = 10;
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newProblems = [];
    for (let i = 0; i < totalProblems; i++) {
      const whole = Math.floor(Math.random() * 9) + 2;
      const part1 = Math.floor(Math.random() * (whole - 1)) + 1;
      const part2 = whole - part1;
      const blank = ["whole", "left", "right"][Math.floor(Math.random() * 3)];
      newProblems.push({ whole, part1, part2, blank });
    }
    setProblems(newProblems);
  }, []);

  if (problems.length === 0) return null;

  const problem = problems[currentIndex];
  const correctAnswer =
    problem.blank === "whole"
      ? problem.whole
      : problem.blank === "left"
      ? problem.part1
      : problem.part2;

  // Circle & SVG dimensions
  const circleRadius = 28;
  const fontSize = 20;
  const svgWidth = 240;
  const svgHeight = 160;
  const topCx = svgWidth / 2;
  const topCy = 32;
  const leftCx = 40;
  const leftCy = 120;
  const rightCx = 200;
  const rightCy = 120;

  function handleSelect(value) {
    setStudentAnswer(value);
    if (value === correctAnswer) {
      // get top circle position
      const rect = document
        .getElementById("top-circle")
        .getBoundingClientRect();
      setConfettiPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

      setShowConfetti(true);
      setScore(score + 1);

      setTimeout(() => {
        setShowConfetti(false);
        setCurrentIndex(currentIndex + 1);
        setStudentAnswer(null);
      }, 1200);
    }
  }

  if (currentIndex >= totalProblems) {
    return (
      <div className="p-4 md:p-6 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">All Done!</h1>
        <p className="text-lg mb-2">
          You got <span className="font-bold">{score}</span> out of {totalProblems} correct.
        </p>
        <button
          onClick={() => {
            setScore(0);
            setCurrentIndex(0);
            setStudentAnswer(null);
            const newProblems = [];
            for (let i = 0; i < totalProblems; i++) {
              const whole = Math.floor(Math.random() * 9) + 2;
              const part1 = Math.floor(Math.random() * (whole - 1)) + 1;
              const part2 = whole - part1;
              const blank = ["whole", "left", "right"][Math.floor(Math.random() * 3)];
              newProblems.push({ whole, part1, part2, blank });
            }
            setProblems(newProblems);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-md mx-auto relative">
      {/* Confetti overlay */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
          recycle={false}
          gravity={0.3}
          confettiSource={{
            x: confettiPos.x,
            y: confettiPos.y,
            w: 10,
            h: 10,
          }}
          run={showConfetti}
          style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999 }}
        />
      )}

      <h1 className="text-2xl font-bold mb-4 text-center">Interactive Number Bonds</h1>
      <div className="mb-4 text-center text-lg">
        Problem {currentIndex + 1} of {totalProblems} | Score: {score}
      </div>

      <div className="mx-auto max-w-xs">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height={svgHeight}>
          {/* Lines connecting circles */}
          <line x1={topCx} y1={topCy + circleRadius} x2={leftCx} y2={leftCy - circleRadius} stroke="black" strokeWidth="2"/>
          <line x1={topCx} y1={topCy + circleRadius} x2={rightCx} y2={rightCy - circleRadius} stroke="black" strokeWidth="2"/>

          {/* Circles */}
          {[
            { cx: topCx, cy: topCy, value: problem.whole, blank: "whole", id: "top-circle" },
            { cx: leftCx, cy: leftCy, value: problem.part1, blank: "left" },
            { cx: rightCx, cy: rightCy, value: problem.part2, blank: "right" },
          ].map((c, i) => (
            <g key={i}>
              <circle
                id={c.id}
                cx={c.cx}
                cy={c.cy}
                r={circleRadius}
                fill={
                  c.blank === problem.blank && studentAnswer
                    ? studentAnswer === correctAnswer
                      ? "#d1fae5"
                      : "#fee2e2"
                    : "white"
                }
                stroke="black"
                strokeWidth="2"
              />
              <text
                x={c.cx}
                y={c.cy + fontSize / 3}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="bold"
              >
                {c.blank === problem.blank ? studentAnswer || "___" : c.value}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Number sentences */}
      <div className="space-y-2 mt-4 text-lg text-center">
        {problem.blank === "whole" && (
          <>
            <div>___ = {problem.part1} + {problem.part2}</div>
            <div>___ = {problem.part2} + {problem.part1}</div>
          </>
        )}
        {problem.blank === "left" && (
          <>
            <div>___ + {problem.part2} = {problem.whole}</div>
            <div>{problem.whole} - {problem.part2} = ___</div>
          </>
        )}
        {problem.blank === "right" && (
          <>
            <div>{problem.part1} + ___ = {problem.whole}</div>
            <div>{problem.whole} - {problem.part1} = ___</div>
          </>
        )}
      </div>

      <NumberLine max={10} onSelect={handleSelect} />

      {studentAnswer && studentAnswer !== correctAnswer && (
        <div className="mt-4 text-center font-bold text-xl text-red-600">Try again</div>
      )}
    </div>
  );
}
