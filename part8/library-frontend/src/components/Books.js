import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = () => {
  const [genreFilter, setGenreFilter] = useState(null)
  const result = useQuery(ALL_BOOKS)

  if (result.loading) return <div>Loading..</div>

  const books = result.data.allBooks

  const allGenres = books.reduce((prev, current) => {
    return prev.concat(current.genres)
  }, [])

  const uniqueGenres = [...new Set(allGenres)]

  const filteredBooks = genreFilter
    ? books.filter((book) => book.genres.includes(genreFilter))
    : books

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {uniqueGenres.map((genre) => (
        <button key={genre} onClick={() => setGenreFilter(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenreFilter(null)}>all genres</button>
    </div>
  )
}

export default Books
