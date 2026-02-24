
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";  // ← add remove here

// Replace with YOUR OWN Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCJOcsEnfN_n1T-rsyIToSVoLbz8zToViY",
    authDomain: "cricket-tounament.firebaseapp.com",
    databaseURL: "https://cricket-tounament-default-rtdb.firebaseio.com",
    projectId: "cricket-tounament",
    storageBucket: "cricket-tounament.firebasestorage.app",
    messagingSenderId: "896256908199",
    appId: "1:896256908199:web:4d5f40bbf5701acdb53482",
    measurementId: "G-K4PWFBTTB3"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// Export the database helpers you use
export { ref, onValue, set, push, remove };   // ← add remove here