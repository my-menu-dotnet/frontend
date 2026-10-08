import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveQRCodeConfig,
  getQRCodeConfig,
  QRCodeDefault,
} from "./QRCode";

const storage = new Map<string, string>();
const storageMock = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
  clear: () => {
    storage.clear();
  },
  key: (i: number) => Array.from(storage.keys())[i] ?? null,
  get length() {
    return storage.size;
  },
};

beforeEach(() => {
  storage.clear();
  Object.defineProperty(window, "localStorage", {
    value: storageMock,
    writable: true,
    configurable: true,
  });
});

describe("QRCode config — saveQRCodeConfig", () => {
  it("persists config to localStorage as JSON", () => {
    const cfg = { ecLevel: "H" as const, bgColor: "#000000" };
    saveQRCodeConfig(cfg);
    const stored = window.localStorage.getItem("qrCodeConfig");
    expect(stored).toBe(JSON.stringify(cfg));
  });

  it("overwrites previous config", () => {
    saveQRCodeConfig({ ecLevel: "L" });
    saveQRCodeConfig({ ecLevel: "H" });
    const stored = window.localStorage.getItem("qrCodeConfig");
    expect(stored).toContain('"ecLevel":"H"');
  });

  it("does not throw when localStorage is unavailable", () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota");
      });
    expect(() => saveQRCodeConfig({ ecLevel: "L" })).not.toThrow();
    setItemSpy.mockRestore();
  });
});

describe("QRCode config — getQRCodeConfig", () => {
  it("returns null when nothing is stored", () => {
    expect(getQRCodeConfig()).toBeNull();
  });

  it("returns the previously saved config", () => {
    const cfg = { ecLevel: "Q" as const, bgColor: "#fff" };
    saveQRCodeConfig(cfg);
    expect(getQRCodeConfig()).toEqual(cfg);
  });

  it("returns null and logs error on corrupt JSON", () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    window.localStorage.setItem("qrCodeConfig", "not-valid-json{");
    expect(getQRCodeConfig()).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe("QRCode config — QRCodeDefault", () => {
  it("has expected default values", () => {
    expect(QRCodeDefault.ecLevel).toBe("L");
    expect(QRCodeDefault.bgColor).toBe("#FFFFFF");
    expect(QRCodeDefault.fgColor).toBe("#000000");
    expect(QRCodeDefault.logoImage).toBe(true);
  });
});
