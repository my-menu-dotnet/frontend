import id from "../support/utils/random";

const CATEGORY_NAME = `category-${id()}`;
const FOOD_NAME = `Food${id()}`;
const CUSTOMER_NAME = `Customer${id()}`;

describe("Create a manual order", () => {
  before(() => {
    cy.login(Cypress.env("USER"), Cypress.env("PASSWORD"));
    cy.visit("/dashboard/menu/categories");
    cy.createCategory(CATEGORY_NAME);

    cy.visit("/dashboard/menu/products");
    cy.createFood(FOOD_NAME, "Test description", "15", CATEGORY_NAME);
    cy.get('[data-test="input-submit"]').click();
  });

  beforeEach(() => {
    cy.login(Cypress.env("USER"), Cypress.env("PASSWORD"));
    cy.visit("/dashboard/orders");
  });

  it("opens the manual order modal", () => {
    cy.get('[data-test="add-manual-order"]').click();
    cy.get('[data-test="manual-order-modal"]').should("exist");
  });

  it("creates a manual order with a known food", () => {
    cy.createManualOrder({
      customerName: CUSTOMER_NAME,
      foodName: FOOD_NAME,
      cep: "01310100",
      state: "SP",
      city: "Sao Paulo",
      neighborhood: "Bela Vista",
      street: "Avenida Paulista",
      number: "1000",
      companyObservation: "Pedido de teste E2E",
    });
  });
});
