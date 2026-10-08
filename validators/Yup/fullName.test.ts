import { describe, it, expect } from "vitest";
import * as Yup from "yup";
import "@/validators/Yup/fullName";

const schema = Yup.string().fullName();
const run = (value: unknown) => schema.validate(value);

describe("Yup fullName() validator", () => {
  it("accepts empty string (field is optional)", async () => {
    await expect(run("")).resolves.toBe("");
  });

  it("accepts two names separated by a single space", async () => {
    await expect(run("João Silva")).resolves.toBe("João Silva");
  });

  it("accepts three or more names", async () => {
    await expect(run("João Silva Santos")).resolves.toBe("João Silva Santos");
  });

  it("accepts names with multiple spaces between words", async () => {
    await expect(run("João  Silva")).resolves.toBe("João  Silva");
  });

  it("rejects a single name (no space)", async () => {
    await expect(run("João")).rejects.toThrow();
  });

  it("accepts a name with trailing whitespace (split gives 2 parts)", async () => {
    await expect(run("João ")).resolves.toBe("João ");
  });
});
