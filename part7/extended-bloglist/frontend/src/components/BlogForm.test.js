import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const container = render(
    <BlogForm createBlog={createBlog}/>
  ).container

  const title = container.querySelector('#title')
  const author = container.querySelector('#author')
  const url = container.querySelector('#url')
  const createButton = container.querySelector('#create-button')

  await user.type(title, 'title of the blog')
  await user.type(author, 'author of the blog')
  await user.type(url, 'url of the blog')
  await user.click(createButton)

  expect(createBlog.mock.calls[0][0].title).toBe('title of the blog')
  expect(createBlog.mock.calls[0][0].author).toBe('author of the blog')
  expect(createBlog.mock.calls[0][0].url).toBe('url of the blog')

})