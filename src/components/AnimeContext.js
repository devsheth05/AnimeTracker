import React, { createContext, useState, useContext, useEffect } from 'react'; // Only one import

// Create context
const AnimeContext = createContext();

// Context provider component
export const AnimeProvider = ({ children }) => {
  const [animeList, setAnimeList] = useState([]);

  const fetchAnimeList = () => {
    // Fetch list logic here, e.g., from localStorage
    const storedList = JSON.parse(localStorage.getItem('top5Anime')) || [];
    setAnimeList(storedList);
  };

  const saveAnimeList = (list) => {
    // Save to localStorage
    localStorage.setItem('top5Anime', JSON.stringify(list));
    setAnimeList(list);
  };

  // Optionally, you can call fetchAnimeList on mount
  useEffect(() => {
    fetchAnimeList();
  }, []);

  return (
    <AnimeContext.Provider value={{ animeList, fetchAnimeList, saveAnimeList }}>
      {children}
    </AnimeContext.Provider>
  );
};

// Custom hook to access the context
export const useAnimeContext = () => useContext(AnimeContext);
