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
import { useApolloClient, useSubscription } from '@apollo/client'
import Recommendations from './components/Recommendations'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

const App = () => {
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data)
      const addedBook = data.data.bookAdded

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        }
      })
      alert(`Book "${addedBook.title}" added`)
    },
  })

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
            <Link to='/recommendations'>
              <button>recommend</button>
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
          <Route
            path='/recommendations'
            element={token ? <Recommendations /> : <Navigate to='/login' />}
          />
          <Route path='/login' element={<LoginForm setToken={setToken} />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
