const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/bloglist')
const usersRouter = require('./controllers/users')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('Connecting to database...')

const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl).then(() => {
  logger.info('connected to server')
}).catch((error) => {
  return logger.error('error connecting to MongoDB', error.message)
}
)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)


module.exports = app