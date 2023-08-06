import React, { useEffect } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ setToken }) => {
  const [login, result] = useMutation(LOGIN)
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()

    login({
      variables: {
        username: event.target.username.value,
        password: event.target.password.value,
      },
    })
  }

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('logged-in-user-token', token)
      navigate('/')
    }
  }, [result]) // eslint-disable-line

  return (
    <div onSubmit={submit}>
      <h3>Login</h3>
      <form>
        <div>
          username
          <input type='text' name='username' id='username' />
        </div>
        <div>
          password
          <input type='password' name='password' id='password' />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
