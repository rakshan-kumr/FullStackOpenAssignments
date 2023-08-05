import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom'

const App = () => {
  const [page, setPage] = useState('authors')

  return (
    <div>
      <Router>
        <Link to='/'>
          <button>Authors</button>
        </Link>
        <Link to='/books'>
          <button>Books</button>
        </Link>
        <Link to='/addbook'>
          <button>Add book</button>
        </Link>
        <Routes>
          <Route path='/' element={<Authors />} />
          <Route path='/books' element={<Books />} />
          <Route path='/addbook' element={<NewBook />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
