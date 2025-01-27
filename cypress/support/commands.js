// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// jim jim@test.com jim 
Cypress.Commands.add('loginToApplication', (email, password) => {
  const userCred = {
    "user":
      {
        "email": Cypress.env('username'),
        "password": Cypress.env('password')
      }
    }

  cy.request('POST', `${Cypress.env('apiUrl')}/api/users/login`, userCred)
  .its('body').then(body => {
    const token = body.user.token;
    cy.wrap(token).as('token');
    
    cy.visit('/', {
      onBeforeLoad(win){
        win.localStorage.setItem('jwtToken', token);
      }
    });
  })
  
  
  
  // cy.visit('/login');
  // cy.get('input[placeholder="Email"]').type(email);
  // cy.get('input[placeholder="Password"]').type(password);
  // cy.get('button[type=submit]').click();
});