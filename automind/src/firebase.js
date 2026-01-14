import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBSbzqq3Y28sch_dkiTq-BvZ3fRNGJRgKQ",
  authDomain: "automind-a85a4.firebaseapp.com",
  projectId: "automind-a85a4",
  storageBucket: "automind-a85a4.firebasestorage.app",
  messagingSenderId: "385178525170",
  appId: "1:385178525170:web:f17c4049980d5983fa9f6b",
  measurementId: "G-N360ZHJMJ1"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
