import React, { useState, useEffect, useRef } from 'react';
import { useInterval } from './useInterval';

const Pip = () => <div className="w-4 h-4 bg-black rounded-full shadow-inner"></div>;

const Die = ({ value }) => {
  const pipLayouts = {
    1: <div className="col-start-2 row-start-2"><Pip /></div>,
    2: <><div className="col-start-1 row-start-1"><Pip /></div><div className="col-start-3 row-start-3"><Pip /></div></>,
    3: <><div className="col-start-1 row-start-1"><Pip /></div><div className="col-start-2 row-start-2"><Pip /></div><div className="col-start-3 row-start-3"><Pip /></div></>,
    4: <><div className="col-start-1 row-start-1"><Pip /></div><div className="col-start-3 row-start-1"><Pip /></div><div className="col-start-1 row-start-3"><Pip /></div><div className="col-start-3 row-start-3"><Pip /></div></>,
    5: <><div className="col-start-1 row-start-1"><Pip /></div><div className="col-start-3 row-start-1"><Pip /></div><div className="col-start-2 row-start-2"><Pip /></div><div className="col-start-1 row-start-3"><Pip /></div><div className="col-start-3 row-start-3"><Pip /></div></>,
    6: <><div className="col-start-1 row-start-1"><Pip /></div><div className="col-start-3 row-start-1"><Pip /></div><div className="col-start-1 row-start-2"><Pip /></div><div className="col-start-3 row-start-2"><Pip /></div><div className="col-start-1 row-start-3"><Pip /></div><div className="col-start-3 row-start-3"><Pip /></div></>,
  };

  return (
    <div className="w-20 h-20 bg-white rounded-lg shadow-lg p-2 grid grid-cols-3 grid-rows-3 items-center justify-items-center">
      {pipLayouts[value]}
    </div>
  );
};

const DiceGame = ({ die1, die2, isRolling }) => {
  const [displayDie1, setDisplayDie1] = useState(die1);
  const [displayDie2, setDisplayDie2] = useState(die2);
  const [animationDelay, setAnimationDelay] = useState(null);
  
  // Use a ref to track if it's the initial render or a new problem
  const hasRolledRef = useRef(false);

  useEffect(() => {
    // If a roll is in progress, start the animation
    if (isRolling) {
      hasRolledRef.current = true; // Mark that a roll has happened
      setAnimationDelay(75);
    } else {
      setAnimationDelay(null);
      // Only update the final values if a roll has just finished
      if (hasRolledRef.current) {
        setDisplayDie1(die1);
        setDisplayDie2(die2);
      }
    }
  }, [isRolling, die1, die2]);

  useInterval(() => {
    setDisplayDie1(Math.floor(Math.random() * 6) + 1);
    setDisplayDie2(Math.floor(Math.random() * 6) + 1);
  }, animationDelay);

  return (
    <div className="flex justify-center items-center gap-6 p-4 min-h-[120px]">
      <Die value={displayDie1} />
      <Die value={displayDie2} />
    </div>
  );
};

export default DiceGame;