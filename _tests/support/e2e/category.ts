
const CATEGORY_NAME = "Category";

function createCategory(name: string = CATEGORY_NAME) {
  cy.get('[data-test="add-category"]').click();

  cy.get('[data-test="input-name"]').type(name);
  cy.get('[data-test="select-status"]').click();
  cy.get('[data-test="select-item-ACTIVE"]').click();

  cy.get('[data-test="input-submit"]').click();
}

function removeCategory(name: string = CATEGORY_NAME) {
  cy.get('[data-test="container-categories"]')
    .should("exist")
    .should("contain", name)
    .contains(name)
    .parent()
    .as("categoryItem");

  cy.get("@categoryItem")
    .find('[data-test="button-category-delete"]')
    .should("be.visible")
    .click({ force: true });

  cy.get('[data-test="button-modal-delete"]')
    .should("exist")
    .should("be.visible")
    .click({ force: true });
}

Cypress.Commands.add("createCategory", createCategory);
Cypress.Commands.add("removeCategory", removeCategory);
