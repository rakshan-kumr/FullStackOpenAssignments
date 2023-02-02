import axios from "axios";

const baseUrl = "api/persons";

const getAllPerson = () => {
  console.log("getAllPerson Function fired!");
  return axios.get(baseUrl).then((response) => {
    console.log(response.data);
    return response.data;
  });
};

const createPerson = (newPerson) => {
  console.log("createPerson Function fired!");
  return axios.post(baseUrl, newPerson);
};

const updatePerson = (id, newPersonObject) => {
  console.log("updatePerson Function fired!");
  return axios
    .put(`${baseUrl}/${id}`, newPersonObject)
    .then((response) => response.data);
};

const deletePerson = (person) => {
  const canConfirm = window.confirm(`Delete ${person.name} ?`);
  if (canConfirm) {
    console.log("DeletePerson function fired!");
    return axios.delete(`${baseUrl}/${person.id}`);
  }
};

export default { getAllPerson, createPerson, deletePerson, updatePerson };
