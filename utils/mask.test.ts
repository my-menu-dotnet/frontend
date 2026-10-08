import { describe, it, expect } from "vitest";
import { masks } from "./mask";

describe("mask.cpf", () => {
  it("formats 11 digits as 000.000.000-00", () => {
    expect(masks.cpf("12345678901")).toBe("123.456.789-01");
  });

  it("strips non-digits before formatting", () => {
    expect(masks.cpf("123.456.789-01")).toBe("123.456.789-01");
  });

  it("returns partial format when input is shorter than 11 digits", () => {
    expect(masks.cpf("123")).toBe("123");
  });

  it("does not format when there are fewer than 11 digits", () => {
    expect(masks.cpf("123456")).toBe("123456");
  });

  it("truncates input to 14 characters before applying mask", () => {
    expect(masks.cpf("123456789012345")).toBe("123.456.789-01234");
  });

  it("handles empty string", () => {
    expect(masks.cpf("")).toBe("");
  });
});

describe("mask.cep", () => {
  it("formats 8 digits as 00000-000", () => {
    expect(masks.cep("01310100")).toBe("01310-100");
  });

  it("strips non-digits before formatting", () => {
    expect(masks.cep("01310-100")).toBe("01310-100");
  });

  it("returns partial format when input is shorter than 8 digits", () => {
    expect(masks.cep("123")).toBe("123");
  });

  it("formats 5 digits with hyphen position 5 still empty", () => {
    expect(masks.cep("12345")).toBe("12345");
  });

  it("truncates input to 9 characters before applying mask", () => {
    expect(masks.cep("013101000000")).toBe("01310-1000");
  });

  it("handles empty string", () => {
    expect(masks.cep("")).toBe("");
  });
});

describe("mask.phone", () => {
  it("formats 10 digits as (00) 0000-0000 (landline)", () => {
    expect(masks.phone("1133334444")).toBe("(11) 3333-4444");
  });

  it("formats 11 digits as (00) 0 0000-0000 (mobile with 9)", () => {
    expect(masks.phone("11933334444")).toBe("(11) 9 3333-4444");
  });

  it("returns input unchanged for short input that doesn't match the regex", () => {
    expect(masks.phone("11")).toBe("11");
  });

  it("strips non-digits before formatting", () => {
    expect(masks.phone("(11) 3333-4444")).toBe("(11) 3333-4444");
  });

  it("truncates input longer than 11 digits", () => {
    expect(masks.phone("119333344445555")).toBe("(11) 9 3333-4444");
  });

  it("handles empty string", () => {
    expect(masks.phone("")).toBe("");
  });
});
