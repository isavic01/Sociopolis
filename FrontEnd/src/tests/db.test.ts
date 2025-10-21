import { describe, it, expect, beforeAll } from "vitest";
import { initializeApp } from "firebase/app";
import {
  getFirestore, connectFirestoreEmulator,
  doc, setDoc, getDoc, deleteDoc
} from "firebase/firestore";

const app = initializeApp({ projectId: "sociopolis-dev" });
const db = getFirestore(app);

beforeAll(() => {
  connectFirestoreEmulator(db, "localhost", 8080);
});

describe("Firestore emulator", () => {
  it("writes and reads /health/ping", async () => {
    const ref = doc(db, "health", "ping");
    const payload = { ok: true, msg: "hello from Sociopolis", at: new Date().toISOString() };

    await setDoc(ref, payload); 
    const snap = await getDoc(ref);

    expect(snap.exists()).toBe(true);
    expect(snap.data()).toMatchObject({ ok: true, msg: "hello from Sociopolis" });

    await deleteDoc(ref);
  });
});
