describe('Blog app', function () {
  beforeEach(function () {
    cy.viewport(500, 500)
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Anil Kumar',
      username: 'anilkumar',
      password: 'anilk',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    const user2 = {
      name: 'Second User',
      username: 'seconduser',
      password: 'second',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    // ...
    cy.contains('Login to the Application')
    cy.get('#username')
    cy.get('#password')
    cy.get('button').contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      // ...
      cy.get('#username').type('anilkumar')
      cy.get('#password').type('anilk')
      cy.get('#login-button').click()

      cy.contains('Anil Kumar logged in')
    })

    it('fails with wrong credentials', function () {
      // ...
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.message')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(128, 128, 128)') // checking for grey as the error color of red is not implemented.
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      // log in user here
      cy.login({ username: 'anilkumar', password: 'anilk' })
    })

    it('A blog can be created', function () {
      // ...
      cy.contains('new blog').click()
      cy.get('#title').type('first Title')
      cy.get('#author').type('first Author')
      cy.get('#url').type('firsturl.com')
      cy.get('#create-button').click()

      cy.contains('first Title first Author')
    })

    it('User can like a blog', function () {
      cy.createBlog({
        title: 'First Title',
        author: 'First Author',
        url: 'firsturl.com',
      })
      cy.get('.view-hide-button').click()
      cy.get('.likes').contains('likes 0')
      cy.get('.like-button').click()
      cy.get('.likes').contains('likes 1')
    })

    it('User can delete the blog', function () {
      cy.createBlog({
        title: 'First Title',
        author: 'First Author',
        url: 'firsturl.com',
      })
      cy.get('.view-hide-button').click()
      cy.get('.blog-element')
      cy.get('.delete-blog-button').click()
      cy.get('.blog-element').should('not.exist')
    })

    it('only creator can see delete button of the blog', function () {
      cy.createBlog({
        title: 'First Title',
        author: 'First Author',
        url: 'firsturl.com',
      })
      cy.get('#logout-button').click()
      cy.login({ username: 'seconduser', password: 'second' })
      cy.createBlog({
        title: 'Second Title',
        author: 'Second Author',
        url: 'secondurl.com',
      })
      cy.get('.view-hide-button').click({
        multiple: true,
      })
      cy.get('.blog-element:first')
        .find('.delete-blog-button')
        .should('not.exist')
      cy.get('.blog-element:last').find('.delete-blog-button')
    })

    it.only('blog is ordered according to likes', function () {
      cy.createBlog({
        title: 'First Title',
        author: 'First Author',
        url: 'firsturl.com',
      })
      cy.createBlog({
        title: 'Second Title',
        author: 'Second Author',
        url: 'secondurl.com',
      })
      cy.get('.view-hide-button').click({
        multiple: true,
      })

      cy.contains('First Title First Author').parent().as('firstBlog')
      cy.contains('Second Title Second Author').parent().as('secondBlog')

      cy.get('@firstBlog').find('.like-button').click()
      cy.get('@firstBlog').find('.likes').contains('likes 1')
      cy.get('@firstBlog').find('.like-button').click()
      cy.get('@firstBlog').find('.likes').contains('likes 2')
      cy.get('@secondBlog').find('.like-button').click()
      cy.get('@secondBlog').find('.likes').contains('likes 1')

      cy.get('.blog-element')
        .eq(0)
        .should('contain', 'Second Title Second Author')
      cy.get('.blog-element')
        .eq(1)
        .should('contain', 'First Title First Author')
    })
  })
})
