
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmx64kk16bjuf0a8IDd9EYBdM5tqLTOFQ",
  authDomain: "medisync-51a50.firebaseapp.com",
  projectId: "medisync-51a50",
  storageBucket: "medisync-51a50.firebasestorage.app",
  messagingSenderId: "828608976291",
  appId: "1:828608976291:web:35eb976e0d1089b6cf7616",
  measurementId: "G-59DCZF7DYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
