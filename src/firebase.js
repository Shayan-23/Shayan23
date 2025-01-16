// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8uiR3n8XiAwMQoOpu6cHNM9_BleiXdVM",
  authDomain: "aiassistance-14a50.firebaseapp.com",
  projectId: "aiassistance-14a50",
  storageBucket: "aiassistance-14a50.firebasestorage.app",
  messagingSenderId: "757498580947",
  appId: "1:757498580947:web:ab2c761ef2622cd380a926",
  measurementId: "G-2W6XR3MF0Z"
};

let app;
let auth;
let db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication
  auth = getAuth(app);
  
  // Initialize Firestore
  db = getFirestore(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { auth, db };
export default app;