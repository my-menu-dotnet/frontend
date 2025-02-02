import id from "../support/utils/random";

const CATEGORY_NAME = `Category-${id()}`;
const FOOD_DATA = {
  name: `Food-${id()}`,
  description: "Description",
  price: "10.00",
};

describe("Create a discount", () => {
  before(() => {
    cy.login(Cypress.env("USER"), Cypress.env("PASSWORD"));

    cy.visit("/dashboard/menu/categories");
    cy.createCategory(CATEGORY_NAME);

    cy.visit("/dashboard/menu/products");
    cy.createFood(
      FOOD_DATA.name,
      FOOD_DATA.description,
      FOOD_DATA.price,
      CATEGORY_NAME
    );
  });

  beforeEach(() => {
    cy.login(Cypress.env("USER"), Cypress.env("PASSWORD"));
    cy.visit("dashboard/menu/discounts");
  });

  it("create a discount", () => {
    
  })
});
