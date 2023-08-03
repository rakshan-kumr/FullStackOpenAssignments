import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  const changeHander = (event) => {
    switch (event.target.id) {
    case 'username':
      setUsername(event.target.value)
      break
    case 'password':
      setPassword(event.target.value)
      break
      // case "title":
      //   setTitle(event.target.value);
      //   break;
      // case "author":
      //   setAuthor(event.target.value);
      //   break;
      // case "url":
      //   setUrl(event.target.value);
      //   break;

    default:
      break
    }
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedInUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const loginHandler = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      setUser(user)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const createNewBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat({ ...returnedBlog, user: user }))
      setMessage(
        `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`
      )
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessage('Something went wrong')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const updateLike = async (blogObject) => {
    const returnedBlog = await blogService.update(blogObject.id, blogObject)
    setBlogs(
      blogs.map((blog) =>
        blog.id !== returnedBlog.id ? blog : { ...returnedBlog, user: user }
      )
    )
    return returnedBlog
  }

  const delBlog = async (id) => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
    } catch (exception) {
      setMessage(`Error: \n ${exception.response.data.error}`)

      setTimeout(() => {
        setMessage(null)
      }, 5000)
      console.log(exception.response.data.error)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const Notification = () => {
    if (message === null) {
      return null
    }

    return <div className="message">{message}</div>
  }

  blogs.sort((a, b) => a.likes - b.likes)

  if (user === null)
    return (
      <>
        <Notification />
        <Login
          username={username}
          password={password}
          onChange={changeHander}
          onSubmit={loginHandler}
        />
      </>
    )
  // console.log(user);
  return (
    <div>
      <h2>blogs</h2>
      <div>
        {user.name} logged in
        <button id='logout-button' onClick={logout}>logout</button>
      </div>
      <Notification />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createNewBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          incrementLike={updateLike}
          delBlog={delBlog}
        />
      ))}
    </div>
  )
}

export default App
