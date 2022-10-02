
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';



// Your web app's Firebase configuration
//const firebaseConfig = {
  // apikey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_DATABASE_URL,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGEIN_SENDER_ID,
  // appId: process.env.REACT_APP_APPID
//};
const firebaseConfig = JSON.parse(process.env.REACT_APP_CONFIG_FIREBASE)


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();                    // Instancia de autenticación asociada con firebase ( Datos del proyecto en firebase )
export const provider = new GoogleAuthProvider(); // Instancia del proveedor de los servicios de autenticación de google ( Datos en google)

export default app