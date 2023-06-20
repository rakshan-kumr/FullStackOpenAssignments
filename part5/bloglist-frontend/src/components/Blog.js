import { useState } from 'react'

const Blog = ({ blog, incrementLike, delBlog }) => {
  const [blogDetailVisible, setBlogDetailVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const buttonLabel = blogDetailVisible ? 'hide' : 'view'

  const toggleVisibility = () => {
    setBlogDetailVisible(!blogDetailVisible)
  }

  const updateLike = async () => {
    const likedBlog = await incrementLike({ ...blog, likes: blog.likes + 1 })
    setLikes(likedBlog.likes)
  }

  const deleteBlog = async () => {
    const confirm = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )
    if (confirm) await delBlog(blog.id)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  // console.log(blog);

  const blogDetail = () => (
    <>
      <p>{blog.url}</p>
      <p>
        likes {likes} <button onClick={updateLike}>like</button>
      </p>

      <p>{blog.user.name}</p>
      <button onClick={deleteBlog}>remove</button>
    </>
  )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      {blogDetailVisible ? blogDetail() : null}
    </div>
  )
}

export default Blog
