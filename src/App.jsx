import { useState, useEffect, useCallback } from 'react';
import './App.css';

const SEQUENCE = `Fantasy JRPG inspired spirit bonding epic with an ever expanding plot that moves from local to cosmic, revealing an indestructible thread of destiny and fate knotted through time. We are in a fantasy world heavily inspired by tales of phantasia, chrono trigger, and final fantasy. There are multiple planets, part of the charm of the story is how you discover that the world is much bigger than you thought, going from just our time on our planet, to different time periods on our planet, to discovering other planets, and conflicts between them, then, finding out there is a world tree connecting 9 planets, and it's struggles to survive. There are 4 types of magic, incantations, anomist/magicyte craftworks, magic sigils, and axis spirits (this is where body x soul comes in). An axis spirit is attached to a body with elfin blood, then the elfin can develop special powers. So, this is like, the person can hear a voice in their heads, and this is a main plot point. These axis spirits can carry memories from person to person affecting people's decisions, and since there exists time travel here, the entire history of the nine planets is a tightly knit knot of causality all dreamt up by the void axis yggdrasil, the sun, this world's god, who is neither good nor evil, but seeks to be entertained. In Season One, our main bad guy is Moebius. It's similar to Cowboy Bebop in that we don't see him much, and we spend most of the time gathering axis spirits with the team. But every now and then, Moebius rears his head, like Vicious, and in the finale, we have to finish him off. The bad guy in season 2 is Fafnir, an ice elfin from 700ad. The humans are trying to overthrow him, and the sea elfin, led by house Reign, struggle to depose him. An elfin called Seraphine starts helping them. Fafnir, as a villain, is very similar to the White Witch of Narnia, cooped away in his icy palace. Season 3's bad guy seems to be Melchior at first, but it proves later on to be Noberyn, high lord of the Moon Kingdom. Seraphine tricked them. She and Noberyn are actually Mithra, insects who only resemble Elfin, and they have a plan to seed Gaia with thousands of insect eggs. No good! In the 4th season of Body x Soul, the main bad guys are the Cult of the Red Moon, who are working together with the Plaguemancers of Bris, mist-tek mages from the future, to cause another apocalypse on Gaia. The 5th Season of Body x Soul revolves around the past. We get to know the Elfin, the Celestials, and the Arcadian Primeval. We go through Reconquista and we follow the Basra as they track down the last zombie ice Ignis on Terra. The main bad guys of the 6th season of Body x Soul are the nu-plaguemancers, also known as the Order of Nidhogg. Enhanced from powerful spells cast by Jormungandr, lord of the worlds of ruin, they are meant to smash through the defenses of the worlds of light and make way for the coming invasion. The 7th season of Body x Soul's bad guys are the Ystrals. They're the last powerful enemies of the worlds of light. They've gone into hiding, and if we don't destroy them, all our work will have been for nothing. We must preserve Yggdrasil.
`.split(' ');

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gridWords, setGridWords] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [isRainbow, setIsRainbow] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#e6f3ff'); // Light blue initial background

  const getRandomWords = useCallback((count, excludeWord) => {
    const words = new Set();
    while (words.size < count) {
      const randomIndex = Math.floor(Math.random() * SEQUENCE.length);
      const word = SEQUENCE[randomIndex];
      if (word !== excludeWord) {
        words.add(word);
      }
    }
    return Array.from(words);
  }, []);

  const setupNewRound = useCallback(() => {
    const targetWord = SEQUENCE[currentIndex];
    const randomWords = getRandomWords(8, targetWord);
    const allWords = [...randomWords, targetWord];
    
    for (let i = allWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }
    
    setGridWords(allWords);
    setCorrectIndex(null);
  }, [currentIndex, getRandomWords]);

  const flashColor = useCallback((color) => {
    setBackgroundColor(color);
    setTimeout(() => {
      setBackgroundColor(currentIndex === 0 ? '#e6f3ff' : '#ffffff');
    }, 500);
  }, [currentIndex]);

  const handleGameReset = useCallback((selectedIndex) => {
    const targetWord = SEQUENCE[currentIndex];
    const correctPosition = gridWords.findIndex(word => word === targetWord);
    
    // Flash red immediately
    flashColor('#ffdddd');
    
    // Show correct answer in blue
    setTimeout(() => {
      setCorrectIndex(correctPosition);
      
      // Reset after showing correct answer
      setTimeout(() => {
        setCurrentIndex(0);
        setupNewRound();
      }, 1000);
    }, 500);
  }, [currentIndex, gridWords, setupNewRound, flashColor]);

  const handleSelection = useCallback((index) => {
    const selectedWord = gridWords[index];
    const targetWord = SEQUENCE[currentIndex];

    if (selectedWord === targetWord) {
      flashColor('#32CD32'); // Lime green flash for correct
      
      if (currentIndex === SEQUENCE.length - 1) {
        setIsRainbow(true);
        setTimeout(() => {
          setIsRainbow(false);
          setCurrentIndex(0);
          setupNewRound();
        }, 3000);
      } else {
        // Immediate transition to next word
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      handleGameReset(index);
    }
  }, [currentIndex, gridWords, handleGameReset, flashColor, setupNewRound]);

  useEffect(() => {
    setupNewRound();
  }, [currentIndex, setupNewRound]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const validKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      if (validKeys.includes(event.key)) {
        const index = validKeys.indexOf(event.key);
        handleSelection(index);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleSelection]);

  return (
    <div style={{ 
      padding: '20px', 
      background: isRainbow ? 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)' : backgroundColor,
      transition: 'background-color 0.3s',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        width: '100%',
        padding: '20px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Memory Study Game</h1>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>Progress: {currentIndex + 1}/{SEQUENCE.length}</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '10px', 
          marginBottom: '20px' 
        }}>
          {[6, 7, 8, 3, 4, 5, 0, 1, 2].map((pos, i) => (
            <div
              key={i}
              onClick={() => handleSelection(pos)}
              style={{
                padding: '20px',
                backgroundColor: correctIndex === pos ? '#87CEEB' : '#ff4444',
                color: correctIndex === pos ? 'black' : 'white',
                borderRadius: '5px',
                cursor: 'pointer',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transition: 'background-color 0.3s',
                fontSize: '16px'
              }}
            >
              {gridWords[pos]}
            </div>
          ))}
        </div>
        
        <p style={{ textAlign: 'center', color: '#666' }}>
          Use numpad keys (1-9) or click/tap the boxes to select words
        </p>
      </div>
    </div>
  );
}

export default App;