import React, { useState } from "react";

function NumberLine({ max = 10, onSelect }) {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onSelect(num)}
          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-blue-100"
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Interactive Number Bonds</h1>
      <button
        onClick={() => generateProblems(6)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-6"
      >
        Generate Problems
      </button>

      <div className="grid grid-cols-1 gap-8">
        {problems.map((p, idx) => {
          const studentAnswer = answers[idx];
          const correctAnswer = getCorrectAnswer(p);
          const isCorrect = studentAnswer === correctAnswer;

          return (
            <div key={idx} className="p-4 border rounded-xl shadow bg-white">
              {/* Number bond diagram */}
              <div className="flex justify-around items-center mb-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 border rounded-full flex items-center justify-center text-lg font-bold ${
                      p.blank === "whole" && studentAnswer
                        ? isCorrect
                          ? "bg-green-100"
                          : "bg-red-100"
                        : ""
                    }`}
                  >
                    {p.blank === "whole" ? studentAnswer || "___" : p.whole}
                  </div>
                  <div className="flex space-x-8 mt-8">
                    <div
                      className={`w-16 h-16 border rounded-full flex items-center justify-center text-lg font-bold ${
                        p.blank === "left" && studentAnswer
                          ? isCorrect
                            ? "bg-green-100"
                            : "bg-red-100"
                          : ""
                      }`}
                    >
                      {p.blank === "left" ? studentAnswer || "___" : p.part1}
                    </div>
                    <div
                      className={`w-16 h-16 border rounded-full flex items-center justify-center text-lg font-bold ${
                        p.blank === "right" && studentAnswer
                          ? isCorrect
                            ? "bg-green-100"
                            : "bg-red-100"
                          : ""
                      }`}
                    >
                      {p.blank === "right" ? studentAnswer || "___" : p.part2}
                    </div>
                  </div>
                </div>
              </div>

              {/* Number sentences */}
              <div className="space-y-2">
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
