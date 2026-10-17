// Firebase initialization for SIGNOVA / Team Syntropy app
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut 
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAU0H-eW7p-AjP5fBLcD8_pts7dIwBTCyw",
  authDomain: "syntropy-7e504.firebaseapp.com",
  projectId: "syntropy-7e504",
  storageBucket: "syntropy-7e504.firebasestorage.app",
  messagingSenderId: "544026206528",
  appId: "1:544026206528:web:35e1273f2516dd09869aa5",
  measurementId: "G-FLENNPM3BZ"
};

// Initialize Firebase safely for Next.js SSR / HMR
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/** Sign in with Email and Password */
export const signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

/** Sign up with Email and Password */
export const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);

/** Sign in with Google Popup */
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

/** Sign out the current user */
export const signOutUser = () => signOut(auth);

/** Listen for auth state changes */
export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);

// Storage
export const storage = getStorage(app);

export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const deleteFile = async (path) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

export const getFileURL = (path) => getDownloadURL(ref(storage, path));
