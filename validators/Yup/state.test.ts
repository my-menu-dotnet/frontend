import { describe, it, expect } from "vitest";
import * as Yup from "yup";
import "@/validators/Yup/state";

const schema = Yup.string().state();
const run = (value: unknown) => schema.validate(value);

describe("Yup state() validator", () => {
  it("accepts empty string (field is optional)", async () => {
    await expect(run("")).resolves.toBe("");
  });

  it("accepts a valid Brazilian state code (SP)", async () => {
    await expect(run("SP")).resolves.toBe("SP");
  });

  it("accepts another valid state code (RJ)", async () => {
    await expect(run("RJ")).resolves.toBe("RJ");
  });

  it("accepts DF (Distrito Federal)", async () => {
    await expect(run("DF")).resolves.toBe("DF");
  });

  it("rejects an invalid state code", async () => {
    await expect(run("XX")).rejects.toThrow();
  });

  it("rejects a lowercase state code (validation is case-sensitive)", async () => {
    await expect(run("sp")).rejects.toThrow();
  });

  it("rejects a full state name (validation requires 2-letter code)", async () => {
    await expect(run("São Paulo")).rejects.toThrow();
  });
});
