import React, { useState, useEffect } from "react";

function NumberLine({ max = 10, onSelect }) {
  return (
    <div className="flex justify-center space-x-4 mt-4">
      {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onSelect(num)}
          className="w-12 h-12 text-lg rounded-full border flex items-center justify-center hover:bg-blue-100"
        >
          {num}
        </button>
      ))}
    </div>
  );
}

export default function NumberBondApp() {
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null

  // Function to generate a new random problem
  function generateProblem() {
    const whole = Math.floor(Math.random() * 9) + 2; // 2–10
    const part1 = Math.floor(Math.random() * (whole - 1)) + 1;
    const part2 = whole - part1;
    const blank = ["whole", "left", "right"][Math.floor(Math.random() * 3)];
    setProblem({ whole, part1, part2, blank });
    setStudentAnswer(null);
    setFeedback(null);
  }

  useEffect(() => {
    generateProblem(); // generate first problem on mount
  }, []);

  if (!problem) return null; // still initializing

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

  const correctAnswer =
    problem.blank === "whole"
      ? problem.whole
      : problem.blank === "left"
      ? problem.part1
      : problem.part2;

  function handleSelect(value) {
    setStudentAnswer(value);
    if (value === correctAnswer) {
      setFeedback("correct");
      // move to next problem after brief delay
      setTimeout(() => generateProblem(), 500);
    } else {
      setFeedback("wrong");
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Interactive Number Bonds
      </h1>

      {/* Number bond SVG */}
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="auto" className="max-w-xs mx-auto">
        {/* Lines */}
        <line x1={topCx} y1={topCy + circleRadius} x2={leftCx} y2={leftCy - circleRadius} stroke="black" strokeWidth="2"/>
        <line x1={topCx} y1={topCy + circleRadius} x2={rightCx} y2={rightCy - circleRadius} stroke="black" strokeWidth="2"/>

        {/* Circles & text */}
        {[{cx: topCx, cy: topCy, value: problem.whole, blank: "whole"},
          {cx: leftCx, cy: leftCy, value: problem.part1, blank: "left"},
          {cx: rightCx, cy: rightCy, value: problem.part2, blank: "right"}].map((c, i) => (
          <>
            <circle
              key={`circle-${i}`}
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
              key={`text-${i}`}
              x={c.cx}
              y={c.cy + fontSize / 3}
              textAnchor="middle"
              fontSize={fontSize}
              fontWeight="bold"
            >
              {c.blank === problem.blank ? studentAnswer || "___" : c.value}
            </text>
          </>
        ))}
      </svg>

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

      {/* Number line */}
      <NumberLine max={10} onSelect={handleSelect} />

      {/* Feedback */}
      {feedback && (
        <div className={`mt-4 text-center font-bold text-xl ${feedback === "correct" ? "text-green-600" : "text-red-600"}`}>
          {feedback === "correct" ? "Correct!" : "Try again"}
        </div>
      )}
    </div>
  );
}
