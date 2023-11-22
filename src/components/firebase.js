// Importación de las funciones para inicializar la aplicación y obtener el objeto de mensajería
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAE7rPFY3mc-L-U2WMmtXod6lwV-ca5QN4",
  authDomain: "icentral-5e110.firebaseapp.com",
  projectId: "icentral-5e110",
  storageBucket: "icentral-5e110.appspot.com",
  messagingSenderId: "554603346354",
  appId: "1:554603346354:web:e2b91985e7a0a95bc04cab",
  measurementId: "G-36GN9VMDVM",
};

// Inicialización de la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Obtención del objeto de mensajería
const messaging = getMessaging(app);

async function getDeviceToken() {
  let currentToken = '';
  try {
    // Solicitar permiso para recibir notificaciones
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Obtener el token
      currentToken = await getToken(messaging, { vapidKey: 'BMVsqIcqrVRUoqsU6JOV7WpHAAfJ9JGkyCoLlzocV9rzJN9jNwu9GQEZKHrtxpXrOL2HkeKYXGZyyj0JHadxFbg' }); // Asegúrate de reemplazar 'tu_vapid_key' con tu clave pública
      if (currentToken) {
        console.log('Token de FCM:', currentToken);
      } else {
        console.log('No se pudo obtener el token. Solicita permiso para recibir notificaciones.');
      }
    } else {
      console.log('Permiso para recibir notificaciones no concedido.');
    }
  } catch (error) {
    console.log('Ocurrió un error al obtener el token:', error);
  }

  return currentToken;
}

export { messaging, getDeviceToken };





