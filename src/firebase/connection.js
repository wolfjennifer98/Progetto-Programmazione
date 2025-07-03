import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyDFK8yjMNMiPcW7n1dfZHo06zE-ykPhndw",
  authDomain: "pixelpedia-24bbd.firebaseapp.com",
  databaseURL:
    "https://pixelpedia-24bbd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pixelpedia-24bbd",
  storageBucket: "pixelpedia-24bbd.firebasestorage.app",
  messagingSenderId: "122038700384",
  appId: "1:122038700384:web:cfabf6fa8616e8657c3605",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
