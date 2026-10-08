import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn (className merge)", () => {
  it("returns a single class unchanged", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("joins multiple class names with spaces", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values (undefined, null, false, empty)", () => {
    expect(cn("foo", undefined, null, false, "", "bar")).toBe("foo bar");
  });

  it("accepts arrays of class names", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("accepts object syntax for conditional classes", () => {
    expect(cn("foo", { bar: true, baz: false })).toBe("foo bar");
  });

  it("merges conflicting tailwind classes (last one wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("keeps non-conflicting tailwind classes", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("handles mixed input types", () => {
    expect(cn("foo", { bar: true }, ["baz", "qux"], null)).toBe("foo bar baz qux");
  });
});
