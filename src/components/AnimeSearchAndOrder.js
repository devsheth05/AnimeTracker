import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AnimeSearchAndOrder.css'; // import css file

const AnimeSearchAndOrder = () => {
  const [query, setQuery] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [error, setError] = useState('');
  const [topAnime, setTopAnime] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [allGenres, setAllGenres] = useState([]);

  // Fetch anime list based on genre when genre is selected
  const fetchTopAnimeByGenre = async (genre) => {
    try {
      const response = await axios.post('https://graphql.anilist.co', {
        query: `
          query ($genre: String) {
            Page(page: 1, perPage: 50) {
              media(type: ANIME, sort: POPULARITY_DESC, genre: $genre) {
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
        variables: { genre }
      });
      setTopAnime(response.data.data.Page.media || []);
    } catch (error) {
      setError('Failed to load top anime.');
    }
  };

  // Fetch all genres from the top anime
  const fetchGenres = async () => {
  try {
    const response = await axios.post('https://graphql.anilist.co', {
      query: `
        query {
          GenreCollection
        }
      `
    });

    console.log("Genres API Response:", response.data); // Debugging line

    // Filter out the "Hentai" genre
    const filteredGenres = response.data.data.GenreCollection.filter(genre => genre !== "Hentai");


    setAllGenres(filteredGenres || []);
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    setError('Failed to fetch genres.');
  }
};


  // Fetch top 50 highest-rated anime titles
  const fetchTop50Anime = async () => {
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
        `
      });
      setTopAnime(response.data.data.Page.media || []);
    } catch (error) {
      setError('Failed to load top anime.');
    }
  };

  // Fetch specific anime based on search query
  const searchAnime = async () => {
    if (query.trim() === '') {
      fetchTopAnimeByGenre(selectedGenre || ''); // Reset to genre-based fetch
      return;
    }

    try {
      const response = await axios.post('https://graphql.anilist.co', {
        query: `
          query ($search: String) {
            Page(page: 1, perPage: 50) {
              media(type: ANIME, search: $search) {
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
        variables: { search: query }
      });
      setTopAnime(response.data.data.Page.media || []);
    } catch (error) {
      setError('Failed to search anime.');
    }
  };

  const addAnime = (anime) => {
    const normalizedAnime = {
      id: anime.id,
      title: anime.title || { romaji: 'Untitled', english: 'Untitled' },
      coverImage: anime.coverImage || { large: 'https://via.placeholder.com/150' },
    };

    if (!animeList.some((item) => item.id === normalizedAnime.id)) {
      const updatedList = [...animeList, normalizedAnime];
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
    fetchGenres();
    fetchTop50Anime(); // Fetch the initial top 50 anime regardless of genre
    const savedList = localStorage.getItem('animeList');
    if (savedList) {
      try {
        const parsedList = JSON.parse(savedList);
        if (Array.isArray(parsedList)) {
          setAnimeList(parsedList);
        }
      } catch (error) {
        console.error('Error parsing anime list from localStorage:', error);
        setAnimeList([]);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      fetchTopAnimeByGenre(selectedGenre);
    } else {
      fetchTop50Anime(); // Reset to top 50 anime when no genre is selected
    }
  }, [selectedGenre]);

  return (
    <div className="search-page container mx-auto px-4">
<h1 style={{ fontSize: '60px' }} className="font-bold mb-6">Anime Search and List</h1>

      {/* Genre Filter */}
      <div className="mb-6 genre-filter">
        <h3 className="text-lg font-semibold mb-2"style={{ fontSize: '28px' }}>Filter by Genre</h3>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Search Bar */}
      <div className="mb-6 search-section">
        <h3 className="text-lg font-semibold mb-2"style={{ fontSize: '28px' }}>Search for an Anime</h3>
        <input
          type="text"
          placeholder="Search for an anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button
          onClick={searchAnime}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"style={{ fontSize: '22px' }}
        >
          Search
        </button>
      </div>

      {/* Your List Section */}
      <h2 className="text-xl font-bold mb-4"style={{ fontSize: '45px' }}>Your List</h2>
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
                  <Draggable key={animeId} draggableId={animeId} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="anime-item"
                      >
                        <img
                          src={anime.coverImage?.large || 'https://via.placeholder.com/150'}
                          alt={
                            anime.title?.romaji ||
                            anime.title?.english ||
                            'Anime cover'
                          }
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
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Top Anime Section */}
      <h2 className="text-3xl font-bold mb-4" style={{ fontSize: '45px' }}>Top 50 Anime</h2>
      <div className="overflow-x-auto">
        <div className="anime-grid">
          {topAnime.length > 0 ? (
            topAnime.map((anime) => {
              const isAdded = animeList.some((item) => item.id === anime.id);
              return (
                <div key={anime.id} className="anime-item">
                  <img
                    src={anime.coverImage?.large}
                    alt={anime.title?.romaji || anime.title?.english || 'Anime cover'}
                    className="anime-img"
                  />
                  <div className="text-center text-sm mb-2">
                    {anime.title?.romaji || anime.title?.english || 'Untitled'}
                  </div>
                  <button
                    onClick={() => isAdded ? removeAnime(anime.id) : addAnime(anime)}
                    className={`w-full px-3 py-1 rounded ${isAdded ? 'added-btn' : 'add-btn'} hover:opacity-80`}
                  >
                    {isAdded ? 'Added' : 'Add to List'}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center">No anime found for the selected genre or search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeSearchAndOrder;
