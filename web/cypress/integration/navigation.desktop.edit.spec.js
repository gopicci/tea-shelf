describe("Desktop editing", { viewportWidth: 1000 }, () => {
  before(() => {
    cy.login();
    cy.visit("/");
  });

  it("Can rate tea.", () => {
    cy.server();
    cy.route("POST", "**/api/tea/**").as("tea");
    cy.get('div[aria-label="add tea"]').click();
    cy.get("span").contains("Skip").click();
    cy.get('input[name="name"]').type("test");
    cy.get('div[aria-label="category"]').click();
    cy.get("li").contains("Oolong").click();
    cy.get("span").contains("Save").click();
    cy.wait("@tea");
    cy.get('button[aria-label="Close"]').click();

    cy.get('button[aria-label="test"]').first().click();
    cy.get("span").contains("Add notes").should("exist");

    cy.server();
    cy.route("PUT", "**/api/tea/**").as("put");
    cy.get('label[for="customized-empty-2-5"]').click({ force: true });
    cy.wait("@put");
    cy.get("span:visible").contains("Close").click();
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

    cy.get("span").contains("Add notes").click();
    cy.get('textarea[id="notes"]').type("test notes");
    cy.server();
    cy.route("PUT", "**/api/tea/**").as("put2");
    cy.get("span").contains("Save").click();
    cy.wait("@put2");
    cy.get("p").contains("test notes").should("exist");
    cy.get("span").contains("Edit notes").click();
    cy.get('div[role="dialog"]').within(() => {
      cy.get("span").contains("Close").click();
    });
    cy.get("div").contains("Save notes?").should("exist");
    cy.server();
    cy.route("PUT", "**/api/tea/**").as("put");
    cy.get("span").contains("Ok").click();
    cy.wait("@put");
  });

  it("Can delete tea.", () => {
    cy.get('button[aria-label="test"]').first().click();
    cy.get('div[role="dialog"]').within(() => {
      cy.get('button[aria-label="menu"]').click();
    });
    cy.get("li").contains("Delete").click();
    cy.server();
    cy.route("DELETE", "**/api/tea/**").as("delete");
    cy.get("span").contains("Ok").click();
    cy.wait("@delete");
    cy.get("div").contains("Tea successfully deleted").should("exist");
  });
});
