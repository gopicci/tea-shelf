import { login } from "./auth.spec";

describe("Create navigation", () => {
  it("Can open and close create page.", () => {
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="add tea"]').should("not.exist");
    cy.get('button[aria-label="cancel"]').click();
    cy.get('button[aria-label="add tea"]').should("exist");
  });

  it("Can take picture twice and move back and forth to input layout.", () => {
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="recapture"]').should("not.exist");
    cy.get('button[aria-label="done"]').should("not.exist");
    cy.wait(2000);
    cy.get('button[aria-label="capture"]').click();
    cy.wait(2000);
    cy.get('button[aria-label="capture"]').should("not.exist");
    cy.get('button[aria-label="recapture"]').click();
    cy.wait(2000);
    cy.get('button[aria-label="capture"]').click();
    cy.wait(2000);
    cy.get('button[aria-label="done"]').click();
    cy.get('div[aria-label="category"]').should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="recapture"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[aria-label="origin"]').should("exist");
  });

  it("Can write a name of max 50 characters, save, edit.", () => {
    const longName =
      "bla bla ble gij!!$ 35ij3 aoiegtjjeagj JE35. aeginj aegoi,..";
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[aria-label="name"]').click();
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('textarea[id="standard-multiline"]').type(longName);
    cy.get('button[aria-label="add"]').should("be.enabled");
    cy.get('textarea[id="standard-multiline"]')
      .invoke("text")
      .then((text) => {
        expect(text.length).to.eq(50);
      });
    cy.get('textarea[id="standard-multiline"]').click().clear().type("test");
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("test").should("not.exist");
    cy.get('div[aria-label="name"]').click();
    cy.get('textarea[id="standard-multiline"]').type("test");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("test").should("exist");
    cy.get('div[aria-label="name"]').click();
    cy.get('textarea[id="standard-multiline"]')
      .invoke("text")
      .then((text) => {
        expect(text).to.eq("test");
      });
  });

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
