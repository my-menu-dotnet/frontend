import { describe, it, expect } from "vitest";
import { hexToHsl, rgbToHsl } from "./colors";

describe("hexToHsl", () => {
  it("converts pure red #ff0000 to H S% L% with H=0", () => {
    expect(hexToHsl("#ff0000")).toBe("0 100% 50%");
  });

  it("converts pure green #00ff00 to H=120", () => {
    expect(hexToHsl("#00ff00")).toBe("120 100% 50%");
  });

  it("converts pure blue #0000ff to H=240", () => {
    expect(hexToHsl("#0000ff")).toBe("240 100% 50%");
  });

  it("converts black #000000 to any H, 0% S, 0% L", () => {
    expect(hexToHsl("#000000")).toBe("0 0% 0%");
  });

  it("converts white #ffffff to any H, 0% S, 100% L", () => {
    expect(hexToHsl("#ffffff")).toBe("0 0% 100%");
  });

  it("returns HSL format string 'H S% L%'", () => {
    const result = hexToHsl("#3366cc");
    expect(result).toMatch(/^\d+\s\d+%\s\d+%$/);
  });
});

describe("rgbToHsl", () => {
  it("converts RGB(255,0,0) red to H=0, S=100, L=50", () => {
    expect(rgbToHsl(255, 0, 0)).toEqual([0, 100, 50]);
  });

  it("converts RGB(0,255,0) green to H=120, S=100, L=50", () => {
    expect(rgbToHsl(0, 255, 0)).toEqual([120, 100, 50]);
  });

  it("converts RGB(0,0,255) blue to H=240, S=100, L=50", () => {
    expect(rgbToHsl(0, 0, 255)).toEqual([240, 100, 50]);
  });

  it("returns 0 saturation when r=g=b (grayscale)", () => {
    expect(rgbToHsl(128, 128, 128)).toEqual([0, 0, 50]);
  });

  it("returns 0% L for black", () => {
    expect(rgbToHsl(0, 0, 0)).toEqual([0, 0, 0]);
  });

  it("returns 100% L for white", () => {
    expect(rgbToHsl(255, 255, 255)).toEqual([0, 0, 100]);
  });

  it("rounds H, S, L to integers", () => {
    const [h, s, l] = rgbToHsl(123, 45, 200);
    expect(Number.isInteger(h)).toBe(true);
    expect(Number.isInteger(s)).toBe(true);
    expect(Number.isInteger(l)).toBe(true);
  });

  it("handles colors with G as max (yellow #ffff00)", () => {
    // H should be 60, S 100, L 50
    expect(rgbToHsl(255, 255, 0)).toEqual([60, 100, 50]);
  });

  it("handles colors with B as max (magenta #ff00ff)", () => {
    // H should be 300, S 100, L 50
    expect(rgbToHsl(255, 0, 255)).toEqual([300, 100, 50]);
  });
});
