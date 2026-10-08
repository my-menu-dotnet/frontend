import { describe, it, expect } from "vitest";
import { serrialize, currency } from "./text";

describe("text utils — serrialize", () => {
  it("replaces \\n with <br /> tag", () => {
    expect(serrialize("linha1\nlinha2")).toBe("linha1 <br /> linha2");
  });

  it("replaces multiple \\n with multiple <br /> tags", () => {
    expect(serrialize("a\nb\nc")).toBe("a <br /> b <br /> c");
  });

  it("returns input unchanged when there is no \\n", () => {
    expect(serrialize("plain text")).toBe("plain text");
  });

  it("handles empty string", () => {
    expect(serrialize("")).toBe("");
  });

  it("preserves whitespace other than newline", () => {
    expect(serrialize("a\tb  c")).toBe("a\tb  c");
  });
});

describe("text utils — currency", () => {
  it("formats zero as R$ 0,00", () => {
    expect(currency(0)).toMatch(/R\$\s*0,00/);
  });

  it("formats small integer as R$ X,00", () => {
    expect(currency(10)).toMatch(/R\$\s*10,00/);
  });

  it("formats cents properly with comma decimal separator", () => {
    expect(currency(49.9)).toMatch(/R\$\s*49,90/);
  });

  it("uses dot as thousands separator", () => {
    expect(currency(1234.56)).toMatch(/R\$\s*1\.234,56/);
  });

  it("formats large numbers with thousands separators", () => {
    const out = currency(1000000);
    expect(out).toMatch(/1\.000\.000/);
  });

  it("uses BRL currency symbol and pt-BR locale", () => {
    expect(currency(1)).toContain("R$");
  });
});
