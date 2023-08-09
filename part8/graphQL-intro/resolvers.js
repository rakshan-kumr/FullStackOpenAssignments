const Book = require('./models/book')
const Author = require('./models/author')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const pubsub = new PubSub()

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
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
