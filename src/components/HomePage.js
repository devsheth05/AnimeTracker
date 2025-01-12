// src/components/HomePage.js
import React, { useState, useEffect } from 'react';

function HomePage() {
  const [topAnime, setTopAnime] = useState([
    { id: 1, name: "Fairy Tail", explanation: "" },
    { id: 2, name: "FullMetal Alchemist Brotherhood", explanation: "" },
    { id: 3, name: "Rascal does not dream of Bunny-girl senpai", explanation: "" },
    { id: 4, name: "Re:Zero Starting life in another world", explanation: "" },
    { id: 5, name: "Naruto", explanation: "" },
  ]);

  // Load saved explanations from localStorage when the component mounts
  useEffect(() => {
    const savedAnime = localStorage.getItem('topAnime');
    if (savedAnime) {
      setTopAnime(JSON.parse(savedAnime)); // Parse and set the anime list from localStorage
    }
  }, []); // Run this once when the component mounts

  // Function to handle explanation changes and save to localStorage
  const handleExplanationChange = (index, value) => {
    const updatedAnimeList = [...topAnime];
    updatedAnimeList[index].explanation = value;
    setTopAnime(updatedAnimeList);

    // Save updated anime list with explanations to localStorage
    localStorage.setItem('topAnime', JSON.stringify(updatedAnimeList));
  };

  return (
    <div>
      <h1>DEVS TOP 5 ANIME!!</h1>
      {topAnime.map((anime, index) => (
        <div key={anime.id}>
          <h2>{`${index + 1}. ${anime.name}`}</h2>
          <textarea
            value={anime.explanation}
            onChange={(e) => handleExplanationChange(index, e.target.value)}
            placeholder={`Explain why ${anime.name} is your top choice...`}
          ></textarea>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
