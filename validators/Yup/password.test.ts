import { describe, it, expect } from "vitest";
import * as Yup from "yup";
import "@/validators/Yup/password";

const schema = Yup.string().password();
const run = (value: unknown) => schema.validate(value);

describe("Yup password() validator", () => {
  it("accepts empty string (field is optional)", async () => {
    await expect(run("")).resolves.toBe("");
  });

  it("accepts a strong password (8+, upper, lower, number, special from @#$%^&+=-, no spaces)", async () => {
    await expect(run("Abcdef1@")).resolves.toBe("Abcdef1@");
  });

  it("accepts long strong password", async () => {
    await expect(run("MyStr0ng@Password")).resolves.toBe("MyStr0ng@Password");
  });

  it("rejects password shorter than 8 characters", async () => {
    await expect(run("Ab1@xyz")).rejects.toThrow();
  });

  it("rejects password without uppercase", async () => {
    await expect(run("abcdef1@")).rejects.toThrow();
  });

  it("rejects password without lowercase", async () => {
    await expect(run("ABCDEF1@")).rejects.toThrow();
  });

  it("rejects password without number", async () => {
    await expect(run("Abcdefgh@")).rejects.toThrow();
  });

  it("rejects password without special character", async () => {
    await expect(run("Abcdefg1")).rejects.toThrow();
  });

  it("rejects password containing whitespace", async () => {
    await expect(run("Abcde f1@")).rejects.toThrow();
  });

  it("rejects '!' as special (not in allowed set @#$%^&+=-)", async () => {
    await expect(run("Abcdef1!")).rejects.toThrow();
  });

  it("accepts different special characters from the allowed set", () => {
    const specials = ["@", "#", "$", "%", "^", "&", "+", "=", "-"];
    specials.forEach((s) => {
      expect(run(`Abcdef1${s}`)).resolves.toBeDefined();
    });
  });
});
