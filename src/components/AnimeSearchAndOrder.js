import { db } from '../firebase'; // Import Firestore setup
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { doc, updateDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore'; // Import Firestore methods

const AnimeSearchAndOrder = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [error, setError] = useState('');
  const [topAnime, setTopAnime] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  // Fetch Top 50 Anime from API
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

  // Filter Top 50 Anime by genre
  const filteredTopAnime = selectedGenre
    ? topAnime.filter((anime) => anime.genres.includes(selectedGenre))
    : topAnime;

  // Fetch Anime from API based on search query
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

  // Add Anime to List and save to Firestore
  const addAnime = async (anime) => {
    if (!animeList.find((item) => item.id === anime.id)) {
      const updatedList = [...animeList, anime];
      setAnimeList(updatedList);

      // Save to Firestore
      const animeRef = collection(db, 'animeList');
      await addDoc(animeRef, anime);  // Add new anime to Firestore
    }
  };

  // Remove Anime from List and Firestore
  const removeAnime = async (id) => {
    const updatedList = animeList.filter((anime) => anime.id !== id);
    setAnimeList(updatedList);

    // Remove from Firestore
    const animeRef = collection(db, 'animeList');
    const snapshot = await getDocs(animeRef);
    snapshot.forEach(async (docSnap) => {
      if (docSnap.data().id === id) {
        await deleteDoc(doc(db, 'animeList', docSnap.id)); // Delete from Firestore
      }
    });
  };

  // Handle Drag and Drop
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    // Reorder items in animeList
    const items = Array.from(animeList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setAnimeList(items);

    // Update Firestore after reordering
    const animeRef = collection(db, 'animeList');
    items.forEach(async (anime, index) => {
      const docRef = doc(animeRef, index.toString());
      await updateDoc(docRef, anime);  // Update the document order
    });
  };

  // Fetch the list from Firestore on page load
  useEffect(() => {
    const fetchAnimeList = async () => {
      const animeRef = collection(db, 'animeList');
      const snapshot = await getDocs(animeRef);
      const list = snapshot.docs.map((docSnap) => docSnap.data());
      setAnimeList(list);
    };
    fetchTopAnime();
    fetchAnimeList();
  }, []);

  return (
    <div>
      <h1>Anime Search and List</h1>

      {/* Genre Filter */}
      <div>
        <h3>Filter by Genre</h3>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All</option>
          {Array.from(new Set(topAnime.flatMap((anime) => anime.genres))).map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      {/* Your List Section */}
      <h2>Your List</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="animeList" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '30px',
              }}
            >
              {animeList.map((anime, index) => (
                <Draggable
                  key={anime.id}
                  draggableId={anime.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        width: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        ...provided.draggableProps.style,
                      }}
                    >
                      <img
                        src={anime.coverImage?.large || ''}
                        alt={anime.title.romaji}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                      <div>{anime.title.romaji || anime.title.english}</div>
                      <button onClick={() => removeAnime(anime.id)}>Remove</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Search Bar */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for anime..."
      />
      <button onClick={fetchAnime}>Search</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Top Anime - Table-like Layout */}
      <h2>Top 50 Anime</h2>
      <div className="top-anime-table">
        {filteredTopAnime.length > 0 ? (
          <div className="anime-table">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="anime-row">
                {filteredTopAnime
                  .slice(rowIndex * 10, rowIndex * 10 + 10)
                  .map((anime) => (
                    <div key={anime.id} className="anime-card">
                      <img
                        src={anime.coverImage?.large}
                        alt={anime.title.romaji}
                        className="anime-img"
                      />
                      <div>{anime.title.romaji || anime.title.english}</div>
                      <button onClick={() => addAnime(anime)}>Add to My List</button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <p>No anime found for the selected genre.</p>
        )}
      </div>

      {/* Anime Search Results */}
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((anime) => (
            <li key={anime.mal_id}>
              {anime.title}{' '}
              <button onClick={() => addAnime(anime)}>Add</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnimeSearchAndOrder;
