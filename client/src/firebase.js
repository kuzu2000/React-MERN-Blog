import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdS3h9FTLGro41-N-EHLIaMg36R6Js5F8",
  authDomain: "test-4f2f1.firebaseapp.com",
  projectId: "test-4f2f1",
  storageBucket: "test-4f2f1.appspot.com",
  messagingSenderId: "324493807493",
  appId: "1:324493807493:web:f4331276cb5e1f6f303eec",
  measurementId: "G-201948GS18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app