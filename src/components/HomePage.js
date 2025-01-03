// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';

function HomePage() {
  const [topAnime, setTopAnime] = useState([
    { id: 1, name: "Naruto", explanation: "" },
    { id: 2, name: "Attack on Titan", explanation: "" },
    { id: 3, name: "Demon Slayer", explanation: "" },
    { id: 4, name: "Fullmetal Alchemist: Brotherhood", explanation: "" },
    { id: 5, name: "My Hero Academia", explanation: "" },
  ]);

  // Load saved explanations from Firestore when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "topAnime"));
      const animeData = [];
      querySnapshot.forEach((doc) => {
        animeData.push(doc.data());
      });
      if (animeData.length > 0) {
        setTopAnime(animeData);
      }
    };
    fetchData();
  }, []);

  // Function to handle explanation changes and save to Firestore
  const handleExplanationChange = async (index, value) => {
    const updatedAnimeList = [...topAnime];
    updatedAnimeList[index].explanation = value;
    setTopAnime(updatedAnimeList);

    // Save updated explanation to Firestore
    await setDoc(doc(db, "topAnime", `${index + 1}`), {
      name: updatedAnimeList[index].name,
      explanation: value,
    });
  };

  return (
    <div>
      <h1>Top 5 Anime</h1>
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
