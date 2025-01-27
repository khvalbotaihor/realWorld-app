const { request } = require("http");

describe('Test with backend', () => {


beforeEach(() => {
  cy.intercept({method: 'Get', path:'tags'}, {fixture: 'tags.json'});
  cy.loginToApplication('jim@test.com', 'jim');
})


  it('verify correct request and response', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/api/articles/`).as('postArticles');
    
    
    
    cy.contains(' New Article ').click();
    cy.get('input[formcontrolname="title"]').type('This is a title');
    cy.get('input[formcontrolname="description"]').type('This is a description');
    cy.get('textarea[formcontrolname="body"]').type('This is a body of the article');
    cy.get('button[type="button"]').click();

    cy.wait('@postArticles').then(xhr => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(200);
      expect(xhr.request.body.article.body).to.equal('This is a body of the article');
      expect(xhr.response.body.article.description).to.equal('This is a description');
    })

  })

  it('verify popular tags are displayed', () => {
    cy.get('.tag-list')
      .should('contain', 'cypress')
      .and('contain', 'automation')
      .and('contain', 'testing');

  })

it('verify global feed likes count', () => {
  cy.intercept('GET', `${Cypress.env('apiUrl')}/api/articles/feed*`, {articles: [], articlesCount: 0});

  cy.intercept('GET', `${Cypress.env('apiUrl')}/api/articles*`, {fixture: 'articles.json'});
  cy.get('app-article-list button').then(listOfButtons => {  
    expect(listOfButtons[0]).to.contain('1');
    expect(listOfButtons[1]).to.contain('5');

  })

  cy.fixture('articles').then(file => {
    const articleLink = file.articles[1].slug;
    file.articles[1].favoritesCount = 6;
    cy.intercept('POST', `${Cypress.env('apiUrl')}/api/articles/${articleLink}/favorite`, file);
    cy.get('app-article-list button').eq(1).click().should('contain', '6');
  })


})

it('intercepting and modifying response and request', () => {
  // cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/', (req)=>{
  //   req.body.article.description = 'This is the description 2';
  // }).as('postArticles');

  cy.intercept('POST', '**/articles', (req)=>{
    req.reply(res => {
      expect(res.body.article.description).to.equal('This is a description');
      res.body.article.description = 'This is the description 2';
    })  
  }).as('postArticles');
  
  
  
  cy.contains(' New Article ').click();
  cy.get('input[formcontrolname="title"]').type('This is a title');
  cy.get('input[formcontrolname="description"]').type('This is a description');
  cy.get('textarea[formcontrolname="body"]').type('This is a body of the article');
  cy.get('button[type="button"]').click();

  cy.wait('@postArticles').then(xhr => {
    console.log(xhr);
    expect(xhr.response.statusCode).to.equal(201);
    expect(xhr.request.body.article.body).to.equal('This is a body of the article');
    expect(xhr.response.body.article.description).to.equal('This is the description 2');
  })

})

it('Delete created article',{retries: 2}, () => {  
  cy.get('@token').then(token => {
    const bodyRequest = {
      "article": {
        "tagList": [],
        "title": "Request from cypress",
        "description": "API testing is easy",
        "body": "Angular is cool"
      }
    }

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/articles/`,
      headers: {
        'Authorization': `Token ${token}`
      },
      body: bodyRequest
    }).then(response => {
      expect(response.status).to.equal(201);
      expect(response.body.article.description).to.equal('API testing is easy');
    })

    cy.contains(' Global Feed ').click();
    cy.get('.preview-link').first().click();
    cy.get('.btn').contains('Delete Article').first().click();
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/articles?limit=10&offset=0`,
      headers: {
        'Authorization': `Token ${token}`
      }
    }).its('body').then(body => {
      console.log(body);
        for (let article of body.articles) {
          expect(article.title).not.to.equal('Request from cypress');
        }
        expect(body.articles[0].title).not.to.equal('Request from cypress');
      })
    
    
  })

})

})