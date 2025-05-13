import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAnimeContext } from './AnimeContext'; // Ensure the correct path
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const { animeList, fetchAnimeList } = useAnimeContext(); // Ensure it's being used properly
  const [topAnime, setTopAnime] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [genres, setGenres] = useState(['Mecha', 'Action', 'Fantasy', 'Drama', 'Adventure']);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const navigate = useNavigate();

  // Fetch the latest anime episodes from the Jikan API
  const fetchLatestEpisodes = async () => {
    try {
      const response = await axios.get('https://api.jikan.moe/v4/seasons/now', { params: { limit: 10 } });
      const sortedAnime = (response.data.data || [])
        .filter((anime) => anime.episodes && anime.airing)
        .sort((a, b) => new Date(b.aired.from) - new Date(a.aired.from))
        .slice(0, 5);

      setRecentlyAdded(sortedAnime);
    } catch (error) {
      console.error('Error fetching latest episodes:', error);
    }
  };

  // Handle search query change
  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  // Search for anime based on the search query
  const searchAnime = async () => {
    if (searchQuery.trim() !== '') {
      try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime`, {
          params: {
            q: searchQuery,
            limit: 5,
          },
        });
        setSearchResults(response.data.data || []);
      } catch (error) {
        console.error('Error searching for anime:', error);
      }
    }
  };

  // Fetch the top 5 anime from localStorage or use the default
  useEffect(() => {
    fetchAnimeList();
    const storedTop5 = JSON.parse(localStorage.getItem('top5Anime'));
    if (storedTop5) {
      setTopAnime(storedTop5);
    } else {
      // Default or fallback top 5 anime
      const defaultTopAnime = [];
      setTopAnime(defaultTopAnime);
    }
    fetchLatestEpisodes();
  }, []);
  useEffect(() => {
  console.log('animeList:', animeList); // Log to see the current list
}, [animeList]);

  return (
    <div className="homepage-container">
      <div className="welcome-section">
        <h1 className="welcome-message">Welcome to AnimeTracker!</h1>
        <p className="description">
          Discover and track your favorite anime. Browse top-rated anime, explore featured genres, and keep up with the latest additions.
          Start exploring and find your next favorite show!
        </p>
      </div>

      <div className="search-button-container">
        <button onClick={() => navigate('/anime-search-and-order')} className="edit-list-btn">
          Edit List
        </button>
      </div>

      <section className="top-anime-showcase">
        <h1 className="section-title">Top 5 Anime</h1>
        <div className="anime-grid">
          {topAnime.length > 0 ? (
            topAnime.map((anime) => (
              <div key={anime.id} className="anime-item">
                <img
                  src={anime.coverImage?.large || 'placeholder.jpg'}
                  alt={anime.title?.romaji || anime.title?.english || 'Anime Cover'}
                  className="anime-img"
                />
                <div className="anime-info">
                  <h3>{anime.title?.romaji || anime.title?.english || 'Unknown Title'}</h3>
                  <Link to={`/anime/${anime.id}`} className="view-details-btn">View Details</Link>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-list-message">Your list is empty right now! Click on "Edit List" to get started!</p>
          )}
        </div>
      </section>

      <section className="latest-episodes">
        <h2 className="section-title">Latest Episodes Released</h2>
        {recentlyAdded.length > 0 ? (
          <div className="anime-grid">
            {recentlyAdded.map((anime) => (
              <div key={anime.mal_id} className="anime-item">
                <img
                  src={anime.images?.jpg?.large_image_url || 'placeholder.jpg'}
                  alt={anime.title || 'Anime Cover'}
                  className="anime-img"
                />
                <div className="anime-info">
                  <h3>{anime.title || 'Unknown Title'}</h3>
                  <p>Episodes: {anime.episodes || 'N/A'}</p>
                  <Link to={`/anime/${anime.mal_id}`} className="view-details-btn">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent episodes available.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
