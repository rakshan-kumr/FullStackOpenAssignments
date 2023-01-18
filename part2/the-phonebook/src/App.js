import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

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

      <Filter value={filterValue} onChange={filterHandler} />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={nameChangeHandler}
        newNum={newNum}
        onNumChange={numChangeHandler} />
        
      <h3>Number</h3>

      <Persons persons={personsToShow}/>
    </div>
  )
}

export default App
