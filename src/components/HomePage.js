import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css'; // Import the custom CSS for styling

const HomePage = () => {
  const [topAnime, setTopAnime] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [genres, setGenres] = useState(['Mecha', 'Action', 'Fantasy', 'Drama', 'Adventure']);

  // Fetch Top Anime
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
      setTopAnime(response.data.data.Page.media || []);
    } catch (error) {
      console.error('Error fetching top anime:', error);
    }
  };

  // Fetch Latest Episode Released Anime
const fetchLatestEpisodes = async () => {
  try {
    const response = await axios.get('https://api.jikan.moe/v4/seasons/now', {
      params: { limit: 10 },
    });

    // Filter by recently released episodes and sort by score (highest rated first)
    const sortedAnime = (response.data.data || [])
      .filter((anime) => anime.episodes && anime.airing)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Get the top 8

    setRecentlyAdded(sortedAnime);
  } catch (error) {
    console.error('Error fetching latest episodes:', error);
  }
};


  useEffect(() => {
    fetchTopAnime();
    fetchLatestEpisodes();
  }, []);

  return (
    <div className="homepage-container">

         {/* Welcome message */}
         <div className="welcome-message">
        <h1>Welcome to AnimeTracker!</h1>
        <p>
          Discover and track your favorite anime. Browse top-rated anime, explore featured genres, and keep up with the latest additions. 
          Start exploring and find your next favorite show!
        </p>
      </div>


      {/* Top Anime Showcase */}
      <section className="top-anime-showcase">
        <h1 className="section-title">Top 5 Anime</h1>
        <div className="anime-grid">
          {topAnime.map((anime) => (
            <div key={anime.id} className="anime-item">
              <img
                src={anime.coverImage.large}
                alt={anime.title.romaji || anime.title.english}
                className="anime-img"
              />
              <div className="anime-info">
                <h3>{anime.title.romaji || anime.title.english}</h3>
                <button className="view-all-btn">View All</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Episodes Released */}
<section className="latest-episodes">
  <h2 className="section-title">Latest Episodes Released</h2>
  {recentlyAdded.length > 0 ? (
    <div className="anime-grid">
      {recentlyAdded.map((anime) => (
        <div key={anime.mal_id} className="anime-item">
          <img
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            className="anime-img"
          />
          <div className="anime-info">
            <h3>{anime.title}</h3>
            <p>
              {anime.score ? `Rating: ${anime.score}` : 'No Rating'}
            </p>
            <p>
              Episodes: {anime.episodes ? anime.episodes : 'N/A'}
            </p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="description">No latest episodes available right now.</p>
  )}
</section>



      {/* Featured Genres */}
      <section className="featured-genres">
        <h2 className="section-title">Explore Featured Genres</h2>
        <div className="genre-cards">
          {genres.map((genre, index) => (
            <div key={index} className="genre-card">
              <div className="genre-icon">{genre[0]}</div>
              <h3>{genre}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
