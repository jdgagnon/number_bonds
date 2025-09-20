import React, { useState } from 'react';
import MainMenu from './MainMenu';
import MathGame from './math/MathGame';
import ReadingGame from './reading/ReadingGame';

function App() {
  const [currentSection, setCurrentSection] = useState('menu');

  const renderSection = () => {
    switch (currentSection) {
      case 'math':
        return <MathGame />;
      case 'reading':
        return <ReadingGame />;
      default:
        return <MainMenu onSelectSection={setCurrentSection} />;
    }
  };

  return (
    <div className="App">
      {renderSection()}
    </div>
  );
}

export default App;