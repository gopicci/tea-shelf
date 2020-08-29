describe("Authentication", () => {
  before(() => {
    cy.visit("/");
  });

  it("Can log in.", () => {
    const { email, password } = Cypress.env("credentials");
    cy.server();
    cy.route("POST", "**/api/login/**").as("login");
    cy.visit("/");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password, { log: false });
    cy.get("button").contains("Sign In").click();
    cy.wait("@login");
    cy.get("button").contains("Sign In").should("not.exist");
  });

});