import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AnimeSearchAndOrder.css'; //import css file

const AnimeSearchAndOrder = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [error, setError] = useState('');
  const [topAnime, setTopAnime] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  const fetchTopAnime = async () => {
    try {
      const response = await axios.post('https://graphql.anilist.co', {
        query: `
          query {
            Page(page: 1, perPage: 50) {
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
                genres
              }
            }
          }
        `,
      });
      setTopAnime(response.data.data.Page.media || []);
    } catch (error) {
      setError('Failed to load top anime.');
    }
  };

  const filteredTopAnime = selectedGenre
    ? topAnime.filter((anime) => anime.genres.includes(selectedGenre))
    : topAnime;

  const fetchAnime = async () => {
    try {
      setError('');
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime?q=${query}&limit=5`
      );
      setSearchResults(response.data.data || []);
    } catch (error) {
      setError('Error fetching anime. Please try again.');
    }
  };

  const addAnime = (anime) => {
    if (!animeList.find((item) => item.id === anime.id)) {
      const updatedList = [...animeList, anime];
      setAnimeList(updatedList);
      localStorage.setItem('animeList', JSON.stringify(updatedList));
    }
  };

  const removeAnime = (id) => {
    const updatedList = animeList.filter((anime) => anime.id !== id);
    setAnimeList(updatedList);
    localStorage.setItem('animeList', JSON.stringify(updatedList));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(animeList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setAnimeList(items);
    localStorage.setItem('animeList', JSON.stringify(items));
  };

  useEffect(() => {
    fetchTopAnime();
    const savedList = localStorage.getItem('animeList');
    if (savedList) {
      setAnimeList(JSON.parse(savedList));
    }
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Anime Search and List</h1>

      {/* Genre Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Filter by Genre</h3>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          {Array.from(new Set(topAnime.flatMap((anime) => anime.genres))).map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      {/* Your List Section */}
      <h2 className="text-xl font-bold mb-4">Your List</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="animeList" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="anime-grid mb-8"
            >
              {animeList.map((anime, index) => {
                const animeId = anime.id ? anime.id.toString() : `anime-${index}`;
                return (
                  <Draggable
                    key={animeId}
                    draggableId={animeId}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="anime-item"
                      >
                        <img
                          src={anime.coverImage?.large || ''}
                          alt={anime.title?.romaji || anime.title?.english || 'Anime cover'}
                          className="anime-img"
                        />
                        <div className="text-center text-sm">
                          {anime.title?.romaji || anime.title?.english || 'Untitled'}
                        </div>
                        <button 
                          onClick={() => removeAnime(anime.id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Search Section */}
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for anime..."
          className="p-2 border rounded mr-2"
        />
        <button 
          onClick={fetchAnime}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Top Anime Section - Horizontal Scroll */}
      <h2 className="text-xl font-bold mb-4">Top 50 Anime</h2>
      <div className="overflow-x-auto">
        <div className="anime-grid">
          {filteredTopAnime.map((anime) => (
            <div 
              key={anime.id} 
              className="anime-item"
            >
              <img
                src={anime.coverImage?.large}
                alt={anime.title?.romaji || anime.title?.english || 'Anime cover'}
                className="anime-img"
              />
              <div className="text-center text-sm mb-2">
                {anime.title?.romaji || anime.title?.english || 'Untitled'}
              </div>
              <button 
                onClick={() => addAnime(anime)}
                className="add-btn"
              >
                Add to List
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Search Results</h3>
          <div className="anime-grid">
            {searchResults.map((anime) => (
              <div 
                key={anime.mal_id} 
                className="anime-item"
              >
                <div className="text-center text-sm mb-2">{anime.title}</div>
                <button 
                  onClick={() => addAnime(anime)}
                  className="add-btn"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeSearchAndOrder;
