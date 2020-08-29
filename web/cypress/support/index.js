import "cypress-localstorage-commands";

// Delete window.fetch on every window load
Cypress.on("window:before:load", (win) => {
  delete win.fetch;
});

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

beforeEach(() => {
  cy.restoreLocalStorage();
});

afterEach(() => {
  cy.saveLocalStorage();
});

const { email, password } = Cypress.env("credentials");
const { baseURL } = Cypress.env("API");

Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: `${baseURL}/login/`,
    body: {
      email: email,
      password: password,
    },
  }).then(res => {
    cy.setLocalStorage("user.auth", JSON.stringify(res.body));
  })
});