import { describe, it, expect } from "vitest";
import { addressValidation } from "./address";

const validAddress = {
  street: "Av Paulista",
  number: "1000",
  neighborhood: "Bela Vista",
  city: "São Paulo",
  state: "SP",
  zip_code: "01310-100",
};

describe("addressValidation", () => {
  it("accepts a complete valid address", async () => {
    await expect(addressValidation().validate(validAddress)).resolves.toEqual(
      validAddress
    );
  });

  it("accepts CEP without hyphen (8 digits)", async () => {
    await expect(
      addressValidation().validate({ ...validAddress, zip_code: "01310100" })
    ).resolves.toBeDefined();
  });

  it("rejects when street is missing", async () => {
    const { street, ...rest } = validAddress;
    void street;
    await expect(addressValidation().validate(rest)).rejects.toThrow();
  });

  it("rejects when number is missing", async () => {
    const { number, ...rest } = validAddress;
    void number;
    await expect(addressValidation().validate(rest)).rejects.toThrow();
  });

  it("rejects when neighborhood is missing", async () => {
    const { neighborhood, ...rest } = validAddress;
    void neighborhood;
    await expect(addressValidation().validate(rest)).rejects.toThrow();
  });

  it("rejects when city is missing", async () => {
    const { city, ...rest } = validAddress;
    void city;
    await expect(addressValidation().validate(rest)).rejects.toThrow();
  });

  it("rejects when state is missing", async () => {
    const { state, ...rest } = validAddress;
    void state;
    await expect(addressValidation().validate(rest)).rejects.toThrow();
  });

  it("rejects when zip_code is missing", async () => {
    const { zip_code, ...rest } = validAddress;
    void zip_code;
    await expect(addressValidation().validate(rest)).rejects.toThrow();
  });

  it("rejects CEP with 7 digits", async () => {
    await expect(
      addressValidation().validate({ ...validAddress, zip_code: "0131010" })
    ).rejects.toThrow();
  });

  it("rejects CEP with letters", async () => {
    await expect(
      addressValidation().validate({
        ...validAddress,
        zip_code: "abcde-fgh",
      })
    ).rejects.toThrow();
  });

  it("complement is optional", async () => {
    const result = await addressValidation().validate(validAddress);
    expect(result).not.toHaveProperty("complement");
  });
});
