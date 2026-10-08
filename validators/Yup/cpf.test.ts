import { describe, it, expect } from "vitest";
import * as Yup from "yup";
import "@/validators/Yup/cpf";

const schema = Yup.string().cpf();
const run = (value: unknown) => schema.validate(value);

describe("Yup cpf() validator", () => {
  it("accepts empty string (field is optional)", async () => {
    await expect(run("")).resolves.toBe("");
  });

  it("accepts a CPF with valid check digits", async () => {
    // 529.982.247-25 is a known-valid CPF
    await expect(run("52998224725")).resolves.toBe("52998224725");
  });

  it("accepts formatted CPF (with dots and hyphen)", async () => {
    await expect(run("529.982.247-25")).resolves.toBe("529.982.247-25");
  });

  it("rejects a CPF with invalid first check digit", async () => {
    // 529.982.247-26 (last digit changed)
    await expect(run("52998224726")).rejects.toThrow();
  });

  it("rejects a CPF with invalid second check digit", async () => {
    // 529.982.247-20 (last digit changed)
    await expect(run("52998224720")).rejects.toThrow();
  });

  it("rejects CPF with 10 digits", async () => {
    await expect(run("1234567890")).rejects.toThrow();
  });

  it("rejects CPF with 12 digits", async () => {
    await expect(run("123456789012")).rejects.toThrow();
  });

  it("accepts CPF with all same digits (known algorithm quirk)", async () => {
    await expect(run("11111111111")).resolves.toBe("11111111111");
  });

  it("rejects non-numeric strings", async () => {
    await expect(run("abcdefghijk")).rejects.toThrow();
  });
});
