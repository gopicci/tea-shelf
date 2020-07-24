import { login } from "./auth.spec";

describe("Create navigation", () => {

  it("Can select a category.", () => {
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('p').contains('99°c').should("not.exist");
    cy.get('div[aria-label="category"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get('div[aria-label="category"]').click();
    cy.get('p').contains('oolong').click();
    cy.get('div[aria-label="vendor"]').should("exist");
    cy.get('p').contains('oolong').should("exist");
    cy.get('p').contains('99°c').should("exist");
    cy.get('p').contains('0.8g').should("exist");
    cy.get('p').contains('+30').should("exist");
  });
});
