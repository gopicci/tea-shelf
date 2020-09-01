describe("Desktop input form navigation", {viewportWidth: 1000},() => {
  before(() => {
    cy.login();
    cy.visit("/");
  });

  it("Cannot post without required fields.", () => {
    cy.get('div[aria-label="add tea"]').click();
    cy.get('button').contains("skip").click();
    cy.get('button[aria-label="save"]').click();
    cy.get("p").contains("Required").should("exist");
    cy.get('input[name="name"]').type("test");
    cy.get('button[aria-label="save"]').click();
    cy.get("p").contains("Required").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button').contains("cancel").click();
  });

  it("Category populates brewing", () => {
    cy.get('div[aria-label="add tea"]').click();
    cy.get('button').contains("skip").click();
    cy.get('input[value="95"]').should("not.exist");
    cy.get('input[value="00:00:15"]').should("not.exist");
    cy.get('input[value="4.5"]').should("not.exist");
    cy.get('input[value="00:00:05"]').should("not.exist");
    cy.get('div[aria-label="category"]').click();
    cy.get("li").contains("Black").click();
    cy.get('input[value="95"]').should("exist");
    cy.get('input[value="00:00:15"]').should("exist");
    cy.get('input[value="4.5"]').should("exist");
    cy.get('input[value="00:00:05"]').should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button').contains("cancel").click();
  });

  it("Subcategory overwrites fields.", () => {
    cy.get('div[aria-label="add tea"]').click();
    cy.get('button').contains("skip").click();
    cy.get('div[aria-label="category"]').click();
    cy.get("li").contains("Oolong").click();
    cy.get("div").contains("Oolong").should("exist");
    cy.get('input[value="95"]').should("not.exist");
    cy.get('div[aria-label="subcategory"]').click();
    cy.get("li").contains("Assam").click();
    cy.get("div").contains("Oolong").should("not.exist");
    cy.get("div").contains("Black").should("exist");
    cy.get('input[value="Assam, India"]').should("exist");
    cy.get('input[value="95"]').should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button').contains("cancel").click();
  });

  it("Cannot enter wrong year.", () => {
    cy.get('div[aria-label="add tea"]').click();
    cy.get('button').contains("skip").click();
    cy.get('input[id="year"]').type("test");
    cy.get('button[aria-label="save"]').click();
    cy.get("p").contains("Invalid year").should("exist");
    cy.get('input[id="year"]').type("2001");
    cy.get('button[aria-label="save"]').click();
    cy.get("p").contains("Invalid year").should("not.exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button').contains("cancel").click();
  });

  it("Can change weight and price.", () => {
    cy.get('div[aria-label="add tea"]').click();
    cy.get('button').contains("skip").click();
    cy.get("label").contains("Price per g").should("exist");
    cy.get('div[aria-label="measure"]').click();
    cy.get("li").contains("oz").click();
    cy.get("label").contains("Price per g").should("not.exist");
    cy.get("label").contains("Price per oz").should("exist");
    cy.get('input[name="weight_left"]').type("13.3");
    cy.get('button[aria-label="save"]').click();
    cy.get("p").contains("Weight").should("not.exist");
    cy.get('input[name="weight_left"]').type("a");
    cy.get('button[aria-label="save"]').click();
    cy.get("p").contains("Weight must be a number").should("exist");
    cy.get('input[name="price"]').type("17");
    cy.get('button[aria-label="save"]').click();
    cy.get("p").contains("Price").should("not.exist");
    cy.get('input[name="price"]').type("test");
    cy.get('button[aria-label="save"]').click();
    cy.get("p").contains("Price must be a number").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button').contains("cancel").click();
  });

  it("Can edit brewings", () => {
    cy.get('div[aria-label="add tea"]').click();
    cy.get('button').contains("skip").click();
    cy.get('div[aria-label="category"]').click();
    cy.get("li").contains("Black").click();
    cy.get('input[value="95"]').should("exist");
    cy.get('div[aria-label="degrees"]').click();
    cy.get("li").contains("F").click();
    cy.get('input[value="95"]').should("not.exist");
    cy.get('input[value="203"]').should("exist");
    cy.get('input[value="00:00:15"]').should("exist");
    cy.get('label[aria-label="brewing"]').click();
    cy.get('input[value="203"]').should("not.exist");
    cy.get('input[value="95"]').should("exist");
    cy.get('input[value="00:00:15"]').should("not.exist");
    cy.get('input[value="00:02:00"]').should("exist");
    cy.get('input[name="western_brewing.initial"]').click().type(`{selectall}9`);
    cy.get('button[aria-label="save"]').click();
    cy.get("p").contains("Must be in 23:59:59 format").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button').contains("cancel").click();
  });
});
