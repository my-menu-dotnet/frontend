import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Banner from "./Banner";

const ITEMS = [
  { id: "a", label: "Banner A" },
  { id: "b", label: "Banner B" },
  { id: "c", label: "Banner C" },
];

const renderBanner = (items = ITEMS) =>
  render(
    <Banner
      itemList={items}
      renderItem={(item) => <div data-testid="current">{item.label}</div>}
    />
  );

describe("Banner", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the first item initially", () => {
    renderBanner();
    expect(screen.getByTestId("current")).toHaveTextContent("Banner A");
  });

  it("advances to the next item on next-button click", () => {
    renderBanner();
    const allButtons = screen.getAllByRole("button");
    const next = allButtons[allButtons.length - ITEMS.length - 1];
    fireEvent.click(next);
    expect(screen.getByTestId("current")).toHaveTextContent("Banner B");
  });

  it("wraps to the first item when clicking next on the last item", () => {
    renderBanner();
    const dots = screen
      .getAllByRole("button")
      .filter((b) => b.className.includes("w-3 h-3"));
    fireEvent.click(dots[2]);
    expect(screen.getByTestId("current")).toHaveTextContent("Banner C");
    const allButtons = screen.getAllByRole("button");
    const next = allButtons[allButtons.length - ITEMS.length - 1];
    fireEvent.click(next);
    expect(screen.getByTestId("current")).toHaveTextContent("Banner A");
  });

  it("wraps to the last item when clicking previous on the first item", () => {
    renderBanner();
    expect(screen.getByTestId("current")).toHaveTextContent("Banner A");
    const allButtons = screen.getAllByRole("button");
    const prev = allButtons[0];
    fireEvent.click(prev);
    expect(screen.getByTestId("current")).toHaveTextContent("Banner C");
  });

  it("jumps to the clicked dot's item", () => {
    renderBanner();
    const dots = screen
      .getAllByRole("button")
      .filter((b) => b.className.includes("w-3 h-3"));
    fireEvent.click(dots[1]);
    expect(screen.getByTestId("current")).toHaveTextContent("Banner B");
    fireEvent.click(dots[0]);
    expect(screen.getByTestId("current")).toHaveTextContent("Banner A");
  });

  it("auto-advances once to item 1 after 5000ms (stale closure bug: never progresses further)", () => {
    renderBanner();
    expect(screen.getByTestId("current")).toHaveTextContent("Banner A");
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId("current")).toHaveTextContent("Banner B");
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId("current")).toHaveTextContent("Banner B");
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId("current")).toHaveTextContent("Banner B");
  });

  it("marks the active dot with full opacity and others with 50%", () => {
    renderBanner();
    const dots = screen
      .getAllByRole("button")
      .filter((b) => b.className.includes("w-3 h-3"));
    expect(dots[0].className).toContain("opacity-100");
    expect(dots[1].className).toContain("opacity-50");
    expect(dots[2].className).toContain("opacity-50");
  });

  it("updates the active dot after navigation", () => {
    renderBanner();
    const dots = screen
      .getAllByRole("button")
      .filter((b) => b.className.includes("w-3 h-3"));
    fireEvent.click(dots[2]);
    const dotsAfter = screen
      .getAllByRole("button")
      .filter((b) => b.className.includes("w-3 h-3"));
    expect(dotsAfter[0].className).toContain("opacity-50");
    expect(dotsAfter[1].className).toContain("opacity-50");
    expect(dotsAfter[2].className).toContain("opacity-100");
  });

  it("hides nav buttons by default (opacity-0) and shows on hover (opacity-100)", () => {
    renderBanner();
    const allButtons = screen.getAllByRole("button");
    const prev = allButtons[0];
    const next = allButtons[allButtons.length - ITEMS.length - 1];
    expect(prev.className).toContain("opacity-0");
    expect(next.className).toContain("opacity-0");
    fireEvent.mouseEnter(prev.parentElement!);
    expect(prev.className).toContain("opacity-100");
    expect(next.className).toContain("opacity-100");
    fireEvent.mouseLeave(prev.parentElement!);
    expect(prev.className).toContain("opacity-0");
    expect(next.className).toContain("opacity-0");
  });
});
