import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent  from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const likeBlog = jest.fn()
  beforeEach(() => {
    const testBlog = {
      title: 'Test Note',
      url: 'www.testnote.com',
      author: 'Test Author',
      user: {
        name: 'Loggedin user'
      },
      likes: 0
    }

    container = render(
      <Blog blog={testBlog} incrementLike={likeBlog}/>
    ).container
  })

  test('renders a blog without blog details', async () => {
    await screen.findByText('Test Note Test Author')
    const blogDetail = container.querySelector('.blog-detail')
    expect(blogDetail).toBeNull()
  })

  test('renders the blog details when expanded', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.view-hide-button')
    await user.click(button)
    const likes = container.querySelector('.blog-detail > p.likes')
    const url = container.querySelector('.blog-detail > p.url')
    expect(likes && url).not.toBeNull()
  })

  test('like function is called when the like button is pressed twice', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.view-hide-button')
    await user.click(button)
    const likeButton = container.querySelector('.like-button')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(likeBlog.mock.calls).toHaveLength(2)
  })

})