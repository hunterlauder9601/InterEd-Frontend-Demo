// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js'
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDP7zHBk7-PJf3ileHtwjw0iX0_3I95RvA",
  authDomain: "dispatcher-358617.firebaseapp.com",
  projectId: "dispatcher-358617",
  storageBucket: "dispatcher-358617.appspot.com",
  messagingSenderId: "909600308947",
  appId: "1:909600308947:web:bee57cfa00d8a8e6569e26",
  measurementId: "G-V7H1DCVRJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;