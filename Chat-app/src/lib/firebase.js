import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-cd5a3.firebaseapp.com",
  projectId: "reactchat-cd5a3",
  storageBucket: "reactchat-cd5a3.appspot.com",
  messagingSenderId: "562372210268",
  appId: "1:562372210268:web:e7b9c84f120830b8948099",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
