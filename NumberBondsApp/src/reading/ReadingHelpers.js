// src/reading/ReadingHelpers.js

// Function to shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export const generateWordProblem = () => {
  const wordList = [
    { word: 'cat', image: '/images/cat.webp' },
    { word: 'sun', image: '/images/sun.webp' },
    { word: 'pig', image: '/images/pig.webp' },
    { word: 'dog', image: '/images/dog.webp' },
    { word: 'cup', image: '/images/cup.webp' },
    { word: 'ship', image: '/images/ship.webp' },
  ];

  const problem = wordList[Math.floor(Math.random() * wordList.length)];
  
  // Create a scrambled set of letter tiles, including some distractors
  const correctLetters = problem.word.split('');
  const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const distractors = new Set();
  while (distractors.size < 5) {
    const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
    if (!correctLetters.includes(randomLetter)) {
      distractors.add(randomLetter);
    }
  }

  const tiles = shuffleArray([...correctLetters, ...distractors]);
  
  // NEW: Convert the array of strings to an array of objects with unique IDs
  const tileObjects = tiles.map((letter, index) => ({
    id: `tile-${letter}-${index}`, // e.g., "tile-c-0"
    content: letter,
  }));

  return {
    ...problem,
    tiles: tileObjects, // Return the new array of objects
  };
};