import axios from "axios";

const baseUrl = "http://localhost:3001/persons"

const getAllPerson = () => {
    return axios
        .get(baseUrl)
        .then(response => response.data)
}

const updatePerson = newPerson => {
    return axios
        .post(baseUrl, newPerson)
}


export default { getAllPerson, updatePerson }