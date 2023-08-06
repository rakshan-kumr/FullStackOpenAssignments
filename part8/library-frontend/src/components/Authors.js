import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, UPDATE_BIRTHYEAR } from '../queries'
import { useState } from 'react'
import Select from 'react-select'

const Authors = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)

  const [updateAuthor] = useMutation(UPDATE_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (result.loading) return <div>Loading..</div>

  const authors = result.data.allAuthors

  const options = authors.map((author) => {
    return {
      value: author.name,
      label: author.name,
    }
  })

  const updateBirthYear = (event) => {
    event.preventDefault()
    updateAuthor({
      variables: {
        name: name.value,
        born,
      },
    })
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set Birth year</h3>
      <form onSubmit={updateBirthYear}>
        <Select defaultValue={name} onChange={setName} options={options} />
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
