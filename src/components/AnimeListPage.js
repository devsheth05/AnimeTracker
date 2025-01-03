// src/components/AnimeListPage.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';  // Import Firestore instance
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

function AnimeListPage() {
  const [animeList, setAnimeList] = useState([]);
  const [animeInput, setAnimeInput] = useState('');

  // Load anime list from Firebase when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "animeList"));
      const fetchedAnimeList = [];
      querySnapshot.forEach((doc) => {
        fetchedAnimeList.push(doc.data().name);
      });
      setAnimeList(fetchedAnimeList);
    };
    fetchData();
  }, []);

  // Function to add anime to Firestore
  const handleAddAnime = async () => {
    if (animeInput.trim()) {
      // Add the new anime to Firestore without deleting old ones
      await addDoc(collection(db, "animeList"), { name: animeInput.trim() });
      setAnimeList((prevList) => [...prevList, animeInput.trim()]);
      setAnimeInput('');
    }
  };

  // Function to remove anime from Firestore
  const handleRemoveAnime = async (index) => {
    const animeToRemove = animeList[index];
    const querySnapshot = await getDocs(collection(db, "animeList"));
    querySnapshot.forEach(async (doc) => {
      if (doc.data().name === animeToRemove) {
        await deleteDoc(doc.ref);
      }
    });
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
