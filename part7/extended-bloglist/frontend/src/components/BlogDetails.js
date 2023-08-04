import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import { useUser } from '../context/UserContext'

const BlogDetails = () => {
  const { id } = useParams()
  console.log(id)
  const queryClient = useQueryClient()
  const user = useUser()
  const blogs = queryClient.getQueryData(['blogs'])
  console.log(blogs)

  const likeBlogMutation = useMutation(({ id, blogObject }) =>  blogService.update(id, blogObject),
    {
      onSuccess: (updatedBlog) => {
        const blogs = queryClient.getQueryData(['blogs'])
        queryClient.setQueryData(['blogs'],   blogs.map((blog) =>
          blog.id !== updatedBlog.id ? blog : { ...updatedBlog, user: user }
        ))
      }
    })

  const updateLike = async (blogObject) => {
    likeBlogMutation.mutate({ id: blogObject.id, blogObject })
  }

  if (!blogs) null

  const blog = blogs.find(blog => blog.id === id)
  console.log(blog)

  return (
    <>
      <h3>{blog.title} - {blog.author}</h3>
      <a href={blog.url}>{blog.url}</a>
      <div>{blog.likes} likes <button onClick={() => updateLike({ ...blog, likes: blog.likes + 1 })}>like</button></div>
      <p>added by {blog.user.name}</p>
    </>


  )
}

export default BlogDetails