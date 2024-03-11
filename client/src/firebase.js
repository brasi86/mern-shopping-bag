// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "shopping-bag-7b911.firebaseapp.com",
  projectId: "shopping-bag-7b911",
  storageBucket: "shopping-bag-7b911.appspot.com",
  messagingSenderId: "219256605135",
  appId: "1:219256605135:web:3edf4368c8260a82e72aba",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
