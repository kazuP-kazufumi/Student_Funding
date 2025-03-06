describe('Basic Navigation', () => {
  it('visits the home page', () => {
    cy.visit('/');
    cy.get('main').should('exist');
  });
}); 