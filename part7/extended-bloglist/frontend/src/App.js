import { useEffect, useRef, useContext } from 'react'
import { useMessage, useNotifier } from './context/NotificationContext'
import UserContext from './context/UserContext'
import { setUser } from './actions/user'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

import Login from './components/Login'
import blogService from './services/blogs'

import userService from './services/users'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import UserDetails from './components/UserDetails'
import { useUsersDispatch } from './context/UsersContext'
import { fetchAllUsers } from './actions/users'
import BlogDetails from './components/BlogDetails'

const App = () => {


  const queryClient = useQueryClient()

  const blogFormRef = useRef()

  const [user, dispatchUser] = useContext(UserContext)
  const dispatchUsers = useUsersDispatch()

  const message = useMessage()
  const notify = useNotifier()



  const resultBlogs = useQuery(['blogs'], () => {
    return blogService.getAll()
  })

  const newBlogutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      console.log(newBlog)
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      notify(`A new blog "${newBlog.title}" by ${newBlog.author} added`)
    },
  })

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedInUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      blogService.setToken(user.token)
      dispatchUser(setUser(user))
    }

    userService
      .getAllUsers()
      .then((users) => dispatchUsers(fetchAllUsers(users)))
  }, [])

  if (resultBlogs.isLoading) return <div>Loading...</div>
  if (resultBlogs.isError) return <div>Something went wrong...</div>

  const blogs = resultBlogs.data


  const createNewBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      newBlogutation.mutate(blogObject)
    } catch (error) {
      console.log(error)
      notify('Something went wrong')
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

  const LoginElement = () => {
    return (
      <>
        <Notification />
        <Login />
      </>
    )
  }

  const BlogListElements = () => {
    return (
      <>
        <Notification />
        <h3>Blog App</h3>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm createBlog={createNewBlog} />
        </Togglable>
        {blogs.map((blog) => (
          <div key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} - {blog.author}
            </Link>
          </div>
        ))}
      </>
    )
  }

  const navStyle = {
    padding: '5px',
  }

  return (
    <div className="container">{
      (!user ? <LoginElement /> :
        <div>
          <Router>
            <Link style={navStyle} to='/'>
            blogs
            </Link>
            <Link style={navStyle} to='/users'>
            Users
            </Link>
            {user.name} logged in
            <Button className='m-1' size='sm' id='logout-button' onClick={logout}>logout</Button>

            <Routes>
              <Route path='/' element={<BlogListElements />}></Route>
              <Route path='/users' element={<Users />}></Route>
              <Route path='/users/:id' element={<UserDetails />}></Route>
              <Route path='/blogs/:id' element={<BlogDetails />}></Route>
            </Routes>
          </Router>
        </div>)}
    </div>
  )
}

export default App
