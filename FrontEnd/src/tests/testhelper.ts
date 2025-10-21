import { initializeApp, deleteApp, FirebaseApp } from "firebase/app";
import {
  getFirestore, connectFirestoreEmulator, Firestore,
  collection, getDocs, doc, deleteDoc
} from "firebase/firestore";

export function getDbConnected(): { app: FirebaseApp; db: Firestore } {
  const app = initializeApp({ projectId: "sociopolis-dev" });
  const db = getFirestore(app);
  connectFirestoreEmulator(db, "localhost", 8080);
  return { app, db };
}

export async function clearCollection(db: Firestore, path: string) {
  const snap = await getDocs(collection(db, path));
  await Promise.all(snap.docs.map(d => deleteDoc(doc(db, path, d.id))));
}

export async function shutdown(app: FirebaseApp) {
  await deleteApp(app);
}