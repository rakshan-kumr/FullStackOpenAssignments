import { useLazyQuery, useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useEffect, useState } from 'react'

const Books = () => {
  const [genreFilter, setGenreFilter] = useState(null)
  const [allGenres, setAllGenres] = useState([])

  const result = useQuery(ALL_BOOKS)
  const [getBooks, { data }] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    console.log('useEffect')
    getBooks({
      variables: {
        genre: null,
      },
    })
    if (data) {
      console.log('If useEffect', data)
      setAllGenres(
        data.allBooks.reduce((prev, current) => {
          return prev.concat(current.genres)
        }, [])
      )
    }
  }, [getBooks, data])

  if (result.loading) return <div>Loading..</div>

  console.log(result.data, genreFilter)

  const genreChange = (genre) => {
    setGenreFilter(genre)
    result.refetch({ genre })
  }

  const books = result.data.allBooks

  // const allGenres =

  const uniqueGenres = [...new Set(allGenres)]

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
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {uniqueGenres.map((genre) => (
        <button key={genre} onClick={() => genreChange(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => genreChange(null)}>all genres</button>
    </div>
  )
}

export default Books
