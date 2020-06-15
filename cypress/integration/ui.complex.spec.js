const FILE_COUNT = 4;

describe('notStore storage UI', function() {
  before(async () => {
    await cy.exec('npm run buildtest');
  });

  it('basic', function() {
    cy.visit('http://localhost:7357/ui.complex.html');

    cy.get('#popupTrigger').click();
    cy.get('.modal').should('exist');
  });
});
