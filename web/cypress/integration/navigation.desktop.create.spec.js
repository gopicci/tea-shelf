describe("Desktop creation", {viewportWidth: 1000}, () => {
  before(() => {
    cy.login();
    cy.visit("/");
  });

  it("Can add a basic tea.", () => {
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
  });

  it("Can add a complex tea.", () => {
    cy.server();
    cy.route("POST", "**/api/tea/**").as("tea");
    cy.get('div[aria-label="add tea"]').click();
    cy.get('button').contains("skip").click();
    cy.get('input[name="name"]').type("test");
    cy.get('div[aria-label="category"]').click();
    cy.get("li").contains("Oolong").click();
    cy.get("div").contains("Oolong").should("exist");
    cy.get('div[aria-label="subcategory"]').click();
    cy.get("li").contains("Assam").click();
    cy.get("div").contains("Black").should("exist");
    cy.get("div").contains("Oolong").should("not.exist");
    cy.get('input[id="year"]').type("2001");
    cy.get('input[name="weight_left"]').type("6");
    cy.get('div[aria-label="measure"]').click();
    cy.get("li").contains("oz").click();
    cy.get('input[name="price"]').type("100");
    cy.get('button[aria-label="save"]').click();
    cy.wait("@tea");
    cy.get("div").contains("Tea successfully uploaded").should("exist");
  });
});
