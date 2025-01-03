// src/components/AnimeListPage.js
import React, { useState } from 'react';

function AnimeListPage() {
  const [animeList, setAnimeList] = useState([]);
  const [animeInput, setAnimeInput] = useState('');

  const handleAddAnime = () => {
    if (animeInput.trim()) {
      setAnimeList([...animeList, animeInput.trim()]);
      setAnimeInput('');
    }
  };

  const handleRemoveAnime = (index) => {
    const updatedList = animeList.filter((_, i) => i !== index);
    setAnimeList(updatedList);
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
      <button onClick={handleAddAnime}>Add</button>
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
