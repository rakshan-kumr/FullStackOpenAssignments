const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  })

  const result = await blog.save().then((blog) => blog.populate(['user']))
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(blog.user.toString(), '\n', blog.user.toString())

  if (!(decodedToken.id && decodedToken.id === blog.user.toString())) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const result = await Blog.findByIdAndRemove(request.params.id)
  response.status(200).json(result)
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  }

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.json(updatedNote)
})

blogRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      $addToSet: {
        comments: [{ comment }],
      },
    },
    { new: true }
  )

  response.status(200).json(updatedBlog)
})

module.exports = blogRouter
