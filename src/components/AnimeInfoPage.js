import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AnimeInfoPage.css'; // Optional: Create CSS for styling

const AnimeInfoPage = () => {
  const { id } = useParams();
  const [animeDetails, setAnimeDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedAnimeDetails = localStorage.getItem('animeDetails');
    const savedSearchQuery = localStorage.getItem('searchQuery');

    if (savedAnimeDetails) {
      setAnimeDetails(JSON.parse(savedAnimeDetails)); // Load saved anime details
    }

    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery); // Load saved search query
    }
  }, []);

  // Save data to localStorage whenever searchQuery or animeDetails changes
  useEffect(() => {
    if (animeDetails) {
      localStorage.setItem('animeDetails', JSON.stringify(animeDetails)); // Save anime details
    }
    if (searchQuery) {
      localStorage.setItem('searchQuery', searchQuery); // Save search query
    }
  }, [animeDetails, searchQuery]);

  useEffect(() => {
    if (id) {
      fetchAnimeDetails(id);
    }
  }, [id]);

  const fetchAnimeDetails = async (animeId) => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}`);
      setAnimeDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching anime details:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // Clear the previous search in localStorage
    localStorage.removeItem('animeDetails');
  
    try {
      const response = await axios.get('https://api.jikan.moe/v4/anime', {
        params: { q: searchQuery, limit: 1 },
      });
      if (response.data.data.length > 0) {
        setAnimeDetails(response.data.data[0]);
      } else {
        setAnimeDetails(null);
        alert('No anime found!');
      }
    } catch (error) {
      console.error('Error searching for anime:', error);
    }
  };
  
  return (
    <div className="anime-info-page">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search for an anime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {animeDetails ? (
        <div className="anime-details">
          <h1>{animeDetails.title}</h1>
          <img src={animeDetails.images.jpg.large_image_url} alt={animeDetails.title} />
          <p><strong>Synopsis:</strong> {animeDetails.synopsis}</p>
          <p><strong>Episodes:</strong> {animeDetails.episodes || 'Unknown'}</p>
          <p><strong>Score:</strong> {animeDetails.score || 'N/A'}</p>
          <p><strong>Status:</strong> {animeDetails.status}</p>
          <p><strong>Type:</strong> {animeDetails.type}</p>
          <p><strong>Genres:</strong> {animeDetails.genres.map((genre) => genre.name).join(', ')}</p>
        </div>
      ) : (
        <p>No anime details to show.</p>
      )}
    </div>
  );
};

export default AnimeInfoPage;
