import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useState } from 'react'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <Router>
        <Link to='/'>
          <button>Authors</button>
        </Link>
        <Link to='/books'>
          <button>Books</button>
        </Link>
        {token ? (
          <>
            <Link to='/addbook'>
              <button>Add book</button>
            </Link>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <Link to='/login'>
            <button>login</button>
          </Link>
        )}

        <Routes>
          <Route path='/' element={<Authors token={token} />} />
          <Route path='/books' element={<Books />} />
          <Route
            path='/addbook'
            element={token ? <NewBook /> : <Navigate to='/login' />}
          />
          <Route path='/login' element={<LoginForm setToken={setToken} />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
