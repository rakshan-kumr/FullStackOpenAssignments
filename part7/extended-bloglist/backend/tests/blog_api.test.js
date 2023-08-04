// const mongoose = require("mongoose");
// const supertest = require("supertest");
// const app = require("../app");

// const api = supertest(app);

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First Test blog',
    author: 'Me',
    url: 'http://www.myfirsttestblog.com',
    likes: 55,
  },
  {
    title: 'Second Test blog',
    author: 'Me',
    url: 'http://www.mysecondtestblog.com',
    likes: 87,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
}, 100000)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs contain id property', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

test('Post request creates a new blog', async () => {
  const newBlog = {
    title: 'Third blog',
    author: 'Me',
    url: 'http://www.mythirdblog.com',
    likes: 36,
  }

  await api.post('/api/blogs').send(newBlog).expect(201)
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length + 1)
})

test('Blog can be deleted', async () => {
  const response = await api.get('/api/blogs')
  const blogsAtStart = response.body
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const secondResponse = await api.get('/api/blogs')
  const blogsAtEnd = secondResponse.body
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
})

test('Blog can be edited', async () => {
  const response = await api.get('/api/blogs')
  const blogsAtStart = response.body
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    title: 'Update blog',
    author: 'Me',
    url: 'http://www.myupdateblog.com',
    likes: 36,
  }

  const res = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog)

  const blogsAfterUpdate = await api.get('/api/blogs')

  expect(blogsAfterUpdate.body).toContainEqual(res.body)
})

afterAll(async () => {
  await mongoose.connection.close()
})
