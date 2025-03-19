import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [topAnime, setTopAnime] = useState([]);
  const [originalTopAnime, setOriginalTopAnime] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [genres, setGenres] = useState(['Mecha', 'Action', 'Fantasy', 'Drama', 'Adventure']);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const fetchTopAnime = async () => {
    try {
      const response = await axios.post('https://graphql.anilist.co', {
        query: `
          query {
            Page(page: 1, perPage: 5) {
              media(type: ANIME, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  large
                }
              }
            }
          }
        `,
      });
      const fetchedTopAnime = response.data.data.Page.media || [];
      setTopAnime(fetchedTopAnime);
      setOriginalTopAnime(fetchedTopAnime);
    } catch (error) {
      console.error('Error fetching top anime:', error);
    }
  };

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

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

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
  

  const toggleSearchModal = () => setShowSearchModal(!showSearchModal);

  const addToTop5 = (anime) => {
    // Get the current Top 5 anime from localStorage or fallback to an empty array
    const currentTop5 = JSON.parse(localStorage.getItem('top5Anime')) || [];
  
    // Check if the anime is already in the list and if the list is not full
    if (currentTop5.length < 5 && !currentTop5.some((item) => item.id === anime.id)) {
      currentTop5.push(anime); // Add the new anime to the list
      localStorage.setItem('top5Anime', JSON.stringify(currentTop5)); // Update localStorage
      setTopAnime([...currentTop5]); // Update the state with the new list
    }
  };
  
  

  const clearList = () => {
    localStorage.removeItem('top5Anime');
    setTopAnime([...originalTopAnime]);
  };

  useEffect(() => {
    fetchTopAnime();
    fetchLatestEpisodes();
  }, []);
  
  useEffect(() => {
    const storedTop5 = JSON.parse(localStorage.getItem('top5Anime'));
    if (storedTop5) {
      setTopAnime(storedTop5);  // Load saved Top 5 from localStorage
    } else {
      setTopAnime(originalTopAnime);  // Fallback to original Top 5 if none is saved
    }
  }, [originalTopAnime]);
  

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
        <button onClick={toggleSearchModal} className="edit-list-btn">Edit List</button>
      </div>

      {showSearchModal && (
        <div className="search-modal show">
          <div className="modal-content">
            <button onClick={toggleSearchModal} className="close-btn">Close</button>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for an anime"
            />
            <button onClick={searchAnime} className="edit-list-btn">Search</button>

            <div className="search-results">
  {searchResults.length > 0 ? (
    searchResults.map((anime) => (
      <div key={anime.mal_id} className="anime-item">
        <img
          src={anime.images?.jpg?.large_image_url || 'placeholder.jpg'}
          alt={anime.title || 'Anime Cover'}
          className="anime-img"
        />
        <div className="anime-info">
          <h3>{anime.title || 'Unknown Title'}</h3>
          <button className="add-btn" onClick={() => addToTop5(anime)}>Add to Top 5</button>
        </div>
      </div>
    ))
  ) : (
    <p>No results found</p>
  )}
</div>


            <button onClick={clearList} className="clear-list-btn">Clear List</button>
          </div>
        </div>
      )}

<section className="top-anime-showcase">
  <h1 className="section-title">Top 5 Anime</h1>
  <div className="anime-grid">
    {topAnime.length > 0 ? (
      topAnime.map((anime) => (
        <div key={anime.id} className="anime-item">
          <img
            src={anime.coverImage?.large || 'placeholder.jpg'}  // Fallback to placeholder
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
      <p>No anime in your Top 5 yet!</p>
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
