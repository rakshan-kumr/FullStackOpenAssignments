const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user' , { name: 1, username: 1 })
  response.json(blogs)
})

// const getTokenFrom = (request) => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.split(' ')[1]
//   }
//   return null
// }

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
    user : user.id
  })

  const result = await blog.save()
  console.log('logging result', result)
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})


blogRouter.put('/:id', async (request, response) => {
  const body  = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, { new:true })
  response.json(updatedNote)
})

module.exports = blogRouter
