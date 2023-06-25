describe('Blog app', function() {

  beforeEach(function() {
    cy.viewport(500, 500)
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Anil Kumar',
      username: 'anilkumar',
      password: 'anilk'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    // ...
    cy.contains('Login to the Application')
    cy.get('#username')
    cy.get('#password')
    cy.get('button').contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      // ...
      cy.get('#username').type('anilkumar')
      cy.get('#password').type('anilk')
      cy.get('#login-button').click()

      cy.contains('Anil Kumar logged in')
    })

    it('fails with wrong credentials', function() {
      // ...
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.message').should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(128, 128, 128)') // checking for grey as the error color of red is not implemented.
    })
  })
})