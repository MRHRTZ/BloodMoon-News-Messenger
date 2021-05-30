import * as firebase from 'firebase'

var firebaseConfig = {
     apiKey: "AIzaSyBETkUN7KUTfRSgPG29NbEYCH8BcSlzHkc",
     authDomain: "rethasicapp.firebaseapp.com",
     databaseURL: "https://rethasicapp-default-rtdb.firebaseio.com",
     projectId: "rethasicapp",
     storageBucket: "rethasicapp.appspot.com",
     messagingSenderId: "590738393978",
     appId: "1:590738393978:web:97039262dc61e29946a4c3",
     measurementId: "G-JB5DQBHLV7"
};

// if (!firebase.apps.length) {
//      firebase.initializeApp(firebaseConfig);
//      // firebase.analytics();
// }

const app = firebase.initializeApp(firebaseConfig);

const db = app.database();

export { db, app, firebaseConfig, }
// export const userInfo = app.auth().currentUser