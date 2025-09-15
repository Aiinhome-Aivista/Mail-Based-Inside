// Give this file exact name: firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDett0SoGzQP8puqO0x1DsPvwSZyNd4g0g",
    authDomain: "agenticemailtool.firebaseapp.com",
    projectId: "agenticemailtool",
    storageBucket: "agenticemailtool.firebasestorage.app",
    messagingSenderId: "413903835231",
    appId: "1:413903835231:web:78c4426b077a9d6aaacbea",
    measurementId: "G-88SCQ6KNC7"
});

const messaging = firebase.messaging();

// Optional: customize background notification handling here if needed