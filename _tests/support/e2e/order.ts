export type ManualOrderInput = {
  customerName: string;
  foodName: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  companyObservation?: string;
};

function createManualOrder(order: ManualOrderInput) {
  cy.get('[data-test="add-manual-order"]').click();

  cy.get('[data-test="manual-order-modal"]').should("exist");

  cy.get('[data-test="input-customer-name"]').type(order.customerName);

  cy.get('[data-test="input-cep"]').type(order.cep);
  cy.get('[data-test="select-state"]').click();
  cy.get(`[data-test="select-item-${order.state}"]`).click();

  cy.get('[data-test="input-city"]').type(order.city);
  cy.get('[data-test="input-neighborhood"]').type(order.neighborhood);
  cy.get('[data-test="input-street"]').type(order.street);
  cy.get('[data-test="input-number"]').type(order.number);

  cy.get('[data-test="add-item-button"]').click();

  cy.get('[data-test="food-picker-modal"]').should("exist");
  cy.contains(order.foodName).click();

  cy.get('[data-test="item-config-modal"]').should("exist");
  cy.get('[data-test="button-confirm-item"]').click();

  if (order.companyObservation) {
    cy.get('[data-test="input-company-observation"]').type(
      order.companyObservation
    );
  }

  cy.get('[data-test="button-submit-order"]').click();
}

Cypress.Commands.add("createManualOrder", createManualOrder);
