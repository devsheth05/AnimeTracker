// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsf8qLCLR_pyWalAFV4Qpk_RaGRi_hI7w",
  authDomain: "animetracker-7a682.firebaseapp.com",
  projectId: "animetracker-7a682",
  storageBucket: "animetracker-7a682.firebasestorage.app",
  messagingSenderId: "415316768323",
  appId: "1:415316768323:web:de17a6819ee89037b106f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore database instance for use in other components
export { db };
