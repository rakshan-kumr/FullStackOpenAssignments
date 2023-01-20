import axios from "axios";

const baseUrl = "http://localhost:3001/persons"

const getAllPerson = () => {
    console.log('getAllPerson Function fired!');
    return axios
        .get(baseUrl)
        .then(response => response.data)
}

const updatePerson = newPerson => {
    console.log('UpdatePerson Function fired!');
    return axios
        .post(baseUrl, newPerson)
}

const deletePerson = person => {
    const canConfirm = window.confirm(`Delete ${person.name} ?`)
    if (canConfirm) {
        console.log('DeletePerson function fired!');
        return axios
            .delete(`${baseUrl}/${person.id}`)
    }
}


export default { getAllPerson, updatePerson, deletePerson }