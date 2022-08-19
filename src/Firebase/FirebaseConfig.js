import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAcZyk02Gt60x3R8RQOgJvHM3tIqcf7FXg",
  authDomain: "blog-app-b8403.firebaseapp.com",
  projectId: "blog-app-b8403",
  storageBucket: "blog-app-b8403.appspot.com",
  messagingSenderId: "960687631406",
  appId: "1:960687631406:web:e28e17543d6620cd4143bf",
  measurementId: "G-9NN08D8JV0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
