import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { AnalysisResult, UploadRecord } from './types';

export async function createUserProfile(uid: string, email: string) {
  await setDoc(
    doc(db, 'users', uid),
    { uid, email, createdAt: serverTimestamp() },
    { merge: true }
  );
}

export async function createGuestProfile(uid: string) {
  await setDoc(
    doc(db, 'users', uid),
    { uid, isGuest: true, createdAt: serverTimestamp() },
    { merge: true }
  );
}

export async function saveUploadRecord(
  uid: string,
  uploadId: string,
  record: Omit<UploadRecord, 'id' | 'createdAt'>
) {
  await setDoc(doc(db, 'users', uid, 'uploads', uploadId), {
    ...record,
    id: uploadId,
    createdAt: new Date().toISOString(),
  });
}

export async function getUploadRecord(uid: string, uploadId: string): Promise<AnalysisResult | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'uploads', uploadId));
  return snap.exists() ? (snap.data() as AnalysisResult) : null;
}

export async function getUploadHistory(uid: string): Promise<UploadRecord[]> {
  const q = query(collection(db, 'users', uid, 'uploads'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UploadRecord);
}
