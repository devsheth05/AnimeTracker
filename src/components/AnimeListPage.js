// src/components/AnimeListPage.js
import { db } from '../firebase'; // Import Firestore db

import React, { useState, useEffect } from 'react';

import { collection, getDocs, addDoc } from 'firebase/firestore'; // Import Firestore methods

function AnimeListPage() {
  const [animeList, setAnimeList] = useState([]);
  const [animeInput, setAnimeInput] = useState('');

  // Load anime list from Firestore when the component mounts
  useEffect(() => {
    const fetchAnimeList = async () => {
      const animeRef = collection(db, 'animeList'); // Get the reference to the anime list collection
      const snapshot = await getDocs(animeRef); // Retrieve the anime list from Firestore
      const list = snapshot.docs.map((doc) => doc.data().name); // Extract anime names
      setAnimeList(list); // Update state with fetched data
    };

    fetchAnimeList(); // Call the function to load data
  }, []); // Run this only once when the component mounts

  // Save anime list to Firestore
  const handleAddAnime = async () => {
    if (animeInput.trim()) {
      // Add the new anime to Firestore
      const animeRef = collection(db, 'animeList');
      await addDoc(animeRef, { name: animeInput.trim() });

      // Update local state to reflect changes without waiting for Firestore response
      setAnimeList((prevList) => [...prevList, animeInput.trim()]);
      setAnimeInput(''); // Clear input field
    }
  };

  // Handle removing an anime from the list (this is just for local state; Firestore removal should be handled separately)
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
