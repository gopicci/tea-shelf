Cypress.config("viewportWidth", 1000);

describe("Create navigation", () => {

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
    cy.get('button[aria-label="skip"]').click();
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
