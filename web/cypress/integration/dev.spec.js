
describe("Mobile input layout navigation",{viewportWidth: 500}, () => {

  before(() => {
    cy.login();
    cy.visit("/");
  });

  it("Can select gongfu brewing.", () => {
    // Can pick temperature
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[id="gongfu_temperature"]').click();
    cy.get('div[id="95°c"]').click();
    cy.get("p").contains("203F").should("exist");
    cy.get('div[id="gongfu_temperature"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("203F").should("exist");
    cy.get('div[id="category"]').should("exist");

    // Can pick weight
    cy.get('div[id="gongfu_weight"]').click();
    cy.get('div[id="8.5g"]').click();
    cy.get("p").contains("8.5").should("exist");
    cy.get('div[id="gongfu_weight"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("8.5").should("exist");
    cy.get('div[id="category"]').should("exist");

    // Can pick initial time
    cy.get('div[id="gongfu_initial"]').click();
    cy.get('button[aria-label="Save"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type(".a#%>!");
    cy.get('button[aria-label="Save"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get("p").contains("39sec").should("exist");
    cy.get('div[id="gongfu_initial"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get('div[id="gongfu_initial"]').click();
    cy.get('input[value="minutes"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("16").should("exist");
    cy.get("p").contains("hour").should("exist");
    cy.get('div[id="gongfu_initial"]').click();
    cy.get('input[value="hours"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("15").should("exist");

    // Can pick increments
    cy.get('div[id="gongfu_increments"]').click();
    cy.get('button[aria-label="Save"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type(".a#%>!");
    cy.get('button[aria-label="Save"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get("p").contains("39sec").should("exist");
    cy.get('div[id="gongfu_increments"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get('div[id="gongfu_increments"]').click();
    cy.get('input[value="minutes"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("16").should("exist");
    cy.get("p").contains("hour").should("exist");
    cy.get('div[id="gongfu_increments"]').click();
    cy.get('input[value="hours"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("15").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
  });

  it("Can select western brewing.", () => {
    // Can pick temperature
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[id="western_temperature"]').click();
    cy.get('div[id="95°c"]').click();
    cy.get("p").contains("203F").should("exist");
    cy.get('div[id="western_temperature"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("203F").should("exist");
    cy.get('div[id="category"]').should("exist");

    // Can pick weight
    cy.get('div[id="western_weight"]').click();
    cy.get('div[id="1.2g"]').click();
    cy.get("p").contains("1.2").should("exist");
    cy.get('div[id="western_weight"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("1.2").should("exist");
    cy.get('div[id="category"]').should("exist");

    // Can pick initial time
    cy.get('div[id="western_initial"]').click();
    cy.get('button[aria-label="Save"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type(".a#%>!");
    cy.get('button[aria-label="Save"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get("p").contains("39sec").should("exist");
    cy.get('div[id="western_initial"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get('div[id="western_initial"]').click();
    cy.get('input[value="minutes"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("16").should("exist");
    cy.get("p").contains("hour").should("exist");
    cy.get('div[id="western_initial"]').click();
    cy.get('input[value="hours"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("15").should("exist");

    // Can pick increments
    cy.get('div[id="western_increments"]').click();
    cy.get('button[aria-label="Save"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type(".a#%>!");
    cy.get('button[aria-label="Save"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get("p").contains("39sec").should("exist");
    cy.get('div[id="western_increments"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get('div[id="western_increments"]').click();
    cy.get('input[value="minutes"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("16").should("exist");
    cy.get("p").contains("hour").should("exist");
    cy.get('div[id="western_increments"]').click();
    cy.get('input[value="hours"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="Save"]').click();
    cy.get("p").contains("15").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
  });

})