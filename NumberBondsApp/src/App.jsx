import React, { useState } from "react";

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
  const [problems, setProblems] = useState([]);
  const [answers, setAnswers] = useState({});

  function generateProblems(n = 6) {
    const newProblems = [];
    for (let i = 0; i < n; i++) {
      const whole = Math.floor(Math.random() * 9) + 2; // 2–10
      const part1 = Math.floor(Math.random() * (whole - 1)) + 1;
      const part2 = whole - part1;
      const blank = ["whole", "left", "right"][Math.floor(Math.random() * 3)];
      newProblems.push({ whole, part1, part2, blank });
    }
    setProblems(newProblems);
    setAnswers({});
  }

  function handleSelect(idx, value) {
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  }

  function getCorrectAnswer(p) {
    if (p.blank === "whole") return p.whole;
    if (p.blank === "left") return p.part1;
    return p.part2;
  }

  return (
    <div className="p-4 md:p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Interactive Number Bonds
      </h1>
      <button
        onClick={() => generateProblems(6)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-6 block mx-auto"
      >
        Generate Problems
      </button>

      <div className="space-y-8">
        {problems.map((p, idx) => {
          const studentAnswer = answers[idx];
          const correctAnswer = getCorrectAnswer(p);
          const isCorrect = studentAnswer === correctAnswer;

          // SVG dimensions and circle positions
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

          return (
            <div key={idx}>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="auto">
                {/* Lines from top circle to bottom circles */}
                <line
                  x1={topCx}
                  y1={topCy + circleRadius}
                  x2={leftCx}
                  y2={leftCy - circleRadius}
                  stroke="black"
                  strokeWidth="2"
                />
                <line
                  x1={topCx}
                  y1={topCy + circleRadius}
                  x2={rightCx}
                  y2={rightCy - circleRadius}
                  stroke="black"
                  strokeWidth="2"
                />

                {/* Top circle */}
                <circle
                  cx={topCx}
                  cy={topCy}
                  r={circleRadius}
                  fill={
                    p.blank === "whole" && studentAnswer
                      ? isCorrect
                        ? "#d1fae5"
                        : "#fee2e2"
                      : "white"
                  }
                  stroke="black"
                  strokeWidth="2"
                />
                <text
                  x={topCx}
                  y={topCy + fontSize / 3}
                  textAnchor="middle"
                  fontSize={fontSize}
                  fontWeight="bold"
                >
                  {p.blank === "whole" ? studentAnswer || "___" : p.whole}
                </text>

                {/* Left circle */}
                <circle
                  cx={leftCx}
                  cy={leftCy}
                  r={circleRadius}
                  fill={
                    p.blank === "left" && studentAnswer
                      ? isCorrect
                        ? "#d1fae5"
                        : "#fee2e2"
                      : "white"
                  }
                  stroke="black"
                  strokeWidth="2"
                />
                <text
                  x={leftCx}
                  y={leftCy + fontSize / 3}
                  textAnchor="middle"
                  fontSize={fontSize}
                  fontWeight="bold"
                >
                  {p.blank === "left" ? studentAnswer || "___" : p.part1}
                </text>

                {/* Right circle */}
                <circle
                  cx={rightCx}
                  cy={rightCy}
                  r={circleRadius}
                  fill={
                    p.blank === "right" && studentAnswer
                      ? isCorrect
                        ? "#d1fae5"
                        : "#fee2e2"
                      : "white"
                  }
                  stroke="black"
                  strokeWidth="2"
                />
                <text
                  x={rightCx}
                  y={rightCy + fontSize / 3}
                  textAnchor="middle"
                  fontSize={fontSize}
                  fontWeight="bold"
                >
                  {p.blank === "right" ? studentAnswer || "___" : p.part2}
                </text>
              </svg>

              {/* Number sentences */}
              <div className="space-y-2 mt-2 text-lg text-center">
                {p.blank === "whole" && (
                  <>
                    <div>___ = {p.part1} + {p.part2}</div>
                    <div>___ = {p.part2} + {p.part1}</div>
                  </>
                )}
                {p.blank === "left" && (
                  <>
                    <div>___ + {p.part2} = {p.whole}</div>
                    <div>{p.whole} - {p.part2} = ___</div>
                  </>
                )}
                {p.blank === "right" && (
                  <>
                    <div>{p.part1} + ___ = {p.whole}</div>
                    <div>{p.whole} - {p.part1} = ___</div>
                  </>
                )}
              </div>

              {/* Interactive number line */}
              <NumberLine max={10} onSelect={(val) => handleSelect(idx, val)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}