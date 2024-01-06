import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyD76MI9XYjnA2HX-n_u6n7OGNxVCHtvVfs",
  authDomain: "kelimeoyunu-b48fa.firebaseapp.com",
  projectId: "kelimeoyunu-b48fa",
  storageBucket: "kelimeoyunu-b48fa.appspot.com",
  messagingSenderId: "319508310654",
  appId: "1:319508310654:web:b866e13cedc7e883bb462f",
  measurementId: "G-NZ1VWNGTDH"
};
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore();

export {
  auth,
  db
}