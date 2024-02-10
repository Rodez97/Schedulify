import {type FirebaseOptions, initializeApp} from "firebase/app";
import {initializeFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getFunctions} from "firebase/functions";
import {initializeAppCheck, ReCaptchaV3Provider} from "firebase/app-check";
import {getAnalytics} from "firebase/analytics";

// Firebase configuration object
export const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize the Firebase app
export const APP = initializeApp(FIREBASE_CONFIG);

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
initializeAppCheck(APP, {
  provider: new ReCaptchaV3Provider("6Lf8P_EmAAAAAB2RFq4TEQPbGfkdBVV8BBUH9t8O"),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});
// Initialize Firestore
export const FIRESTORE = initializeFirestore(APP, {
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: true,
});

export const AUTH = getAuth(APP);

export const FUNCTIONS = getFunctions(APP);

export const ANALYTICS = getAnalytics(APP);
