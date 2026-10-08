import { describe, it, expect } from "vitest";
import RandomEmoji from "./randomEmoji";

describe("RandomEmoji.sad", () => {
  const validSadEmojis = new Set(["🥲", "😢", "😭", "😥", "😓", "😔", "🙁"]);

  it("returns a string", () => {
    expect(typeof RandomEmoji.sad()).toBe("string");
  });

  it("returns one of the known sad emojis", () => {
    const result = RandomEmoji.sad();
    expect(validSadEmojis.has(result)).toBe(true);
  });

  it("does not always return the same emoji (eventually varies)", () => {
    const samples = new Set();
    for (let i = 0; i < 100; i++) {
      samples.add(RandomEmoji.sad());
    }
    expect(samples.size).toBeGreaterThan(1);
  });
});
