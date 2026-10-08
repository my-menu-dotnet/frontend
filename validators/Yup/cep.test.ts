import { describe, it, expect } from "vitest";
import * as Yup from "yup";
import "@/validators/Yup/cep";

const schema = Yup.string().cep();

const run = (value: unknown) => schema.validate(value);

describe("Yup cep() validator", () => {
  it("accepts empty string (field is optional)", async () => {
    await expect(run("")).resolves.toBe("");
    await expect(run(undefined)).resolves.toBeUndefined();
  });

  it("accepts 8 raw digits", async () => {
    await expect(run("01310100")).resolves.toBe("01310100");
  });

  it("accepts formatted CEP with hyphen", async () => {
    await expect(run("01310-100")).resolves.toBe("01310-100");
  });

  it("rejects 7 digits", async () => {
    await expect(run("0131010")).rejects.toThrow();
  });

  it("rejects 9 digits", async () => {
    await expect(run("013101000")).rejects.toThrow();
  });

  it("rejects non-numeric strings", async () => {
    await expect(run("abc")).rejects.toThrow();
  });
});
