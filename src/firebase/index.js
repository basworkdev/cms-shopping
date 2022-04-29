import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCMwXr-a3Q_nQQqgMQHgOL6sU6td5gsnc4",
    authDomain: "rodxoffroadshop.firebaseapp.com",
    projectId: "rodxoffroadshop",
    storageBucket: "rodxoffroadshop.appspot.com",
    messagingSenderId: "978336853629",
    appId: "1:978336853629:web:8e49d360ff791c0cbe4b14"
  };

  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();
  
  export { storage, firebase as default };