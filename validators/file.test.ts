import { describe, it, expect } from "vitest";
import { validateImageFileType } from "./file";

describe("validateImageFileType", () => {
  it("throws when file is null", () => {
    expect(() => validateImageFileType(null)).toThrow("O arquivo é obrigatório.");
  });

  it("throws when file is undefined", () => {
    expect(() => validateImageFileType(undefined)).toThrow(
      "O arquivo é obrigatório."
    );
  });

  it("accepts image/jpeg files", () => {
    const file = new File(["x"], "photo.jpg", { type: "image/jpeg" });
    expect(validateImageFileType(file)).toBe(true);
  });

  it("accepts image/png files", () => {
    const file = new File(["x"], "photo.png", { type: "image/png" });
    expect(validateImageFileType(file)).toBe(true);
  });

  it("rejects image/gif files", () => {
    const file = new File(["x"], "photo.gif", { type: "image/gif" });
    expect(validateImageFileType(file)).toBe(false);
  });

  it("rejects image/webp files", () => {
    const file = new File(["x"], "photo.webp", { type: "image/webp" });
    expect(validateImageFileType(file)).toBe(false);
  });

  it("rejects text/plain files", () => {
    const file = new File(["x"], "doc.txt", { type: "text/plain" });
    expect(validateImageFileType(file)).toBe(false);
  });

  it("rejects application/pdf files", () => {
    const file = new File(["x"], "doc.pdf", { type: "application/pdf" });
    expect(validateImageFileType(file)).toBe(false);
  });
});
