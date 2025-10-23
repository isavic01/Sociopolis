import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { z } from "zod";
import { getDbConnected, clearCollection, shutdown } from "./testhelper";

const UserSchema = z.object({
  admin: z.boolean(),
  age: z.number().int().nonnegative(),
  displayName: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  level: z.number().int().nonnegative(),
  termsAccepted: z.boolean(),
  xp: z.number().int().nonnegative()
});

async function createUserValidated(db: any, uid: string, data: unknown) {
  const parsed = UserSchema.safeParse(data);
  if (!parsed.success) throw new Error("validation-failed");
  await setDoc(doc(db, "users", uid), parsed.data);
}

let ctx: ReturnType<typeof getDbConnected>;

beforeAll(async () => {
  ctx = getDbConnected();
  await clearCollection(ctx.db, "users");
});

afterAll(async () => {
  await shutdown(ctx.app);
});

describe("users validation (positive + negative cases)", () => {
  it("accepts a valid user payload and persists it", async () => {
    const uid = "valid-user-1";
    const payload = {
      admin: false,
      age: 20,
      displayName: "Vincent",
      email: "44vincentlin@gmail.com",
      emailVerified: false,
      level: 0,
      termsAccepted: true,
      xp: 0
    };

    await createUserValidated(ctx.db, uid, payload);
    const snap = await getDoc(doc(ctx.db, "users", uid));
    expect(snap.exists()).toBe(true);
    expect(snap.data()!.email).toBe("44vincentlin@gmail.com");
  });

  it("rejects an invalid user payload (bad email) and writes nothing", async () => {
    const uid = "invalid-user-1";
    const bad = {
      admin: false,
      age: 19,
      displayName: "Bad Email",
      email: "not-an-email",
      emailVerified: false,
      level: 0,
      termsAccepted: true,
      xp: 0
    };

    await expect(createUserValidated(ctx.db, uid, bad))
      .rejects.toThrow("validation-failed");

    const snap = await getDoc(doc(ctx.db, "users", uid));
    expect(snap.exists()).toBe(false);
  });
});
