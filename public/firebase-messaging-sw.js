importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAE7rPFY3mc-L-U2WMmtXod6lwV-ca5QN4",
  authDomain: "icentral-5e110.firebaseapp.com",
  projectId: "icentral-5e110",
  storageBucket: "icentral-5e110.appspot.com",
  messagingSenderId: "554603346354",
  appId: "1:554603346354:web:e2b91985e7a0a95bc04cab",
  measurementId: "G-36GN9VMDVM",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

