import id from "../support/utils/random";

const CATEGORY_NAME = `category-${id()}`;

describe("create a category", () => {
  beforeEach(() => {
    cy.login(Cypress.env("USER"), Cypress.env("PASSWORD"));
    cy.visit("/dashboard/menu/categories");
  });

  it("create a category", () => {
    cy.createCategory(CATEGORY_NAME);
  });

  it("have the created category", () => {
    cy.get('[data-test="category-item"]').should("contain", CATEGORY_NAME);
  });

  it("edit the name of the created category", () => {
    cy.get('[data-test="category-item"]')
      .contains(CATEGORY_NAME)
      .parent()
      .find('[data-test="button-category-edit"]')
      .click();

    cy.get('[data-test="input-name"]')
      .clear()
      .type(CATEGORY_NAME + "-v2");

    cy.get('[data-test="input-submit"]').click();
  });

  it("have the edited category", () => {
    cy.get('[data-test="category-item"]').should(
      "contain",
      CATEGORY_NAME + "-v2"
    );
  });

  it("edit the status of the created category", () => {
    cy.get('[data-test="category-item"]')
      .contains(CATEGORY_NAME)
      .parent()
      .find('[data-test="button-category-edit"]')
      .click();

    cy.get('[data-test="select-status"]').click();
    cy.get('[data-test="select-item-INACTIVE"]').click();
    cy.get('[data-test="input-submit"]').click();
  });

  it("have the edited status of the category", () => {
    cy.get('[data-test="category-item"]')
      .contains(CATEGORY_NAME + "-v2")
      .parent()
      .find(".bg-danger");
  });

  it("delete the created category", () => {
    cy.removeCategory(CATEGORY_NAME + "-v2");
  });

  it("do not have the deleted category", () => {
    cy.get('[data-test="container-categories"]').should(
      "not.contain",
      CATEGORY_NAME + "-v2"
    );
  });
});
