// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMxZywbh69AHrwrWjVstsQA89P2eRAFZQ",
  authDomain: "ecs-162-final-project-41420.firebaseapp.com",
  projectId: "ecs-162-final-project-41420",
  storageBucket: "ecs-162-final-project-41420.firebasestorage.app",
  messagingSenderId: "773885506876",
  appId: "1:773885506876:web:523f9eff33be3d69099a39",
  measurementId: "G-9ZPHPRTZZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}