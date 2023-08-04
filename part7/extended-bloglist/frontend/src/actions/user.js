export const setUser = (user) => {
  return {
    type: 'LOGIN',
    payload: user,
  }
}
