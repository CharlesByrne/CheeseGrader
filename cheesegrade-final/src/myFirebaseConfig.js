import firebase from "firebase"; //import firebase modules

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBEYwVstjoUKUAfmjd_v6PECmbeYbjBpZE",
  authDomain: "cheese-grader.firebaseapp.com",
  databaseURL:
    "https://cheese-grader-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cheese-grader",
  storageBucket: "cheese-grader.appspot.com",
  messagingSenderId: "454711219092",
  appId: "1:454711219092:web:90d62ae61d6d1b01ea7581",
  measurementId: "G-ELEMYW2B2Q"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

//firebase.initializeApp(firebaseConfig);
firebase.analytics();
//initialize instance of firebase for the application
export default firebase;
