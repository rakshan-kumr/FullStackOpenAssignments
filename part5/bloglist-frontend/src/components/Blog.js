import { useState } from 'react'

const Blog = ({ blog, incrementLike, delBlog }) => {
  const [blogDetailVisible, setBlogDetailVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const buttonLabel = blogDetailVisible ? 'hide' : 'view'

  const toggleVisibility = () => {
    setBlogDetailVisible(!blogDetailVisible)
  }

  const updateLike = async () => {
    try {
      const likedBlog = await incrementLike({ ...blog, likes: blog.likes + 1 })
      setLikes(likedBlog.likes)
    } catch (error) {
      console.log(error.message)
    }

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
    <div className='blog-detail'>
      <p className='url'>{blog.url}</p>
      <p className='likes'>
        likes {likes} <button onClick={updateLike} className='like-button'>like</button>
      </p>

      <p className='username'>{blog.user.name}</p>
      <button onClick={deleteBlog}>remove</button>
    </div>
  )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility} className='view-hide-button'>{buttonLabel}</button>
      </div>
      <div>
        {blogDetailVisible ? blogDetail() : null}
      </div>

    </div>
  )
}

export default Blog
