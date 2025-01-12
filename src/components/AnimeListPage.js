// src/components/AnimeListPage.js
import React, { useState, useEffect } from 'react';

function AnimeListPage() {
  const [animeList, setAnimeList] = useState([]);
  const [animeInput, setAnimeInput] = useState('');

  // Load anime list from localStorage when the component mounts
  useEffect(() => {
    const savedList = localStorage.getItem('animeList');
    if (savedList) {
      setAnimeList(JSON.parse(savedList)); // Parse and set the list from localStorage
    }
  }, []); // Run this only once when the component mounts

  // Save anime list to localStorage and update state
  const handleAddAnime = () => {
    if (animeInput.trim()) {
      const updatedList = [...animeList, animeInput.trim()];
      setAnimeList(updatedList); // Update state with new list
      localStorage.setItem('animeList', JSON.stringify(updatedList)); // Save updated list to localStorage
      setAnimeInput(''); // Clear input field
    }
  };

  // Handle removing an anime from the list
  const handleRemoveAnime = (index) => {
    const updatedList = animeList.filter((_, i) => i !== index);
    setAnimeList(updatedList); // Update state with new list
    localStorage.setItem('animeList', JSON.stringify(updatedList)); // Save updated list to localStorage
  };

  return (
    <div>
      <h1>All Anime I've Watched</h1>
      <input
        type="text"
        value={animeInput}
        onChange={(e) => setAnimeInput(e.target.value)}
        placeholder="Add a new anime"
      />
      <button onClick={handleAddAnime} disabled={!animeInput.trim()}>Add</button>
      <ul>
        {animeList.map((anime, index) => (
          <li key={index}>
            {anime} <button onClick={() => handleRemoveAnime(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnimeListPage;
