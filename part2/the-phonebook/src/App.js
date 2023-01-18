import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState("")
  const [filterValue, setFilterValue] = useState("")

  const addPerson = (event) => {
    event.preventDefault()

    const isExist = persons.some(person => person.name === newName)

    if (!isExist) {
      const personObject = {
        name: newName,
        number: newNum,
        id: persons.length + 1
      }
      setPersons(persons.concat(personObject))
      setNewName("")
      setNewNum("")

    } else alert(`${newName} is already added to phonebook`)
  }

  const nameChangeHandler = (event) => {
    setNewName(event.target.value)
  }
  const numChangeHandler = (event) => {
    setNewNum(event.target.value)
  }

  const filterHandler = (event) => {
    setFilterValue(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={filterValue} onChange={filterHandler}></input>
      </div>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={nameChangeHandler} />
        </div>
        <div>
          number: <input value={newNum} onChange={numChangeHandler} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {personsToShow.map((person) => <p key={person.id}>{person.name} {person.number}</p>)}
      </div>
    </div>
  )
}

export default App
