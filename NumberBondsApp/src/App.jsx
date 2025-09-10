import React, { useState, useEffect } from "react";

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
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [animateCorrect, setAnimateCorrect] = useState(false);

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
      setAnimateCorrect(true);
      setScore(score + 1);

      // Move to next problem after animation
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setStudentAnswer(null);
        setFeedback(null);
        setAnimateCorrect(false);
      }, 700);
    } else {
      setFeedback("wrong");
      setAnimateCorrect(false);
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
            setFeedback(null);
            setAnimateCorrect(false);
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
    <div className="p-4 md:p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Interactive Number Bonds
      </h1>

      {/* Progress tracker */}
      <div className="mb-4 text-center text-lg">
        Problem {currentIndex + 1} of {totalProblems} | Score: {score}
      </div>

      {/* Number bond SVG */}
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="auto" className="max-w-xs mx-auto">
        <line x1={topCx} y1={topCy + circleRadius} x2={leftCx} y2={leftCy - circleRadius} stroke="black" strokeWidth="2"/>
        <line x1={topCx} y1={topCy + circleRadius} x2={rightCx} y2={rightCy - circleRadius} stroke="black" strokeWidth="2"/>

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
              className={animateCorrect && c.blank === problem.blank ? "transition-all duration-500 scale-110" : ""}
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
