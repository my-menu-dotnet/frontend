import { describe, it, expect } from "vitest";
import * as Yup from "yup";
import "@/validators/Yup/phone";

const schema = Yup.string().phone();
const run = (value: unknown) => schema.validate(value);

describe("Yup phone() validator", () => {
  it("accepts empty string (field is optional)", async () => {
    await expect(run("")).resolves.toBe("");
  });

  it("accepts 10 digits (landline without 9)", async () => {
    await expect(run("1133334444")).resolves.toBe("1133334444");
  });

  it("accepts 11 digits (mobile with 9)", async () => {
    await expect(run("11933334444")).resolves.toBe("11933334444");
  });

  it("accepts formatted phone with spaces, parens, and hyphen", async () => {
    await expect(run("(11) 93333-4444")).resolves.toBe("(11) 93333-4444");
  });

  it("rejects 9 digits", async () => {
    await expect(run("113333444")).rejects.toThrow();
  });

  it("rejects 12 digits", async () => {
    await expect(run("119333344445")).rejects.toThrow();
  });

  it("rejects non-numeric strings", async () => {
    await expect(run("abc")).rejects.toThrow();
  });
});
