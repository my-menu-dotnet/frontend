function imagePicker(fixtureName: string) {
  cy.get('[data-test="image-picker"]')
    .click()
    .selectFile(`_tests/fixtures/${fixtureName}`);
  cy.get('[data-test="image-preview"]').should("exist");
}

Cypress.Commands.add("imagePicker", imagePicker);
