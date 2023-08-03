import { useState, useEffect, useRef, useContext } from 'react'
import NotificationContext from './context/NotificationContext'
import { setMessage } from './actions/notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import Blog from './components/Blog'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  const queryClient = useQueryClient()

  const blogFormRef = useRef()

  const [message, dispatch] = useContext(NotificationContext)

  const changeHander = (event) => {
    switch (event.target.id) {
    case 'username':
      setUsername(event.target.value)
      break
    case 'password':
      setPassword(event.target.value)
      break

    default:
      break
    }
  }

  const resultBlogs = useQuery('blogs', () => {
    return blogService.getAll()
  })

  const newBlogutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      console.log(newBlog)
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.concat(newBlog))
      notify(`A new blog "${newBlog.title}" by ${newBlog.author} added`)
    }
  })

  const likeBlogMutation = useMutation(({ id, blogObject }) =>  blogService.update(id, blogObject),
    {
      onSuccess: (updatedBlog) => {
        const blogs = queryClient.getQueryData('blogs')
        queryClient.setQueryData('blogs',   blogs.map((blog) =>
          blog.id !== updatedBlog.id ? blog : { ...updatedBlog, user: user }
        ))
      }
    })

  const deleteBlogMutation = useMutation(blogService.deleteBlog, {
    onSuccess:(deletedBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.filter((blog) => blog.id !== deletedBlog.id))
      notify('Blog deleted successfully')
    }
  })

  const notify = (message) => {
    dispatch(setMessage(
      message)
    )
    setTimeout(() => {
      dispatch(setMessage(null))
    }, 5000)
  }

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedInUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  if (resultBlogs.isLoading) return <div>Loading...</div>

  const blogs = resultBlogs.data

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
      notify('Wrong credentials')
    }
  }

  const createNewBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      newBlogutation.mutate(blogObject)
    } catch (error) {
      console.log(error)
      notify('Something went wrong')
    }
  }

  const updateLike = async (blogObject) => {
    likeBlogMutation.mutate({ id: blogObject.id, blogObject })  }

  const delBlog = async (id) => {
    try {
      deleteBlogMutation.mutate(id)
    } catch (exception) {
      notify(`Error: \n ${exception.response.data.error}`)
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

    return <div className='message'>{message}</div>
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
        <button id='logout-button' onClick={logout}>
          logout
        </button>
      </div>
      <Notification />
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
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
