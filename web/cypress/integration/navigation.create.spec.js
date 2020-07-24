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

  it("Can add a complex tea.", () => {
    cy.server();
    cy.route("POST", "**/api/tea/**").as("tea");
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[aria-label="name"]').click();
    cy.get('textarea[id="standard-multiline"]').type("test");
    cy.get('button[aria-label="add"]').click();
    cy.get('div[id="category"]').click();
    cy.get("p").contains("black").click();
    cy.get('div[id="subcategory"]').click();
    cy.get('input[id="subcategory-autocomplete"]').type("Dan C");
    cy.get("div").contains("Dan C").click();
    cy.get('div[id="year"]').click();
    cy.get("p").contains("2010").click();
    cy.get('div[id="origin"]').click();
    cy.get('input[id="origin-autocomplete"]').type("los an");
    cy.get("div").contains("Los Angeles").click();
    cy.get('div[id="vendor"]').click();
    cy.get('input[id="vendor-autocomplete"]').type("tea shop");
    cy.get("div").contains("Tea Shop").click();
    cy.get('div[id="weight"]').click();
    cy.get('div[aria-label="weight"]').type("0.5");
    cy.get('input[value="ounces"]').click();
    cy.get('button[aria-label="add"]').click();
    cy.get('div[id="price"]').click();
    cy.get('label[aria-label="ounces"]').click();
    cy.get('div[aria-label="price"]').type("10");
    cy.get('div[aria-label="amount"]').type("5");
    cy.get('button[aria-label="add"]').click();
    cy.get('div[id="gongfu_temperature"]').click();
    cy.get('div[id="84°c"]').click();
    cy.get('div[id="western_weight"]').click();
    cy.get('div[id="0.8g"]').click();
    cy.get('div[id="western_increments"]').click();
    cy.get('div[aria-label="time-text"]').type("19");
    cy.get('button[aria-label="add"]').click();

    cy.get('button[aria-label="add"]').click();
    cy.wait("@tea");
    cy.get("div").contains("Tea successfully created").should("exist");
  });
});
