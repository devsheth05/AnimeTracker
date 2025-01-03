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

  // Fetch Anime from API
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
    if (!animeList.find((item) => item.mal_id === anime.mal_id)) {
      const updatedList = [...animeList, anime];
      setAnimeList(updatedList);
      
      // Save to Firestore
      const animeRef = collection(db, 'animeList');
      await addDoc(animeRef, anime);  // Add new anime to Firestore
    }
    setSearchResults([]);
    setQuery('');
  };

  // Remove Anime from List and Firestore
  const removeAnime = async (id) => {
    const updatedList = animeList.filter((anime) => anime.mal_id !== id);
    setAnimeList(updatedList);
    
    // Remove from Firestore
    const animeRef = collection(db, 'animeList');
    const snapshot = await getDocs(animeRef);
    snapshot.forEach(async (docSnap) => {
      if (docSnap.data().mal_id === id) {
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
      const list = snapshot.docs.map(docSnap => docSnap.data());
      setAnimeList(list);
    };
    fetchAnimeList();
  }, []);

  return (
    <div>
      <h1>Anime Search and List</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for anime..."
      />
      <button onClick={fetchAnime}>Search</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search Results */}
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

      {/* Drag and Drop List */}
      <DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId="animeList">
    {(provided) => (
      <ul
        {...provided.droppableProps}
        ref={provided.innerRef}
        style={{ listStyle: 'none', padding: 0 }}
      >
        {animeList.map((anime, index) => {
          // Check if mal_id is undefined or missing
          if (!anime.mal_id) {
            console.warn('Skipping anime with missing mal_id', anime);
            return null;
          }
          return (
            <Draggable
              key={anime.mal_id}
              draggableId={anime.mal_id.toString()}
              index={index}
            >
              {(provided) => (
                <li
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    marginBottom: '10px',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    ...provided.draggableProps.style,
                  }}
                >
                  <img
                    src={anime.images?.jpg?.image_url || ''}
                    alt={anime.title}
                    style={{ width: '50px', marginRight: '10px' }}
                  />
                  {anime.title}{' '}
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => removeAnime(anime.mal_id)}
                  >
                    Remove
                  </button>
                </li>
              )}
            </Draggable>
          );
        })}
        {provided.placeholder}
      </ul>
    )}
  </Droppable>
</DragDropContext>

    </div>
  );
};

export default AnimeSearchAndOrder;
