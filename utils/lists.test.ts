import { describe, it, expect } from "vitest";
import {
  months,
  states,
  status,
  discountsStatusColors,
  discountsStatusMasks,
  bannerRedirectMasks,
  bannerTypeMasks,
} from "./lists";

describe("months", () => {
  it("contains 12 months", () => {
    expect(months).toHaveLength(12);
  });

  it("starts with Janeiro and ends with Dezembro", () => {
    expect(months[0]).toBe("Janeiro");
    expect(months[11]).toBe("Dezembro");
  });

  it("contains all expected months in Portuguese", () => {
    expect(months).toEqual([
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]);
  });
});

describe("states", () => {
  it("contains all 27 Brazilian federative units (26 states + DF)", () => {
    expect(states).toHaveLength(27);
  });

  it("includes the 5 expected states", () => {
    const keys = states.map((s) => s.key);
    expect(keys).toContain("SP");
    expect(keys).toContain("RJ");
    expect(keys).toContain("MG");
    expect(keys).toContain("BA");
    expect(keys).toContain("DF");
  });

  it("has no duplicate keys", () => {
    const keys = states.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("every state has key and label", () => {
    states.forEach((s) => {
      expect(s.key).toBeTruthy();
      expect(s.label).toBeTruthy();
    });
  });

  it("SP maps to São Paulo", () => {
    const sp = states.find((s) => s.key === "SP");
    expect(sp?.label).toBe("São Paulo");
  });
});

describe("status", () => {
  it("has ACTIVE and INACTIVE entries", () => {
    const keys = status.map((s) => s.key);
    expect(keys).toEqual(["ACTIVE", "INACTIVE"]);
  });

  it("ACTIVE maps to 'Ativo' and INACTIVE to 'Inativo'", () => {
    expect(status.find((s) => s.key === "ACTIVE")?.label).toBe("Ativo");
    expect(status.find((s) => s.key === "INACTIVE")?.label).toBe("Inativo");
  });
});

describe("discountsStatusColors", () => {
  it("maps ACTIVE to success", () => {
    expect(discountsStatusColors.ACTIVE).toBe("success");
  });

  it("maps INACTIVE to default", () => {
    expect(discountsStatusColors.INACTIVE).toBe("default");
  });

  it("maps EXPIRED to danger", () => {
    expect(discountsStatusColors.EXPIRED).toBe("danger");
  });

  it("maps PENDING to warning", () => {
    expect(discountsStatusColors.PENDING).toBe("warning");
  });
});

describe("discountsStatusMasks", () => {
  it("maps each status to its Portuguese label", () => {
    expect(discountsStatusMasks.ACTIVE).toBe("Ativo");
    expect(discountsStatusMasks.INACTIVE).toBe("Inativo");
    expect(discountsStatusMasks.EXPIRED).toBe("Expirado");
    expect(discountsStatusMasks.PENDING).toBe("Pendente");
  });
});

describe("bannerRedirectMasks", () => {
  it("maps each redirect type to a Portuguese label", () => {
    expect(bannerRedirectMasks.FOOD).toBe("Produto");
    expect(bannerRedirectMasks.CATEGORY).toBe("Categoria");
    expect(bannerRedirectMasks.URL).toBe("URL");
  });
});

describe("bannerTypeMasks", () => {
  it("maps each banner type to a Portuguese label", () => {
    expect(bannerTypeMasks.MOBILE).toBe("Mobile");
    expect(bannerTypeMasks.DESKTOP).toBe("Desktop");
  });
});
