describe("Mobile editing", {viewportWidth: 500}, () => {
  before(() => {
    cy.login();
    cy.visit("/");
  });

  it("Can rate tea.", () => {

    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[aria-label="name"]').click();
    cy.get('textarea[id="standard-multiline"]').type("test tea");
    cy.get('button[aria-label="Save"]').click();
    cy.get('div[id="category"]').click();
    cy.get("p").contains("black").click();

    cy.server();
    cy.route("POST", "**/api/tea/**").as("tea");
    cy.get('button[aria-label="Create"]').click();
    cy.wait("@tea");
    cy.get("div").contains("Tea successfully added").should("exist");
    cy.get('button[aria-label="Close"]').click();

    cy.get('button[aria-label="test tea"]').first().click();
    cy.get("span").contains("Add notes").should("exist");

    cy.server();
    cy.route("PUT", "**/api/tea/**").as("put");
    cy.get('label[for="customized-empty-2-5"]').click({force: true});
    cy.wait("@put");
    cy.get('button[aria-label="back"]').click();
  });

  it("Can edit tea.", () => {

    cy.get('button[aria-label="test tea"]').first().click();
    cy.get('button[aria-label="menu"]').click();
    cy.get('li').contains("Edit").click();
    cy.get('div[aria-label="name"]').click();
    cy.get('textarea[id="standard-multiline"]').type("test");
    cy.get('button[aria-label="Save"]').click();
    cy.server();
    cy.route("PUT", "**/api/tea/**").as("put1");
    cy.get('button[aria-label="Save"]').click();
    cy.wait("@put1");
    cy.get("span").contains("Add notes").click();
    cy.get('textarea[id="standard-multiline"]').type("test notes");
    cy.server();
    cy.route("PUT", "**/api/tea/**").as("put2");
    cy.get('button[aria-label="save"]').click();
    cy.wait("@put2");
    cy.get("p").contains("test notes").should("exist");
    cy.get('button[aria-label="back"]').click();
  });

});
