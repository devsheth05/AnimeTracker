// firestore.js
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from './firebase'; // Import Firebase app from firebase.js

const db = getFirestore(app);

// Function to add anime to Firestore
const addAnimeToFirestore = async (animeData) => {
  try {
    const docRef = await addDoc(collection(db, "anime"), animeData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Function to fetch all anime from Firestore
const fetchAnimeList = async () => {
  const querySnapshot = await getDocs(collection(db, "anime"));
  const animeList = [];
  querySnapshot.forEach((doc) => {
    animeList.push(doc.data());
  });
  return animeList;
};

export { addAnimeToFirestore, fetchAnimeList };
