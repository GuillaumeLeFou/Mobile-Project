import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAVEcpRka-PdUkKy8fl2PWi1MakUj_9VOk",
  authDomain: "sololeveling-40ff3.firebaseapp.com",
  databaseURL: "https://sololeveling-40ff3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sololeveling-40ff3",
  storageBucket: "sololeveling-40ff3.appspot.com",
  messagingSenderId: "387585611629",
  appId: "1:387585611629:web:afbb6ce9b6144273f6ec64",
  measurementId: "G-NDCT71Q6Q9"
};

// Initialisez Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);