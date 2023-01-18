import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      id: 1,
      number: "040-1234567"
    }
  ])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState("")

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

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={nameChangeHandler} />
        </div>
        <div>
          number: <input value={newNum} onChange={numChangeHandler}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map((person) => <p key={person.id}>{person.name} {person.number}</p>)}
      </div>
    </div>
  )
}

export default App
