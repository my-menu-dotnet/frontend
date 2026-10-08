import { describe, it, expect } from "vitest";
import { orderStatusMask, orderStatusColor } from "./order";
import type { OrderStatus } from "@/types/api/order/Order";

describe("orderStatusMask", () => {
  const cases: Array<[OrderStatus, string]> = [
    ["CREATED", "Criado"],
    ["ACCEPTED", "Aceito"],
    ["PRODUCING", "Em produção"],
    ["READY", "Pronto"],
    ["DELIVERED", "Entregue"],
    ["CANCELLED", "Cancelado"],
  ];

  it.each(cases)("maps %s to %s", (status, expected) => {
    expect(orderStatusMask(status)).toBe(expected);
  });

  it("returns empty string for unknown status", () => {
    expect(orderStatusMask("UNKNOWN" as OrderStatus)).toBe("");
  });
});

describe("orderStatusColor", () => {
  const cases: Array<[OrderStatus, string]> = [
    ["CREATED", "bg-blue-500"],
    ["ACCEPTED", "bg-green-500"],
    ["PRODUCING", "bg-yellow-500"],
    ["READY", "bg-red-500"],
    ["DELIVERED", "bg-purple-500"],
    ["CANCELLED", "bg-gray-500"],
  ];

  it.each(cases)("maps %s to %s", (status, expected) => {
    expect(orderStatusColor(status)).toBe(expected);
  });

  it("returns empty string for unknown status", () => {
    expect(orderStatusColor("UNKNOWN" as OrderStatus)).toBe("");
  });

  it("returns unique colors for each status (no collisions)", () => {
    const colors = cases.map(([s]) => orderStatusColor(s));
    expect(new Set(colors).size).toBe(colors.length);
  });
});
