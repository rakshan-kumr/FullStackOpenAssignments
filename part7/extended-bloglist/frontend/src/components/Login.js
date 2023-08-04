import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useUserDispatch } from '../context/UserContext'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useNotifier } from '../context/NotificationContext'
import { setUser } from '../actions/user'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatchUser = useUserDispatch()
  const notify = useNotifier()


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

  return (
    <div>
      <h2>Login to the Application</h2>
      <Form onSubmit={loginHandler}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control
            id='username'
            type="text"
            name="username"
            value={username} onChange={changeHander}
          />
          <Form.Label>password</Form.Label>
          <Form.Control
            id='password'
            type="password"
            name="password"
            value={password} onChange={changeHander}
          />
        </Form.Group>
        <Button className='m-1' size='sm' variant='primary' id='login-button' type='submit'>login</Button>
      </Form>
    </div>
  )}


export default Login
