import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phonebookService from "./services/communications";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [resultMessage, setresultMessage] = useState(null);
  const [messageType, setMessagetype] = useState("");

  useEffect(() => {
    phonebookService.getAllPerson().then((allPersonData) => {
      setPersons(allPersonData);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const getAllPersonData = phonebookService.getAllPerson();

    getAllPersonData.then((allPersonData) => {
      //     const isExist = allPersonData.some((person) => person.name === newName);

      //     if (!isExist) {
      const personObject = {
        name: newName,
        number: newNum,
      };

      phonebookService
        .createPerson(personObject)
        .then((response) => {
          console.log("Persons: ", persons);
          console.log("response.data: ", response.data);
          setPersons(persons.concat(response.data));
          setMessagetype("success-message");
          setresultMessage(`Added ${personObject.name}`);
          setTimeout(() => {
            setresultMessage(null);
          }, 5000);
          setNewName("");
          setNewNum("");
        })
        .catch((error) => {
          console.log(error.response.data.code);
          if (error.response.data.name === "ValidationError") {
            setMessagetype("error-message");
            setresultMessage(`${error.response.data.message}`);
            setTimeout(() => {
              setresultMessage(null);
            }, 5000);
          } else if (error.response.data.code === 11000) {
            const addConfirm = window.confirm(
              `${newName} is already added to phonebook, replace the old number with new one?`
            );
            if (addConfirm) {
              const personObject = allPersonData.find(
                (person) => person.name === newName
              );

              phonebookService
                .updatePerson(personObject.id, {
                  name: personObject.name,
                  number: newNum,
                })
                .then((result) => {
                  console.log("After update", result);
                  setPersons(
                    persons.map((person) =>
                      person.id === result.id ? result : person
                    )
                  );
                  setMessagetype("success-message");
                  setresultMessage(`Added ${personObject.name}`);
                  setTimeout(() => {
                    setresultMessage(null);
                  }, 5000);
                });

              console.log(personObject);
            }
          }
        });
    });
  };

  const deletePersonAction = (person) => {
    phonebookService
      .deletePerson(person)
      .then(() =>
        phonebookService
          .getAllPerson()
          .then((allPersonData) => setPersons(allPersonData))
      )
      .catch((error) => {
        setresultMessage(
          `Information of ${person.name} has already been removed form server`
        );
        setMessagetype("error-message");
        setTimeout(() => {
          setresultMessage(null);
        }, 5000);
      });
  };

  const nameChangeHandler = (event) => {
    setNewName(event.target.value);
  };
  const numChangeHandler = (event) => {
    setNewNum(event.target.value);
  };

  const filterHandler = (event) => {
    setFilterValue(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook - Frontend</h1>

      <Notification message={resultMessage} messageType={messageType} />

      <Filter value={filterValue} onChange={filterHandler} />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={nameChangeHandler}
        newNum={newNum}
        onNumChange={numChangeHandler}
      />

      <h3>Number</h3>

      <Persons persons={personsToShow} deletePerson={deletePersonAction} />
    </div>
  );
};

export default App;
