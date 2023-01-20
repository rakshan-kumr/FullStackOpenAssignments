const DeletePersonButton = ({ onClick }) => {
    return (
        <button onClick={onClick}>delete</button>
    )
}


const Persons = ({ persons, deletePerson }) => {
    return (
        <div>
            {persons
                .map((person) => <p
                    key={person.id}>{person.name} {person.number} <DeletePersonButton onClick={() => deletePerson(person)} />
                </p>)}
        </div>
    )
}


export default Persons