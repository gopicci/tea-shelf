import { login } from "./auth.spec";

describe("Create navigation", () => {
  it("Can add a basic tea.", () => {
    cy.server();
    cy.route("POST", "**/api/tea/**").as("tea");
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('div[aria-label="name"]').click();
    cy.get('textarea[id="standard-multiline"]').type("test");
    cy.get('button[aria-label="add"]').click();
    cy.get('div[id="category"]').click();
    cy.get("p").contains("oolong").click();
    cy.get('button[aria-label="add"]').should("not.be.disabled");
    cy.get('button[aria-label="add"]').click();
    cy.wait("@tea");
    cy.get("div").contains("Tea successfully created").should("exist");
  });
});
