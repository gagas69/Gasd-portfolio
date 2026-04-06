import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// ==========================================
// 🚨 CRITICAL : COLLER LE CONFIG FIREBASE ICI !
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAGgdg-NMTgWYuoVvGjYpCKzxiH8AkcD_M",
  authDomain: "gasd-c41ca.firebaseapp.com",
  projectId: "gasd-c41ca",
  storageBucket: "gasd-c41ca.firebasestorage.app",
  messagingSenderId: "606280464457",
  appId: "1:606280464457:web:d2372ab12f4ad179a56798",
  measurementId: "G-DWG90Y3W1H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
