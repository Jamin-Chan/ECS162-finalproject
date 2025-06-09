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
  authDomain: "ecs-162-final-e7b2f.firebaseapp.com",
  projectId: "ecs-162-final-e7b2f",
  storageBucket: "ecs-162-final-e7b2f.firebasestorage.app",
  messagingSenderId: "109466083073",
  appId: "1:109466083073:web:a6270bfee7e07f20858500",
  measurementId: "G-P3JNG2TS1M"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
