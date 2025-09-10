import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";

/* Number line (large touch-friendly buttons) */
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
  const [studentAnswer, setStudentAnswer] = useState(null); // chosen for the bond
  const [stage, setStage] = useState("bond"); // "bond" | "sentences"
  const [sentenceAnswers, setSentenceAnswers] = useState({});
  const [wrongIndexes, setWrongIndexes] = useState([]);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });

  const topCircleRef = useRef(null);

  useEffect(() => {
    // generate problems (sums <= 10)
    const newProblems = [];
    for (let i = 0; i < totalProblems; i++) {
      const whole = Math.floor(Math.random() * 9) + 2; // 2..10
      const part1 = Math.floor(Math.random() * (whole - 1)) + 1;
      const part2 = whole - part1;
      const blank = ["whole", "left", "right"][Math.floor(Math.random() * 3)];
      newProblems.push({ whole, part1, part2, blank });
    }
    setProblems(newProblems);
  }, []);

  if (problems.length === 0) return null;
  if (currentIndex >= totalProblems) {
    // completion screen
    return (
      <div className="p-4 md:p-6 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">All Done!</h1>
        <p className="text-lg mb-2">
          You got <span className="font-bold">{score}</span> out of {totalProblems} correct.
        </p>
        <button
          onClick={() => {
            // restart
            setScore(0);
            setCurrentIndex(0);
            setStudentAnswer(null);
            setStage("bond");
            setSentenceAnswers({});
            setWrongIndexes([]);
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

  const problem = problems[currentIndex];

  const correctAnswer =
    problem.blank === "whole" ? problem.whole : problem.blank === "left" ? problem.part1 : problem.part2;

  // SVG / circle layout
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

  // Build sentence definitions once so submit handler can use them
  function getSentencesForProblem(p) {
    const s = [];
    if (p.blank === "whole") {
      // input then " = a + b"
      s.push({ before: "", after: ` = ${p.part1} + ${p.part2}`, expected: p.whole });
      s.push({ before: "", after: ` = ${p.part2} + ${p.part1}`, expected: p.whole });
    } else if (p.blank === "left") {
      // "___ + b = whole"  and  "whole - b = ___"
      s.push({ before: "", after: ` + ${p.part2} = ${p.whole}`, expected: p.part1 });
      s.push({ before: `${p.whole} - ${p.part2} = `, after: "", expected: p.part1 });
    } else {
      // right blank: "a + ___ = whole"  and "whole - a = ___"
      s.push({ before: `${p.part1} + `, after: ` = ${p.whole}`, expected: p.part2 });
      s.push({ before: `${p.whole} - ${p.part1} = `, after: "", expected: p.part2 });
    }
    return s;
  }
  const sentences = getSentencesForProblem(problem);

  // Called when a number on the number line is chosen
  function handleSelect(value) {
    setStudentAnswer(value);
    if (value === correctAnswer) {
      // measure top circle position for confetti origin
      if (topCircleRef.current && typeof topCircleRef.current.getBoundingClientRect === "function") {
        const rect = topCircleRef.current.getBoundingClientRect();
        setConfettiPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      } else {
        setConfettiPos({ x: window.innerWidth / 2, y: 100 });
      }

      setShowConfetti(true);

      // after a short burst, go to sentences stage (keep studentAnswer shown in circle)
      setTimeout(() => {
        setShowConfetti(false);
        setStage("sentences");
        setSentenceAnswers({});
        setWrongIndexes([]);
      }, 900);
    } else {
      // wrong number bond choice — give immediate feedback by briefly highlighting blank
      setStage("bond");
      // You can add additional visual feedback here if desired
    }
  }

  function handleSentenceInput(i, value) {
    setSentenceAnswers((prev) => ({ ...prev, [i]: value }));
    // clear wrong highlight for this input as the user types
    setWrongIndexes((prev) => prev.filter((idx) => idx !== i));
  }

  function handleSubmitSentences() {
    const wrong = [];
    sentences.forEach((s, i) => {
      const userVal = sentenceAnswers[i];
      if (userVal == null || String(userVal).trim() === "" || Number(userVal) !== s.expected) {
        wrong.push(i);
      }
    });

    if (wrong.length === 0) {
      // all correct — increment score and move to next
      setScore((s) => s + 1);
      // short delay so user sees correct state
      setTimeout(() => {
        setCurrentIndex((ci) => ci + 1);
        setStudentAnswer(null);
        setStage("bond");
        setSentenceAnswers({});
        setWrongIndexes([]);
      }, 300);
    } else {
      // mark incorrect inputs
      setWrongIndexes(wrong);
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-md mx-auto relative">
      {/* Confetti overlay (full viewport) */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
          recycle={false}
          gravity={0.35}
          confettiSource={{ x: confettiPos.x, y: confettiPos.y, w: 10, h: 10 }}
          style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999 }}
        />
      )}

      <h1 className="text-2xl font-bold mb-4 text-center">Interactive Number Bonds</h1>
      <div className="mb-4 text-center text-lg">
        Problem {currentIndex + 1} of {totalProblems} | Score: {score}
      </div>

      <div className="mx-auto max-w-xs">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height={svgHeight}>
          {/* connecting lines (edge-to-edge) */}
          <line x1={topCx} y1={topCy + circleRadius} x2={leftCx} y2={leftCy - circleRadius} stroke="black" strokeWidth="2" />
          <line x1={topCx} y1={topCy + circleRadius} x2={rightCx} y2={rightCy - circleRadius} stroke="black" strokeWidth="2" />

          {/* circles: top, left, right */}
          {[{ cx: topCx, cy: topCy, value: problem.whole, blank: "whole", ref: topCircleRef },
            { cx: leftCx, cy: leftCy, value: problem.part1, blank: "left" },
            { cx: rightCx, cy: rightCy, value: problem.part2, blank: "right" }].map((c, i) => {
            // decide fill and text:
            const isBlank = c.blank === problem.blank;
            // while in bond stage, show the chosen bond value in the blank circle (if chosen)
            // while in sentence stage, keep the blank circle filled to confirm the chosen answer
            const fill =
              isBlank && (stage === "sentences" || (stage === "bond" && studentAnswer === correctAnswer))
                ? "#d1fae5"
                : "white";
            const displayedText = isBlank
              ? (stage === "bond" ? (studentAnswer ? String(studentAnswer) : "___") : String(correctAnswer))
              : String(c.value);

            return (
              <g key={i}>
                <circle
                  ref={i === 0 ? c.ref : undefined}
                  cx={c.cx}
                  cy={c.cy}
                  r={circleRadius}
                  fill={fill}
                  stroke="black"
                  strokeWidth="2"
                />
                <text x={c.cx} y={c.cy + fontSize / 3} textAnchor="middle" fontSize={fontSize} fontWeight="bold">
                  {displayedText}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stage 1: number bond interaction */}
      {stage === "bond" && <NumberLine max={10} onSelect={handleSelect} />}

      {/* Stage 2: fill sentences (inputs inline replacing the blanks) */}
      {stage === "sentences" && (
        <div className="space-y-3 mt-4 text-lg text-center">
          {sentences.map((s, i) => (
            <div key={i} className="flex justify-center items-center gap-2">
              {/* text before, input, text after */}
              <span>{s.before}</span>
              <input
                inputMode="numeric"
                type="number"
                value={sentenceAnswers[i] ?? ""}
                onChange={(e) => handleSentenceInput(i, e.target.value)}
                className={`w-20 p-1 border rounded text-center text-lg ${wrongIndexes.includes(i) ? "ring-2 ring-red-500" : ""}`}
                aria-label={`Sentence input ${i + 1}`}
              />
              <span>{s.after}</span>
            </div>
          ))}

          <div className="flex justify-center gap-3 mt-3">
            <button onClick={handleSubmitSentences} className="px-4 py-2 bg-green-500 text-white rounded">
              Submit
            </button>
            <button
              onClick={() => {
                // let student change bond answer — go back to bond stage
                setStage("bond");
                setSentenceAnswers({});
                setWrongIndexes([]);
                setStudentAnswer(null);
              }}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Back
            </button>
          </div>

          {wrongIndexes.length > 0 && (
            <div className="text-red-600 font-semibold mt-2">Some answers are incorrect — try again.</div>
          )}
        </div>
      )}
    </div>
  );
}
