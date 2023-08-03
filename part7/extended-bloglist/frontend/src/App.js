import { useState, useEffect, useRef, useContext } from 'react'
import NotificationContext from './context/NotificationContext'
import UserContext from './context/UserContext'
import { setMessage } from './actions/notification'
import { setUser } from './actions/user'

import { useQuery, useMutation, useQueryClient } from 'react-query'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Blog from './components/Blog'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import UserDetails from './components/UserDetails'
import { useUsersDispatch } from './context/UsersContext'
import { fetchAllUsers } from './actions/users'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const queryClient = useQueryClient()


  const blogFormRef = useRef()

  const [message, dispatchNotif] = useContext(NotificationContext)
  const [user, dispatchUser] = useContext(UserContext)
  const dispatchUsers = useUsersDispatch()


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
    dispatchNotif(setMessage(
      message)
    )
    setTimeout(() => {
      dispatchNotif(setMessage(null))
    }, 5000)
  }

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedInUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      blogService.setToken(user.token)
      dispatchUser(setUser(user))
    }

    userService.getAllUsers()
      .then(users => dispatchUsers(fetchAllUsers(users)))
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

      dispatchUser(setUser(user))
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
    dispatchUser(setUser(null))
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

  const BlogListElements = () => {
    return (
      <>
        <Notification />
        <h3>Blog App</h3>
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
      </>
    )
  }

  const navStyle = {
    padding: '5px'
  }
  // console.log(user);
  return (
    <div>
      <div>
        <Router>
          <Link style= {navStyle} to='/'>blogs</Link>
          <Link style= {navStyle} to='/users'>Users</Link>
          {user.name} logged in
          <button id='logout-button' onClick={logout}>
          logout
          </button>

          <Routes>
            <Route path='/' element={<BlogListElements />}></Route>
            <Route path='/users' element={<Users />}></Route>
            <Route path='/users/:id' element={<UserDetails />}></Route>
          </Routes>
        </Router>
      </div>

    </div>
  )
}

export default App
