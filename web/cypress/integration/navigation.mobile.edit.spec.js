describe("Mobile editing", { viewportWidth: 500 }, () => {
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
    cy.get('label[for="customized-empty-2-5"]').click({ force: true });
    cy.wait("@put");
    cy.get('button[aria-label="back"]').click();
  });

  it("Can edit tea.", () => {
    cy.get('button[aria-label="test tea"]').first().click();
    cy.get('button[aria-label="edit"]').click();
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

  it("Can archive tea.", () => {
    cy.get('button[aria-label="open drawer"]').click();
    cy.get("span").contains("Archive").click();
    cy.get('button[aria-label="test"]').should("not.exist");
    cy.get('button[aria-label="open drawer"]').click();
    cy.get("span").contains("Teas").click();
    cy.get('button[aria-label="test"]').first().click();
    cy.server();
    cy.route("PUT", "**/api/tea/**").as("archive");
    cy.get('button[aria-label="archive"]').click();
    cy.wait("@archive");
    cy.get("div").contains("Tea successfully archived").should("exist");
    cy.get('button[aria-label="Close"]').click();

    cy.get('button[aria-label="open drawer"]').click();
    cy.get("span").contains("Archive").click();
    cy.get('button[aria-label="test"]').click();
    cy.server();
    cy.route("PUT", "**/api/tea/**").as("unarchive");
    cy.get('button[aria-label="unarchive"]').click();
    cy.wait("@unarchive");
    cy.get("div").contains("Tea successfully unarchived").should("exist");
    cy.get('button[aria-label="Close"]').click();
    cy.get('button[aria-label="open drawer"]').click();
    cy.get("span").contains("Teas").click();
  });

  it("Can delete tea.", () => {
    cy.get('button[aria-label="test"]').first().click();
    cy.get('button[aria-label="menu"]').click();
    cy.server();
    cy.route("DELETE", "**/api/tea/**").as("delete");
    cy.get("li").contains("Delete").click();
    cy.wait("@delete");
    cy.get("div").contains("Tea successfully deleted").should("exist");
  });
});
