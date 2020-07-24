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
    cy.wait(3000);
    cy.get('button[aria-label="capture"]').click();
    cy.wait(3000);
    cy.get('button[aria-label="capture"]').should("not.exist");
    cy.get('button[aria-label="recapture"]').click();
    cy.wait(3000);
    cy.get('button[aria-label="capture"]').click();
    cy.wait(3000);
    cy.get('button[aria-label="done"]').click();
    cy.get('div[aria-label="category"]').should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="recapture"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[aria-label="origin"]').should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
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
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
  });

  it("Can select a category.", () => {
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get("p").contains("99°c").should("not.exist");
    cy.get('div[aria-label="category"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get('div[aria-label="category"]').click();
    cy.get("p").contains("oolong").click();
    cy.get('div[aria-label="vendor"]').should("exist");
    cy.get("p").contains("oolong").should("exist");
    cy.get("p").contains("99°c").should("exist");
    cy.get("p").contains("0.8g").should("exist");
    cy.get("p").contains("+30").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
  });

  it("Can select a subcategory.", () => {
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get("p").contains("99°c").should("not.exist");
    cy.get('div[id="category"]').click();
    cy.get("p").contains("oolong").click();
    cy.get("p").contains("oolong").should("exist");
    cy.get("p").contains("99°c").should("exist");
    cy.get('div[id="subcategory"]').click();
    cy.get('div[id="Baihao Yinzhen (Silver Needle)"]').click();
    cy.get("p").contains("oolong").should("not.exist");
    cy.get("p").contains("white").should("exist");
    cy.get("p").contains("99°c").should("not.exist");
    cy.get("p").contains("85°c").should("exist");
    cy.get('div[id="subcategory"]').click();
    cy.get('input[id="subcategory-autocomplete"]').type("test");
    cy.get("div").contains('Add "test"').click();
    cy.get("p").contains("white").should("exist");
    cy.get("p").contains("test").should("exist");
    cy.get("p").contains("85°c").should("exist");
    cy.get('div[id="category"]').click();
    cy.get("p").contains("oolong").click();
    cy.get("p").contains("85°c").should("not.exist");
    cy.get("p").contains("99°c").should("exist");
    cy.get("p").contains("white").should("not.exist");
    cy.get("p").contains("Baihao Yinzhen (Silver Needle)").should("not.exist");
    cy.get('div[id="subcategory"]').click();
    cy.get('input[id="subcategory-autocomplete"]').type("Baihao Y");
    cy.get("div").contains("Baihao Yinzhen (Silver Needle)").click();
    cy.get("p").contains("85°c").should("exist");
    cy.get("p").contains("white").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
  });

  it("Can select a year.", () => {
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[id="year"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get('div[id="year"]').click();
    cy.get("p").contains("1999").click();
    cy.get("p").contains("1999").should("exist");
    cy.get('div[id="year"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("1999").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
  });

  it("Can select an origin.", () => {
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[id="origin"]').click();
    cy.get('input[id="origin-autocomplete"]').type("los an");
    cy.get("div").contains("Los Angeles").click();
    cy.get("p").contains("Los Angeles, CA, USA").should("exist");
    cy.get('div[id="origin"]').click();
    cy.get('input[id="origin-autocomplete"]').type("london");
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("Los Angeles, CA, USA").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
  });

  it("Can select a vendor.", () => {
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[id="vendor"]').click();
    cy.get("p").contains("Tea Shop").click();
    cy.get("p").contains("Tea Shop").should("exist");
    cy.get('div[id="vendor"]').click();
    cy.get('input[id="vendor-autocomplete"]').type("test");
    cy.get("div").contains('Add "test"').click();
    cy.get("p").contains("test").should("exist");
    cy.get('div[id="vendor"]').click();
    cy.get('input[id="vendor-autocomplete"]').type("tea shop");
    cy.get("div").contains("Tea Shop").click();
    cy.get("p").contains("Tea Shop").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
  });

  it("Can select a weight.", () => {
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[id="weight"]').click();
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('div[aria-label="weight"]').type("...");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("...").should("not.exist");
    cy.get("p").contains("NaN").should("not.exist");
    cy.get('div[id="weight"]').click();
    cy.get('div[aria-label="weight"]').type("10");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("10g - 0.35oz").should("exist");
    cy.get('div[id="weight"]').click();
    cy.get('div[aria-label="weight"]').type("10");
    cy.get('input[value="ounces"]').click();
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("283.5g - 10oz").should("exist");
    cy.get('div[id="weight"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("283.5g - 10oz").should("exist");
    cy.get('div[id="price"]').click();
    cy.get('input[value="283.5"]').should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
  });

  it("Can select a price.", () => {
    cy.get('button[aria-label="add tea"]').click();
    cy.get('button[aria-label="skip"]').click();
    cy.get('div[id="price"]').click();
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('div[aria-label="price"]').type("...");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("...").should("not.exist");
    cy.get("p").contains("NaN").should("not.exist");
    cy.get('div[id="price"]').click();
    cy.get('div[aria-label="price"]').type("100");
    cy.get('div[aria-label="amount"]').type("10");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("10/g - 283.5/oz").should("exist");
    cy.get("p").contains("10g - 0.35oz").should("exist");
    cy.get('div[id="price"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("10/g - 283.5/oz").should("exist");
    cy.get('div[id="price"]').click();
    cy.get('label[aria-label="ounces"]').click();
    cy.get('input[value="0.35"]').should("exist");
    cy.get('div[aria-label="price"]').type("2");
    cy.get('div[aria-label="amount"]').type(".1");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("0.71/g - 20.1/oz").should("exist");
    cy.get("p").contains("10g - 0.35oz").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
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
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type(".a#%>!");
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get("p").contains("39sec").should("exist");
    cy.get('div[id="gongfu_initial"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get('div[id="gongfu_initial"]').click();
    cy.get('input[value="minutes"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("16").should("exist");
    cy.get("p").contains("hour").should("exist");
    cy.get('div[id="gongfu_initial"]').click();
    cy.get('input[value="hours"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("999").should("exist");

    // Can pick increments
    cy.get('div[id="gongfu_increments"]').click();
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type(".a#%>!");
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get("p").contains("39sec").should("exist");
    cy.get('div[id="gongfu_increments"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get('div[id="gongfu_increments"]').click();
    cy.get('input[value="minutes"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("16").should("exist");
    cy.get("p").contains("hour").should("exist");
    cy.get('div[id="gongfu_increments"]').click();
    cy.get('input[value="hours"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("999").should("exist");
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
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type(".a#%>!");
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get("p").contains("39sec").should("exist");
    cy.get('div[id="western_initial"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get('div[id="western_initial"]').click();
    cy.get('input[value="minutes"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("16").should("exist");
    cy.get("p").contains("hour").should("exist");
    cy.get('div[id="western_initial"]').click();
    cy.get('input[value="hours"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("999").should("exist");

    // Can pick increments
    cy.get('div[id="western_increments"]').click();
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type(".a#%>!");
    cy.get('button[aria-label="add"]').should("be.disabled");
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get("p").contains("39sec").should("exist");
    cy.get('div[id="western_increments"]').click();
    cy.get('button[aria-label="back"]').click();
    cy.get("p").contains("16m").should("exist");
    cy.get('div[id="western_increments"]').click();
    cy.get('input[value="minutes"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("16").should("exist");
    cy.get("p").contains("hour").should("exist");
    cy.get('div[id="western_increments"]').click();
    cy.get('input[value="hours"]').click();
    cy.get('div[aria-label="time-text"]').type("999");
    cy.get('button[aria-label="add"]').click();
    cy.get("p").contains("999").should("exist");
    cy.get('button[aria-label="back"]').click();
    cy.get('button[aria-label="cancel"]').click();
  });
});
