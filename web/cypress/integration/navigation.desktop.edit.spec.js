describe("Desktop editing", {viewportWidth: 1000}, () => {
  before(() => {
    cy.login();
    cy.visit("/");
  });

  it("Can rate tea.", () => {
    cy.server();
    cy.route("POST", "**/api/tea/**").as("tea");
    cy.get('div[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('input[name="name"]').type("test");
    cy.get('div[aria-label="category"]').click();
    cy.get("li").contains("Oolong").click();
    cy.get('button[aria-label="save"]').click();
    cy.wait("@tea");
    cy.get("div").contains("Tea successfully uploaded").should("exist");
    cy.get('button[aria-label="Close"]').click();

    cy.get('button[aria-label="test"]').first().click();
    cy.get("span").contains("add notes").should("exist");

    cy.server();
    cy.route("PUT", "**/api/tea/**").as("put");
    cy.get('label[for="customized-empty-2-5"]').click({force: true});
    cy.wait("@put");
    cy.get("div").contains("Tea successfully uploaded").should("exist");
    cy.get('button[aria-label="close"]').click();
  });

  it("Can edit tea.", () => {
    cy.get('button[aria-label="test"]').first().click();
    cy.get('button[aria-label="edit"]').click();
    cy.get('input[name="name"]').type("test edit");
    cy.get('div[aria-label="category"]').click();
    cy.get("li").contains("Black").click();
    cy.server();
    cy.route("PUT", "**/api/tea/**").as("put1");
    cy.get('button[aria-label="save"]').click();
    cy.wait("@put1");
    cy.get("div").contains("Tea successfully uploaded").should("exist");
    cy.get('button[aria-label="Close"]').click();

    cy.get('button[aria-label="add notes"]').click();
    cy.get('textarea[id="notes"]').type("test notes");
    cy.server();
    cy.route("PUT", "**/api/tea/**").as("put2");
    cy.get('button[aria-label="save notes"]').click();
    cy.wait("@put2");
    cy.get("div").contains("Tea successfully uploaded").should("exist");
    cy.get("p").contains("test notes").should("exist");
    cy.get('button[aria-label="edit notes"]').should("exist");
    cy.get('button[aria-label="close"]').click();
  });

});
