import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATzw7zZetP8ZWaoTiIxlM0-_ArEzM-xoA",
  authDomain: "car-expense-tracker-ff192.firebaseapp.com",
  projectId: "car-expense-tracker-ff192",
  storageBucket: "car-expense-tracker-ff192.firebasestorage.app",
  messagingSenderId: "473181817197",
  appId: "1:473181817197:web:330ee8e0390fa9d77af264"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
