// FrontEnd/src/tests/users.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { z } from "zod";
import { getDbConnected, clearCollection, shutdown } from "./testhelper";

const UserSchema = z.object({
  admin: z.boolean(),
  age: z.number().int().nonnegative(),
  createdAt: z.any().optional(),   // serverTimestamp renders as special object in emulator
  displayName: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  level: z.number().int().nonnegative(),
  termsAccepted: z.boolean(),
  updatedAt: z.any().optional(),
  xp: z.number().int().nonnegative()
});

let ctx: ReturnType<typeof getDbConnected>;

beforeAll(async () => {
  ctx = getDbConnected();
  await clearCollection(ctx.db, "users");
});

afterAll(async () => {
  await shutdown(ctx.app);
});

describe("users collection (Sociopolis schema)", () => {
  it("creates a user doc with expected fields and types", async () => {
    const uid = "test-user-1";
    const userDoc = {
      admin: false,
      age: 20,
      createdAt: serverTimestamp(),
      displayName: "vincent",
      email: "44vincentlin@gmail.com",
      emailVerified: false,
      level: 0,
      termsAccepted: true,
      updatedAt: serverTimestamp(),
      xp: 0
    };

    await setDoc(doc(ctx.db, "users", uid), userDoc);
    const snap = await getDoc(doc(ctx.db, "users", uid));
    expect(snap.exists()).toBe(true);

    const parsed = UserSchema.parse(snap.data());
    expect(parsed.admin).toBe(false);
    expect(parsed.level).toBe(0);
    expect(parsed.xp).toBe(0);
  });
});
