
function createFood(name: string, description: string, price: string, categoryName: string) {
  cy.get('[data-test="add-food"]').click();

  cy.get('[data-test="food-modal"]').should("exist");

  cy.get('[data-test="input-name"]').type(name);
  cy.get('[data-test="input-description"]').type(description);
  cy.get('[data-test="input-price"]').type(price);

  cy.selectItem("select-category", `select-item-${categoryName}`);
  cy.imagePicker("pizza-de-calabresa.jpg");
}

Cypress.Commands.add("createFood", createFood);
