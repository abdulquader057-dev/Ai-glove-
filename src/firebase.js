// Firebase initialization for SIGNOVA app
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU0H-eW7p-AjP5fBLcD8_pts7dIwBTCyw",
  authDomain: "syntropy-7e504.firebaseapp.com",
  projectId: "syntropy-7e504",
  storageBucket: "syntropy-7e504.firebasestorage.app",
  messagingSenderId: "544026206528",
  appId: "1:544026206528:web:35e1273f2516dd09869aa5",
  measurementId: "G-FLENNPM3BZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// ----- Auth -----
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
export const auth = getAuth(app);

/**
 * Sign in a user with email & password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

/**
 * Create a new user with email & password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);

/** Sign out the current user */
export const signOutUser = () => signOut(auth);

/** Listen for auth state changes */
export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);

// ----- Storage -----
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
export const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage.
 * @param {File} file - browser File object
 * @param {string} path - storage path (e.g., "gestures/${file.name}")
 * @returns {Promise<string>} - download URL of the uploaded file
 */
export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

/**
 * Delete a file from Firebase Storage.
 * @param {string} path - storage path of the file to delete
 */
export const deleteFile = async (path) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

/**
 * Get a download URL for a stored file.
 * @param {string} path - storage path of the file
 */
export const getFileURL = (path) => getDownloadURL(ref(storage, path));
