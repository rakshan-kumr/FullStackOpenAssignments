const middleware = require('./utils/middleware')

const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/bloglist')

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

app.use(middleware.requestLogger)

module.exports = app