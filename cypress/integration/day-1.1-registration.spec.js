/// <reference types="Cypress" />
import * as helpers from '../support/helpers';
/**
 * @abstract: Create an account
 *
 * @criteria
  As first time visiting user:
  - I'm directed to a registration page.
  - On that page, I can enter my name, username, and password.
  - If all my information is correct, upon clicking the submit button, I'm taken to a login page.
  - If any of my information is incorrect, I'm given proper error messages and the option to correct my information
*/
describe(`User story: Register an account`, function () {
  it('on first load, directs me to the registration page', () => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.config().baseUrl}/register`);

    cy.get('main section').within(($section) => {
      cy.get('h2').should('have.text', 'Sign up');
    });
  });

  it(`displays the name, username and password fields`, () => {
    cy.visit('/register');

    cy.get('section form').within(() => {
      cy.get('label[for=registration-name-input]').should(
        'have.text',
        'Enter your name*'
      );
      cy.get('input#registration-name-input')
        .should('have.attr', 'type', 'text')
        .and('have.attr', 'required', 'required');

      cy.get('label[for=registration-username-input]').should(
        'have.text',
        'Choose a username*'
      );
      cy.get('input#registration-username-input')
        .should('have.attr', 'type', 'text')
        .and('have.attr', 'required', 'required');

      cy.get('label[for=registration-password-input]').should(
        'have.text',
        'Choose a password*'
      );
      cy.get('input#registration-password-input')
        .should('have.attr', 'type', 'password')
        .and('have.attr', 'required', 'required');

      cy.get('button[type=submit]').should('have.text', 'Sign up');
    });
  });

  context(`Given invalid information`, () => {
    const serverError = 'Some error from the server';

    beforeEach(() => {
      cy.server()
        .route({
          method: 'POST',
          url: '/api/user',
          // server determines the information is incorrect
          status: 400,
          response: {
            error: serverError,
          },
        })
        .as('postRegister');
    });

    it(`displays error from POSTS /api/users`, () => {
      const newUser = {
        name: 'Test name',
        username: 'invalid-username',
        password: 'invalid-password',
      };
      cy.visit('/register');

      cy.get('main form').within(($form) => {
        cy.get('#registration-name-input').type(newUser.name);
        cy.get('#registration-username-input').type(newUser.username);
        cy.get('#registration-password-input').type(newUser.password);
        cy.root().submit();

        cy.wait('@postRegister')
          .get('[role=alert]')
          .should('have.text', serverError);
      });
    });
  });

  context(`Given valid information`, () => {
    beforeEach(() => {
      cy.server()
        .route({
          method: 'POST',
          url: '/api/user',
          // server determines the information is correct
          status: 200,
          response: {
            id: 123,
            name: 'test name',
            username: 'test username',
          },
        })
        .as('postRegister');
    });

    // This test is outdated
    // it(`redirects to /login`, () => {
    //   const newUser = {
    //     name: 'Test name',
    //     username: 'test-username',
    //     password: 'test-password',
    //   }
    //   cy.visit('/register')

    //   cy.get('section form').within($form => {
    //     cy.get('#registration-name-input')
    //       .type(newUser.name)
    //     cy.get('#registration-username-input')
    //       .type(newUser.username)
    //     cy.get('#registration-password-input')
    //       .type(newUser.password)
    //     cy.root().submit()
    //     cy.wait('@postRegister')
    //       .url()
    //       .should('eq', `${Cypress.config().baseUrl}/login`)
    //   })
    // })
  });

  //modified cypress test due to outdated original file that doesn't match user stories from module

  context(`Given valid credentials`, () => {
    const loginToken = helpers.makeLoginToken();

    beforeEach(() => {
      cy.server()
        .route({
          method: 'POST',
          url: '/api/auth/token',
          // server determines credentials are correct
          status: 200,
          response: {
            authToken: loginToken,
          },
        })
        .as('loginRequest');

      cy.route({
        method: 'PUT',
        // server determines refresh is correct
        url: '/api/auth/token',
        status: 200,
        response: {
          authToken: loginToken,
        },
      }).as('refreshRequest');

      cy.route({
        method: 'GET',
        url: '/api/language',
        // minimal happy response from language endpoint
        status: 200,
        response: {
          language: {},
          words: [],
        },
      }).as('languageRequest');
    });

    it(`stores token in localStorage and redirects to /`, () => {
      const loginUser = {
        username: 'username',
        password: 'password',
      };
      cy.visit('/login');

      cy.get('main form').within(($form) => {
        cy.get('#login-username-input').type(loginUser.username);
        cy.get('#login-password-input').type(loginUser.password);
        cy.root().submit();

        cy.wait('@loginRequest')
          .window()
          .then((win) => {
            const tokenInStorage = win.localStorage.getItem(
              Cypress.env('TOKEN_KEY')
            );
            expect(tokenInStorage).to.eql(loginToken);
          });

        cy.url().should('eq', `${Cypress.config().baseUrl}/`);
      });
    });

    it(`displays my user name and presents the logout button`, () => {
      cy.login().visit('/');

      cy.get('header').within(($header) => {
        cy.contains('Test name of user').should('exist');
        cy.get('nav a')
          .should('have.length', 1)
          .and('have.text', 'Logout')
          .and('have.attr', 'href', '/login');

        cy.get('nav a')
          .click()
          .url()
          .should('eq', `${Cypress.config().baseUrl}/login`);

        cy.window().then((win) => {
          const tokenInStorage = win.localStorage.getItem(
            Cypress.env('TOKEN_KEY')
          );
          expect(tokenInStorage).to.not.exist;
        });
      });
    });

    it(`keeps refreshing the token before it expires`, () => {
      const loginUser = {
        username: 'username',
        password: 'password',
      };
      cy.clock().visit('/login');

      // cy.login() uses localStorage directly. So...
      // need to ensure the refresh login still applies after using login form
      cy.get('main form').within(($form) => {
        cy.get('#login-username-input').type(loginUser.username);
        cy.get('#login-password-input').type(loginUser.password);

        cy.root().submit();

        cy.wait('@loginRequest');

        cy.tick(20000).wait('@refreshRequest');
        cy.tick(20000).wait('@refreshRequest');
      });
    });

    it(`refreshes tokens loaded from localStorage`, () => {
      cy.login().clock().visit('/');
      cy.tick(20000).wait('@refreshRequest');
      cy.tick(20000).wait('@refreshRequest');
    });

    it(`doesn't redirect on page load when valid token in localStorage`, () => {
      cy.login()
        .visit('/')
        .url()
        .should('not.contain', `/register`)
        .and('not.contain', `/login`);
    });
  });
});
