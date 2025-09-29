// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrPuJ3kAXmcz3Xs5sgphJRnzndWMNTTaY",
  authDomain: "sociopolis-bff81.firebaseapp.com",
  projectId: "sociopolis-bff81",
  storageBucket: "sociopolis-bff81.firebasestorage.app",
  messagingSenderId: "380051301679",
  appId: "1:380051301679:web:8db334cda9eff6d7006dda",
  measurementId: "G-TNDGLMXJ4K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export default app;