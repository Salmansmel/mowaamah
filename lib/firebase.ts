import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// No storageBucket — Firebase Storage is a paid service this project doesn't use.
// Uploaded documents are analyzed in-memory by /api/analyze and never persisted to a bucket.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics needs a browser environment and must be feature-detected —
// calling getAnalytics() during SSR or module load throws.
export async function initAnalyticsIfSupported() {
  if (typeof window === 'undefined') return null;
  const { getAnalytics, isSupported } = await import('firebase/analytics');
  const supported = await isSupported();
  return supported ? getAnalytics(app) : null;
}

export default app;
