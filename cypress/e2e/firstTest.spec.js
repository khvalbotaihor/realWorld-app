describe('Test with backend', () => {


beforeEach(() => {
  cy.loginToApplication('jim@test.com', 'jim');
})


  it('first', () => {
    cy.log('You are logged id')
  })
})