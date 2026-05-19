// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPXHYGw4sGnGa9Vxamm2ZNe-zWIjnxpDc",
  authDomain: "convoy-live-f3db7.firebaseapp.com",
  databaseURL: "https://convoy-live-f3db7-default-rtdb.firebaseio.com",
  projectId: "convoy-live-f3db7",
  storageBucket: "convoy-live-f3db7.firebasestorage.app",
  messagingSenderId: "907677125127",
  appId: "1:907677125127:web:045e7cc491214ee44e38a2",
  measurementId: "G-3DNDC5FKE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);