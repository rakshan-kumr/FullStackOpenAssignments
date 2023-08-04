import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import { useUser } from '../context/UserContext'
import './BlogDetails.css'

const BlogDetails = () => {
  const { id } = useParams()
  console.log(id)
  const queryClient = useQueryClient()
  const user = useUser()
  const blogs = queryClient.getQueryData(['blogs'])
  console.log(blogs)

  if (!blogs) null

  const blog = blogs.find(blog => blog.id === id)

  const likeBlogMutation = useMutation(({ id, blogObject }) =>  blogService.update(id, blogObject),
    {
      onSuccess: (updatedBlog) => {
        console.log(updatedBlog)
        const blogs = queryClient.getQueryData(['blogs'])
        queryClient.setQueryData(['blogs'],   blogs.map((blog) =>
          blog.id !== updatedBlog.id ? blog : { ...updatedBlog, user: user }
        ))
      }
    })

  const updateLike = async (blogObject) => {
    likeBlogMutation.mutate({ id: blogObject.id, blogObject })
  }

  const addCommentMutation = useMutation(({ id, comment }) => blogService.addComment(id, comment),
    {
      onSuccess: (updatedBlog) => {
        const blogs = queryClient.getQueryData(['blogs'])
        queryClient.setQueryData(['blogs'],   blogs.map((blog) =>
          blog.id !== updatedBlog.id ? blog : updatedBlog
        ))
      }
    }
  )

  const addComment = async (event) => {
    event.preventDefault()

    addCommentMutation
      .mutate({ id: blog.id, comment: event.target.comment.value })

    event.target.comment.value = ''
  }
  console.log(blog)

  const redirect = (url) => {
    if (url.includes('https://') || url.includes('http://'))
      window.location.href = url

    else window.location.href = `https://${url}`
  }

  return (
    <>
      <h3>{blog.title} - {blog.author}</h3>
      <u className='blog-url' onClick={() => redirect(blog.url)}>{blog.url}</u>
      <div>{blog.likes} likes <button onClick={() => updateLike({ ...blog, likes: blog.likes + 1 })}>like</button></div>
      <p>added by {blog.user.name}</p>
      <h4>Comments</h4>
      <form onSubmit={addComment}>
        <input type="text" name='comment'/>
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments && (
          blog.comments.map((comment) => <li key={comment._id}>{comment.comment}</li>)
        ) }
      </ul>
    </>


  )
}

export default BlogDetails