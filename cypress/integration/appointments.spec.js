beforeEach(() => {
  // Reset the data before testing
  cy.request("GET", "/api/debug/reset")
    
  cy.visit("/")

  cy.contains("Monday")
})

describe("Appointments", () => {
  it("should book an interview", () => {
    cy.get("[alt=Add]")
      .first()
      .click()

    cy.get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones")

    cy.get("[alt='Sylvia Palmer'")
      .click()

    cy.contains("button", "Save")
      .click()

    cy.get(".appointment__card--show")
      .should("contain", "Lydia Miller-Jones")
      .and("contain", "Sylvia Palmer")

  });

  it("should edit an interview", () => {
    cy.get("[alt=Edit]")
      .first()
      .click({force: true})

    cy.get("[data-testid=student-name-input]")
      .type("{selectall}Lydia Miller-Jones")

    cy.get("[alt='Tori Malcolm'")
      .click()

    cy.contains("button", "Save")
      .click()

    cy.get(".appointment__card--show")
      .should("contain", "Lydia Miller-Jones")
      .and("contain", "Tori Malcolm")
  });

  it("should cancel an interview", () => {
    cy.get("[alt=Delete]")
      .first()
      .click({force: true})

    cy.contains("button", "Confirm")
      .click()

    cy.contains("Deleting...").should("exist")
    cy.contains("Deleting...").should("not.exist")

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });

});