function Select(select: string, item: string) {
  cy.get(`[data-test="${select}"]`)
    .click()
    .should("have.attr", "aria-expanded", "true");

  cy.get(`[data-test="${item}"]`).click();
}

Cypress.Commands.add("selectItem", Select);
