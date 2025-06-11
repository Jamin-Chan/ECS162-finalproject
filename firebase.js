// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: "ecs-162-final-project-99d60.firebaseapp.com",
  projectId: "ecs-162-final-project-99d60",
  storageBucket: "ecs-162-final-project-99d60.firebasestorage.app",
  messagingSenderId: "890768234878",
  appId: "1:890768234878:web:ffb834c1a7f5b41d80bb2f"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
