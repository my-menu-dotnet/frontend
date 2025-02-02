
function login(email: string, password: string) {
  cy.visit("/auth/login");

  cy.get("#input-email").type(email);
  cy.get("#input-password").type(password);

  cy.get("#input-submit").click();

  cy.url().should("include", "/dashboard");
}

Cypress.Commands.add("login", (email, password) => {
  cy.session(`user-${email}`, () => {
    login(email, password);
  });
});
