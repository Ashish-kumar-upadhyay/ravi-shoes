import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVHTQ8EjLbRmjpiCLapMftNIRIJHRFy78",
  authDomain: "luxury-shoes-844e4.firebaseapp.com",
  projectId: "luxury-shoes-844e4",
  storageBucket: "luxury-shoes-844e4.firebasestorage.app",
  messagingSenderId: "655318160815",
  appId: "1:655318160815:web:2797f6602df04f2c574b5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set language code
auth.languageCode = 'en';

export function setupRecaptcha(containerId: string) {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
      }
    });
  }
  return window.recaptchaVerifier;
}

export async function sendFirebaseOtp(phoneNumber: string) {
  try {
    const appVerifier = setupRecaptcha('recaptcha-container');
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return { success: true };
  } catch (error: any) {
    console.error("Firebase OTP error:", error);
    return { success: false, error: error.message };
  }
}

export async function verifyFirebaseOtp(otp: string) {
  try {
    if (!window.confirmationResult) {
      return { success: false, error: "No confirmation result available" };
    }
    const result = await window.confirmationResult.confirm(otp);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error("Firebase verify OTP error:", error);
    return { success: false, error: error.message };
  }
}

// Type declarations for global window object
declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}
