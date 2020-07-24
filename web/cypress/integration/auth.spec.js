export function login() {
  const { email, password } = Cypress.env("credentials");

  // Capture HTTP requests.
  cy.server();
  cy.route("POST", "**/api/login/**").as("login");

  // Log into the app.
  cy.visit("/");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password, { log: false });
  cy.get("button").contains("Sign In").click();
  cy.wait("@login");
};

describe("Authentication", () => {

  it("Can log in.", () => {
    login();
    cy.get("button").contains("Sign In").should("not.exist");
  });

});