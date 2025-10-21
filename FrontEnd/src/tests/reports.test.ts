import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  collection, addDoc, doc, getDoc, getDocs, query, where, setDoc, serverTimestamp
} from "firebase/firestore";
import { z } from "zod";
import { getDbConnected, clearCollection, shutdown } from "./testhelper";

const ReportSchema = z.object({
  uid: z.string().min(1),
  displayName: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  sourcePage: z.string().min(1),
  wordCount: z.number().int().nonnegative(),
  createdAt: z.any().optional() 
});

let ctx: ReturnType<typeof getDbConnected>;

beforeAll(async () => {
  ctx = getDbConnected();
  await clearCollection(ctx.db, "reports");
});

afterAll(async () => {
  await shutdown(ctx.app);
});

describe("reports collection based on work", () => {
  it("creates a report and reads it back with correct shape", async () => {
    const message = "you stink";
    const payload = {
      uid: "testuser",
      displayName: "vincent",
      email: "44vincentlin@gmail.com",
      message,
      sourcePage: "landing",
      wordCount: message.trim().split(/\s+/).length,
      createdAt: serverTimestamp()
    };

    const ref = await addDoc(collection(ctx.db, "reports"), payload);
    const snap = await getDoc(doc(ctx.db, "reports", ref.id));
    expect(snap.exists()).toBe(true);

    const parsed = ReportSchema.parse(snap.data());
    expect(parsed.uid).toBe("testuser");
    expect(parsed.sourcePage).toBe("landing");
    expect(parsed.wordCount).toBe(2);
  });

  it("queries only a specific user's reports from a given page", async () => {
    await setDoc(doc(ctx.db, "reports", "r1"), {
      uid: "A", displayName: "a", email: "a@x.com",
      message: "hello world", sourcePage: "landing", wordCount: 2
    });
    await setDoc(doc(ctx.db, "reports", "r2"), {
      uid: "A", displayName: "a", email: "a@x.com",
      message: "ping", sourcePage: "contact", wordCount: 1
    });
    await setDoc(doc(ctx.db, "reports", "r3"), {
      uid: "B", displayName: "b", email: "b@x.com",
      message: "there is trash", sourcePage: "landing", wordCount: 3
    });

    const qs = await getDocs(
      query(
        collection(ctx.db, "reports"),
        where("uid", "==", "A"),
        where("sourcePage", "==", "landing")
      )
    );

    const ids = qs.docs.map(d => d.id).sort();
    expect(ids).toEqual(["r1"]);
  });
});
