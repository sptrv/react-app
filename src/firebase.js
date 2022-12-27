import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDAuMRZpl_14jGwPXEPDjc6bEMiCYr0fFE",
  authDomain: "react-app-a572a.firebaseapp.com",
  projectId: "react-app-a572a",
  storageBucket: "react-app-a572a.appspot.com",
  messagingSenderId: "1093450181600",
  appId: "1:1093450181600:web:e8f9daa18f34f81aeb9985"
};


firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export {auth,fs,storage}