import id from "../support/utils/random";

const CATEGORY_NAME = `category-${id()}`;
const FOOD_DATA = {
  name: "Food" + id(),
  description: "Description",
  price: "10",
  image: "_tests/fixtures/pizza-de-calabresa.jpg",
};
const NEW_FOOD_DATA = {
  name: "Food" + id(),
  description: "Description-v2",
  price: "20",
};

describe("Create a food using a category", () => {
  before(() => {
    cy.login(Cypress.env("USER"), Cypress.env("PASSWORD"));
    cy.visit("/dashboard/menu/categories");
    cy.createCategory(CATEGORY_NAME);
  });

  after(() => {
    cy.login(Cypress.env("USER"), Cypress.env("PASSWORD"));
    cy.visit("/dashboard/menu/categories");
    cy.wait(2000);
    cy.removeCategory(CATEGORY_NAME);

    cy.visit("/dashboard/menu/products");
    cy.get('[data-test="food-container"]').should(
      "not.contain",
      FOOD_DATA.name
    );
  });

  beforeEach(() => {
    cy.login(Cypress.env("USER"), Cypress.env("PASSWORD"));
    cy.visit("/dashboard/menu/products");
  });

  it("create a food", () => {
    cy.createFood(
      FOOD_DATA.name,
      FOOD_DATA.description,
      FOOD_DATA.price,
      CATEGORY_NAME
    );
    cy.get('[data-test="input-submit"]').click();
  });

  it("have the created food", () => {
    cy.get(`[data-test="food-${FOOD_DATA.name}"]`).should("exist");
  });

  it("have the values of the created food", () => {
    cy.get(`[data-test="food-${FOOD_DATA.name}"]`).click();

    cy.get('[data-test="input-name"]').should("have.value", FOOD_DATA.name);
    cy.get('[data-test="input-description"]').should(
      "have.value",
      FOOD_DATA.description
    );
    cy.get('[data-test="input-price"]').should("have.value", FOOD_DATA.price);
    cy.get('[data-test="select-category"]').should("contain", CATEGORY_NAME);
  });

  it("edit the values of the created food", () => {
    cy.get(`[data-test="food-${FOOD_DATA.name}"]`).click();

    cy.get('[data-test="input-name"]').clear().type(NEW_FOOD_DATA.name);
    cy.get('[data-test="input-description"]')
      .clear()
      .type(NEW_FOOD_DATA.description);
    cy.get('[data-test="input-price"]').clear().type(NEW_FOOD_DATA.price);

    cy.get('[data-test="input-submit"]').click();
  });

  it("have the edited values of the food", () => {
    cy.get(`[data-test="food-${NEW_FOOD_DATA.name}"]`).should("exist");

    cy.get(`[data-test="food-${NEW_FOOD_DATA.name}"]`).click();

    cy.get('[data-test="input-name"]').should("have.value", NEW_FOOD_DATA.name);
    cy.get('[data-test="input-description"]').should(
      "have.value",
      NEW_FOOD_DATA.description
    );
    cy.get('[data-test="input-price"]').should(
      "have.value",
      NEW_FOOD_DATA.price
    );
  });
});
