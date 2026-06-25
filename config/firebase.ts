import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const expoExtra = Constants.expoConfig?.extra as
  | Record<string, string>
  | undefined;

// Initialize Firebase using environment variables from Expo config extra
const firebaseConfig = {
  apiKey:
    expoExtra?.EXPO_PUBLIC_FIREBASE_API_KEY ??
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:
    expoExtra?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:
    expoExtra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID ??
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    expoExtra?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    expoExtra?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:
    expoExtra?.EXPO_PUBLIC_FIREBASE_APP_ID ??
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId:
    expoExtra?.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ??
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

console.log("🔥 Firebase Initializing...");
console.log("🔥 API Key found:", !!firebaseConfig.apiKey);
console.log("🔥 Project ID:", firebaseConfig.projectId);

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with appropriate persistence for platform
let auth: Auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    auth = getAuth(app);
  }
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
