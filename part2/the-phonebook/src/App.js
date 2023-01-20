import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import phonebookService from './services/communications'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState("")
  const [filterValue, setFilterValue] = useState("")


  useEffect(() => {
    phonebookService
      .getAllPerson()
      .then(allPersonData => {
        setPersons(allPersonData)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    phonebookService
      .getAllPerson()
      .then(allPersonData => {
        const isExist = allPersonData.some(person => person.name === newName)

        if (!isExist) {
          const personObject = {
            name: newName,
            number: newNum,
          }

          phonebookService
            .updatePerson(personObject)
            .then(response => {
              setPersons(persons.concat(response.data))
              setNewName("")
              setNewNum("")
            })

        } else alert(`${newName} is already added to phonebook`)
      })
  }

  const deletePersonAction = (person) => {
    phonebookService
      .deletePerson(person)
      .then(() => phonebookService
        .getAllPerson()
        .then(allPersonData => setPersons(allPersonData)))

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

      <Persons persons={personsToShow} deletePerson={deletePersonAction} />
    </div>
  )
}

export default App
