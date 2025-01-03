// firestore.js
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { app } from './firebase'; // Import Firebase app from firebase.js

const db = getFirestore(app);

// Function to add anime to Firestore
const addAnimeToFirestore = async (animeData) => {
  try {
    const docRef = await addDoc(collection(db, "animeList"), animeData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Function to fetch all anime from Firestore
const fetchAnimeList = async () => {
  const querySnapshot = await getDocs(collection(db, "animeList"));
  const animeList = [];
  querySnapshot.forEach((doc) => {
    animeList.push({ ...doc.data(), id: doc.id }); // Include doc id for easier manipulation
  });
  return animeList;
};

// Function to remove anime from Firestore
const removeAnimeFromFirestore = async (animeId) => {
  try {
    const animeDocRef = doc(db, "animeList", animeId);
    await deleteDoc(animeDocRef);
    console.log("Anime removed successfully!");
  } catch (e) {
    console.error("Error removing anime: ", e);
  }
};

export { addAnimeToFirestore, fetchAnimeList, removeAnimeFromFirestore };
