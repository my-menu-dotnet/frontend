import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBusinessStatus } from "./useBusinessStatus";
import type { BusinessHours } from "@/types/api/BusinessHours";

const ALL_DAYS: BusinessHours[] = [
  { day_of_week: "MONDAY", opening_time: "09:00", closing_time: "18:00", is_closed: false },
  { day_of_week: "TUESDAY", opening_time: "09:00", closing_time: "18:00", is_closed: false },
  { day_of_week: "WEDNESDAY", opening_time: "09:00", closing_time: "18:00", is_closed: false },
  { day_of_week: "THURSDAY", opening_time: "09:00", closing_time: "18:00", is_closed: false },
  { day_of_week: "FRIDAY", opening_time: "09:00", closing_time: "18:00", is_closed: false },
  { day_of_week: "SATURDAY", opening_time: "10:00", closing_time: "14:00", is_closed: false },
  { day_of_week: "SUNDAY", opening_time: "00:00", closing_time: "00:00", is_closed: true },
];

const setLocalTime = (localIso: string) => {
  vi.setSystemTime(new Date(localIso));
};

describe("useBusinessStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns isOpen=false and 'Horário não definido' for empty array", () => {
    setLocalTime("2026-06-01T10:00:00");
    const { result } = renderHook(() => useBusinessStatus([]));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.status).toBe("Horário não definido");
    expect(result.current.todayHours).toBeNull();
  });

  it("returns isOpen=false when today is marked as closed", () => {
    setLocalTime("2026-06-07T10:00:00");
    const { result } = renderHook(() => useBusinessStatus(ALL_DAYS));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.status).toBe("Fechado hoje");
    expect(result.current.todayHours).toBeNull();
  });

  it("returns isOpen=true when current time is between opening and closing", () => {
    setLocalTime("2026-06-01T12:00:00");
    const { result } = renderHook(() => useBusinessStatus(ALL_DAYS));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.status).toBe("Aberto agora");
  });

  it("returns isOpen=false when before opening time", () => {
    setLocalTime("2026-06-01T08:00:00");
    const { result } = renderHook(() => useBusinessStatus(ALL_DAYS));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.status).toBe("Fechado agora");
  });

  it("returns isOpen=false when after closing time", () => {
    setLocalTime("2026-06-01T19:00:00");
    const { result } = renderHook(() => useBusinessStatus(ALL_DAYS));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.status).toBe("Fechado agora");
  });

  it("returns isOpen=true at exactly opening time", () => {
    setLocalTime("2026-06-01T09:00:00");
    const { result } = renderHook(() => useBusinessStatus(ALL_DAYS));
    expect(result.current.isOpen).toBe(true);
  });

  it("returns isOpen=true at exactly closing time", () => {
    setLocalTime("2026-06-01T18:00:00");
    const { result } = renderHook(() => useBusinessStatus(ALL_DAYS));
    expect(result.current.isOpen).toBe(true);
  });

  it("returns the today's schedule in todayHours", () => {
    setLocalTime("2026-06-01T12:00:00");
    const { result } = renderHook(() => useBusinessStatus(ALL_DAYS));
    expect(result.current.todayHours?.day_of_week).toBe("MONDAY");
  });
});
