export const fetchAllUsers = (users) => {
  return {
    type: 'FETCH_USERS',
    payload: users,
  }
}
