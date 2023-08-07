const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
require('dotenv').config()
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

/*
  you can remove the placeholder query once your first own has been implemented 
*/

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]
  }

  type AuthorBookDetails {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(
      author: String
      genre: String
    ): [Book]!
    allAuthors: [AuthorBookDetails]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.genre) {
        const books = await Book.find({
          genres: { $all: [args.genre] },
        }).populate('author')
        return books.filter((book) => book.genres.includes(args.genre))
      }
      const books = await Book.find({}).populate('author')
      return books
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const authorsNew = authors.map((author) => {
        return {
          name: author.name,
          born: author.born,
          bookCount: Book.collection.countDocuments({
            author: author._id,
          }),
        }
      })
      return authorsNew
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Authentication error', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      let author = await Author.findOne({ name: args.author })
      const foundBook = await Book.findOne({ title: args.title })

      if (foundBook) {
        throw new GraphQLError('Book already exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      if (args.title.length <= 5 || args.author.length <= 5) {
        throw new GraphQLError('Book title or author name too short', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      if (!author) {
        try {
          author = new Author({ name: args.author })
          await author.save()
        } catch (error) {
          throw new GraphQLError('Something went wrong', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              error,
            },
          })
        }
      }

      const book = new Book({ ...args, author })
      await book.save()
      return book
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Authentication error', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      if (args.setBornTo.toString().length != 4) {
        throw new GraphQLError('Please enter valid year', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const author = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        {
          new: true,
          upsert: false,
        }
      )
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      return author
    },
    createUser: async (root, { username, favoriteGenre }) => {
      const user = new User({ username, favoriteGenre })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: username,
            error,
          },
        })
      })
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username })
      if (!user || password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
