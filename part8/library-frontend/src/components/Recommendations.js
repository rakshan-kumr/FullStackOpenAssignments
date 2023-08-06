import React from 'react'
import { ALL_BOOKS, ME } from '../queries'
import { useQuery } from '@apollo/client'

const Recommendations = () => {
  const myProfile = useQuery(ME)
  const booksQuery = useQuery(ALL_BOOKS)

  if (myProfile.loading || booksQuery.loading) return <div>Loading...</div>
  console.log(booksQuery.data, myProfile.data)
  const books = booksQuery.data.allBooks.filter((book) =>
    book.genres.includes(myProfile.data.me.favoriteGenre)
  )
  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books in your favourite genre{' '}
        <strong>{myProfile.data.me.favoriteGenre}</strong>
      </p>
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
    </div>
  )
}

export default Recommendations
