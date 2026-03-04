// Import Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Paste your config here
const firebaseConfig = {
  apiKey: "AIzaSyD7xrQA2RtxfRE6WGuN9do3KinhlUtFI_c",
  authDomain: "capturepro-759e3.firebaseapp.com",
  projectId: "capturepro-759e3",
  storageBucket: "capturepro-759e3.firebasestorage.app",
  messagingSenderId: "656903923024",
  appId: "1:656903923024:web:3c6d059321af1a21273855",
  measurementId: "G-VLDW5XMX4Q"
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Setup auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };